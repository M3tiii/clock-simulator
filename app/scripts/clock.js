export default class Clock {

  constructor() {
    this.actualDay = {};
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  }

  set(name, action, value) {
    switch (action) {
      case "toggle-visibility":
        value ? this.d3Service.show(this[name]) : this.d3Service.hide(this[name]);
        break;
      case "toggle-boolean":
        this[name] = value;
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
    }
  }

  getDate() {
    const currentdate = new Date();
    return {
      year: currentdate.getFullYear(),
      month: currentdate.getMonth(),
      day: currentdate.getDate(),
      weekDay: currentdate.getDay()
    }
  }

  synchronzieClock() {
    return new Promise((resolve) => {
      const actual = this.getTime();
      setTimeout(() => {
        resolve(true);
      }, (1000 - actual.msecond));
    })
  }

  fillDate() {
    const actual = this.getDate();
    console.log(this.getTime().msecond);
    if (JSON.stringify(actual) !== JSON.stringify(this.actualDay)) {
      this.actualDay = actual;
      let dayNamePanel = $(".day-name");
      let dayDatePanel = $(".day-date");
      const dayNameText = this.days[this.actualDay.weekDay - 1] + ',';
      const dayDateText = `${this.actualDay.day} ${this.months[this.actualDay.month]} ${this.actualDay.year}`;
      dayNamePanel.text(dayNameText);
      dayDatePanel.text(dayDateText);
    }
  }

  run(callback) {
    this.synchronzieClock().then(() => {
      setInterval(() => {
        this.fillDate();
        callback();
      }, 1000);
    })
  }
}
