// Module: bbcodePasteAlliance
// Discrption: This module will paste the copied BBCode of the alliance in a massage, forum or note.
// Last Updated: 2024/12/09

// TODO: Add pagination for ally's bigger than 25 members -> Next version

let bbcodePasteAlliance = {
  module: "bbcodePasteAlliance",
  output: "",
  tablePage: 1,
  tableMaxRows: 25,

  settingsKeys: [
    { key: "showAllianceName", value: null, default: true },
    { key: "showAllianceNumberPlayers", value: null, default: true },
    { key: "showAlliancePoints", value: null, default: true },
    { key: "showAllianceRank", value: null, default: true },
    { key: "showNumber", value: null, default: true },
    { key: "showPlayerTowns", value: null, default: true },
    { key: "showPlayerPoints", value: null, default: true },
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
    const setting = bbcodePasteAlliance.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    setting.value = value;

    settings.safeSetting(
      `${Game.world_id}|bbcodePasteAlliance.${settingKey}`,
      value
    );
  },

  setShowAllianceName(value) {
    bbcodePasteAlliance.setSettingValue("showAllianceName", value);
  },

  setShowAllianceNumberPlayers(value) {
    bbcodePasteAlliance.setSettingValue("showAllianceNumberPlayers", value);
  },

  setShowAlliancePoints(value) {
    bbcodePasteAlliance.setSettingValue("showAlliancePoints", value);
  },

  setShowAllianceRank(value) {
    bbcodePasteAlliance.setSettingValue("showAllianceRank", value);
  },

  setShowNumber(value) {
    bbcodePasteAlliance.setSettingValue("showNumber", value);
  },

  setShowPlayerTowns(value) {
    bbcodePasteAlliance.setSettingValue("showPlayerTowns", value);
  },

  setShowPlayerPoints(value) {
    bbcodePasteAlliance.setSettingValue("showPlayerPoints", value);
  },

  setShowEmptyColumn(value) {
    bbcodePasteAlliance.setSettingValue("showEmptyColumn", value);
  },

  createOutput() {
    bbcodePasteAlliance.output = "";

    // general information
    bbcodePasteAlliance.output = "[quote]\n";
    if (bbcodePasteAlliance.getSettingValue("showAllianceName")) {
      bbcodePasteAlliance.output += `[ally]${
        bbcodeCopyAlliance.data.get(0).allianceName
      }[/ally]\n`;
    }
    if (bbcodePasteAlliance.getSettingValue("showAllianceNumberPlayers")) {
      bbcodePasteAlliance.output += `${
        language[language.settingActiveLanguage].members
      }: ${bbcodeCopyAlliance.data.get(0).allianceCurrentMembers}\n${
        language[language.settingActiveLanguage].maxMembers
      }: ${bbcodeCopyAlliance.data.get(0).allianceMaxMembers}\n`;
    }

    if (bbcodePasteAlliance.getSettingValue("showAlliancePoints")) {
      bbcodePasteAlliance.output += `${
        language[language.settingActiveLanguage].alliance
      } ${language[language.settingActiveLanguage].points.toLowerCase()}: ${
        bbcodeCopyAlliance.data.get(0).alliancePoints
      }\n`;
    }

    if (bbcodePasteAlliance.getSettingValue("showAllianceRank")) {
      bbcodePasteAlliance.output += `${
        language[language.settingActiveLanguage].alliance
      } ${language[language.settingActiveLanguage].rank.toLowerCase()}: ${
        bbcodeCopyAlliance.data.get(0).allianceRank
      }\n`;
    }

    // create table header
    bbcodePasteAlliance.output += "\n[table]\n";
    bbcodePasteAlliance.output += "[**] ";

    bbcodePasteAlliance.getSettingValue("showNumber")
      ? (bbcodePasteAlliance.output += `${
          language[language.settingActiveLanguage].numberShort
        } [||] ${language[language.settingActiveLanguage].player} `)
      : (bbcodePasteAlliance.output += `${
          language[language.settingActiveLanguage].player
        }`);

    bbcodePasteAlliance.getSettingValue("showPlayerTowns")
      ? (bbcodePasteAlliance.output += ` [||] ${
          language[language.settingActiveLanguage].towns
        } `)
      : "";

    bbcodePasteAlliance.getSettingValue("showPlayerPoints")
      ? (bbcodePasteAlliance.output += ` [||] ${
          language[language.settingActiveLanguage].points
        } `)
      : "";

    bbcodePasteAlliance.getSettingValue("showEmptyColumn")
      ? (bbcodePasteAlliance.output += " [||] ")
      : "";
    bbcodePasteAlliance.output += " [/**]\n";

    // create table content
    for (let i = 1; i < bbcodeCopyAlliance.data.size; ++i) {
      bbcodePasteAlliance.output += "[*] ";
      bbcodePasteAlliance.getSettingValue("showNumber")
        ? (bbcodePasteAlliance.output +=
            bbcodeCopyAlliance.data.get(i).playerRank + ". [|] ")
        : "";

      bbcodePasteAlliance.output += `[player]${
        bbcodeCopyAlliance.data.get(i).playerName
      }[/player]`;

      if (bbcodePasteAlliance.getSettingValue("showPlayerTowns")) {
        bbcodePasteAlliance.output +=
          ` [|]  ${bbcodeCopyAlliance.data.get(i).playerCities} ` +
          (bbcodeCopyAlliance.data.get(i).playerCities > 1
            ? language[language.settingActiveLanguage].towns
            : language[language.settingActiveLanguage].town);
      }

      bbcodePasteAlliance.getSettingValue("showPlayerPoints")
        ? (bbcodePasteAlliance.output += ` [|] ${
            bbcodeCopyAlliance.data.get(i).playerPoints
          } ${language[language.settingActiveLanguage].points}`)
        : "";

      bbcodePasteAlliance.getSettingValue("showEmptyColumn")
        ? (bbcodePasteAlliance.output += " [||] ")
        : "";

      bbcodePasteAlliance.output += " [/*]\n";
    }
    bbcodePasteAlliance.output += "[/table]\n[/quote]\n";

    return bbcodePasteAlliance.output;
  },
};
