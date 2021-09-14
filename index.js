import dotenv from "dotenv"
import { Client } from "@notionhq/client"

import {
  addItem,
  getDatabaseById,
} from "./modules/test_functions/testFunctions.js"

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID

//! awaiting this call to getDatabaseById in order to get resolved data instead of pending Promise
//TODO: Write a filter database query function that passes an object in for the filter
const database = await getDatabaseById(notion, databaseId)

//TODO: Write a function to filter pages for Full-Time or Part-Time Course
//TODO: Destructure key properties from pages objects returned from database query; refactor functions for simpler logic
//* Can do this as a database query with a filter object passed as argument
const filterPagesBySelectProperty = (data, property, value) => {
  let filteredData = data.filter(page => {
    if (page.properties[property].select.name === value) {
      return true
    }
  })

  return filteredData
}

let results = filterPagesBySelectProperty(database, "Course", "Full-Time")
console.log(results.length)
let nextResults = filterPagesBySelectProperty(
  results,
  "Standup Status",
  "In Progress"
)
console.log(nextResults.length)

//TODO: Write unit tests for all functions
const updateStandupStatusToNotStarted = async (data, notionClient) => {
  data.forEach(async page => {
    try {
      let response = await notionClient.pages.update({
        page_id: page.id,
        properties: {
          "Standup Status": { select: { name: "Not Started" } },
        },
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  })
}

updateStandupStatusToNotStarted(nextResults, notion)
