import dotenv from "dotenv"
import { Client } from "@notionhq/client"

import {
  updateStandupStatusToNotStarted,
  queryDatabaseByFilter,
} from "./modules/test_functions/testFunctions.js"

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

//TODO: Write unit tests for all functions

let filter = {
  property: "Standup Status",
  select: {
    does_not_equal: "Cohort Finished",
  },
}

const filteredDatabase = await queryDatabaseByFilter(notion, databaseId, filter)
console.log(filteredDatabase.length)

updateStandupStatusToNotStarted(filteredDatabase, notion)
