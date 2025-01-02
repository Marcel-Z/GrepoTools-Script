// Module: coordinates
// Discrption: This module will display the coordinates numbers (x/y) on the island view.
// Last Updated: 2024/12/22

let coordinates = {
  module: "coordinates",
  rendered: false,
  styleDiv: `GrepoTools_coordinates`,
  activeStyle: "",
  islandViewDivX: `GrepoTools_coordinates_X_island_view`,
  islandViewDivY: `GrepoTools_coordinates_Y_island_view`,
  settingsKeys: [
    { key: "visibleIslandView", value: null, default: true },
    { key: "updateScrolling", value: null, default: true },
  ],

  init() {
    if (grepolisLoaded) {
      this.loadSettings();
      this.createDiv();
      this.createStyle();
      this.contolModule();
    }
  },

  createDiv() {
    if (!this.rendered) {
      if (!$(`#${this.islandViewDivX}`).length) {
        $(`<div id='${this.islandViewDivX}'></div>`).insertAfter(
          "#map_movements"
        );
      }
      if (!$(`#${this.islandViewDivY}`).length) {
        $(`<div id='${this.islandViewDivY}'></div>`).insertAfter(
          "#map_movements"
        );
      }
      coordinates.setVisibilityIslandView(
        coordinates.getSettingValue("visibleIslandView")
      );
    }
  },

  contolModule() {
    // update only when mouse button is released
    $("#ui_box").mouseup(function () {
      if (!coordinates.getSettingValue("updateScrolling")) {
        if (Game.layout_mode === "island_view") {
          coordinates.draw();
        }
      }
    });

    // update when scrolling
    $("#ui_box").on("mousemove", function () {
      if (coordinates.getSettingValue("updateScrolling")) {
        if (Game.layout_mode === "island_view") {
          coordinates.draw();
        }
      }
    });
  },

  createStyle() {
    if (!this.rendered) {
      const commonStyles = `
          span.IslandViewTextblockY,
          span.IslandViewTextblockX {
            text-align: center;
            font-weight: normal;
            font-size: 14px;
            color: #ccc;
            background-color: rgba(25, 25, 25, 0.3);
            border: 1px solid rgba(25, 25, 25, 0.5);
            border-radius: 3px;
            padding: 3px;
          }
          div.IslandViewTextblockY {
            height: 128px;
            width: 60px;
            color: #FFF;
            float: left;
            display: block;
          }
          div.IslandViewTextblockX {
            height: 24px;
            width: 128px;
            color: #FFF;
            float: left;
            display: block;
          }
        `;

      const enlargedUiStyles = `
          #${this.islandViewDivY} {
            height: 100vh;
            width: 60px;
            right: 120px;
            top: 0;
            position: absolute;
            z-index: 2;
          }
          #${this.islandViewDivX} {
            height: 24px;
            width: 100vw;
            left: 0;
            bottom: 80px;
            position: absolute;
            z-index: 2;
          }
        `;

      const defaultUiStyles = `
          #${this.islandViewDivY} {
            height: 100vh;
            width: 60px;
            right: 150px;
            top: 0;
            position: absolute;
            z-index: 2;
          }
          #${this.islandViewDivX} {
            height: 24px;
            width: 100vw;
            left: 0;
            bottom: 40px;
            position: absolute;
            z-index: 2;
          }
        `;

      const styles = Game.ui_scale.enlarged_ui_size
        ? enlargedUiStyles
        : defaultUiStyles;

      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(commonStyles + styles)
      );

      this.rendered = true;
    }
  },

  loadSettings() {
    this.settingsKeys.forEach((setting) => {
      const { key, default: defaultValue } = setting;
      const value = settings.loadSetting(
        `${Game.world_id}|${this.module}.${key}`,
        defaultValue
      );
      setting.value = value;
    });
  },

  getSettingValue(settingKey) {
    const setting = this.settingsKeys.find(({ key }) => key === settingKey);
    return setting ? setting.value : null;
  },

  setSettingValue(settingKey, value) {
    const setting = coordinates.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    setting.value = value;

    settings.safeSetting(`${Game.world_id}|coordinates.${settingKey}`, value);
  },

  animate() {
    //This module does not work with the global timer interval that Animate calls. This module is controlled by the mouse within the controlModule function
  },

  setVisibilityIslandView(value) {
    coordinates.setSettingValue("visibleIslandView", value);
    const displayValue = value ? "block" : "none";
    $("#" + coordinates.islandViewDivX).css("display", displayValue);
    $("#" + coordinates.islandViewDivY).css("display", displayValue);
  },

  setUpdateScrolling(value) {
    coordinates.settingUpdateScrolling = value;
    coordinates.setSettingValue("updateScrolling", value);
  },

  draw() {
    const blockSize = 128;
    let htmlX = "";
    let htmlY = "";

    const mapContainer = $("#map_move_container");
    const windowX = -parseInt(mapContainer.css("left").replace("px", ""));
    const windowY = -parseInt(mapContainer.css("top").replace("px", ""));

    const startX = Math.max(0, Math.ceil(windowX / blockSize));
    const startY = Math.max(0, Math.floor(windowY / blockSize));

    const windowWidth = Math.floor($(window).width() / blockSize) - 2;
    const windowHeight = Math.floor($(window).height() / blockSize);

    for (let x = 0; x <= windowWidth; x++) {
      htmlX += `<div class='IslandViewTextblockX'><span class='IslandViewTextblockX'>X: ${
        startX + x
      }</span></div>`;
    }

    for (let y = 0; y <= windowHeight; y++) {
      htmlY += `<div class='IslandViewTextblockY'><span class='IslandViewTextblockY'>Y: ${
        startY + y
      }</span></div>`;
    }

    const islandViewDivX = $("#" + this.islandViewDivX);
    const islandViewDivY = $("#" + this.islandViewDivY);

    islandViewDivX.html(htmlX);
    islandViewDivY.html(htmlY);

    const offsetX = windowX < 0 ? -windowX - 64 : -(windowX % blockSize) + 64;
    const offsetY = windowY < 0 ? -windowY - 9 : -(windowY % blockSize) - 9;

    islandViewDivX.css("left", `${offsetX}px`);
    islandViewDivY.css("top", `${offsetY}px`);
  },
};
