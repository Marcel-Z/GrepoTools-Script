// module version
// Discrption: this module will check and handle the version of the script
// Last Updated: 2024/12/22

let version = {
  module: "version",
  rendered: false,
  styleDiv: `GrepoTools_version`,
  data: new Map(),
  localVersion: GM_info.script.version,
  betaVersion: "",
  stableVersion: "",
  release: "",
  releaseAction: "",
  notification: false,
  settingsKeys: [{ key: "joinBetaProgram", value: null, default: false }],

  init() {
    if (grepolisLoaded) {
      this.createStyle();
      this.loadSettings();
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          #notification_area .GrepoToolsUpdate .icon {
            background: url(https://www.grepotools.nl/grepotools/images/logoNotification.png) 3px 3px no-repeat !important; 
            cursor: pointer;
          }
          #notification_area .GrepoToolsUpdate { 
            cursor: pointer;
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
    const setting = version.settingsKeys.find(({ key }) => key === settingKey);
    setting.value = value;

    settings.safeSetting(`${Game.world_id}|version.${settingKey}`, value);
  },

  setJoinBetaProgram(value) {
    version.setSettingValue("joinBetaProgram", value);
  },

  getScriptVersionData() {
    return fetch("https://www.grepotools.nl/grepotools/php/version.php", {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch server version. HTTP status: ${response.status}`
          );
        }

        return response.text();
      })
      .then((data) => {
        JSON.parse(data).forEach(function (value) {
          version.data.set(value.id, value);
        });
      })
      .catch((error) => {
        console.error("Error fetching server version:", error);
        throw error;
      });
  },

  getScriptVersions() {
    for (const [key, value] of version.data.entries()) {
      if (value.script === "beta") {
        version.betaVersion = value.version;
      }
      if (value.script === "stable") {
        version.stableVersion = value.version;
      }
    }
    version.getRelease();
  },

  getRelease() {
    if (version.localVersion < version.stableVersion) {
      version.release = "stable";
      version.releaseAction = "updateStable";
    } else if (version.localVersion === version.stableVersion) {
      version.release = "stable";
      version.releaseAction = "none";
    } else if (
      version.localVersion === version.betaVersion &&
      version.stableVersion < version.betaVersion
    ) {
      version.release = "beta";
      version.releaseAction = "none";
    } else if (
      version.localVersion > version.stableVersion &&
      version.localVersion < version.betaVersion
    ) {
      version.release = "beta";
      version.releaseAction = "updateBeta";
    } else if (
      version.localVersion > version.stableVersion &&
      version.localVersion > version.betaVersion
    ) {
      version.release = "development";
      version.releaseAction = "none";
    }
  },

  checkUpdate() {
    if (version.releaseAction === "none") {
      return;
    }

    const showUpdateNotification = (versionType, targetVersion) => {
      version.showNotification(
        `${versionType.toUpperCase()} ${language[
          language.settingActiveLanguage
        ].version.toUpperCase()} </br>${
          language[language.settingActiveLanguage].update
        } ${version.localVersion} ${language[
          language.settingActiveLanguage
        ].to.toLowerCase()} ${targetVersion}</br><br><a class="notify_subjectlink" href="https://www.grepotools.nl/" target="_blank">${
          language[language.settingActiveLanguage].update
        }</a>`
      );
    };

    if (version.releaseAction === "updateStable") {
      showUpdateNotification(version.release, version.stableVersion);
    }

    if (
      version.getSettingValue("joinBetaProgram") &&
      version.releaseAction === "updateBeta"
    ) {
      showUpdateNotification(version.release, version.betaVersion);
    }
  },

  showNotification(textNotification) {
    if (version.notification) return;

    if ($("#notification_area>.notification").length > 7) {
      return;
    } else {
      const date = new Date();
      const formatWithLeadingZero = (value) => (value < 10 ? "0" : "") + value;

      const day = formatWithLeadingZero(date.getDate());
      const month = formatWithLeadingZero(date.getMonth() + 1);
      const hour = formatWithLeadingZero(date.getHours());
      const minutes = formatWithLeadingZero(date.getMinutes());
      const seconds = formatWithLeadingZero(date.getSeconds());

      const dayTimeString = `${day}.${month}.|${hour}:${minutes}:${seconds}`;

      const notification = new uw.NotificationHandler();
      const layout =
        typeof Layout.notify === "undefined"
          ? new NotificationHandler()
          : Layout;

      notification.notify(
        $("#notification_area>.notification").length + 1,
        "GrepoToolsUpdate",
        `<span><b>${
          language[language.settingActiveLanguage].grepotoolsUpdateAvailable
        }</b></span>` +
          textNotification +
          `<span class="small notification_date">${dayTimeString}</span>`
      );
      version.notification = true;
    }
  },
};
