// Module: bbcodePasteIsland
// Discrption: This module will paste the copied BBCode of the island in a massage, forum or note.
// Last Updated: 2024/12/15

let bbcodePasteIsland = {
  module: "bbcodePasteIsland",
  output: "",

  settingsKeys: [
    { key: "showIslandNumber", value: null, default: true },
    { key: "showIslandTag", value: null, default: true },
    { key: "showIslandResources", value: null, default: true },
    { key: "showIslandCoordinates", value: null, default: true },
    { key: "showIslandOcean", value: null, default: true },
    { key: "showIslandOccupation", value: null, default: true },
    { key: "showNumber", value: null, default: true },
    { key: "showTown", value: null, default: true },
    { key: "showPoints", value: null, default: true },
    { key: "showPlayer", value: null, default: true },
    { key: "showAlliance", value: null, default: true },
    { key: "showEmptyColumn", value: null, default: true },
  ],

  init() {
    if (grepolisLoaded) {
      this.loadSettings();
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
    const setting = bbcodePasteIsland.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    setting.value = value;

    settings.safeSetting(
      `${Game.world_id}|bbcodePasteIsland.${settingKey}`,
      value
    );
  },

  setShowIslandNumber(value) {
    bbcodePasteIsland.setSettingValue("showIslandNumber", value);
  },

  setShowIslandTag(value) {
    bbcodePasteIsland.setSettingValue("showIslandTag", value);
  },

  setShowIslandResources(value) {
    bbcodePasteIsland.setSettingValue("showIslandResources", value);
  },

  setShowIslandCoordinates(value) {
    bbcodePasteIsland.setSettingValue("showIslandCoordinates", value);
  },

  setShowIslandOcean(value) {
    bbcodePasteIsland.setSettingValue("showIslandOcean", value);
  },

  setShowIslandOccupation(value) {
    bbcodePasteIsland.setSettingValue("showIslandOccupation", value);
  },

  setShowNumber(value) {
    bbcodePasteIsland.setSettingValue("showNumber", value);
  },

  setShowPoints(value) {
    bbcodePasteIsland.setSettingValue("showPoints", value);
  },

  setShowPlayer(value) {
    bbcodePasteIsland.setSettingValue("showPlayer", value);
  },

  setShowAlliance(value) {
    bbcodePasteIsland.setSettingValue("showAlliance", value);
  },

  setShowEmptyColumn(value) {
    bbcodePasteIsland.setSettingValue("showEmptyColumn", value);
  },

  createOutput() {
    bbcodePasteIsland.output = "";

    // general information
    bbcodePasteIsland.output = "[quote]\n";
    if (bbcodePasteIsland.getSettingValue("showIslandNumber")) {
      bbcodePasteIsland.output += `${
        language[language.settingActiveLanguage].islandNumber
      }: [island]${bbcodeCopyIsland.data.get(0).islandNumber}[/island]\n`;
    }
    if (bbcodePasteIsland.getSettingValue("showIslandTag")) {
      bbcodePasteIsland.output += `${
        language[language.settingActiveLanguage].islandTag
      }: ${bbcodeCopyIsland.data.get(0).islandTag}\n`;
    }

    if (bbcodePasteIsland.getSettingValue("showIslandOccupation")) {
      bbcodePasteIsland.output += `${
        language[language.settingActiveLanguage].towns
      }: ${bbcodeCopyIsland.data.size - 1} ${
        language[language.settingActiveLanguage].occupied
      } / ${bbcodeCopyIsland.data.get(0).islandFreeSpace} ${
        language[language.settingActiveLanguage].free
      }\n`;
    }

    if (bbcodePasteIsland.getSettingValue("showIslandResources")) {
      bbcodePasteIsland.output += `${
        language[language.settingActiveLanguage].resources
      }: `;

      for (let i = 1; i >= 0; --i) {
        const resource = bbcodeCopyIsland.data.get(0).islandRes.charAt(i);
        bbcodePasteIsland.output += i === 0 ? " / +" : "-";

        const resourceMap = {
          w: language[language.settingActiveLanguage].wood,
          s: language[language.settingActiveLanguage].stone,
          i: language[language.settingActiveLanguage].silver,
        };

        bbcodePasteIsland.output += `${resourceMap[resource.toLowerCase()]}`;
      }
      bbcodePasteIsland.output += "\n";
    }

    if (bbcodePasteIsland.getSettingValue("showIslandOcean")) {
      bbcodePasteIsland.output += `${
        language[language.settingActiveLanguage].ocean
      }: ${bbcodeCopyIsland.data.get(0).ocean}\n`;
    }

    if (bbcodePasteIsland.getSettingValue("showIslandCoordinates")) {
      bbcodePasteIsland.output += `${
        language[language.settingActiveLanguage].coordinates
      }: ${bbcodeCopyIsland.data.get(0).islandX} / ${
        bbcodeCopyIsland.data.get(0).islandY
      }\n`;
    }

    // create table header
    bbcodePasteIsland.output += "\n[table]\n";
    bbcodePasteIsland.output += "[**] ";

    bbcodePasteIsland.getSettingValue("showNumber")
      ? (bbcodePasteIsland.output += `${
          language[language.settingActiveLanguage].numberShort
        } [||] ${language[language.settingActiveLanguage].town}`)
      : (bbcodePasteIsland.output +=
          language[language.settingActiveLanguage].town);

    bbcodePasteIsland.getSettingValue("showPoints")
      ? (bbcodePasteIsland.output += ` [||] ${
          language[language.settingActiveLanguage].points
        }`)
      : "";

    bbcodePasteIsland.getSettingValue("showPlayer")
      ? (bbcodePasteIsland.output += ` [||] ${
          language[language.settingActiveLanguage].player
        }`)
      : "";

    bbcodePasteIsland.getSettingValue("showAlliance")
      ? (bbcodePasteIsland.output += ` [||] ${
          language[language.settingActiveLanguage].alliance
        }`)
      : "";

    bbcodePasteIsland.getSettingValue("showEmptyColumn")
      ? (bbcodePasteIsland.output += " [||] ")
      : "";
    bbcodePasteIsland.output += " [/**]\n";

    // create table content
    for (let i = 1; i < bbcodeCopyIsland.data.size; ++i) {
      bbcodePasteIsland.output += "[*]";
      bbcodePasteIsland.getSettingValue("showNumber")
        ? (bbcodePasteIsland.output += ` ${i}. [|] [town]${
            bbcodeCopyIsland.data.get(i).townId
          }[/town]`)
        : (bbcodePasteIsland.output += ` [town]${
            bbcodeCopyIsland.data.get(i).townId
          }[/town]`);

      bbcodePasteIsland.getSettingValue("showPoints")
        ? (bbcodePasteIsland.output += ` [|] ${
            bbcodeCopyIsland.data.get(i).townPoints
          } ${language[language.settingActiveLanguage].points}`)
        : "";

      if (bbcodeCopyIsland.data.get(i).player != "") {
        bbcodePasteIsland.getSettingValue("showPlayer")
          ? (bbcodePasteIsland.output += ` [|] ${
              bbcodeCopyIsland.data.get(i).player
            }`)
          : "";

        bbcodePasteIsland.getSettingValue("showAlliance") &&
        bbcodeCopyIsland.data.get(i).alliance !== ""
          ? (bbcodePasteIsland.output += ` [|] [ally]${
              bbcodeCopyIsland.data.get(i).alliance
            }[/ally]`)
          : "";
      } else {
        bbcodePasteIsland.output += ` [|] ${
          language[language.settingActiveLanguage].ghostTown
        } [|] `;
      }

      bbcodePasteIsland.getSettingValue("showEmptyColumn")
        ? (bbcodePasteIsland.output += " [|] ")
        : "";
      bbcodePasteIsland.output += " [/*]\n";
    }

    bbcodePasteIsland.output += "[/table]\n[/quote]\n";
    return bbcodePasteIsland.output;
  },
};
