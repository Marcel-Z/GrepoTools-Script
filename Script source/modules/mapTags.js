// Module: mapTags
// Discrption: This module will render and display maptags on the map.
// Last Updated: 2025/01/05

let mapTags = {
  module: "mapTags",
  rendered: false,
  styleDiv: `GrepoTools_mapTags`,
  mapTagsReset: false,
  towns: [],
  settingsKeys: [
    { key: "settingAllianceName", value: null, default: true },
    { key: "settingPlayerName", value: null, default: true },
    { key: "settingTownName", value: null, default: false },
    { key: "settingTownPoints", value: null, default: false },
    { key: "settingInactiveTimePlayer", value: null, default: true },
    { key: "settingNoWrap", value: null, default: true },
  ],

  init() {
    if (grepolisLoaded) {
      this.loadSettings();
      this.createStyle();
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          .tags {
              background-color: inherit;
              pointer-events: none;
              opacity: 0.8;
              position: absolute;
              text-align: center;
              color: white;
              display: block;
              font-size: 9px;
              padding: 2px;
              border-radius: 3px;
              text-shadow: 1px 1px rgba(0, 0, 0, 0.7);
          }

          .tags.sw.one { top: -15px; left: -45px; }
          .tags.ne.one { top: -20px; left: 0px; }
          .tags.se.one { top: -7px; left: -25px; }
          .tags.nw.one { top: -5px; left: -35px; }

          .tags.sw.two { top: -27px; left: -45px; }
          .tags.ne.two { top: -32px; left: 0px; }
          .tags.se.two { top: -19px; left: -25px; }
          .tags.nw.two { top: -17px; left: -35px; }

          .tags.sw.three { top: -39px; left: -45px; }
          .tags.ne.three { top: -44px; left: 0px; }
          .tags.se.three { top: -31px; left: -25px; }
          .tags.nw.three { top: -29px; left: -35px; }

          .tags.sw.four { top: -51px; left: -45px; }
          .tags.ne.four { top: -56px; left: 0px; }
          .tags.se.four { top: -43px; left: -25px; }
          .tags.nw.four { top: -41px; left: -35px; }

          .nowrap {
              white-space: nowrap;
          }

          .inactive_sw, .inactive_ne, .inactive_se, .inactive_nw {
              font-size: 9px;
              background-color: rgba(0, 0, 0, 0.3);
              color: white;
              padding: 2px 3px;
              display: block;
              position: absolute;
          }

          .inactive_sw { top: 35px; left: -45px; }
          .inactive_ne { top: 25px; left: 5px; }
          .inactive_se { top: 45px; left: -15px; }
          .inactive_nw { top: 35px; left: -35px; }

          .green, .yellow, .red {
              border-radius: 3px;
          }

          .green { border: 1px solid green; }
          .yellow { border: 1px solid yellow; }
          .red { border: 1px solid red; }
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
    const setting = mapTags.settingsKeys.find(({ key }) => key === settingKey);
    setting.value = value;

    settings.safeSetting(`${Game.world_id}|mapTags.${settingKey}`, value);
  },

  animate() {
    let start;
    // NOTE this is a workarround if DioTools is active
    if ($("#town_icon > div.town_icon_bg").get(0)) {
      start = 1;
    } else {
      start = 0;
    }

    // reset nessasary when a setting has changd or the data has reloaded from the server
    if (mapTags.mapTagsReset) {
      for (let i = start; i < mapTags.towns.length; i++) {
        let townID = JSON.parse(atob(mapTags.towns[i].hash.substr(1))).id;
        $("#town_flag_" + townID).empty();
      }
      mapTags.mapTagsReset = false;
    }

    mapTags.towns = $("[id^=town]")
      .not("[id*=flag]")
      .not("[id*=info-]")
      .not("[id*=bbcode]")
      .toArray();

    if (externalData.townDataLoaded) {
      for (let i = start; i < mapTags.towns.length; i++) {
        if (mapTags.towns[i].className != "flag town") {
          try {
            let townID = JSON.parse(atob(mapTags.towns[i].hash.substr(1))).id;

            if (externalData.townData.has(townID.toString())) {
              let playerName = "";
              let tag_speler_id = "";
              let allianceName;

              externalData.townData.get(townID.toString()).playerName != null
                ? (playerName = decodeURIComponent(
                    externalData.townData
                      .get(townID.toString())
                      .playerName.split("+")
                      .join(" ")
                  ))
                : (playerName = "");

              externalData.townData.get(townID.toString()).playerId != null
                ? (tag_speler_id = externalData.townData.get(
                    townID.toString()
                  ).playerId)
                : (tag_speler_id = "");

              let townName = decodeURIComponent(
                externalData.townData
                  .get(townID.toString())
                  .townName.split("+")
                  .join(" ")
              );

              externalData.townData.get(townID.toString()).allianceName != null
                ? (allianceName = decodeURIComponent(
                    externalData.townData
                      .get(townID.toString())
                      .allianceName.split("+")
                      .join(" ")
                  ))
                : (allianceName = "");

              let townPoints = externalData.townData.get(
                townID.toString()
              ).points;
              let windDirection = mapTags.getTownWindDirection(
                mapTags.towns[i].className
              );
              let idle = 0;

              if (externalData.idleDataLoaded) {
                if (externalData.idleData.has(tag_speler_id.toString())) {
                  idle = externalData.idleData.get(
                    tag_speler_id.toString()
                  ).idle;
                }
              }

              if (!document.getElementById("gt_" + townID.toString())) {
                this.draw(
                  townID,
                  playerName,
                  townName,
                  townPoints,
                  allianceName,
                  windDirection,
                  idle
                );
              }
            }
          } catch (error) {
            return;
          }
        }
      }
    }
  },

  getTownWindDirection(className) {
    if (className.includes("sw")) return "sw";
    if (className.includes("se")) return "se";
    if (className.includes("nw")) return "nw";
    if (className.includes("ne")) return "ne";
  },

  draw(
    townID,
    playerName,
    townName,
    townPoints,
    allianceName,
    windDirection,
    idle
  ) {
    let tagText = "";
    let lines = 0;
    let linesCss = "";

    if (this.getSettingValue("settingPlayerName") && playerName) lines++;
    if (this.getSettingValue("settingAllianceName") && playerName) lines++;
    if (this.getSettingValue("settingTownName")) lines++;
    if (this.getSettingValue("settingTownPoints")) lines++;

    const regelClasses = ["", "one", "two", "three", "four"];
    linesCss = regelClasses[lines] || "";

    if (this.getSettingValue("settingAllianceName") && playerName) {
      tagText = allianceName || "";
    }

    if (this.getSettingValue("settingPlayerName") && playerName) {
      tagText = tagText ? `${tagText}<br>${playerName}` : playerName;
    }

    if (this.getSettingValue("settingTownName")) {
      tagText = tagText ? `${tagText}<br>${townName}` : townName;
    }

    if (this.getSettingValue("settingTownPoints")) {
      const puntenTekst = `${townPoints} ${
        language[language.settingActiveLanguage].points
      }`;
      tagText = tagText ? `${tagText}<br>${puntenTekst}` : puntenTekst;
    }

    // Update de HTML van de stadsvlag
    if (lines) {
      const townFlag = $(`#town_flag_${townID}`);
      townFlag.empty();
      townFlag.append(
        `<div id="gt_${townID}" class="tags ${windDirection} ${linesCss}">${tagText}</div>`
      );
      if (this.getSettingValue("settingNoWrap")) {
        $(`#gt_${townID}`).addClass("nowrap");
      }
    }

    // Toon inactiviteit indien ingesteld
    if (this.getSettingValue("settingInactiveTimePlayer")) {
      mapTags.displayIdle(idle, windDirection, townID);
    }
  },

  displayIdle(idleTime, windDirection, townID) {
    $("#town_flag_" + townID).css("width", "0");

    if (idleTime > 0) {
      const idleText = mapTags.calculateIdle(idleTime);
      let idleClass = "";

      if (idleTime <= 12) {
        idleClass = "green";
      } else if (idleTime <= 24) {
        idleClass = "yellow";
      } else {
        idleClass = "red";
      }

      $("#town_flag_" + townID).append(
        `<div class="inactive_${windDirection} nowrap ${idleClass}">${idleText}</div>`
      );
    }
  },

  calculateIdle(idleTime) {
    const { day, days, hour } = language[language.settingActiveLanguage];
    const idleDays = Math.floor(idleTime / 24);
    const idleHours = idleTime % 24;

    if (idleDays === 1) {
      return `${idleDays} ${day} ${idleHours} ${hour}`;
    } else if (idleDays > 1) {
      return `${idleDays} ${days} ${idleHours} ${hour}`;
    } else {
      return `${idleHours} ${hour}`;
    }
  },

  setAllianceName(value) {
    mapTags.setSettingValue("settingAllianceName", value);
    mapTags.mapTagsReset = true;
    mapTags.animate();
  },

  setPlayerName(value) {
    mapTags.setSettingValue("settingPlayerName", value);
    mapTags.mapTagsReset = true;
    mapTags.animate();
  },

  setTownName(value) {
    mapTags.setSettingValue("settingTownName", value);
    mapTags.mapTagsReset = true;
    mapTags.animate();
  },

  setTownPoints(value) {
    mapTags.setSettingValue("settingTownPoints", value);
    mapTags.mapTagsReset = true;
    mapTags.animate();
  },

  setInactiveTimePlayer(value) {
    mapTags.setSettingValue("settingInactiveTimePlayer", value);
    mapTags.mapTagsReset = true;
    mapTags.animate();
  },

  setNoWrap(value) {
    mapTags.setSettingValue("settingNoWrap", value);
    mapTags.mapTagsReset = true;
    mapTags.animate();
  },
};
