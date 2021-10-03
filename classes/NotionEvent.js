class NotionEvent {
  constructor(name) {
    this.name = name
    this.type = ""
    this.day = ""
    this.lastWorkingDay = ""
  }

  addDay(dayNumber) {
    this.day = dayNumber
  }

  addType(type) {
    this.type = type
  }
}

export default NotionEvent
