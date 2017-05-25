import Clock from './clock';
import * as d3 from "d3";
import d3Service from './d3Service';

export default class Digital extends Clock {

  constructor() {
    super();
    this.d3Service = new d3Service();

    this.width = 300;
    this.height = 150;
    this.fontSize = 80;

    const borderData = [{
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      class: "clock-border"
    }];

    const numberData = [{
      x: this.width / 2 - this.fontSize * 1.25,
      y: this.height / 2 + this.fontSize / 4,
      "font-size": this.fontSize + "px",
      "class": 'digital-number digital-hour'
    }, {
      x: this.width / 2 + this.fontSize * 0.25,
      y: this.height / 2 + this.fontSize / 4,
      "font-size": this.fontSize + "px",
      "class": 'digital-number digital-minute'
    }, {
      x: this.width * 0.8,
      y: this.height - this.fontSize / 8,
      "font-size": this.fontSize / 2 + "px",
      "class": 'digital-number digital-second'
    }]

    let svgContainer = d3.select("div.clock-digital-svg").append("svg")
      .attr("width", 300)
      .attr("height", 300);

    let border = svgContainer.selectAll("rect")
      .data(borderData)
      .enter()
      .append("rect");
    this.d3Service.updateProperties(borderData, border);

    let textLabel = svgContainer.selectAll("text")
      .data(numberData)
      .enter()
      .append("text");
    this.d3Service.updateProperties(numberData, textLabel);

    this.digitalHour = textLabel.filter(".digital-hour");
    this.digitalMinute = textLabel.filter(".digital-minute");
    this.digitalSecond = textLabel.filter(".digital-second");

    this.lastTime = {};
  }

  toTimer(time) {
    return time < 10 ? "0" + time : time;
  }

  tick() {
    const time = this.getTime();
    if (time.second != this.lastTime.second) {
      this.digitalHour.text(time.hour + ":");
      this.digitalMinute.text(this.toTimer(time.minute));
      this.digitalSecond.text(this.toTimer(time.second));
      this.lastTime.second = time.second;
    }
  }

  render() {
    this.run(() => {
      this.tick()
    });
  }

}
