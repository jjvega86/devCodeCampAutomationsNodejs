import fs from "fs"
import path from "path"
import csv from "fast-csv"
import NotionEvent from "../../classes/NotionEvent.js"

const __dirname = path.resolve()

/*
Parse a .csv file containing data for a devCodeCamp course template
Convert each row into lecture and assignment events using custom class syntax
Return a collection of custom events to be added to a Notion database using official API 
 */
async function parseCourseTemplate() {
  let data = []
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(
        __dirname,
        "assets",
        "FullStackDevelopmentSchedule (1) - 14 Weeks V1.csv"
      )
    )
      .pipe(csv.parse({ headers: true }))
      .on("error", error => reject(error))
      .on("data", row => {
        let newRow = parseRow(row)
        let segregatedData = segregateData(newRow)
        data.push(...segregatedData)
      })
      .on("end", () => {
        resolve(data)
      })
  })
}

const convertParsedCourseDataToNotionEvents = async () => {
  let finalData = []
  let data = await parseCourseTemplate()
  let [assignments, lectures] = filterEvents(data)
  let dedupedAssignments = dedupeAssignments(assignments)
  finalData = lectures.concat(dedupedAssignments)
  return finalData
}

function filterEvents(data) {
  let assignments = data.filter(event => {
    if (event.type === "Assignment") {
      return true
    } else {
      return false
    }
  })
  let lectures = data.filter(event => {
    if (event.type === "Lecture") {
      return true
    } else {
      return false
    }
  })
  return [assignments, lectures]
}
function dedupeAssignments(data) {
  let currentAssignment = data[0]
  let finalAssignments = []

  data.splice(1).forEach(event => {
    if (event.name === currentAssignment.name) {
      currentAssignment.lastWorkingDay++
    } else {
      finalAssignments.push(currentAssignment)
      currentAssignment = event
      currentAssignment.lastWorkingDay = currentAssignment.day
    }
  })
  finalAssignments.push(currentAssignment)
  return finalAssignments
}
const parseRow = row => {
  let convertedRow = Object.entries(row)
  let splicedConvertedRow = convertedRow.splice(1)
  return splicedConvertedRow
}

const segregateData = convertedRow => {
  let [day, lectures, assignments] = convertedRow
  let convertedDay = parseInt(day[1])
  let lectureEvents = processLectures(convertedDay, lectures[1].split(","))
  let assignmentEvents = processAssignments(
    convertedDay,
    assignments[1].split(",")
  )
  return lectureEvents.concat(assignmentEvents)
}

function processAssignments(day, assignments) {
  let processedAssignments = []
  assignments.forEach(assignment => {
    if (assignment === "") {
      return
    } else {
      let event = new NotionEvent(assignment.trim())
      event.addDay(day)
      event.addType("Assignment")
      processedAssignments.push(event)
    }
  })
  return processedAssignments
}

function processLectures(day, lectures) {
  let processedLectures = []
  lectures.forEach(lecture => {
    if (lecture === "") {
      return
    } else {
      let event = new NotionEvent(lecture)
      event.addDay(day)
      event.addType("Lecture")
      processedLectures.push(event)
    }
  })
  return processedLectures
}

export { convertParsedCourseDataToNotionEvents as convertDataToNotionEvents }
