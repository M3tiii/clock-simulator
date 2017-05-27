import d3Service from "./d3Service";

export default class Clock {

  constructor() {
    this.intervalId;
    this.lastTime = {};
    this.lastDate = {};
    this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    this.months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  }

  // handle settings checkboxes
  set(name, action, value) {
    switch (action) {
      case "toggle-visibility":
        value ? d3Service.show(this[name]) : d3Service.hide(this[name]);
        break;
      case "toggle-boolean":
        this[name] = value;
        break;
      case "radio-switch":
        this.switchSymbols(name);
        break;
    }
  }

  getTime() {
    const currentdate = new Date();
    return {
      hour: currentdate.getHours(),
      minute: currentdate.getMinutes(),
      second: currentdate.getSeconds(),
      msecond: currentdate.getMilliseconds()
    };
  }

  getDate() {
    const currentdate = new Date();
    return {
      year: currentdate.getFullYear(),
      month: currentdate.getMonth(),
      day: currentdate.getDate(),
      weekDay: currentdate.getDay()
    };
  }

  // synchronize timer with user local clock
  synchronzieClock() {
    return new Promise((resolve) => {
      const actual = this.getTime();
      setTimeout(() => resolve(true), (1000 - actual.msecond));
    });
  }

  // extract day name and date to text from Date
  collectDate(lastDate, trim) {
    const actual = this.getDate();
    if (JSON.stringify(actual) !== JSON.stringify(lastDate)) {
      const dayNameText = this.days[actual.weekDay - 1];
      const monthNameText = this.months[actual.month];
      const dayDateText = `${actual.day} ${trim ? monthNameText.slice(0,trim) : monthNameText} ${actual.year}`;
      return {
        dayNameText,
        dayDateText,
        actual
      };
    }
    return false;
  }

  // get full extracted date
  getFullDate(lastDate) {
    return this.collectDate(lastDate);
  }

  // get extracted date, month as 3 signs
  getShortDate(lastDate) {
    return this.collectDate(lastDate, 3);
  }

  // start running clock
  render() {
    this.run(this.tick.bind(this));
  }

  // start main clock interval every 1 sec
  run(callback) {
    callback(); //set first status of time to avoid view of unset clock before synchronize which may take to 1 sec
    this.synchronzieClock().then(() => {
      this.intervalId = setInterval(() => {
        callback();
      }, 1000);
    });
  }
}
