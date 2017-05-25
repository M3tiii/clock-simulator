import Analog from './analog';
import Digital from './digital';

export default class Scene {
  constructor() {

    this.actual = "analog";

    this.clocks = {
      analog: new Analog(),
      digital: new Digital()
    };
    this.clocks.analog.render();
    this.clocks.digital.render();
  }

  setSettings(name, action, value) {
    this.clocks[this.actual].set(name, action, value);
  }

  toggleClock(name) {
    this.actual = name;
  }
}
