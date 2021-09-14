/** For accessing the value of multi-select properties on a database page and filtering for that value
 * console.log(response.results[0].properties["Tags"]["multi_select"][0].name)
    let results = response.results.filter(page => {
      if (page.properties["Tags"]["multi_select"].length > 0) {
        if (page.properties["Tags"].multi_select[0].color === "brown") {
          return true
        }
      }
    })
    console.log(results)
 */

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
    console.log("Success!", response)
  } catch (error) {
    console.error(error.body)
  }
}

const getDatabaseById = async (notionClient, databaseId) => {
  try {
    const response = await notionClient.databases.query({
      database_id: databaseId,
    })
    return response.results
  } catch (error) {
    console.error(error)
  }
}

export { addItem, getDatabaseById }
