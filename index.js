import dotenv from "dotenv"
import { Client } from "@notionhq/client"

import { queryDatabaseByFilter } from "./modules/notion/notionQuery.js"
import { convertDataToNotionEvents } from "./modules/helpers/courseTemplateParse.js"
import { addEventsToDatabase } from "./modules/notion/notionCreate.js"
import { updateStandupStatusToNotStarted } from "./modules/notion/notionUpdate.js"

dotenv.config()

//! ALL TODO COMMENTS HERE
//TODO: Write unit tests for all functions

const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID
const testDatabaseId = process.env.NOTION_TEST_DATABASE_ID

const filteredDatabase = await queryDatabaseByFilter(notion, databaseId, {
  property: "Standup Status",
  select: {
    does_not_equal: "Cohort Finished",
  },
})

updateStandupStatusToNotStarted(filteredDatabase, notion)

let data = await convertDataToNotionEvents()
addEventsToDatabase(notion, testDatabaseId, data)
