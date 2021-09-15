import dotenv from "dotenv"
import { Client } from "@notionhq/client"

import {
  getDatabaseById,
  filterPagesBySelectProperty,
  updateStandupStatusToNotStarted,
  queryDatabaseByFilter,
} from "./modules/test_functions/testFunctions.js"

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

//TODO: Write unit tests for all functions

//! awaiting this call to getDatabaseById in order to get resolved data instead of pending Promise
const database = await getDatabaseById(notion, databaseId)
let filter = {
  property: "Course",
  select: {
    equals: "Full-Time",
  },
}
const filteredDatabase = await queryDatabaseByFilter(notion, databaseId, filter)
console.log(filteredDatabase)

//let results = filterPagesBySelectProperty(database, "Course", "Full-Time")

// console.log(results.length)

// let nextResults = filterPagesBySelectProperty(
//   results,
//   "Standup Status",
//   "In Progress"
// )

// console.log(nextResults.length)

// updateStandupStatusToNotStarted(nextResults, notion)
