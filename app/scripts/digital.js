import Clock from './clock';
import * as d3 from "d3";
import d3Service from './d3Service';

export default class Digital extends Clock {

  constructor() {
    super();

    this.d3Service = new d3Service();

    const borderData = [{
      x: 0,
      y: 0,
      width: 300,
      height: 150,
      class: "clock-border"
    }];

    const numberData = [{
      x: 20,
      y: 20,
      cx: 40,
      cy: 40,
      "font-family": "sans-serif",
      "font-size": "20px",
      "fill": "red"
    }]

    let svgContainer = d3.select("div.clock-digital").append("svg")
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
    textLabel.text("test");

    this.lastTime = {};
  }

  render() {

  }

}
