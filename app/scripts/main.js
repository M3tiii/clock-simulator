import Scene from './scene';

$(document).ready(function() {

  let scene = new Scene();

  let analogSwitch = $("#analog-switch");
  let digitalSwitch = $("#digital-switch");

  let analogPanel = $("#clock-analog-panel");
  let digitalPanel = $("#clock-digital-panel");

  $(':checkbox').change(function() {
    scene.setSettings(this.getAttribute('name'), this.getAttribute('action'), this.checked);
  });

  analogSwitch.click(() => {
    analogSwitch.parent().addClass("active");
    digitalSwitch.parent().removeClass("active");
    analogPanel.removeClass("hide");
    digitalPanel.addClass("hide");
    scene.toggleClock("analog");
  })

  digitalSwitch.click(() => {
    digitalSwitch.parent().addClass("active");
    analogSwitch.parent().removeClass("active");
    digitalPanel.removeClass("hide");
    analogPanel.addClass("hide");
    scene.toggleClock("digital");
  })
});
