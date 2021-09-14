import dotenv from "dotenv"
import { Client } from "@notionhq/client"

import {
  addItem,
  getDatabaseById,
} from "./modules/test_functions/testFunctions.js"

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID

// TODO: Write out sequence of functions to get all pages in a database and modify their multi select property with another value
// TODO: Port this sequence to modifying Active Students to Not Started
//! awaiting this call to getDatabaseById in order to get resolved data instead of pending Promise
const database = await getDatabaseById(notion, databaseId)

const updateAllTags = async (databaseData, notionClient) => {
  databaseData.forEach(async page => {
    try {
      let response = await notionClient.pages.update({
        page_id: page.id,
        properties: {
          Tags: { select: { name: "A new tag" } },
        },
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  })
}

updateAllTags(database, notion)
