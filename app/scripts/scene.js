import Analog from './analog';
import Digital from './digital';

export default class Scene {
  constructor() {

    this.visibleSettings = false;

    let analog = new Analog();
    analog.render();

    let digital = new Digital();
    digital.render();
  }

  openSettings() {

  }

  toggleSettings() {
    this.visibleSettings = !this.visibleSettings;
    console.log(this.visibleSettings);
  }
}
