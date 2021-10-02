import dotenv from "dotenv"
import { Client } from "@notionhq/client"

import {
  updateStandupStatusToNotStarted,
  queryDatabaseByFilter,
} from "./modules/test_functions/testFunctions.js"
import parseCourseTemplate from "./modules/course_template_parse/courseTemplateParse"

dotenv.config()

//! ALL TODO COMMENTS HERE
//TODO: Write unit tests for all functions
//TODO: Port NodeFileSystem code over and organize folder/file structure

/* const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

let filter = {
  property: "Standup Status",
  select: {
    does_not_equal: "Cohort Finished",
  },
}

const filteredDatabase = await queryDatabaseByFilter(notion, databaseId, filter)
console.log(filteredDatabase.length)

updateStandupStatusToNotStarted(filteredDatabase, notion) */
let parsedData = parseCourseTemplate()
console.log(parsedData)
