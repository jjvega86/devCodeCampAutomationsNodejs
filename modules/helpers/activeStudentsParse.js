import fs from "fs"
import path from "path"
import csv from "fast-csv"

const __dirname = path.resolve()

// returns a Promise with the parsed data resolved or an error
async function parseActiveStudentsCSV() {
  let data = []
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(
        __dirname,
        "assets",
        "Admissions to Instruction - Nov 1 - FT.csv"
      )
    )
      .pipe(csv.parse({ headers: true }))
      .on("error", error => reject(error))
      .on("data", row => {
        console.log(row)
        data.push(row)
      })
      .on("end", () => {
        resolve(data)
      })
  })
}

export { parseActiveStudentsCSV }
