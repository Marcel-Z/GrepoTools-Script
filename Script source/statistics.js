// Module: statistics
// Discrption: This module will safe the stats of the user.
// Last Updated: 2024/12/22

let statistics = {
  module: "statistics",
  uidSaved: "",
  uidGenerated: "",
  settingsKeys: [{ key: "uid", value: null, default: null }],

  init() {
    if (grepolisLoaded) {
      this.loadSettings();
      statistics.uidGenerated = statistics.uniqueId();
      statistics.safe();
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
    const setting = statistics.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    return setting ? setting.value : null;
  },

  setSettingValue(settingKey, value) {
    const setting = statistics.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    setting.value = value;

    settings.safeSetting(`${Game.world_id}|statistics.${settingKey}`, value);
  },

  safe() {
    if (statistics.getSettingValue("uid") != statistics.uidGenerated) {
      $.ajax({
        type: "POST",
        url: "https://www.grepotools.nl/grepotools/php/statistics.php",
        data: {
          player: uw.Game.player_name,
          server: uw.Game.world_id,
          version: GM_info.script.version,
          language: language.settingActiveLanguage,
        },
        success: function (returnData) {
          if (returnData == "GrepoTools: Statistics saved successfully") {
            statistics.setSettingValue("uid", statistics.uidGenerated);
          }
        },
      });
    }
  },

  uniqueId() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${uw.Game.player_name}${uw.Game.world_id}${GM_info.script.version}${year}${month}${day}`;
  },
};
