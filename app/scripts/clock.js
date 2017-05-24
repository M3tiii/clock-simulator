export default class Clock {

  constructor() {}

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
      year: currentdate.getFullYear,
      month: currentdate.getMonth + 1,
      day: currentdate.getDate()
    }
  }

  run(callback) {
    setInterval(() => {
      callback();
    }, 1000);
  }
}
