import dotenv from "dotenv"
import { Client } from "@notionhq/client"

dotenv.config()

import { getDatabaseById } from "./modules/notion/notionQuery.js"
import { convertDataToNotionEvents } from "./modules/helpers/courseTemplateParse.js"
import { addEventsToDatabase } from "./modules/notion/notionCreate.js"
import { updateStandupStatusToNotStarted } from "./modules/notion/notionUpdate.js"
import { parseActiveStudentsCSV } from "./modules/helpers/activeStudentsParse.js"
import { addStudentsToDatabase } from "./modules/notion/notionAddStudent.js"
import addDatesToClassSchedule from "./modules/addDatesToClassSchedule.js"

const notion = new Client({ auth: process.env.NOTION_KEY })
//! ALL TODO COMMENTS HERE
//TODO: Write unit tests for all applicable functions using Jest
//TODO: Refactor modules folder to organize helpers and notion files together by action
//* See addDatesToClassSchedule as example. Each one should export a single default function
//TODO: Write script to add grading templates for all assignments for a Cohort to Grading. (Set up Notion to auto hide until two weeks out in Not Started)

addDatesToClassSchedule(notion)
