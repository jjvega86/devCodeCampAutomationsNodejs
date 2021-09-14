const addItem = async (notionClient, databaseId, text) => {
  try {
    const response = await notionClient.pages.create({
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

export default addItem
