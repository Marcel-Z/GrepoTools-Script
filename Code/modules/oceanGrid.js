// Module: OceanGrid
// Discrption: This module will display a grid on the strategic map and island view.
// Last Updated: 2024/11/29

let oceanGrid = {
  module: "oceanGrid",
  rendered: false,
  styleDiv: `GrepoTools_oceanGrid`,
  activeStyle: "",
  strategicMapDiv: `GrepoTools_oceanGrid_strategic_map`,
  islandViewDiv: `GrepoTools_oceanGrid_island_view`,
  activeDiv: "",
  letters: ["A", "B", "C", "D", "E"],
  gridVisibleIslandView: [],
  gridVisibleStrategicMap: [],
  gridToDraw: [],
  oceanSize: "",
  gridsPerOcean: 5,
  settingsKeys: [
    { key: "visibleStrategicMap", value: null, default: true },
    { key: "visibleIslandView", value: null, default: true },
    { key: "gridColor", value: null, default: "grey" },
    { key: "gridTextColor", value: null, default: "blue" },
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

      oceanGrid.setVisibilityStrategicMap(
        oceanGrid.getSettingValue("visibleStrategicMap")
      );

      if (!$(`#${this.islandViewDiv}`).length) {
        $(`<div id='${this.islandViewDiv}'></div>`).insertAfter("#map_islands");
      }

      oceanGrid.setVisibilityIslandView(
        oceanGrid.getSettingValue("visibleIslandView")
      );
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          .gridBorderRight {
            border-right-width: 3px;
            border-right-style: solid;
            position: absolute;
            z-index: 1;
            opacity: .5;
            width:3px;
          }
          .gridBorderBottom {
            border-bottom-width: 3px;
            border-bottom-style: solid;
            position: absolute;
            z-index: 1;
            opacity: .5;            
          }
          .gridBorder {
            border-width: 3px;
            border-style: solid;
            position: absolute;
            z-index: 1;
            opacity: .5;            
          }
          .gridTextStrategicMap {
            position: absolute;
            z-index: 1;
            text-align: center;
            min-width: 40px;
            margin: auto;
            padding: 3px;
            font-weight: normal;
            font-size: 12px;
            background-color: rgba(25, 25, 25, 0.5);
            border: 1px solid rgba(25, 25, 25, 0.7);
            border-radius: 3px;
          }
          .gridTextIslandView {
            position: absolute;
            z-index: 1;
            text-align: center;
            min-width: 80px;
            margin: auto;
            font-weight: normal;
            font-size: 24px;
            background-color: rgba(25, 25, 25, 0.5);
            border: 1px solid rgba(25, 25, 25, 0.7);
            border-radius: 3px;
          }
        `)
      );
      this.rendered = true;
    }
  },

  loadSettings() {
    this.settingsKeys.forEach((setting) => {
      const { key, default: defaultValue } = setting;
      let value = settings.loadSetting(
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
    const setting = oceanGrid.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    setting.value = value;

    settings.safeSetting(`${Game.world_id}|oceanGrid.${settingKey}`, value);
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
        this.activeStyle = "gridTextStrategicMap";

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
        this.activeStyle = "gridTextIslandView";

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
    oceanGrid.setSettingValue("visibleStrategicMap", value);
    const displayValue = value ? "block" : "none";
    $("#" + oceanGrid.strategicMapDiv).css("display", displayValue);
  },

  setVisibilityIslandView(value) {
    oceanGrid.setSettingValue("visibleIslandView", value);
    const displayValue = value ? "block" : "none";
    $("#" + oceanGrid.islandViewDiv).css("display", displayValue);
  },

  gridColor(color) {
    if (color && color != oceanGrid.getSettingValue("gridColor")) {
      oceanGrid.setSettingValue("gridColor", color.split(" ").join(""));
    }
    $(".gridBorderRight, .gridBorderBottom, .gridBorder").css(
      "border-color",
      settings.colors[oceanGrid.getSettingValue("gridColor")]
    );
  },

  gridTextColor(color) {
    if (color && color != oceanGrid.getSettingValue("gridTextColor")) {
      oceanGrid.setSettingValue("gridTextColor", color.split(" ").join(""));
    }
    $(".gridTextStrategicMap, .gridTextIslandView").css(
      "color",
      settings.colors[oceanGrid.getSettingValue("gridTextColor")]
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
      div.className = "gridBorderRight";
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
      div.className = "gridBorderBottom";
      div.style.width = `${this.oceanSize}px`;
      div.style.height = `${gridStep}px`;
      div.style.left = `${left}px`;
      div.style.top = `${top}px`;
      fragment.appendChild(div);
    }

    const borderDiv = document.createElement("div");
    borderDiv.className = "gridBorder";
    borderDiv.style.width = `${this.oceanSize - 3}px`;
    borderDiv.style.height = `${this.oceanSize - 3}px`;
    borderDiv.style.left = `${OceanX}px`;
    borderDiv.style.top = `${OceanY}px`;
    fragment.appendChild(borderDiv);

    for (let x = 0; x < this.gridsPerOcean; x++) {
      for (let y = 0; y < this.gridsPerOcean; y++) {
        const left = 10 + (OceanX + x * gridStep);
        const top = 10 + (OceanY + y * gridStep);
        const letter = this.letters[x];
        const number = y + 1;

        const div = document.createElement("div");
        div.className = this.activeStyle;
        div.style.left = `${left}px`;
        div.style.top = `${top}px`;
        div.textContent = `${ocean} ${letter}${number}`;
        fragment.appendChild(div);
      }
    }

    const container = document.createElement("div");
    container.className = `${this.module}_${ocean}`;
    container.appendChild(fragment);

    document.getElementById(this.activeDiv).appendChild(container);

    this.gridColor();
    this.gridTextColor();
  },
};
