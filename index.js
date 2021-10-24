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
4. Starting on Day 1, add the correct date to each class event. Determine Date object for class start date
5. When the event day changes, change the active date as well
6. Check for weekend and holidays, skip those days (and Fridays if part time)
7. If Assignment event, calculate the last working day and assignment submission date, add to event
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

let parsedEvents = parseClassScheduleEvents(database)

function addDatesToClassEvents(events, startDate, formatDate) {
  //TODO: Create a Map with keys as day of class and values as the date of that class day
  // Then can use built in Map functions to more easily add dates and end dates to objects
  let currentDate = { date: startDate, dayNum: 1 }
  let eventsWithDates = events.map(event => {
    //TODO: Refactor using Map with class dates
    if (event.day === currentDate.dayNum) {
      return { ...event, "Date Assigned": formatDate(currentDate) }
    } else {
    }
  })
  return eventsWithDates
}

function populateClassDatesMap(date, finalClassDay, formatDate) {
  // finalClassDay is the number value of the final course day
  // Every day from 1 to finalClassDay (ex. 45) will have a date assigned to it
  // skipping weekends and holidays
  let classDates = new Map()
  let holidays = ["2021-11-25", "2021-11-26"]
  for (let index = 1; index <= finalClassDay; index++) {
    classDates.set(index, formatDate(date))
    date.setDate(date.getDate() + 1)
    while (true) {
      if (holidays.includes(formatDate(date))) {
        date.setDate(date.getDate() + 1)
      } else {
        break
      }
    }
    if (date.getDay() === 0) {
      date.setDate(date.getDate() + 1)
    } else if (date.getDay() === 6) {
      date.setDate(date.getDate() + 2)
    }
  }
  return classDates
}
function formatDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

let classDates = populateClassDatesMap(new Date("2021/10/18"), 45, formatDate)
console.log(classDates)
