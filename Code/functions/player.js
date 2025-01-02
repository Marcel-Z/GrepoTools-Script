// Not active yet (1.9.2)

function getPlayerInfo() {
  $.ajax({
    type: "GET",
    url: `https://${Game.world_id}.grepolis.com/game/alliance?`,
    data: {
      town_id: Game.townId,
      action: "members_show",
      h: Game.csrfToken,
    },
    success: function (returnData) {
      // table header -> x will be removed from JSON
      const tableHeaderData = [
        "player",
        "ally_rank",
        "points",
        "no_of_city",
        "founder",
        "leader",
        "invitations",
        "diplomacy",
        "circular",
        "forum_moderator",
        "access_internal_forums",
        "reservations",
        "x",
      ];

      let tableHeader;

      for (i = 0; i < tableHeaderData.length; i++) {
        tableHeader += `<th>${tableHeaderData[i]}</th>`;
      }

      let rawAllyData = returnData.plain.html.replace(/\s+/g, " ");
      //tekst = tekst.replace(/ class="narrow" /g,'');
      rawAllyData = rawAllyData.replace(/ class="checked" /g, "");
      // remove alt text (any language)
      rawAllyData = rawAllyData.replace(/alt=".*?"/g, 'alt=""');
      // player has no rights -> change image for "0"
      rawAllyData = rawAllyData.replace(
        / <img src="\/images\/game\/ally\/indicators\/yellow.png" alt="" /g,
        0
      );
      // player has rights -> change image for "1"
      rawAllyData = rawAllyData.replace(
        / <img src="\/images\/game\/ally\/indicators\/yellow_checkmark.png" alt=""\/> /g,
        1
      );
      // change table start and insert header row
      rawAllyData = rawAllyData.replace(
        /<table class="game_table" cellspacing="0" width="100%">/g,
        `<table>${tableHeader}</tr>`
      );
      // remove last row
      rawAllyData = rawAllyData.replace(
        /<tr style="height: 100%" id="ally_ie6_invisible">\s*<td><\/td>\s*<\/tr>/,
        ""
      );

      let start = rawAllyData.indexOf('<div id="ally_members_body">');
      let end = rawAllyData.indexOf("</table> </div>");

      rawAllyData = rawAllyData.substr(start + 29, end - start - 21);

      let jsonData = playerTableToJson(rawAllyData);

      for (i = 0; i < jsonData.length; i++) {
        if (jsonData[i].player == uw.Game.player_name) {
          player.id = uw.Game.player_id;
          player.name = uw.Game.player_name;
          player.rank = uw.Game.player_rank;
          player.country = uw.Game.market_id;
          player.points = jsonData[i].points;
          player.cities = jsonData[i].no_of_city;
          player.allianceId = uw.Game.alliance_id;
          player.allianceRank = jsonData[i].ally_rank;
          player.hasFounderRights = jsonData[i].founder;
          player.hasLeaderRights = jsonData[i].leader;
          player.hasInvitationsRights = jsonData[i].invitations;
          player.hasDiplomacyRights = jsonData[i].diplomacy;
          player.hasCircularMessageRights = jsonData[i].circular;
          player.hasForumModeratorRights = jsonData[i].forum_moderator;
          player.hasInternalForumRights = jsonData[i].access_internal_forums;
          player.hasReservationsRights = jsonData[i].reservations;
        }
      }
    },
  });
}

// create a JSON object from a string with a table value
function playerTableToJson(tableString) {
  // Create a DOM parser
  let parser = new DOMParser();
  let doc = parser.parseFromString(tableString, "text/html");

  // Get all rows from the table
  let rows = doc.querySelectorAll("table tr");

  // Extract headers
  let headers = Array.from(rows[0].querySelectorAll("th")).map((th) =>
    th.textContent.trim()
  );

  // Extract data
  let data = Array.from(rows)
    .slice(1)
    .map((row) => {
      let cells = row.querySelectorAll("td");
      let obj = {};
      headers.forEach((header, i) => {
        obj[header] = cells[i].textContent.trim();
      });
      return obj;
    });

  return data;
}
