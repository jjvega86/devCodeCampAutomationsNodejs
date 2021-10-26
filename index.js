import dotenv from "dotenv"
import { Client } from "@notionhq/client"

import { getDatabaseById } from "./modules/notion/notionQuery.js"
import { convertDataToNotionEvents } from "./modules/helpers/courseTemplateParse.js"
import { addEventsToDatabase } from "./modules/notion/notionCreate.js"
import { updateStandupStatusToNotStarted } from "./modules/notion/notionUpdate.js"
import { parseActiveStudentsCSV } from "./modules/helpers/activeStudentsParse.js"
import { addStudentsToDatabase } from "./modules/notion/notionAddStudent.js"
import addDatesToClassSchedule from "./modules/addDatesToClassSchedule.js"

dotenv.config()

//! ALL TODO COMMENTS HERE
//TODO: Write unit tests for all functions using Jest
//TODO: Move class schedule functions into own module and expose a single function to use in index.js
//TODO: Write script to add grading templates for all assignments for a Cohort to Grading. (Set up Notion to auto hide until two weeks out in Not Started)

const notion = new Client({ auth: process.env.NOTION_KEY })
addDatesToClassSchedule(notion)
