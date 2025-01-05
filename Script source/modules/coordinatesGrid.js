// Module: coordinatesGrid
// Discrption: This module will display the coordinates grid on the strategic map and island view.
// Last Updated: 2024/11/30

let coordinatesGrid = {
  module: "coordinatesGrid",
  rendered: false,
  styleDiv: `GrepoTools_coordinatesGrid`,
  activeStyle: "",
  strategicMapDiv: `GrepoTools_coordinatesGrid_strategic_map`,
  islandViewDiv: `GrepoTools_coordinatesGrid_island_view`,
  activeDiv: "",
  gridVisibleIslandView: [],
  gridVisibleStrategicMap: [],
  gridToDraw: [],
  oceanSize: "",
  gridsPerOcean: 100,
  settingsKeys: [
    { key: "visibleStrategicMap", value: null, default: true },
    { key: "visibleIslandView", value: null, default: true },
    { key: "gridColor", value: null, default: "grey" },
  ],

  init() {
    if (grepolisLoaded) {
      this.loadSettings();
      this.createDiv();
      this.createStyle();
    }
  },

  createDiv() {
    if (!this.rendered) {
      if (!$(`#${this.strategicMapDiv}`).length) {
        $(`<div id='${this.strategicMapDiv}'></div>`).insertAfter(
          "#minimap_islands_layer"
        );
      }

      coordinatesGrid.setVisibilityStrategicMap(
        coordinatesGrid.getSettingValue("visibleStrategicMap")
      );

      if (!$(`#${this.islandViewDiv}`).length) {
        $(`<div id='${this.islandViewDiv}'></div>`).insertAfter("#map_islands");
      }
      coordinatesGrid.setVisibilityIslandView(
        coordinatesGrid.getSettingValue("visibleIslandView")
      );
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          .coordinatesBorderRight {
            border-right-width: 1px;
            border-right-style: dotted;
            position: absolute;
            z-index: 2;
            opacity: .5;
          }
          .coordinatesBorderBottom {
            border-bottom-width: 1px;
            border-bottom-style: dotted;
            position: absolute;
            z-index: 2;
            opacity: .5;
          }
          .coordinatesBorder {
            border-width: 3px;
            border-style: solid;
            position: absolute;
            z-index: 2;
            opacity: .5;
          }
        `)
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
    const setting = coordinatesGrid.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    setting.value = value;

    settings.safeSetting(
      `${Game.world_id}|coordinatesGrid.${settingKey}`,
      value
    );
  },

  animate() {
    if (!this.rendered) {
      this.gridVisibleIslandView = [];
      this.gridVisibleStrategicMap = [];
      return;
    }
    this.gridToDraw = [];

    switch (Game.layout_mode) {
      case "strategic_map":
        this.oceanSize = 2560;
        this.activeDiv = this.strategicMapDiv;

        this.gridToDraw = ocean.visibleOceans.filter(
          (value) => !this.gridVisibleStrategicMap.includes(value)
        );
        this.gridToDraw.forEach((ocean) => {
          if (ocean >= 0 && ocean <= 99) {
            this.draw(ocean);
            this.gridVisibleStrategicMap.push(ocean);
          }
        });
        break;
      case "island_view":
        this.oceanSize = 12800;
        this.activeDiv = this.islandViewDiv;

        this.gridToDraw = ocean.visibleOceans.filter(
          (value) => !this.gridVisibleIslandView.includes(value)
        );
        this.gridToDraw.forEach((ocean) => {
          if (ocean >= 0 && ocean <= 99) {
            this.draw(ocean);
            this.gridVisibleIslandView.push(ocean);
          }
        });
        break;
    }
  },

  setVisibilityStrategicMap(value) {
    coordinatesGrid.setSettingValue("visibleStrategicMap", value);
    const displayValue = value ? "block" : "none";
    $("#" + coordinatesGrid.strategicMapDiv).css("display", displayValue);
  },

  setVisibilityIslandView(value) {
    coordinatesGrid.setSettingValue("visibleIslandView", value);
    const displayValue = value ? "block" : "none";
    $("#" + coordinatesGrid.islandViewDiv).css("display", displayValue);
  },

  gridColor(color) {
    if (color && color != coordinatesGrid.getSettingValue("gridColor")) {
      coordinatesGrid.setSettingValue("gridColor", color.split(" ").join(""));
    }
    $(
      ".coordinatesBorderBottom, .coordinatesBorderRight, .coordinatesBorder"
    ).css(
      "border-color",
      settings.colors[coordinatesGrid.getSettingValue("gridColor")]
    );
  },

  draw(ocean) {
    const OceanX = Math.floor(ocean / 10) * this.oceanSize;
    const OceanY = (ocean % 10) * this.oceanSize;
    const gridStep = this.oceanSize / this.gridsPerOcean;
    const fragment = document.createDocumentFragment();

    for (let x = 0; x < this.gridsPerOcean - 1; x++) {
      const left = OceanX + x * gridStep;
      const top = OceanY;

      const div = document.createElement("div");
      div.className = "coordinatesBorderRight";
      div.style.width = `${gridStep}px`;
      div.style.height = `${this.oceanSize}px`;
      div.style.left = `${left}px`;
      div.style.top = `${top}px`;
      fragment.appendChild(div);
    }

    for (let y = 0; y < this.gridsPerOcean - 1; y++) {
      const left = OceanX;
      const top = OceanY + y * gridStep;

      const div = document.createElement("div");
      div.className = "coordinatesBorderBottom";
      div.style.width = `${this.oceanSize}px`;
      div.style.height = `${gridStep}px`;
      div.style.left = `${left}px`;
      div.style.top = `${top}px`;
      fragment.appendChild(div);
    }

    const borderDiv = document.createElement("div");
    borderDiv.className = "coordinatesBorder";
    borderDiv.style.width = `${this.oceanSize - 3}px`;
    borderDiv.style.height = `${this.oceanSize - 3}px`;
    borderDiv.style.left = `${OceanX}px`;
    borderDiv.style.top = `${OceanY}px`;
    fragment.appendChild(borderDiv);

    const container = document.createElement("div");
    container.className = `${this.module}_${ocean}`;
    container.appendChild(fragment);

    document.getElementById(this.activeDiv).appendChild(container);

    this.gridColor();
  },
};
