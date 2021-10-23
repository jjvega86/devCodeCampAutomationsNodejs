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
1. Query user for class start date and type of course (full or part time)
2. Grab all class events from Class Schedule Template database in Notion
3. Determine Date object for class start date
4. Starting on Day 1, add the correct date to each class event
5. When the event day changes, change the active date as well
6. Check for weekend and holidays, skip those days (and Fridays if part time)
7. If Assignment event, calculate the last working day and assignment submission date, add to event
*/

const notion = new Client({ auth: process.env.NOTION_KEY })
const testDatabaseId = process.env.NOTION_DATABASE_ID

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

let date = queryForStartDate()
console.log(date.toString())

let courseType = queryForCourseType()
console.log(courseType)
