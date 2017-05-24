import Clock from './clock';
import * as d3 from "d3";

export default class d3Service {

  updateProperties(data, element) {
    for (let property in data[0]) {
      element.attr(property, function(d) {
        return d[property]
      });
    }
  }

}
