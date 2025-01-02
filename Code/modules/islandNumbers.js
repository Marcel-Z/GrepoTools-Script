// Module: islandNumbers
// Discrption: This module will show the island numbers on the strategic map and island view.
// Last Updated: 2025/12/12

let islandNumbers = {
  module: "islandNumbers",
  rendered: false,
  databaseServerCheck: false,
  data: {},
  styleDiv: `GrepoTools_islandNumbers`,
  strategicFarmingMapDiv: `GrepoTools_islandNumbers_farming_strategic_map`,
  islandViewFarmingDiv: `GrepoTools_islandNumbers_farming_island_view`,
  strategicRockMapDiv: `GrepoTools_islandNumbers_rock_strategic_map`,
  islandViewRockDiv: `GrepoTools_islandNumbers_rock_island_view`,
  settingsKeys: [
    { key: "visibleFarmingStrategicMap", value: null, default: true },
    { key: "visibleFarmingTagsStrategicMap", value: null, default: false },
    { key: "visibleRockStrategicMap", value: null, default: false },
    { key: "visibleFarmingIslandView", value: null, default: true },
    { key: "visibleRockIslandView", value: null, default: true },
    { key: "visibleFarmingTagsIslandView", value: null, default: true },
    { key: "link", value: null, default: true },
    { key: "farmingTextColor", value: null, default: "yellow" },
    { key: "rockTextColor", value: null, default: "grey" },
  ],

  islandData: [
    ["1", "farming", 90, 50, 585, 315],
    ["2", "farming", 80, 45, 425, 250],
    ["3", "farming", 80, 60, 495, 315],
    ["4", "farming", 85, 30, 405, 275],
    ["5", "farming", 80, 30, 425, 315],
    ["6", "farming", 70, 50, 705, 375],
    ["7", "farming", 40, 60, 235, 285],
    ["8", "farming", 65, 60, 515, 365],
    ["9", "farming", 80, 45, 370, 220],
    ["10", "farming", 80, 55, 470, 150],
    ["11", "rock", 30, 15, 195, 195],
    ["12", "rock", 25, 25, 230, 125],
    ["13", "rock", 50, 30, 310, 155],
    ["14", "rock", 20, 25, 185, 125],
    ["15", "rock", 40, 35, 170, 195],
    ["16", "rock", 55, 40, 250, 200],
    ["37", "farming", 90, 80, 425, 315],
    ["38", "farming", 70, 40, 360, 220],
    ["39", "farming", 55, 40, 525, 310],
    ["40", "farming", 75, 55, 545, 285],
    ["41", "farming", 70, 70, 310, 215],
    ["42", "farming", 70, 35, 435, 250],
    ["43", "farming", 70, 25, 365, 155],
    ["44", "farming", 85, 40, 420, 150],
    ["45", "farming", 75, 45, 370, 345],
    ["46", "farming", 65, 50, 365, 285],
    ["47", "rock", 45, 40, 265, 195],
    ["48", "rock", 40, 20, 245, 125],
    ["49", "rock", 60, 30, 370, 150],
    ["50", "rock", 45, 50, 245, 220],
    ["51", "rock", 45, 35, 310, 155],
    ["52", "rock", 65, 25, 375, 150],
    ["53", "rock", 45, 25, 310, 135],
    ["54", "rock", 35, 35, 300, 250],
    ["55", "rock", 45, 25, 270, 120],
    ["56", "rock", 55, 45, 310, 250],
    ["57", "rock", 35, 35, 320, 200],
    ["58", "rock", 50, 35, 310, 250],
    ["59", "rock", 40, 40, 310, 225],
    ["60", "rock", 55, 30, 305, 165],
  ],

  init() {
    if (grepolisLoaded) {
      this.loadSettings();
      this.createDiv();
      this.createStyle();
      this.databaseCheck();
      this.initializeIslandNumbersOffset();
      islandNumbers.loadDataInterval = setInterval(
        islandNumbers.databaseCheck,
        5000
      );
    }
  },

  initializeIslandNumbersOffset() {
    this.islandNumbersOffset = new Map(
      this.islandData.map(
        ([id, type, offsetXSK, offsetYSK, offsetXEO, offsetYEO]) => [
          id,
          this.createIslandData(
            type,
            offsetXSK,
            offsetYSK,
            offsetXEO,
            offsetYEO
          ),
        ]
      )
    );
  },

  createIslandData(type, offsetXSK, offsetYSK, offsetXEO, offsetYEO) {
    return {
      type: type,
      offsetXSK: offsetXSK,
      offsetYSK: offsetYSK,
      offsetXEO: offsetXEO,
      offsetYEO: offsetYEO,
    };
  },

  createDiv() {
    if (!this.rendered) {
      if (!$(`#${this.strategicFarmingMapDiv}`).length) {
        $(`<div id='${this.strategicFarmingMapDiv}'></div>`).insertAfter(
          "#minimap_islands_layer"
        );
      }
      this.setVisibilityFarmingStrategicMap(
        this.getSettingValue("visibleFarmingStrategicMap")
      );

      if (!$(`#${this.islandViewFarmingDiv}`).length) {
        $(`<div id='${this.islandViewFarmingDiv}'></div>`).insertAfter(
          "#map_islands"
        );
      }
      this.setVisibilityFarmingIslandView(
        this.getSettingValue("visibleFarmingIslandView")
      );

      if (!$(`#${this.strategicRockMapDiv}`).length) {
        $(`<div id='${this.strategicRockMapDiv}'></div>`).insertAfter(
          "#minimap_islands_layer"
        );
      }
      this.setVisibilityRockStrategicMap(
        this.getSettingValue("visibleRockStrategicMap")
      );

      if (!$(`#${this.islandViewRockDiv}`).length) {
        $(`<div id='${this.islandViewRockDiv}'></div>`).insertAfter(
          "#map_islands"
        );
      }
      this.setVisibilityRockIslandView(
        this.getSettingValue("visibleRockIslandView")
      );
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
  .islandNumbersFarmingTextStrategicMap, .islandNumbersRockTextStrategicMap,
    .islandNumbersFarmingTextIslandView, .islandNumbersRockTextIslandView {
      position: absolute;
      z-index: 100;
      text-align: center;
      margin: auto;
      font-weight: normal;
      white-space: nowrap;
    }
    .islandNumbersFarmingTextStrategicMap, .islandNumbersRockTextStrategicMap {
      font-size: 12px;
    }
    .islandNumbersFarmingTextIslandView, .islandNumbersRockTextIslandView {
      font-size: 20px;
    }
    a:link.islandNumbersFarmingTextStrategicMap, a:link.islandNumbersRockTextStrategicMap,
    a:link.islandNumbersFarmingTextIslandView, a:link.islandNumbersRockTextIslandView {
      padding: 3px;
      background-color: rgba(25, 25, 25, 0.5);
      border: 1px solid rgba(25, 25, 25, 0.7);
      border-radius: 3px;
    }
    a:visited.islandNumbersFarmingTextStrategicMap, a:visited.islandNumbersRockTextStrategicMap,
    a:visited.islandNumbersFarmingTextIslandView, a:visited.islandNumbersRockTextIslandView {
      border: 1px solid rgba(25, 25, 25, 0.7);
      border-radius: 3px;
    }
    a:hover.islandNumbersFarmingTextStrategicMap, a:hover.islandNumbersRockTextStrategicMap,
    a:hover.islandNumbersFarmingTextIslandView, a:hover.islandNumbersRockTextIslandView {
      text-decoration: underline;
    }
    .noLink {
      text-align: center;
      margin: auto;
      padding: 3px;
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
    const setting = islandNumbers.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    setting.value = value;

    settings.safeSetting(`${Game.world_id}|islandNumbers.${settingKey}`, value);
  },

  databaseCheck: async function () {
    try {
      const response = await fetch(
        "https://www.grepotools.nl/grepotools/php/islandNumbers.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            server: Game.world_id,
            action: "CheckDB",
            version: GM_info.script.version,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const returnData = await response.text();

      if (returnData == "DB-OK") {
        islandNumbers.databaseServerCheck = true;
        clearInterval(islandNumbers.loadDataInterval);
        setTimeout(function () {
          islandNumbers.animate();
        }, 250);
      } else {
        console.log("Database server check failed:", returnData);
        islandNumbers.databaseServerCheck = false;
      }
    } catch (error) {
      console.error("Error:", error);
      islandNumbers.databaseServerCheck = false;
    }
  },

  localDatabaseCheck: function (ocean) {
    //check local database for the island numbers
    if (externalData.islandData.has(Game.world_id + "|" + ocean)) {
      return true;
    } else {
      return false;
    }
  },

  getCoordinatesFromID(id, map) {
    const patterns = [/mini_i(\d+)_(\d+)/, /islandtile_(\d+)_(\d+)/];
    let matches = null;

    for (const pattern of patterns) {
      matches = id.match(pattern);
      if (matches) break;
    }

    if (matches) {
      const x = parseInt(matches[1]);
      const y = parseInt(matches[2]);

      for (let [key, value] of map.entries()) {
        for (let item of value) {
          if (item.x === x && item.y === y) {
            return item;
          }
        }
      }
    }
    return null;
  },

  animate() {
    if (!this.rendered || !this.databaseServerCheck) {
      return;
    }

    ocean.visibleOceans.forEach((ocean) => {
      if (!this.localDatabaseCheck(ocean)) {
        externalData.loadIslandData(ocean);
      }
    });

    let islandsVisible = "";
    let htmlFarming = "";
    let htmlRock = "";
    let text = "";

    switch (Game.layout_mode) {
      case "strategic_map":
        islandsVisible = $("[id^=mini_i]")
          .toArray()
          .map((element) => element.id);
        htmlFarming = "";
        htmlRock = "";
        text = "";

        for (let i = 0; i < islandsVisible.length; i++) {
          data = this.getCoordinatesFromID(
            islandsVisible[i],
            externalData.islandData
          );
          if (data) {
            soort = this.islandNumbersOffset.get(data.type.toString()).type;
            switch (soort) {
              case "farming":
                this.islandTypeToDraw = "farming";
                text = this.draw(data);
                htmlFarming += text ?? "";
                break;
              case "rock":
                this.islandTypeToDraw = "rock";
                text = this.draw(data);
                htmlRock += text ?? "";
                break;
            }
          }
        }

        $(`#${this.strategicFarmingMapDiv}`).html(htmlFarming);
        $(".islandNumbersFarmingTextStrategicMap").css(
          "color",
          settings.colors[islandNumbers.getSettingValue("farmingTextColor")]
        );

        $(`#${this.strategicRockMapDiv}`).html(htmlRock);
        $(".islandNumbersRockTextStrategicMap").css(
          "color",
          settings.colors[islandNumbers.getSettingValue("rockTextColor")]
        );
        break;
      case "island_view":
        islandsVisible = $("[id^=islandtile]")
          .toArray()
          .map((element) => element.id);

        htmlFarming = "";
        htmlRock = "";
        text = "";

        for (let i = 0; i < islandsVisible.length; i++) {
          data = this.getCoordinatesFromID(
            islandsVisible[i],
            externalData.islandData
          );
          if (data) {
            soort = this.islandNumbersOffset.get(data.type.toString()).type;
            switch (soort) {
              case "farming":
                this.islandTypeToDraw = "farming";
                text = this.draw(data);
                htmlFarming += text ?? "";
                break;
              case "rock":
                this.islandTypeToDraw = "rock";
                text = this.draw(data);
                htmlRock += text ?? "";
                break;
            }
          }
        }

        $(`#${this.islandViewFarmingDiv}`).html(htmlFarming);
        $(".islandNumbersFarmingTextIslandView").css(
          "color",
          settings.colors[islandNumbers.getSettingValue("farmingTextColor")]
        );

        $(`#${this.islandViewRockDiv}`).html(htmlRock);
        $(".islandNumbersRockTextIslandView").css(
          "color",
          settings.colors[islandNumbers.getSettingValue("rockTextColor")]
        );
        break;
    }
  },

  draw(data) {
    let valueX,
      valueY,
      className,
      linkTag,
      text = "";

    switch (Game.layout_mode) {
      case "strategic_map":
        valueX =
          data.x * 25.6 +
          this.islandNumbersOffset.get(data.type.toString()).offsetXSK;
        valueY =
          data.y * 25.6 +
          this.islandNumbersOffset.get(data.type.toString()).offsetYSK;
        if (data.x % 2 !== 0) valueY += 12.8;

        if (this.islandTypeToDraw === "farming") {
          if (this.getSettingValue("visibleFarmingStrategicMap")) {
            text = this.getSettingValue("visibleFarmingTagsStrategicMap")
              ? `${data.id}<br>${data.tagData}`
              : `${data.id}`;
          } else if (this.getSettingValue("visibleFarmingTagsStrategicMap")) {
            text = `${data.tagData}`;
          }

          className = this.getSettingValue("link")
            ? "islandNumbersFarmingTextStrategicMap"
            : "islandNumbersFarmingTextStrategicMap noLink";
          linkTag = this.getSettingValue("link")
            ? `<a href="#${data.link}" class="${className}">${text}</a>`
            : text;
        }
        if (this.islandTypeToDraw === "rock") {
          className = this.getSettingValue("link")
            ? "islandNumbersRockTextStrategicMap"
            : "islandNumbersRockTextStrategicMap noLink";
          linkTag = this.getSettingValue("link")
            ? `<a href="#${data.link}" class="${className}">${data.id}</a>`
            : data.id;
        }
        return `<div class="${className}" style="left:${valueX}px;top:${valueY}px">${linkTag}</div>`;
        break;
      case "island_view":
        valueX =
          data.x * 128 +
          this.islandNumbersOffset.get(data.type.toString()).offsetXEO;
        valueY =
          data.y * 128 +
          this.islandNumbersOffset.get(data.type.toString()).offsetYEO;
        data.x % 2 != 0 ? (valueY += 64) : "";

        if (this.islandTypeToDraw === "farming") {
          if (this.getSettingValue("visibleFarmingIslandView")) {
            text = this.getSettingValue("visibleFarmingTagsIslandView")
              ? `${data.id}<br>${data.tagData}`
              : `${data.id}`;
          } else if (this.getSettingValue("visibleFarmingTagsIslandView")) {
            text = `${data.tagData}`;
          }

          className = this.getSettingValue("link")
            ? "islandNumbersFarmingTextIslandView"
            : "islandNumbersFarmingTextIslandView noLink";
          linkTag = this.getSettingValue("link")
            ? `<a href="#${data.link}" class="${className}">${text}</a>`
            : text;
        }

        if (this.islandTypeToDraw === "rock") {
          className = this.getSettingValue("link")
            ? "islandNumbersRockTextIslandView"
            : "islandNumbersRockTextIslandView noLink";
          linkTag = this.getSettingValue("link")
            ? `<a href="#${data.link}" class="${className}">${data.id}</a>`
            : data.id;
        }
        return `<div class="${className}" style="left:${valueX}px;top:${valueY}px">${linkTag}</div>`;
        break;
    }
  },

  setVisibilityFarmingStrategicMap(value) {
    islandNumbers.setSettingValue("visibleFarmingStrategicMap", value);
    const displayValue =
      !islandNumbers.getSettingValue("visibleFarmingStrategicMap") &&
      !islandNumbers.getSettingValue("visibleFarmingTagsStrategicMap")
        ? "none"
        : "block";
    $("#" + islandNumbers.strategicFarmingMapDiv).css("display", displayValue);

    if (displayValue === "block") {
      islandNumbers.animate();
    }
  },

  setVisibilityFarmingTagsStrategicMap(value) {
    islandNumbers.setSettingValue("visibleFarmingTagsStrategicMap", value);
    const displayValue =
      !islandNumbers.getSettingValue("visibleFarmingStrategicMap") &&
      !islandNumbers.getSettingValue("visibleFarmingTagsStrategicMap")
        ? "none"
        : "block";
    $("#" + islandNumbers.strategicFarmingMapDiv).css("display", displayValue);

    if (displayValue === "block") {
      islandNumbers.animate();
    }
  },

  setVisibilityRockStrategicMap(value) {
    islandNumbers.setSettingValue("visibleRockStrategicMap", value);
    const displayValue = value ? "block" : "none";
    $("#" + islandNumbers.strategicRockMapDiv).css("display", displayValue);
  },

  setVisibilityFarmingIslandView(value) {
    islandNumbers.setSettingValue("visibleFarmingIslandView", value);
    const displayValue =
      !islandNumbers.getSettingValue("visibleFarmingIslandView") &&
      !islandNumbers.getSettingValue("visibleFarmingTagsIslandView")
        ? "none"
        : "block";
    $("#" + islandNumbers.islandViewFarmingDiv).css("display", displayValue);

    if (displayValue === "block") {
      islandNumbers.animate();
    }
  },

  setVisibilityFarmingTagsIslandView(value) {
    islandNumbers.setSettingValue("visibleFarmingTagsIslandView", value);
    const displayValue =
      !islandNumbers.getSettingValue("visibleFarmingIslandView") &&
      !islandNumbers.getSettingValue("visibleFarmingTagsIslandView")
        ? "none"
        : "block";
    $("#" + islandNumbers.islandViewFarmingDiv).css("display", displayValue);

    if (displayValue === "block") {
      islandNumbers.animate();
    }
  },

  setVisibilityRockIslandView(value) {
    islandNumbers.setSettingValue("visibleRockIslandView", value);
    const displayValue = value ? "block" : "none";
    $("#" + islandNumbers.islandViewRockDiv).css("display", displayValue);

    if (displayValue === "block") {
      islandNumbers.animate();
    }
  },

  setLink(value) {
    islandNumbers.setSettingValue("link", value);
    islandNumbers.animate();
  },

  setFarmingTextColor(color) {
    if (color && color != islandNumbers.getSettingValue("farmingTextColor")) {
      islandNumbers.setSettingValue(
        "farmingTextColor",
        color.split(" ").join("")
      );
    }
    $(
      ".islandNumbersFarmingTextStrategicMap, .islandNumbersFarmingTextIslandView"
    ).css(
      "color",
      settings.colors[islandNumbers.getSettingValue("farmingTextColor")]
    );
  },

  setRockTextColor(color) {
    if (color && color != islandNumbers.getSettingValue("rockTextColor")) {
      islandNumbers.setSettingValue("rockTextColor", color.split(" ").join(""));
    }
    $(
      ".islandNumbersRockTextStrategicMap, .islandNumbersRockTextIslandView"
    ).css(
      "color",
      settings.colors[islandNumbers.getSettingValue("rockTextColor")]
    );
  },
};
