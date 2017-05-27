import Scene from "./scene";

$(document).ready(function() {

  const scene = new Scene();

  const analogSwitch = $("#analog-switch");
  const digitalSwitch = $("#digital-switch");

  const analogPanel = $("#clock-analog-panel");
  const digitalPanel = $("#clock-digital-panel");

  // handle checkbox events
  $(":checkbox, :radio").change(function() {
    scene.setSettings(this.getAttribute("data-name"), this.getAttribute("data-action"), this.checked);
  });

  // handle button analog switch
  analogSwitch.click(() => {
    analogSwitch.parent().addClass("active");
    digitalSwitch.parent().removeClass("active");
    analogPanel.removeClass("hidden");
    digitalPanel.addClass("hidden");
    scene.toggleClock("analog");
  });

  // handle button digital switch
  digitalSwitch.click(() => {
    digitalSwitch.parent().addClass("active");
    analogSwitch.parent().removeClass("active");
    digitalPanel.removeClass("hidden");
    analogPanel.addClass("hidden");
    scene.toggleClock("digital");
  });
});
