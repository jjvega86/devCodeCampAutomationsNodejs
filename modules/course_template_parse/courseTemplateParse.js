import fs from "fs"
import path from "path"
import csv from "fast-csv"
import NotionEvent from "../../classes/NotionEvent"

//* I want to parse each row of the csv
//* I will create a new rowType for all events in that row
//* I will then iterate through that new array of events and add to a new csv
//* I will then import that csv to Notion (ideally in the correct format)

//* This data array will contain all of the individual NotionEvent objects created from all lectures and assignments in the course

export default parseCourseTemplate = () => {
  let data = []
  fs.createReadStream(
    path.join(
      __dirname,
      "assets",
      "FullStackSoftwareDevCourseSchedule12week - 12 Weeks V2.csv"
    )
  )
    .pipe(csv.parse({ headers: true }))
    .on("error", error => console.error(error))
    .on("data", row => {
      let newRow = parseRow(row)
      let segregatedData = segregateData(newRow)
      data.push(...segregatedData)
    })
    .on("end", () => {
      let [assignments, lectures] = filterEvents(data)
      let dedupedAssignments = dedupeAssignments(assignments)
      data = lectures.concat(dedupedAssignments)
      return data
    })
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
