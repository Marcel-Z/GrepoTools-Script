// Module: bbcodeCopyAlliance
// Discrption: This module will add a button to the alliance page to copy the alliance bbcode.
// Last Updated: 2024/11/30

let bbcodeCopyAlliance = {
  module: "bbcodeCopyAlliance",
  rendered: false,
  styleDiv: `GrepoTools_bbcodeCopyAlliance`,
  buttonAction: true,
  data: new Map(),

  init() {
    if (grepolisLoaded) {
      this.createStyle();
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          .button_logo {
            margin-right:10px;
          }
          .button_tekst {
            height:23px;
            float:right;
          }
          .bbcodeAllianceButton {
            float:right;
            padding-top:3px;
          }
          #ally_towns .game_header {
            height: 27px;
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
      $(".bbcodeAllianceButton").length
    ) {
      return;
    }

    otherScripts.checkActiveScripts();
    this.hideDiotoolsBbcodeButton();
    this.hideGrcrtBbcodeButton();
    this.hideMoleholeBbcodeButton();

    this.addBbcodeButton();
  },

  addBbcodeButton() {
    $("#ally_towns > div > div.game_header.bold").append(
      $("<div/>", {
        id: "bbcodeAllianceButton",
        class: "button_new bbcodeAllianceButton",
      }).button({
        caption: `
          <img class="buttonLogo" src="https://www.grepotools.nl/grepotools/images/logoStable.png">
          <span class="buttonText">BBCode</span>`,
      })
    );

    $(".bbcodeAllianceButton").tooltip(
      `${language[language.settingActiveLanguage].bbcodeAlliance}`
    );

    $(".bbcodeAllianceButton").click(() => {
      if (this.buttonAction) {
        this.buttonAction = false;
        this.data.clear();

        const members = this.getMembers();
        const allianceInfo = this.getAllianceInfo(members);

        this.data.set(0, allianceInfo);

        members.forEach((member, index) => {
          this.data.set(index + 1, {
            playerRank: index + 1,
            playerName: member.name,
            playerId: parseInt(member.id),
            playerPoints: parseInt(member.points),
            playerCities: parseInt(member.cities),
          });
        });

        setTimeout(() => {
          if (this.data.size > 0) {
            HumanMessage.success(
              `${
                language[language.settingActiveLanguage]
                  .bbcodeAllianceCopySucces
              }`
            );
          }
          this.buttonAction = true;
        }, 500);
      }
    });
  },

  getMembers() {
    const liItems = $("#ally_towns .members_list li.even:not([class*=' '])");
    const members = [];

    liItems.each(function () {
      const hrefWithoutHash = $(this)
        .find(".gp_player_link")
        .attr("href")
        .slice(1);
      const memberData = JSON.parse(atob(hrefWithoutHash));

      members.push({
        id: memberData.id,
        name: memberData.name,
        points: bbcodeCopyAlliance.extractPoints(
          $(this).find("div.small-descr").text(),
          0
        ),
        cities: bbcodeCopyAlliance.extractPoints(
          $(this).find("div.small-descr").text(),
          1
        ),
      });
    });

    return members;
  },

  getAllianceInfo(members) {
    const allianceName = $("#bbcodeAllianceButton")
      .closest(".ui-dialog")
      .find(".ui-dialog-title")
      .text();

    const alliancePoints = members.reduce(
      (sum, member) => sum + parseInt(member.points, 10),
      0
    );
    const allianceRank = this.extractNumber(
      "#ally_rank_text > div.rank_number"
    );
    const [currentMembers, maxMembers] = this.extractMembers(
      "#ally_towns .members_list li.header:not([class*=' ']) .small-descr"
    );

    return {
      allianceName,
      allianceCurrentMembers: parseInt(currentMembers),
      allianceMaxMembers: parseInt(maxMembers),
      alliancePoints: parseInt(alliancePoints),
      allianceRank: parseInt(allianceRank),
    };
  },

  extractPoints(text, index) {
    return text.split(",")[index].replace(/\D/g, "");
  },

  extractText(selector) {
    return $(selector)
      .contents()
      .filter(function () {
        return this.nodeType === 3;
      })
      .text()
      .trim();
  },

  extractNumber(selector) {
    return $(selector).text().replace(/\D/g, "");
  },

  extractMembers(selector) {
    const membersText = $(selector).text().trim();
    return membersText.split("/").map((item) => item.replace(/\D/g, ""));
  },

  hideDiotoolsBbcodeButton() {
    if (
      otherScripts.diotoolsActive &&
      otherScripts.getSettingValue("diotoolsBbcodeButton")
    ) {
      $("#dio_alliance_player").hide();
    }
  },

  hideGrcrtBbcodeButton() {
    if (
      otherScripts.grcrtActive &&
      otherScripts.getSettingValue("grcrtBbcodeButton")
    ) {
      $("div[name='BBCode']").hide();
    }
  },

  hideMoleholeBbcodeButton() {
    if (
      otherScripts.grcrtActive &&
      otherScripts.getSettingValue("moleholeBbcodeButton")
    ) {
      $("#ally_towns > div > a.button").hide();
    }
  },
};
