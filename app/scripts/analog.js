import Clock from './clock';
import * as d3 from "d3";
import d3Service from './d3Service';

export default class Analog extends Clock {

  constructor() {
    super();

    this.d3Service = new d3Service();

    const borderData = [{
      cx: 150,
      cy: 150,
      r: 100,
      class: "clock-border"
    }];

    const clockData = [{
      x: 146,
      y: 146,
      width: 8,
      height: 50,
      class: "short-hand"
    }, {
      x: 147.5,
      y: 147.5,
      width: 5,
      height: 80,
      class: "long-hand"
    }, {
      x: 149,
      y: 149,
      width: 2,
      height: 80,
      class: "second-hand"
    }];

    let svgContainer = d3.select("div.clock-analog").append("svg")
      .attr("width", 300)
      .attr("height", 300);

    let border = svgContainer.selectAll("circle")
      .data(borderData)
      .enter()
      .append("circle");

    this.d3Service.updateProperties(borderData, border);

    let clocks = svgContainer.selectAll("rect")
      .data(clockData)
      .enter()
      .append("rect");

    this.d3Service.updateProperties(clockData, clocks);

    const numberData = [1, 2, 3, 4, 5];

    this.lastTime = {};
    this.short = clocks.filter(".short-hand");
    this.long = clocks.filter(".long-hand");
    this.second = clocks.filter(".second-hand");

    this.hide(this.long);
  }

  hide(element) {
    element.attr("visibility", "hidden");
  }

  show(element) {
    element.attr("visibility", "visible");
  }

  rotate(el, angle, max, duration) {
    el.transition().duration(duration)
      .attrTween("transform", _rotTween);

    function _rotTween() {
      angle = (angle / max * 360) + 180;
      const i = d3.interpolate(angle, angle + 360 / max);
      return (t) => {
        return "rotate(" + i(t) + ",150,150)";
      };
    }
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
