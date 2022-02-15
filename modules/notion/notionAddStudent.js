/* Add student objects from .csv to Active Students */

const addStudentsToDatabase = (client, databaseId, data) => {
  data.forEach(student => {
    try {
      studentValidate(student)
      addStudentToActiveStudents(client, databaseId, student)
    } catch (error) {
      console.error(error)
    }
  })
}

function studentValidate(student) {
  for (let property in student) {
    if (!student[property]) {
      student[property] = "N/A"
    }
  }
}

const addStudentToActiveStudents = async (client, databaseId, student) => {
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
                content: student["Student Name"],
              },
            },
          ],
        },
        Course: {
          select: {
            name: student["Course"],
          },
        },
        Cohort: {
          select: {
            name: student["Cohort"],
          },
        },
        "Standup Status": {
          select: {
            name: "Not Started",
          },
        },
        "Contact Number": {
          phone_number: student["Contact Number"],
        },
        "Emergency Contact Number": {
          phone_number: student["Emergency Contact Number"],
        },
        "Emergency Contact Name": {
          rich_text: [
            {
              type: "text",
              text: {
                content: student["Emergency Contact Name"],
              },
            },
          ],
        },
        "Admissions Notes": {
          rich_text: [
            {
              type: "text",
              text: {
                content: student["Admissions Notes"],
              },
            },
          ],
        },
      },
    })
  } catch (error) {
    console.error(error)
  }
}

export { addStudentsToDatabase }
