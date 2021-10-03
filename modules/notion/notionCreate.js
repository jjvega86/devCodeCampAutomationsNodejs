/* Add custom course events to a Notion database  */

const addEventsToDatabase = (client, databaseId, data) => {
  data.forEach(courseEvent => {
    try {
      addNotionCourseEventToDatabase(client, databaseId, courseEvent)
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

export { addEventsToDatabase }
