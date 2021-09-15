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
    return formatDatabaseData(response.results)
  } catch (error) {
    console.error(error)
  }
}

/* EXAMPLE FILTER ARG
let filter = {
  property: "Course",
  select: {
    equals: "Full-Time",
  },
}
*/
const queryDatabaseByFilter = async (notionClient, databaseId, filter = {}) => {
  try {
    const response = await notionClient.databases.query({
      database_id: databaseId,
      filter: filter,
    })
    return formatDatabaseData(response.results)
  } catch (error) {
    console.log(error)
  }
}

const formatDatabaseData = data => {
  let formattedData = data.map(page => {
    return {
      id: page.id,
      properties: page.properties,
    }
  })

  return formattedData
}

const filterPagesBySelectProperty = (data, property, value) => {
  let filteredData = data.filter(page => {
    if (page.properties[property].select.name === value) {
      return true
    }
  })

  return filteredData
}

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

export {
  addItem,
  getDatabaseById,
  filterPagesBySelectProperty,
  updateStandupStatusToNotStarted,
  queryDatabaseByFilter,
}
