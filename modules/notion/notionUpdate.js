/* Update Notion Active Students database for students all students to status Not Started */

const updateStandupStatusToNotStarted = async (data, notionClient) => {
  data.forEach(async page => {
    try {
      await notionClient.pages.update({
        page_id: page.id,
        properties: {
          "Standup Status": { select: { name: "Not Started" } },
        },
      })
    } catch (error) {
      console.log(error)
    }
  })
}

export { updateStandupStatusToNotStarted }
