import dotenv from "dotenv"
import { Client } from "@notionhq/client"

import addItem from "./modules/test_functions/testFunctions.js"

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID

addItem(notion, databaseId, "This is another test")
