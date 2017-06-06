import d3Service from './d3Service';

export default class Clock {

  constructor() {
    this.intervalId;
    this.timezoneOffset = 2;
    this.lastTime = {};
    this.lastDate = {};
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  }

  // handle settings checkboxes
  set(name, action, value) {
    switch (action) {
      case 'toggle-visibility':
        value ? d3Service.show(this[name]) : d3Service.hide(this[name]);
        break;
      case 'toggle-boolean':
        this[name] = value;
        break;
      case 'radio-switch':
        this.switchSymbols(name);
        break;
      case 'change-timezone':
        this.timezoneOffset = Number(value);
        this.callback(true);
        break;
    }
  }

  getTime() {
    const currentTime = new Date();
    return {
      hour: currentTime.getUTCHours() + this.timezoneOffset,
      minute: currentTime.getUTCMinutes(),
      second: currentTime.getUTCSeconds(),
      msecond: currentTime.getUTCMilliseconds()
    };
  }

  getDate() {
    const currentDate = new Date();
    return {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day: currentDate.getDate(),
      weekDay: currentDate.getDay()
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
    this.callback = this.tick.bind(this);
    this.callback(true); //set first status of time to avoid view of unset clock before synchronize which may take to 1 sec
    this.run();
  }

  // start main clock interval every 1 sec
  run() {
    this.synchronzieClock().then(() => {
      this.callback(true);
      this.intervalId = setInterval(() => {
        this.callback();
      }, 1000);
    });
  }
}
