import Analog from "./analog";
import Digital from "./digital";

export default class Scene {
  constructor() {

    this.actual = "analog"; // actual selected clock

    this.clocks = {
      analog: new Analog(),
      digital: new Digital()
    };

    this.clocks.analog.render();
  }

  // forward event to actual clock handling checkboxes
  setSettings(...args) {
    this.clocks[this.actual].set(...args);
  }

  // changing running clock
  // stop last clock and start actual clock
  toggleClock(name) {
    clearInterval(this.clocks[this.actual].intervalId);
    this.clocks[name].render();
    this.actual = name;
  }
}
