import { isWeekend } from "../modules/addDatesToClassSchedule"

// All related tests are grouped under the same describe
// Each individual test is written under a call to test
// For readability, use the arrange -> act -> assert structure
describe("Date helper function tests", () => {
  test("Returns true when date is a Saturday (6)", () => {
    // arrange
    let date = new Date("2021/10/30")

    // act
    let result = isWeekend(date)

    // assert
    expect(result).toBe(true)
  })
})
