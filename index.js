import dotenv from "dotenv"
import { Client } from "@notionhq/client"

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID

const addItem = async text => {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: {
          title: [
            {
              text: {
                content: text,
              },
            },
          ],
        },
      },
    })
    console.log("Success!", response.properties)
  } catch (error) {
    console.error(error.body)
  }
}

addItem("This is a test")
