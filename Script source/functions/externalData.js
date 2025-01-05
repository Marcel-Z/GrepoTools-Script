// Module: externalData
// Discrption: This module will load external data from GrepoTools and GrepoData.
// Last Updated: 2024/12/22

let externalData = {
  module: "externalData",
  townData: new Map(),
  townDataLoaded: false,
  islandData: new Map(),
  idleData: new Map(),
  idleDataLoaded: false,

  init() {
    externalData.loadTownData();
    externalData.loadIdleData();

    externalData.intervalLoadTownData = setInterval(
      externalData.loadTownData,
      3600000
    );
    externalData.intervalLoadIdleData = setInterval(
      externalData.loadIdleData,
      3600000
    );
  },

  loadTownData() {
    $.ajax({
      type: "POST",
      url: "https://www.grepotools.nl/grepotools/php/townData.php",
      data: {
        server: uw.Game.world_id,
      },
      success: function (returnData) {
        if (returnData != "data niet beschikbaar") {
          const data = JSON.parse(returnData);
          for (let i = 0; i < data.length; i++) {
            externalData.townData.set(data[i].townId, data[i]);
          }
          externalData.townDataLoaded = true;

          mapTags.mapTagsReset = true;
          mapTags.animate();
        } else {
          console.log("GrepoTools - Data niet beschikbaar");
        }
      },
    });
  },

  loadIslandData: async function (ocean) {
    const url = "https://www.grepotools.nl/grepotools/php/islandNumbers.php";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        server: Game.world_id,
        ocean: ocean,
        version: GM_info.script.version,
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.text();

      externalData.islandData.set(
        Game.world_id + "|" + ocean,
        JSON.parse(data)
      );

      GM_setValue(
        "islandData",
        JSON.stringify(Array.from(externalData.islandData.entries()))
      );
      islandNumbers.animate();
    } catch (networkError) {
      console.error("GrepoTools network error:", networkError);
    }
  },

  loadIdleData() {
    // Data available from GrepoData
    $.ajax({
      type: "GET",
      url:
        "https://api.grepodata.com/data/" +
        uw.Game.world_id +
        "/player_idle.json",
      data: {
        server: uw.Game.world_id,
      },
      success: function (returnData) {
        if (returnData) {
          $.each(returnData, function (speler, idle) {
            externalData.idleData.set(speler, {
              speler_id: speler,
              idle: idle,
            });
          });
          externalData.idleDataLoaded = true;
          mapTags.mapTagsReset = true;
        } else {
          console.log("GrepoTools - GrepoData not available");
        }
      },
    });
  },
};
