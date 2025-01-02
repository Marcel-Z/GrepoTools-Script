// Module:messageAlliance
// Discrption: This module will add a button to the island page to send a message to all alliance members.
// Last Updated: 2025/01/01

let messageIsland = {
  module: "messageIsland",
  rendered: false,
  styleDiv: `GrepoTools_messageIsland`,
  buttonAction: true,

  init() {
    if (grepolisLoaded) {
      this.createStyle();
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          .buttonLogo {
            margin-right:10px;
            width:20px;
            height:20px;
          }
          .buttonText {
            height:23px;
            float:right
          }
          [id^="messageIslandButton"] {
            float:right;
            padding-top:3px;
            margin-right:10px
          }
        `)
      );
      this.rendered = true;
    }
  },

  animate() {
    if (!this.rendered == true) {
      return;
    }

    Layout.wnd.getAllOpen().forEach((elem) => {
      if (elem.getController() === "island_info") {
        if (!$(`#messageIslandButton_${elem.getElement().id}`).length) {
          otherScripts.checkActiveScripts();
          this.hideDiotoolsMessageButton();
          this.hideMoleholeMessageButton();
          this.addButton(elem.getElement().id);
        }
      }
    });
  },

  addButton(id) {
    $(`#${id} .island_info_left .game_header`).append(
      $("<div/>", {
        id: `messageIslandButton_${id}`,
        class: "button_new",
      }).button({
        caption: `
            <img class="buttonLogo" src="https://www.grepotools.nl/grepotools/images/logoStable.png">
            <span class="buttonText">${
              language[language.settingActiveLanguage].message
            }</span>`,
      })
    );

    $(`#messageIslandButton_${id}`).tooltip(
      `${language[language.settingActiveLanguage].sendMessageIsland}`
    );

    $(`#messageIslandButton_${id}`).click(function () {
      if (messageIsland.buttonAction) {
        messageIsland.buttonAction = false;
        messageTo = [];
        islandCityData = [];
        playerData = "";

        const liItems = $(this)
          .closest(".gpwindow_content")
          .find(
            "#island_info_towns_left_sorted_by_name li.odd, #island_info_towns_left_sorted_by_name li.even"
          );

        liItems.each(function () {
          if ($(this).find(".gp_town_link").length == 0) {
            HumanMessage.error(
              language[language.settingActiveLanguage].islandEmptyNoMessage
            );
          } else {
            const hrefData = $(this).find(".gp_town_link").attr("href");
            const townId = JSON.parse(
              atob(hrefData.slice(hrefData.lastIndexOf("#") + 1))
            ).id;

            if (townId != undefined) {
              islandCityData.push(townId);
            }
          }
        });

        if (islandCityData.length) {
          for (let i = 0; i < islandCityData.length; i++) {
            if (externalData.townData.has(islandCityData[i].toString())) {
              data = externalData.townData.get(islandCityData[i].toString());
              playerName = decodeURI(data.playerName.split("+").join(" "));

              if (
                data.allianceId == uw.Game.alliance_id &&
                playerName != uw.Game.player_name &&
                !messageTo.includes(playerName)
              ) {
                messageTo.push(playerName);
              }
            }
          }
          if (!messageTo.length) {
            HumanMessage.error(
              language[language.settingActiveLanguage].islandNoAllianceNoMessage
            );
          } else {
            uw.Layout.newMessage.open({
              recipients: [...new Set(messageTo)].join(";"),
            });
          }
        }

        setTimeout(() => {
          messageIsland.buttonAction = true;
        }, 500);
      }
    });
  },

  hideDiotoolsMessageButton() {
    if (
      otherScripts.diotoolsActive &&
      otherScripts.getSettingValue("diotoolsMessageButton")
    ) {
      // island window
      document.querySelectorAll("#dio_message_island").forEach((element) => {
        element.style.display = "none";
      });
    }
  },

  hideMoleholeMessageButton() {
    if (
      otherScripts.moleholeActive &&
      otherScripts.getSettingValue("moleholeMessageButton")
    ) {
      document.querySelectorAll(".write_message").forEach((element) => {
        element.style.display = "none";
      });
    }
  },
};
