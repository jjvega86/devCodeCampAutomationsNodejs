import dotenv from "dotenv"
import { Client } from "@notionhq/client"
import NotionEvent from "./classes/NotionEvent.js"

import {
  updateStandupStatusToNotStarted,
  queryDatabaseByFilter,
} from "./modules/test_functions/testFunctions.js"
import { convertDataToNotionEvents } from "./courseTemplateParse.js"

dotenv.config()

//! ALL TODO COMMENTS HERE
//TODO: Write unit tests for all functions
//TODO: Add module to Notion modules to add Notion Events to a new course database table in Notion
//TODO: Refactor testFunctions.js - split into appropriate Notion modules
//TODO: Move courseTemplateParse to its own folder and fix import bug

const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_DATABASE_ID
const testDatabaseId = process.env.NOTION_TEST_DATABASE_ID
/*
const filteredDatabase = await queryDatabaseByFilter(notion, databaseId, {
  property: "Standup Status",
  select: {
    does_not_equal: "Cohort Finished",
  },
})

updateStandupStatusToNotStarted(filteredDatabase, notion) */
const addEventsToDatabase = async (client, databaseId, data, callback) => {
  data.forEach(courseEvent => {
    try {
      callback(client, databaseId, courseEvent)
    } catch (error) {
      console.error(error)
    }
  })
}

const addNotionCourseEventToDatabase = async (client, databaseId, event) => {
  try {
    let response = await client.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: event.name,
              },
            },
          ],
        },
        Day: {
          number: event.day,
        },
        "Last Working Day": {
          number:
            event.lastWorkingDay === "" ? event.day : event.lastWorkingDay,
        },
        Type: {
          select: {
            name: event.type,
          },
        },
      },
    })
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

let data = await convertDataToNotionEvents()
await addEventsToDatabase(
  notion,
  testDatabaseId,
  data,
  addNotionCourseEventToDatabase
)
