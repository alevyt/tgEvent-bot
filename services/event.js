class Event {
    constructor(name, date, description) {
      this.name = name;
      this.date = date;
      this.description = description;
    }
  
    displayInfo() {
      return `Event Name: ${this.name}\nDate: ${this.date}\nDescription: ${this.description}`;
    }
  }
  
  module.exports = Event;
  