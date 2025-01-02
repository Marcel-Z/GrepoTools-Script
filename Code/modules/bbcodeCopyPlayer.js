// Module: bbcodeCopyPlayer
// Discrption: This module will add a button to the player profile page to copy the BBCode of the player.
// Last Updated: 2024/12/09

let bbcodeCopyPlayer = {
  module: "bbcodeCopyPlayer",
  rendered: false,
  styleDiv: `GrepoTools_bbcodeCopyPlayer`,
  buttonAction: true,
  innoPlayerData: new Map(),
  data: new Map(),
  playerId: "",
  allianceId: "",

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
          .bbcodePlayerButton {
            float:right;
            padding-top:3px;
          }
          #player_towns .game_header {
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
      !$("#player_towns").length ||
      $(".bbcodePlayerButton").length
    ) {
      return;
    }

    otherScripts.checkActiveScripts();
    this.hideDiotoolsBbcodeButton();
    this.hideGrcrtBbcodeButton();

    this.addBbcodeButton();
  },

  addBbcodeButton() {
    $("#player_towns > div > div.game_header.bold").append(
      $("<div/>", {
        id: "bbcodePlayerButton",
        class: "button_new bbcodePlayerButton",
      }).button({
        caption: `
          <img class="buttonLogo" src="https://www.grepotools.nl/grepotools/images/logoStable.png">
          <span class="buttonText">BBCode</span>`,
      })
    );

    $(".bbcodePlayerButton").tooltip(
      `${language[language.settingActiveLanguage].bbcodePlayer}`
    );

    $(".bbcodePlayerButton").click(() => {
      if (this.buttonAction) {
        $(".bbcodePlayerButton").addClass("disabled");
        $("#ajax_loader").css("visibility", "visible");
        let townList = "";
        bbcodeCopyPlayer.buttonAction = false;
        bbcodeCopyPlayer.innoPlayerData.clear();
        steden = [];
        bbcodeCopyPlayer.data.clear();

        const closestGameList = $("#player_towns").find("ul.game_list");
        townList = closestGameList.find("li").toArray();

        townList.forEach((item) => {
          const link = item.querySelector("a.gp_town_link");
          if (link) {
            const href = link.getAttribute("href");
            let stad = JSON.parse(atob(href.substring(1, href.length)));
            steden.push(stad.id);
          }
        });

        if (steden.length > 0) {
          $.ajax({
            type: "post",
            async: false,
            url: "https://www.grepotools.nl/grepotools/php/bbcodeCopyPlayer.php",
            data: {
              towns: JSON.stringify(steden),
              server: uw.Game.world_id,
            },
            success: function (returnData) {
              if (returnData != "data niet beschikbaar") {
                bbcodeCopyPlayer.innoPlayerData.clear();
                JSON.parse(returnData).forEach(function (value) {
                  bbcodeCopyPlayer.innoPlayerData.set(value.townId, value);
                });
              }
            },
            error: function (error) {
              console.error("AJAX request failed:", error);
            },
          });
        }
        bbcodeCopyPlayer.data.clear();

        let i = 0;
        bbcodeCopyPlayer.innoPlayerData.forEach((value, key) => {
          if (externalData.townData.has(key.toString())) {
            i++;
            townInfo = "";
            townOcean = externalData.townData.get(key.toString()).ocean;
            townName = decodeURI(
              externalData.townData
                .get(key.toString())
                .townName.split("+")
                .join(" ")
            );
            townPoints = externalData.townData.get(key.toString()).points;

            if (i === 1) {
              bbcodeCopyPlayer.playerId = parseInt(
                externalData.townData.get(key.toString()).playerId
              );
              bbcodeCopyPlayer.allianceId = parseInt(
                externalData.townData.get(key.toString()).allianceId
              );
              bbcodeCopyPlayer.data.set(0, bbcodeCopyPlayer.getPlayerInfo());
            }

            townInfo = {
              townId: parseInt(value.townId),
              townName,
              townPoints: parseInt(townPoints),
              Ocean: parseInt(townOcean),
              islandNumber: parseInt(value.islandId),
              islandTag: value.tagData,
            };
            bbcodeCopyPlayer.data.set(i, townInfo);
          }
        });

        setTimeout(() => {
          if (bbcodeCopyPlayer.data.size > 0) {
            $(".bbcodePlayerButton").removeClass("disabled");
            $("#ajax_loader").css("visibility", "hidden");
            HumanMessage.success(
              `${
                language[language.settingActiveLanguage].bbcodePlayerCopySucces
              }`
            );
            bbcodePastePlayer.tablePage = 1;
          } else {
            console.log("ERROR: Player data not found in InnoGames");
          }
          this.buttonAction = true;
        }, 500);
      }
    });
  },

  getPlayerInfo(members) {
    const playerName = $("#player_info").find("h3").text().trim();
    let allianceName = "";
    if ($("#player_info .gp_alliance_link").length > 0) {
      allianceName = $("#player_info .gp_alliance_link")
        .attr("onclick")
        .match(/'([^']+)'/)[1];
    }
    const playerRank = $("#player_info").find(".rank").text().trim();
    const playerBattlePoints = $("#player_info")
      .find(".battle_points")
      .text()
      .trim();
    const playerGrepolisScore = $("#player_info")
      .find(".grepolis_score_box .grepolis_score")
      .text()
      .trim();

    return {
      playerId: parseInt(this.playerId),
      allianceName,
      allianceId: parseInt(this.allianceId),
      playerName,
      playerRank: parseInt(playerRank),
      playerBattlePoints: parseInt(playerBattlePoints),
      playerGrepolisScore: parseInt(playerGrepolisScore),
    };
  },

  hideDiotoolsBbcodeButton() {
    if (
      otherScripts.diotoolsActive &&
      otherScripts.getSettingValue("diotoolsBbcodeButton")
    ) {
      $("#dio_player_towns").hide();
      $("#dio_BBplayer1").hide();
      $("#dio_BBalliance1").hide();
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
};
