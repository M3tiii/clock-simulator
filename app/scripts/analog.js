import Clock from './clock';
import * as d3 from "d3";
import d3Service from './d3Service';

export default class Analog extends Clock {

  constructor() {
    super();

    this.d3Service = new d3Service();
    this.range = 100;
    this.center = 150;
    this.shortWidth = 8;
    this.shortHeight = 50;
    this.longWidth = 5;
    this.longHeight = 80;
    this.secondWidth = 2;
    this.secondHeight = 80;

    const borderData = [{
      cx: this.center,
      cy: this.center,
      r: this.range,
      class: "clock-border"
    }];

    const clockData = [{
      x: this.center - this.shortWidth / 2,
      y: this.center - this.shortWidth / 2,
      width: this.shortWidth,
      height: this.shortHeight,
      class: "short-hand"
    }, {
      x: this.center - this.longWidth / 2,
      y: this.center - this.longWidth / 2,
      width: this.longWidth,
      height: this.longHeight,
      class: "long-hand"
    }, {
      x: this.center - this.secondWidth / 2,
      y: this.center - this.secondWidth / 2,
      width: this.secondWidth,
      height: this.secondHeight,
      class: "second-hand"
    }];

    this.svgContainer = d3.select("div.clock-analog-svg").append("svg")
      .attr("width", 300)
      .attr("height", 300);

    let border = this.svgContainer.selectAll("circle")
      .data(borderData)
      .enter()
      .append("circle");

    this.d3Service.updateProperties(borderData, border);

    let clocks = this.svgContainer.selectAll("rect")
      .data(clockData)
      .enter()
      .append("rect");

    this.d3Service.updateProperties(clockData, clocks);

    this.lastTime = {};
    this.short = clocks.filter(".short-hand");
    this.long = clocks.filter(".long-hand");
    this.second = clocks.filter(".second-hand");


    this.secondShifter = this.spawnShifter(60, 5);
    this.hourShifter = this.spawnShifter(12, 10);

  }

  spawnShifter(n, long = 10) {
    let lineData = [];
    for (let i = 0; i < n; i++) {
      lineData.push({
        x1: this.center + this.range - long,
        y1: this.center,
        x2: this.center + this.range,
        y2: this.center,
        "style": "stroke: #000",
        'transform': 'rotate(' + (i * 360 / n - 90) + ' 150 150)'
      });
    }
    let lines = this.svgContainer.selectAll()
      .data(lineData)
      .enter()
      .append("line");

    this.d3Service.updateProperties(lineData, lines);
    return lines;
  }

  rotate(el, angle, max, duration) {
    el.transition().duration(duration)
      .attrTween("transform", () => {
        angle = (angle / max * 360) + 180;
        const i = d3.interpolate(angle, angle + 360 / max);
        return (t) => {
          return "rotate(" + i(t) + ",150,150)";
        };
      });
  }

  tick() {
    const time = this.getTime();
    if (time.second != this.lastTime.second) {
      this.lastTime.second = time.second;
      this.rotate(this.second, time.second, 60, 20000);
      this.rotate(this.long, (time.minute * 60 + time.second), 3600, 5);
      this.rotate(this.short, (time.hour * 60 + time.minute), 720, 5);
    }
  }

  render() {
    this.run(() => {
      this.tick()
    });
  }
}
