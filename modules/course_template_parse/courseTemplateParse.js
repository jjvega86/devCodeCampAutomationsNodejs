const fs = require("fs")
const path = require("path")
const csv = require("fast-csv")
const NotionEvent = require("../../classes/NotionEvent")

//* I want to parse each row of the csv
//* I will create a new rowType for all events in that row
//* I will then iterate through that new array of events and add to a new csv
//* I will then import that csv to Notion (ideally in the correct format)

//* This data array will contain all of the individual NotionEvent objects created from all lectures and assignments in the course
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
    segregateData(newRow)
  })
  .on("end", () => {
    let [assignments, lectures] = filterEvents(data)
    let dedupedAssignments = dedupeAssignments(assignments)
    data = lectures.concat(dedupedAssignments)
    console.log(data)
  })
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
  processLectures(convertedDay, lectures[1].split(","))
  processAssignments(convertedDay, assignments[1].split(","))
}

function processAssignments(day, assignments) {
  assignments.forEach(assignment => {
    if (assignment === "") {
      return
    } else {
      let event = new NotionEvent(assignment.trim())
      event.addDay(day)
      event.addType("Assignment")
      data.push(event)
    }
  })
}

function processLectures(day, lectures) {
  lectures.forEach(lecture => {
    if (lecture === "") {
      return
    } else {
      let event = new NotionEvent(lecture)
      event.addDay(day)
      event.addType("Lecture")
      data.push(event)
    }
  })
}
