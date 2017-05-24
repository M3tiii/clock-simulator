import Scene from './scene';

let scene = new Scene();

let button = document.getElementById("settings");
button.onclick = function() {
  scene.toggleSettings();
}
