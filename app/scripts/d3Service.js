import Clock from './clock';
import * as d3 from 'd3';

const D3Service = class {

  // hide element on scene
  hide(element) {
    element.attr('visibility', 'hidden');
  }

  // show element on scene
  show(element) {
    element.attr('visibility', 'visible');
  }

  // set each of data properties in svg elemnt
  updateProperties(data, element) {
    for (let property in data[0]) {
      if (data[0].hasOwnProperty(property))
        element.attr(property, d => d[property]);
    }
  }
}

export default new D3Service();
