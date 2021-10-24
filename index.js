import dotenv from "dotenv"
import { Client } from "@notionhq/client"
import promptSync from "prompt-sync"
const prompt = promptSync()

import { getDatabaseById } from "./modules/notion/notionQuery.js"
import { convertDataToNotionEvents } from "./modules/helpers/courseTemplateParse.js"
import { addEventsToDatabase } from "./modules/notion/notionCreate.js"
import { updateStandupStatusToNotStarted } from "./modules/notion/notionUpdate.js"
import { parseActiveStudentsCSV } from "./modules/helpers/activeStudentsParse.js"
import { addStudentsToDatabase } from "./modules/notion/notionAddStudent.js"

dotenv.config()

//! ALL TODO COMMENTS HERE
//TODO: Write unit tests for all functions using Jest
//TODO: Write script to add dates to class schedule in Class Schedule Template
//TODO: Write script to add grading templates for all assignments for a Cohort to Grading. (Set up Notion to auto hide until two weeks out in Not Started)

/* 
1. Query user for class start date and type of course (full or part time) DONE
2. Grab all class events from Class Schedule Template database in Notion DONE
3. Parse data to create simpler objects for each event (pageId, type, day, last working day) DONE
4. Starting on Day 1, add the correct date to each class event. Determine Date object for class start date DONE
5. When the event day changes, change the active date as well DONE
6. Check for weekend and holidays, skip those days (and Fridays if part time) DONE
7. If Assignment event, calculate the last working day and assignment submission date, add to event DONE
8. Make API requests to update each class event with the dates generated
*/

const notion = new Client({ auth: process.env.NOTION_KEY })
const testDatabaseId = process.env.NOTION_DATABASE_ID
const classScheduleDbId = process.env.NOTION_CLASS_SCHEDULE_ID

const queryForStartDate = () => {
  let dateString = prompt("When will the class start? Format: YYYY/MM/DD")
  return new Date(dateString)
}

const queryForCourseType = () => {
  let courseTypeString = prompt(
    "What type of class? <1 for Part-Time or 2 Full-Time>"
  )
  switch (parseInt(courseTypeString)) {
    case 1:
      return { 1: "Full-Time" }
    case 2:
      return { 2: "Part-Time" }
    default:
      queryForCourseType()
  }
}

const getClassSchedule = async (client, databaseId) => {
  try {
    let response = await client.databases.query({
      database_id: databaseId,
      sorts: [{ property: "Day", direction: "ascending" }],
    })
    return response.results
  } catch (error) {
    console.log(error)
  }
}

let database = await getClassSchedule(notion, classScheduleDbId)

const parseClassScheduleEvents = events => {
  let parsedDatabase = events.map(page => {
    return {
      pageId: page.id,
      day: page.properties.Day.number,
      type: page.properties.Type.select.name,
      lastWorkingDay: page.properties["Last Working Day"].number,
      name: page.properties.Name.title[0].text.content,
    }
  })
  return parsedDatabase
}

function addDatesToClassEvents(events, classDates) {
  let eventsWithDates = events.map(event => {
    //TODO: Refactor using Map with class dates
    if (event.type === "Assignment") {
      return {
        ...event,
        start: classDates.get(event.day),
        end: classDates.get(event.lastWorkingDay),
      }
    } else {
      return { ...event, start: classDates.get(event.day) }
    }
  })
  return eventsWithDates
}

function populateClassDatesMap(date, finalClassDay, formatDate) {
  let classDates = new Map()
  for (let index = 1; index <= finalClassDay; index++) {
    classDates.set(index, formatDate(date))
    date.setDate(date.getDate() + 1)
    // add day. Then check if day is a weekend or holiday. If either condition is true, keep incrementing days (always checking for both for each day)
    while (isWeekend(date) || isHoliday(date)) {
      date.setDate(date.getDate() + 1)
    }
  }
  return classDates
}

function isWeekend(date) {
  if (date.getDay() === 0 || date.getDay() === 6) {
    return true
  } else {
    return false
  }
}

function isHoliday(date) {
  let holidays = ["2021-11-25", "2021-11-26"]
  if (holidays.includes(formatDate(date))) {
    return true
  } else {
    return false
  }
}
function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

let parsedEvents = parseClassScheduleEvents(database)
let classDates = populateClassDatesMap(new Date("2021/10/18"), 45, formatDate)
let eventsWithDates = addDatesToClassEvents(parsedEvents, classDates)
console.log(eventsWithDates)
