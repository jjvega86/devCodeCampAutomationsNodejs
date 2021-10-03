/* GET database by databaseId and GET database records by databaseId with filtering, plus formatting helper  */

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

export { getDatabaseById, queryDatabaseByFilter }
