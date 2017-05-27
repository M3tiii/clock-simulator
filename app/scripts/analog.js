import Clock from "./clock";
import * as d3 from "d3";
import d3Service from "./d3Service";

export default class Analog extends Clock {

  constructor() {
    super();

    const svgWidth = 300;
    const svgHeight = 300;
    this.range = 100;
    this.center = 150;
    this.shortWidth = 8;
    this.shortHeight = 50;
    this.longWidth = 5;
    this.longHeight = 80;
    this.secondWidth = 2;
    this.secondHeight = 80;
    this.fontSize = 18;
    this.rounded = 5;
    this.opacity = 0.85;

    this.symbolsSign = {
      arabic: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      roman: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
    };

    const borderData = [{
      cx: this.center,
      cy: this.center,
      r: this.range,
      class: "clock-border"
    }];

    const clockData = [{
      x: this.center - this.shortWidth / 2,
      y: this.center - this.shortWidth / 2,
      rx: this.rounded,
      width: this.shortWidth,
      height: this.shortHeight,
      "fill-opacity": this.opacity,
      "class": "short-hand"
    }, {
      x: this.center - this.longWidth / 2,
      y: this.center - this.longWidth / 2,
      rx: this.rounded,
      width: this.longWidth,
      height: this.longHeight,
      "fill-opacity": this.opacity,
      "class": "long-hand"
    }, {
      x: this.center - this.secondWidth / 2,
      y: this.center - this.secondWidth / 2,
      rx: this.rounded,
      width: this.secondWidth,
      height: this.secondHeight,
      "fill-opacity": this.opacity,
      "class": "second-hand"
    }];

    const dateData = [{
      x: this.center,
      y: this.center + this.range / 2,
      "font-size": this.fontSize + "px",
      "class": "digital-number analog-date",
      "text-anchor": "middle",
      "fill": "gray"
    }, {
      x: this.center,
      y: this.center + this.range / 2 + this.fontSize * 1.1,
      "font-size": this.fontSize + "px",
      "class": "digital-number analog-day",
      "text-anchor": "middle",
      "fill": "gray"
    }];

    this.svgContainer = d3.select("div.clock-analog-svg").append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const date = this.svgContainer.selectAll("text")
      .data(dateData)
      .enter()
      .append("text");

    d3Service.updateProperties(dateData, date);

    const border = this.svgContainer.selectAll("circle")
      .data(borderData)
      .enter()
      .append("circle");

    d3Service.updateProperties(borderData, border);

    const clocks = this.svgContainer.selectAll("rect")
      .data(clockData)
      .enter()
      .append("rect");

    d3Service.updateProperties(clockData, clocks);

    this.short = clocks.filter(".short-hand");
    this.long = clocks.filter(".long-hand");
    this.second = clocks.filter(".second-hand");
    this.dateField = date.filter(".analog-date");
    this.dayField = date.filter(".analog-day");

    this.secondShifter = this.spawnShifter(60, 5);
    this.hourShifter = this.spawnShifter(12, 10);
    this.symbols = this.spawnSymbols();
    this.switchSymbols('signRoman');
  }

  // create time divider around clock
  spawnShifter(n, length = 10) {
    const lineData = [];
    for (let i = 0; i < n; i++) {
      lineData.push({
        x1: this.center + this.range - length,
        y1: this.center,
        x2: this.center + this.range,
        y2: this.center,
        "style": "stroke: #000",
        "transform": "rotate(" + (i * 360 / n - 90) + " 150 150)"
      });
    }
    const lines = this.svgContainer.selectAll()
      .data(lineData)
      .enter()
      .append("line");

    d3Service.updateProperties(lineData, lines);
    return lines;
  }

  // create symbols around clock
  spawnSymbols() {
    const symbolData = [];
    for (let i = 0; i < 12; i++) {
      let angle = i / 6 * Math.PI - 45;
      let x = (this.range + this.fontSize) * Math.cos(angle);
      let y = (this.range + this.fontSize) * Math.sin(angle);
      symbolData.push({
        x: this.center,
        y: this.center,
        "font-size": this.fontSize + "px",
        "class": "digital-number",
        "text-anchor": "middle",
        "fill": "gray",
        "transform": `translate(${x}, ${y})`,
        "dominant-baseline": "central",
        "signArabic": this.symbolsSign.arabic[i],
        "signRoman": this.symbolsSign.roman[i]
      });
    }
    const symbols = this.svgContainer.selectAll()
      .data(symbolData)
      .enter()
      .append("text");

    d3Service.updateProperties(symbolData, symbols);
    return symbols;
  }

  // switch visible type of symbols
  switchSymbols(type) {
    this.symbols.text(function(d) {
      return d[type];
    });
  }

  // rotate element to n fragment around circle with max fragments
  rotate(el, n, max, duration) {
    el.transition().duration(duration)
      .attrTween("transform", () => {
        const angle = (n / max * 360) + 180;
        const i = d3.interpolate(angle, angle + 360 / max);
        return (t) => "rotate(" + i(t) + ",150,150)";
      });
  }

  // manage one tick (1 sec) of working clock
  tick() {
    const time = this.getTime();
    if (time.second != this.lastTime.second) {
      this.lastTime.second = time.second;
      this.rotate(this.second, time.second, 60, 20000);
      this.rotate(this.long, (time.minute * 60 + time.second), 3600, 5);
      this.rotate(this.short, (time.hour * 60 + time.minute), 720, 5);
      const fullDate = this.getShortDate(this.lastDate);
      if (fullDate) {
        this.lastDate = fullDate.actual;
        this.dateField.text(fullDate.dayDateText);
        this.dayField.text(fullDate.dayNameText);
      }
    }
  }
}
