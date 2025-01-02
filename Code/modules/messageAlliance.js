// Module:messageAlliance
// Discrption: This module will add a button to the alliance page to send a message to all alliance members.
// Last Updated: 2024/11/30

let messageAlliance = {
  module: "messageAlliance",
  rendered: false,
  styleDiv: `GrepoTools_messageAlliance`,
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
          .messageAllianceButton {
            float:right;
            padding-top:3px;
            margin-right:10px
          }
          #ally_towns .game_header{
            height: 27px
          }
        `)
      );
      this.rendered = true;
    }
  },

  animate() {
    if (
      !this.rendered ||
      !$("#ally_towns").length ||
      $(".messageAllianceButton").length
    ) {
      return;
    }

    otherScripts.checkActiveScripts();
    this.hideDiotoolsMessageButton();
    this.hideGrcrtMessageButton();
    this.hideMoleholeMessageButton();

    $("#ally_towns > div > div.game_header.bold").append(
      $("<div/>", {
        id: "messageAllianceButton",
        class: "button_new messageAllianceButton",
      }).button({
        caption: `
          <img class="buttonLogo" src="https://www.grepotools.nl/grepotools/images/logoStable.png">
          <span class="buttonText">${
            language[language.settingActiveLanguage].message
          }</span>`,
      })
    );

    $(".messageAllianceButton").tooltip(
      `${language[language.settingActiveLanguage].sendMessageAlliance}`
    );

    $(".messageAllianceButton").click(() => {
      if (messageIsland.buttonAction) {
        messageIsland.buttonAction = false;

        const allianceMembers = $(".members_list li:eq(1) ul li.even");
        const messageTo = allianceMembers
          .map((index, element) => {
            const playerName = $(element)
              .find("a.gp_player_link")
              .attr("title");
            return playerName !== uw.Game.player_name ? playerName : null;
          })
          .get()
          .filter(Boolean)
          .join(";");

        uw.Layout.newMessage.open({ recipients: messageTo });

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
      $("#dio_ally_mass_mail").hide();
    }
  },

  hideGrcrtMessageButton() {
    if (
      otherScripts.grcrtActive &&
      otherScripts.getSettingValue("grcrtMessageButton")
    ) {
      $("#grcrt_ally_mass_mail").hide();
    }
  },

  hideMoleholeMessageButton() {
    if (
      otherScripts.moleholeActive &&
      otherScripts.getSettingValue("diotoolsMessageButton")
    ) {
      document.querySelectorAll(".write_message").forEach((element) => {
        element.style.display = "none";
      });
    }
  },
};
