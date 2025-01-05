// Module: bbcodePastePlayer
// Discrption: This module will paste the copied BBCode of the player in a massage, forum or note.
// Last Updated: 2024/12/15

let bbcodePastePlayer = {
  module: "bbcodePastePlayer",
  output: "",
  tableMaxRows: 25,
  tablePage: 1,

  settingsKeys: [
    { key: "showPlayerName", value: null, default: true },
    { key: "showAllianceName", value: null, default: true },
    { key: "showGrepolisRank", value: null, default: true },
    { key: "showPlayerBattlePoints", value: null, default: true },
    { key: "showPlayerGrepolisScore", value: null, default: true },
    { key: "showNumber", value: null, default: true },
    { key: "showPoints", value: null, default: true },
    { key: "showOcean", value: null, default: true },
    { key: "showIslandNumber", value: null, default: true },
    { key: "showIslandTag", value: null, default: true },
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
    const setting = bbcodePastePlayer.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    setting.value = value;

    settings.safeSetting(
      `${Game.world_id}|bbcodePastePlayer.${settingKey}`,
      value
    );
  },

  setShowPlayerName(value) {
    bbcodePastePlayer.setSettingValue("showPlayerName", value);
  },

  setShowAllianceName(value) {
    bbcodePastePlayer.setSettingValue("showAllianceName", value);
  },

  setShowgrepolisRank(value) {
    bbcodePastePlayer.setSettingValue("showGrepolisRank", value);
  },

  setShowPlayerBattlePoints(value) {
    bbcodePastePlayer.setSettingValue("showPlayerBattlePoints", value);
  },

  setShowPlayerGrepolisScore(value) {
    bbcodePastePlayer.setSettingValue("showPlayerGrepolisScore", value);
  },

  setShowNumber(value) {
    bbcodePastePlayer.setSettingValue("showNumber", value);
  },

  setShowPoints(value) {
    bbcodePastePlayer.setSettingValue("showPoints", value);
  },

  setShowOcean(value) {
    bbcodePastePlayer.setSettingValue("showOcean", value);
  },

  setShowIslandNumber(value) {
    bbcodePastePlayer.setSettingValue("showIslandNumber", value);
  },

  setShowIslandTag(value) {
    bbcodePastePlayer.setSettingValue("showIslandTag", value);
  },

  setShowEmptyColumn(value) {
    bbcodePastePlayer.setSettingValue("showEmptyColumn", value);
  },

  setTablePage(value) {
    bbcodePastePlayer.tablePage = value;
  },

  createOutput() {
    bbcodePastePlayer.output = "";

    // general information
    bbcodePastePlayer.output = "[quote]\n";
    if (bbcodePastePlayer.getSettingValue("showPlayerName")) {
      bbcodePastePlayer.output +=
        "[player]" + bbcodeCopyPlayer.data.get(0).playerName + "[/player]\n";
    }
    if (bbcodePastePlayer.getSettingValue("showAllianceName")) {
      bbcodePastePlayer.output +=
        "[ally]" + bbcodeCopyPlayer.data.get(0).allianceName + "[/ally]\n\n";
    }
    if (bbcodePastePlayer.getSettingValue("showGrepolisRank")) {
      bbcodePastePlayer.output += `${
        language[language.settingActiveLanguage].grepolisRank
      }: ${bbcodeCopyPlayer.data.get(0).playerRank} \n`;
    }
    if (bbcodePastePlayer.getSettingValue("showPlayerGrepolisScore")) {
      bbcodePastePlayer.output += `${
        language[language.settingActiveLanguage].grepolisScore
      }: ${bbcodeCopyPlayer.data.get(0).playerGrepolisScore} \n`;
    }
    if (bbcodePastePlayer.getSettingValue("showPlayerBattlePoints")) {
      bbcodePastePlayer.output += `${
        language[language.settingActiveLanguage].battlePoints
      }: ${bbcodeCopyPlayer.data.get(0).playerBattlePoints} \n`;
    }

    // create table header
    bbcodePastePlayer.output += "\n[table]\n";
    bbcodePastePlayer.output += "[**]";

    bbcodePastePlayer.getSettingValue("showNumber")
      ? (bbcodePastePlayer.output += ` ${
          language[language.settingActiveLanguage].numberShort
        } [||] ${language[language.settingActiveLanguage].town} `)
      : (bbcodePastePlayer.output += ` ${
          language[language.settingActiveLanguage].town
        }`);
    bbcodePastePlayer.getSettingValue("showPoints")
      ? (bbcodePastePlayer.output += ` [||] ${
          language[language.settingActiveLanguage].points
        } `)
      : "";
    bbcodePastePlayer.getSettingValue("showOcean")
      ? (bbcodePastePlayer.output += ` [||] ${
          language[language.settingActiveLanguage].ocean
        }`)
      : "";
    bbcodePastePlayer.getSettingValue("showIslandNumber")
      ? (bbcodePastePlayer.output += ` [||] ${
          language[language.settingActiveLanguage].islandNumber
        }`)
      : "";
    bbcodePastePlayer.getSettingValue("showIslandTag")
      ? (bbcodePastePlayer.output += ` [||] ${
          language[language.settingActiveLanguage].islandTag
        }`)
      : "";
    bbcodePastePlayer.getSettingValue("showEmptyColumn")
      ? (bbcodePastePlayer.output += " [||] ")
      : "";
    bbcodePastePlayer.output += " [/**]\n";

    // create table content
    let startRow =
      bbcodePastePlayer.tablePage * bbcodePastePlayer.tableMaxRows -
      bbcodePastePlayer.tableMaxRows +
      1;
    let endRow = startRow + bbcodePastePlayer.tableMaxRows;
    if (endRow > bbcodeCopyPlayer.data.size) {
      endRow = bbcodeCopyPlayer.data.size;
    }
    for (let i = startRow; i < endRow; ++i) {
      bbcodePastePlayer.output += "[*]";
      bbcodePastePlayer.getSettingValue("showNumber")
        ? (bbcodePastePlayer.output += ` ${i}. [|] [town]${
            bbcodeCopyPlayer.data.get(i).townId
          }[/town]`)
        : (bbcodePastePlayer.output += ` [town]${
            bbcodeCopyPlayer.data.get(i).townId
          }[/town]`);

      bbcodePastePlayer.getSettingValue("showPoints")
        ? (bbcodePastePlayer.output += ` [|] ${
            bbcodeCopyPlayer.data.get(i).townPoints
          } ${language[language.settingActiveLanguage].points}`)
        : "";

      bbcodePastePlayer.getSettingValue("showOcean")
        ? (bbcodePastePlayer.output += ` [|] ${
            language[language.settingActiveLanguage].ocean
          } ${bbcodeCopyPlayer.data.get(i).Ocean}`)
        : "";

      bbcodePastePlayer.getSettingValue("showIslandNumber")
        ? (bbcodePastePlayer.output += ` [|] [island]${
            bbcodeCopyPlayer.data.get(i).islandNumber
          }[/island]`)
        : "";

      bbcodePastePlayer.getSettingValue("showIslandTag")
        ? (bbcodePastePlayer.output += ` [|] ${
            bbcodeCopyPlayer.data.get(i).islandTag
          }`)
        : "";

      bbcodePastePlayer.getSettingValue("showEmptyColumn")
        ? (bbcodePastePlayer.output += " [|] ")
        : "";
      bbcodePastePlayer.output += " [/*]\n";
    }
    bbcodePastePlayer.output += "[/table]\n[/quote]\n";
    return bbcodePastePlayer.output;
  },
};
