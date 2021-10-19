import dotenv from "dotenv"
import { Client } from "@notionhq/client"

import { getDatabaseById } from "./modules/notion/notionQuery.js"
import { convertDataToNotionEvents } from "./modules/helpers/courseTemplateParse.js"
import { addEventsToDatabase } from "./modules/notion/notionCreate.js"
import { updateStandupStatusToNotStarted } from "./modules/notion/notionUpdate.js"
import { parseActiveStudentsCSV } from "./modules/helpers/activeStudentsParse.js"
import { addStudentsToDatabase } from "./modules/notion/notionAddStudent.js"

dotenv.config()

//! ALL TODO COMMENTS HERE
//TODO: Write unit tests for all functions using Jest
//TODO: Write script to add new students to Active Students database
//TODO: Write script to add dates to class schedule in Class Schedule Template

/* 
1. Parse .csv file with all Active Students in it
2. Select Full-Time or Part-Time 
3. Ask for Cohort name
4. For each student, add those property values 
5. Add each student to the Active Students database
*/

const notion = new Client({ auth: process.env.NOTION_KEY })
//const databaseId = process.env.NOTION_DATABASE_ID
const testDatabaseId = process.env.NOTION_DATABASE_ID

let data = await parseActiveStudentsCSV("Full-Time", "Parsnips")
addStudentsToDatabase(notion, testDatabaseId, data)
console.log(data)
