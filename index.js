import dotenv from "dotenv"
import { Client } from "@notionhq/client"

import {
  getDatabaseById,
  filterPagesBySelectProperty,
  updateStandupStatusToNotStarted,
} from "./modules/test_functions/testFunctions.js"

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

//TODO: Write unit tests for all functions
//TODO: Write a filter database query function that passes an object in for the filter
//TODO: Destructure key properties from pages objects returned from database query; refactor functions for simpler logic
//TODO: Write a function to filter pages for Full-Time or Part-Time Course

//! awaiting this call to getDatabaseById in order to get resolved data instead of pending Promise
const database = await getDatabaseById(notion, databaseId)
console.log(database[0])
let results = filterPagesBySelectProperty(database, "Course", "Full-Time")

console.log(results.length)

let nextResults = filterPagesBySelectProperty(
  results,
  "Standup Status",
  "In Progress"
)

console.log(nextResults.length)

updateStandupStatusToNotStarted(nextResults, notion)
