// Module: OceanNumbers
// Discrption: This module will display the ocean number on the strategic map and island view.
// Last Updated: 2024/11/28

// TODO: Add option for transparency of the numbers on the strategic map and island view. -> Next version

let oceanNumbers = {
  module: "oceanNumbers",
  rendered: false,
  styleDiv: `GrepoTools_oceanNumbers`,
  activeStyle: "",
  strategicMapDiv: `GrepoTools_oceanNumbers_strategic_map`,
  islandViewDiv: `GrepoTools_oceanNumbers_island_view`,
  activeDiv: "",
  oceanNumbersVisibleIslandView: [],
  oceanNumbersVisibleStrategicMap: [],
  oceanNumbersToDraw: [],
  oceanSize: "",
  settingsKeys: [
    { key: "visibleStrategicMap", value: null, default: true },
    { key: "visibleIslandView", value: null, default: true },
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
      oceanNumbers.setVisibilityStrategicMap(
        oceanNumbers.getSettingValue("visibleStrategicMap")
      );

      if (!$(`#${this.islandViewDiv}`).length) {
        $(`<div id='${this.islandViewDiv}'></div>`).insertAfter("#map_islands");
      }
      oceanNumbers.setVisibilityIslandView(
        oceanNumbers.getSettingValue("visibleIslandView")
      );
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          .oceanNumbersTextStrategicMap {
            position: absolute;
            z-index: 2;
            font-weight: normal;
            font-size: 72px;
            color: rgba(255, 255, 255, 0.05);
          }
          .oceanNumbersTextIslandView {
            position: absolute;
            z-index: 2;
            font-weight: normal;
            font-size: 128px;
            color: rgba(255, 255, 255, 0.05);
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
    const setting = oceanNumbers.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    setting.value = value;

    settings.safeSetting(`${Game.world_id}|oceanNumbers.${settingKey}`, value);
  },

  animate() {
    if (!this.rendered) {
      this.oceanNumbersVisibleIslandView = [];
      this.oceanNumbersVisibleStrategicMap = [];
      return;
    }
    this.oceanNumbersToDraw = [];

    switch (Game.layout_mode) {
      case "strategic_map":
        this.oceanSize = 2560;
        this.activeDiv = this.strategicMapDiv;
        this.step = 256;
        this.numbersPerOcean = 10;
        this.offset = 75;

        this.oceanNumbersToDraw = ocean.visibleOceans.filter(
          (value) => !this.oceanNumbersVisibleStrategicMap.includes(value)
        );
        this.oceanNumbersToDraw.forEach((ocean) => {
          if (ocean >= 0 && ocean <= 99) {
            this.draw(ocean);
            this.oceanNumbersVisibleStrategicMap.push(ocean);
          }
        });
        break;
      case "island_view":
        this.oceanSize = 12800;
        this.activeDiv = this.islandViewDiv;
        this.step = 512;
        this.numbersPerOcean = 25;
        this.offset = 175;

        this.oceanNumbersToDraw = ocean.visibleOceans.filter(
          (value) => !this.oceanNumbersVisibleIslandView.includes(value)
        );
        this.oceanNumbersToDraw.forEach((ocean) => {
          if (ocean >= 0 && ocean <= 99) {
            this.draw(ocean);
            this.oceanNumbersVisibleIslandView.push(ocean);
          }
        });
        break;
    }
  },

  setVisibilityStrategicMap(value) {
    oceanNumbers.setSettingValue("visibleStrategicMap", value);
    const displayValue = value ? "block" : "none";
    $("#" + oceanNumbers.strategicMapDiv).css("display", displayValue);
  },

  setVisibilityIslandView(value) {
    oceanNumbers.setSettingValue("visibleIslandView", value);
    const displayValue = value ? "block" : "none";
    $("#" + oceanNumbers.islandViewDiv).css("display", displayValue);
  },

  draw(ocean) {
    const OceanX = Math.floor(ocean / 10) * this.oceanSize;
    const OceanY = (ocean % 10) * this.oceanSize;
    const fragment = document.createDocumentFragment();

    for (let x = 0; x < this.numbersPerOcean; x++) {
      for (let y = 0; y < this.numbersPerOcean; y++) {
        const left = OceanX + (x * this.step + this.offset);
        const top = OceanY + (y * this.step + this.offset);
        const className =
          Game.layout_mode === "strategic_map"
            ? "oceanNumbersTextStrategicMap"
            : "oceanNumbersTextIslandView";

        const div = document.createElement("div");
        div.className = className;
        div.style.left = `${left}px`;
        div.style.top = `${top}px`;
        div.textContent = ocean;
        fragment.appendChild(div);
      }
    }

    const container = document.createElement("div");
    container.className = `${this.module}_${ocean}`;
    container.appendChild(fragment);

    document.getElementById(this.activeDiv).appendChild(container);
  },
};
