import Clock from "./clock";
import * as d3 from "d3";
import d3Service from "./d3Service";

export default class Digital extends Clock {

  constructor() {
    super();

    const svgWidth = 300;
    const svgHeight = 300;
    this.width = 300;
    this.height = 150;
    this.fontSize = 80;
    this.timeMode = true;

    const borderData = [{
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      class: "clock-border"
    }];

    const numberData = [{
      x: this.width / 2 - this.fontSize / 2,
      y: this.height / 2 + this.fontSize / 4,
      "font-size": this.fontSize + "px",
      "class": "digital-number digital-hour",
      "text-anchor": "end"
    }, {
      x: this.width / 2,
      y: this.height / 2 + this.fontSize / 4,
      "font-size": this.fontSize + "px",
      "class": "digital-number digital-minute",
      "text-anchor": "start"
    }, {
      x: this.width / 2 - this.fontSize / 4,
      y: this.height / 2 + this.fontSize / 4,
      "font-size": this.fontSize + "px",
      "class": "digital-number digital-divider",
      "text-anchor": "middle"
    }, {
      x: this.width - this.fontSize / 6,
      y: this.height / 2 + this.fontSize / 4,
      "font-size": this.fontSize / 2 + "px",
      "class": "digital-number digital-second",
      "text-anchor": "end"
    }, {
      x: this.width - this.fontSize / 6,
      y: this.height - this.fontSize / 8,
      "font-size": this.fontSize / 3 + "px",
      "class": "digital-number digital-msecond",
      "text-anchor": "end"
    }, {
      x: this.fontSize / 2,
      y: this.height - this.fontSize / 8,
      "font-size": this.fontSize / 5 + "px",
      "class": "digital-number digital-date",
      "text-anchor": "start"
    }];

    const svgContainer = d3.select("div.clock-digital-svg").append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const border = svgContainer.selectAll("rect")
      .data(borderData)
      .enter()
      .append("rect");
    d3Service.updateProperties(borderData, border);

    const textLabel = svgContainer.selectAll("text")
      .data(numberData)
      .enter()
      .append("text");
    d3Service.updateProperties(numberData, textLabel);

    this.digitalHour = textLabel.filter(".digital-hour");
    this.digitalMinute = textLabel.filter(".digital-minute");
    this.digitalDivider = textLabel.filter(".digital-divider");
    this.digitalDivider.text(":");
    this.digitalSecond = textLabel.filter(".digital-second");
    this.digitalMsecond = textLabel.filter(".digital-msecond");
    this.digitalDate = textLabel.filter(".digital-date");
  }

  // render miliseconds counter
  updateMiliseconds(ms) {
    setTimeout(() => {
      this.digitalMsecond.text(ms);
      ms += 10;
      if (ms < 1000)
        this.updateMiliseconds(ms);
    }, 10);
  }

  // change format of time to minimum double numeric
  toTimerPrefix(time) {
    return time < 10 ? "0" + time : time;
  }

  // manage one tick (1 sec) of working clock
  tick() {
    const time = this.getTime();
    if (time.second != this.lastTime.second) {
      time.hour = this.timeMode ? time.hour : (time.hour >= 12 ? (time.hour - 12) : time.hour)
      this.digitalHour.text(this.toTimerPrefix(time.hour));
      this.digitalMinute.text(this.toTimerPrefix(time.minute));
      this.digitalSecond.text(this.toTimerPrefix(time.second));
      const fullDate = this.getFullDate(this.lastDate);
      if (fullDate) {
        this.lastDate = fullDate.actual;
        this.digitalDate.text(fullDate.dayNameText + ", " + fullDate.dayDateText);
      }
      this.lastTime.second = time.second;
      this.updateMiliseconds(0);
    }
  }
}
