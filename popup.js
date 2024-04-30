let firstscorecardcopy = document.getElementById("firstscorecardcopy");
let firstscorecardpaste = document.getElementById("firstscorecardpaste");
let secondscorecardcopy = document.getElementById("secondscorecardcopy");
let secondscorecardpaste = document.getElementById("secondscorecardpaste");
let mvpcopy = document.getElementById("mvpcopy");
let mvppaste = document.getElementById("mvppaste");
let commentarycopy = document.getElementById("commentarycopy");
let commentarypaste = document.getElementById("commentarypaste");
let cleardetail = document.getElementById("clearit");

/**
 * First Innings Copy Event Handling
 */
firstscorecardcopy.addEventListener("click", async () => {
  // Get current active Tab of browser
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  console.log(tab.url);
  if (
    tab.url.includes("/full-scorecard") ||
    tab.url.includes("/live-cricket-score")
  ) {
    //Executing script on the page !!
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeFirstInningMatchScoreCard,
    });
  } else {
    alert("Not on Scorecard Page, kindly select valid page");
  }
});

/**
 * First Innings Paste Event Handling
 */
firstscorecardpaste.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: pasteFirstInningMatchScoreCard,
  });
});

/**
 * Second Innings Copy Event Handling
 */
secondscorecardcopy.addEventListener("click", async () => {
  // Get current active Tab of browser
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (tab.url.includes("/match-statistics")) {
    //Executing script on the page !!
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeSecondInningMatchScoreCard,
    });
  } else {
    alert("Not on Scorecard Page, kindly select valid page");
  }
});

/**
 * Second Innings Copy Event Handling
 */
secondscorecardpaste.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: pasteSecondInningMatchScoreCard,
  });
});

/**
 * MVP Copy Event Handling
 */
mvpcopy.addEventListener("click", async () => {
  // Get current active Tab of browser
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (tab.url.includes("/live-cricket-score")) {
    //Executing script on the page !!
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeMatchMVP,
    });
  } else {
    alert("Not on Player MVP Page, kindly select valid page");
  }
});

/**
 * MVP Paste Event Handling
 */
mvppaste.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: pasteMatchMVP,
  });
});

/**
 * Commentary Copy Event Handling
 */

commentarycopy.addEventListener("click", async () => {
  // Get current active Tab of browser
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  //if (tab.url.includes("/ball-by-ball-commentary")) {
  //Executing script on the page !!
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeMatchCommentary,
  });
  // } else {
  //   alert("Not on Commantary Page, kindly select valid page");
  // }
});

/**
 * Commentary Paste Event Handling
 */
commentarypaste.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: pasteMatchCommentary,
  });
});

/**
 * Clear data from chrome storage
 */

cleardetail.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: clearAllEntriesFromStorage,
  });
});

/**
 * Handler to copy match of first innings from site
 */
const scrapeFirstInningMatchScoreCard = async () => {
  let firstInningsScore = {
    batting: [],
    bowling: [],
  };

  let firstInnings = document.querySelectorAll(".ds-rounded-lg.ds-mt-2")[0];
  let firstInningsBatting = firstInnings.querySelectorAll(".ds-p-0 > table")[0];
  let allPlayersBattingStats = [];
  firstInningsBatting.querySelectorAll("tbody > tr").forEach((ele, index) => {
    if (ele.childElementCount === 8) {
      let battingPlayerStats = {};
      battingPlayerStats["Innings"] = 1;
      battingPlayerStats["Batsman"] = ele.children[0].textContent
        ?.replaceAll(",", "")
        .replaceAll("†", "")
        .replaceAll("(c)", "")
        .trim();
      //battingPlayerStats["howWasOut"] = ele.children[1].textContent;
      battingPlayerStats["Runs Scored"] = isNaN(ele.children[2].textContent)
        ? "-"
        : Number(ele.children[2].textContent);
      battingPlayerStats["Balls Faced"] = isNaN(ele.children[3].textContent)
        ? "-"
        : Number(ele.children[3].textContent);
      //battingPlayerStats["minutes"] = isNaN(ele.children[4].textContent) ? "-" : Number(ele.children[4].textContent);
      battingPlayerStats["4s by Batsman"] = isNaN(ele.children[5].textContent)
        ? "-"
        : Number(ele.children[5].textContent);
      battingPlayerStats["6s by Batsman"] = isNaN(ele.children[6].textContent)
        ? "-"
        : Number(ele.children[6].textContent);
      battingPlayerStats["Strike Rate"] = isNaN(ele.children[7].textContent)
        ? "-"
        : Number(ele.children[7].textContent);
      allPlayersBattingStats.push(battingPlayerStats);
    }
  });
  let secondInnings = document.querySelectorAll(".ds-rounded-lg.ds-mt-2")[1];
  let secondInningsBatting =
    secondInnings.querySelectorAll(".ds-p-0 > table")[0];
  secondInningsBatting.querySelectorAll("tbody > tr").forEach((ele, index) => {
    if (ele.childElementCount === 8) {
      let battingPlayerStats = {};
      battingPlayerStats["Innings"] = 2;
      battingPlayerStats["Batsman"] = ele.children[0].textContent
        ?.replaceAll(",", "")
        .replaceAll("†", "")
        .replaceAll("(c)", "")
        .trim();
      //battingPlayerStats["howWasOut"] = ele.children[1].textContent;
      battingPlayerStats["Runs Scored"] = isNaN(ele.children[2].textContent)
        ? "-"
        : Number(ele.children[2].textContent);
      battingPlayerStats["Balls Faced"] = isNaN(ele.children[3].textContent)
        ? "-"
        : Number(ele.children[3].textContent);
      //battingPlayerStats["minutes"] = isNaN(ele.children[4].textContent) ? -1000 : Number(ele.children[4].textContent);
      battingPlayerStats["4s by Batsman"] = isNaN(ele.children[5].textContent)
        ? "-"
        : Number(ele.children[5].textContent);
      battingPlayerStats["6s by Batsman"] = isNaN(ele.children[6].textContent)
        ? "-"
        : Number(ele.children[6].textContent);
      battingPlayerStats["Strike Rate"] = isNaN(ele.children[7].textContent)
        ? "-"
        : Number(ele.children[7].textContent);
      allPlayersBattingStats.push(battingPlayerStats);
    }
  });

  let firstInningsBowling = firstInnings.querySelectorAll(".ds-p-0 > table")[1];
  let allPlayersBowlingStats = [];
  firstInningsBowling.querySelectorAll("tbody > tr").forEach((ele, index) => {
    if (ele.childElementCount === 11) {
      let bowlingPlayerStats = {};
      bowlingPlayerStats["Innings"] = 1;
      bowlingPlayerStats["Bowler"] = ele.children[0].textContent
        .replaceAll(",", "")
        .replaceAll("†", "")
        .replaceAll("(c)", "")
        .trim();
      bowlingPlayerStats["Overs Bowled"] = isNaN(ele.children[1].textContent)
        ? "-"
        : Number(ele.children[1].textContent);
      bowlingPlayerStats["Maidens Bowled"] = isNaN(ele.children[2].textContent)
        ? "-"
        : Number(ele.children[2].textContent);
      bowlingPlayerStats["Runs Conceded"] = isNaN(ele.children[3].textContent)
        ? "-"
        : Number(ele.children[3].textContent);
      bowlingPlayerStats["Wickets Taken"] = isNaN(ele.children[4].textContent)
        ? "-"
        : Number(ele.children[4].textContent);
      bowlingPlayerStats["Economy Rate"] = isNaN(ele.children[5].textContent)
        ? "-"
        : Number(ele.children[5].textContent);
      bowlingPlayerStats["Dot Balls"] = isNaN(ele.children[6].textContent)
        ? "-"
        : Number(ele.children[6].textContent);
      bowlingPlayerStats["Fours Conceded"] = isNaN(ele.children[7].textContent)
        ? -1000
        : Number(ele.children[7].textContent);
      bowlingPlayerStats["Sixes Conceded"] = isNaN(ele.children[8].textContent)
        ? -1000
        : Number(ele.children[8].textContent);
      bowlingPlayerStats["Wides"] = isNaN(ele.children[9].textContent)
        ? -1000
        : Number(ele.children[9].textContent);
      bowlingPlayerStats["No Balls"] = isNaN(ele.children[10].textContent)
        ? -1000
        : Number(ele.children[10].textContent);
      allPlayersBowlingStats.push(bowlingPlayerStats);
    }
  });

  let secondInningsBowling =
    secondInnings.querySelectorAll(".ds-p-0 > table")[1];
  secondInningsBowling.querySelectorAll("tbody > tr").forEach((ele, index) => {
    if (ele.childElementCount === 11) {
      let bowlingPlayerStats = {};
      bowlingPlayerStats["Innings"] = 2;
      bowlingPlayerStats["Bowler"] = ele.children[0].textContent
        .replaceAll(",", "")
        .replaceAll("†", "")
        .replaceAll("(c)", "")
        .trim();
      bowlingPlayerStats["Overs Bowled"] = isNaN(ele.children[1].textContent)
        ? -1000
        : Number(ele.children[1].textContent);
      bowlingPlayerStats["Maidens Bowled"] = isNaN(ele.children[2].textContent)
        ? -1000
        : Number(ele.children[2].textContent);
      bowlingPlayerStats["Runs Conceded"] = isNaN(ele.children[3].textContent)
        ? -1000
        : Number(ele.children[3].textContent);
      bowlingPlayerStats["Wickets Taken"] = isNaN(ele.children[4].textContent)
        ? -1000
        : Number(ele.children[4].textContent);
      bowlingPlayerStats["Economy Rate"] = isNaN(ele.children[5].textContent)
        ? -1000
        : Number(ele.children[5].textContent);
      bowlingPlayerStats["Dot Balls"] = isNaN(ele.children[6].textContent)
        ? -1000
        : Number(ele.children[6].textContent);
      bowlingPlayerStats["Fours Conceded"] = isNaN(ele.children[7].textContent)
        ? -1000
        : Number(ele.children[7].textContent);
      bowlingPlayerStats["Sixes Conceded"] = isNaN(ele.children[8].textContent)
        ? -1000
        : Number(ele.children[8].textContent);
      bowlingPlayerStats["Wides"] = isNaN(ele.children[9].textContent)
        ? -1000
        : Number(ele.children[9].textContent);
      bowlingPlayerStats["No Balls"] = isNaN(ele.children[10].textContent)
        ? -1000
        : Number(ele.children[10].textContent);
      allPlayersBowlingStats.push(bowlingPlayerStats);
    }
  });

  const allElements = document.querySelectorAll(
    ".ds-text-tight-s.ds-font-regular.ds-leading-4"
  );
  const filteredElements = Array.from(allElements).filter(
    (el) => !el.classList.contains("ds-text-typo-mid1")
  );

  const spansFirst = filteredElements[0].querySelectorAll(
    ".ds-text-tight-s span"
  );
  const wicketsArrayFirst = Array.from(spansFirst).map((span) => {
    const text = span.textContent.trim();
    const parts = text.match(/(\d+)-(\d+) \(([^,]+), (\d+\.\d+) ov\)/);
    if (!parts) {
      return null;
    }
    return {
      Innings: 1,
      "Wicket Number": parseInt(parts[1]),
      "Over And Ball": parseFloat(parts[4]),
      "At Runs": parseInt(parts[2], 10),
      "Dismissed Player Name": parts[3],
    };
  });

  const spansSecond = filteredElements[1].querySelectorAll(
    ".ds-text-tight-s span"
  );
  const wicketsArraySecond = Array.from(spansSecond).map((span) => {
    const text = span.textContent.trim();
    const parts = text.match(/(\d+)-(\d+) \(([^,]+), (\d+\.\d+) ov\)/);
    if (!parts) {
      return null;
    }
    return {
      Innings: 2,
      "Wicket Number": parseInt(parts[1]),
      "Over And Ball": parseFloat(parts[4]),
      "At Runs": parseInt(parts[2], 10),
      "Dismissed Player Name": parts[3],
    };
  });
  let wicketsArray = wicketsArrayFirst.concat(wicketsArraySecond);
  firstInningsScore["batting"] = allPlayersBattingStats.map((battingObj) => ({
    ...battingObj,
    "Total Boundary": battingObj["4s by Batsman"] + battingObj["6s by Batsman"],
    "Runs from Boundary":
      battingObj["4s by Batsman"] * 4 + battingObj["6s by Batsman"] * 6,
    "Runs not from boundary":
      battingObj["Runs Scored"] -
      (battingObj["4s by Batsman"] * 4 + battingObj["6s by Batsman"] * 6),
  }));
  firstInningsScore["bowling"] = allPlayersBowlingStats.map((bowlingObj) => ({
    ...bowlingObj,
    "Total Boundaries Conceded":
      bowlingObj["Fours Conceded"] + bowlingObj["Sixes Conceded"],
    "Runs from Boundary Conceded":
      bowlingObj["Fours Conceded"] * 4 + bowlingObj["Sixes Conceded"] * 6,
    "Runs not from boundary Conceded":
      bowlingObj["Runs Conceded"] -
      (bowlingObj["Fours Conceded"] * 4 + bowlingObj["Sixes Conceded"] * 6),
    "Extra Runs Conceded (Wides & No Balls)":
      bowlingObj["Wides"] + bowlingObj["No Balls"],
  }));
  firstInningsScore["fallofwickets"] = wicketsArray.filter(
    (element) => element !== null
  );

  function getDoNotBatPlayers() {
    let doNotBatPlayers = [];
    document
      .querySelectorAll(
        ".ds-text-tight-s.ds-font-regular.ds-leading-4.ds-text-typo-mid1"
      )
      .forEach((ele, idx) => {
        const players = ele.querySelectorAll(".ds-popper-wrapper.ds-inline");
        players.forEach((player) => {
          doNotBatPlayers.push({
            Batsman: player.innerText
              .replaceAll(",", "")
              .replaceAll("†", "")
              .replaceAll("(c)", "")
              .trim(),
            Innings: idx === 0 ? 1 : 2,
          });
        });
      });
    return doNotBatPlayers;
    // return doNotBatPlayers;
  }

  firstInningsScore["doNotBatPlayers"] = getDoNotBatPlayers();
  firstInningsScore["battingPlayers"] = firstInningsScore.batting.map(
    (obj) => obj.Batsman
  );
  firstInningsScore["bowlingPlayers"] = firstInningsScore.bowling.map(
    (obj) => obj.Bowler
  );
  firstInningsScore["doNotBatPlayersNames"] =
    firstInningsScore.doNotBatPlayers.map((obj) => obj.Batsman);

  // let storedValueFirstInnings = await chrome.storage.local.set({
  //   match_first_innings: JSON.stringify(firstInningsScore),
  // });

  console.log("First Inning Data Stored !!", firstInningsScore);
};

/**
 * Handler to paste match of first innings from site
 */
const pasteFirstInningMatchScoreCard = async () => {
  let fetchedValue = await chrome.storage.local.get("match_first_innings");
  document.getElementById("first_innings_jsondata").value = "";
  document.getElementById("first_innings_jsondata").value =
    fetchedValue.match_first_innings;
  console.log("First Inning Data Pasted !!", fetchedValue.match_first_innings);
};

/**
 * Handler to copy match of second innings from site
 */
const scrapeSecondInningMatchScoreCard = async () => {
  // let secondInningsScore = {
  //   batting: [],
  //   bowling: [],
  // };
  // let secondInnings = document.querySelectorAll(".ds-rounded-lg.ds-mt-2")[1];
  // let secondInningsBatting =
  //   secondInnings.querySelectorAll(".ds-p-0 > table")[0];
  // let allPlayersBattingStats = [];
  // secondInningsBatting.querySelectorAll("tbody > tr").forEach((ele, index) => {
  //   if (ele.childElementCount === 8) {
  //     let battingPlayerStats = {};
  //     battingPlayerStats["playerName"] = ele.children[0].textContent;
  //     battingPlayerStats["howWasOut"] = ele.children[1].textContent;
  //     battingPlayerStats["runs"] = isNaN(ele.children[2].textContent)
  //       ? -1000
  //       : Number(ele.children[2].textContent);
  //     battingPlayerStats["balls"] = isNaN(ele.children[3].textContent)
  //       ? -1000
  //       : Number(ele.children[3].textContent);
  //     battingPlayerStats["minutes"] = isNaN(ele.children[4].textContent)
  //       ? -1000
  //       : Number(ele.children[4].textContent);
  //     battingPlayerStats["fours"] = isNaN(ele.children[5].textContent)
  //       ? -1000
  //       : Number(ele.children[5].textContent);
  //     battingPlayerStats["sixes"] = isNaN(ele.children[6].textContent)
  //       ? -1000
  //       : Number(ele.children[6].textContent);
  //     battingPlayerStats["strikeRate"] = isNaN(ele.children[7].textContent)
  //       ? -1000
  //       : Number(ele.children[7].textContent);
  //     allPlayersBattingStats.push(battingPlayerStats);
  //   }
  // });
  // let secondInningsBowling =
  //   secondInnings.querySelectorAll(".ds-p-0 > table")[1];
  // let allPlayersBowlingStats = [];
  // secondInningsBowling.querySelectorAll("tbody > tr").forEach((ele, index) => {
  //   if (ele.childElementCount === 11) {
  //     let bowlingPlayerStats = {};
  //     bowlingPlayerStats["playerName"] = ele.children[0].textContent;
  //     bowlingPlayerStats["overs"] = isNaN(ele.children[1].textContent)
  //       ? -1000
  //       : Number(ele.children[1].textContent);
  //     bowlingPlayerStats["maidens"] = isNaN(ele.children[2].textContent)
  //       ? -1000
  //       : Number(ele.children[2].textContent);
  //     bowlingPlayerStats["runs"] = isNaN(ele.children[3].textContent)
  //       ? -1000
  //       : Number(ele.children[3].textContent);
  //     bowlingPlayerStats["wickets"] = isNaN(ele.children[4].textContent)
  //       ? -1000
  //       : Number(ele.children[4].textContent);
  //     bowlingPlayerStats["econ"] = isNaN(ele.children[5].textContent)
  //       ? -1000
  //       : Number(ele.children[5].textContent);
  //     bowlingPlayerStats["zeros"] = isNaN(ele.children[6].textContent)
  //       ? -1000
  //       : Number(ele.children[6].textContent);
  //     bowlingPlayerStats["fours"] = isNaN(ele.children[7].textContent)
  //       ? -1000
  //       : Number(ele.children[7].textContent);
  //     bowlingPlayerStats["sixes"] = isNaN(ele.children[8].textContent)
  //       ? -1000
  //       : Number(ele.children[8].textContent);
  //     bowlingPlayerStats["wides"] = isNaN(ele.children[9].textContent)
  //       ? -1000
  //       : Number(ele.children[9].textContent);
  //     bowlingPlayerStats["noballs"] = isNaN(ele.children[10].textContent)
  //       ? -1000
  //       : Number(ele.children[10].textContent);
  //     allPlayersBowlingStats.push(bowlingPlayerStats);
  //   }
  // });
  // secondInningsScore["batting"] = allPlayersBattingStats;
  // secondInningsScore["bowling"] = allPlayersBowlingStats;
  // let storedValueSecondInnings = await chrome.storage.local.set({
  //   match_second_innings: JSON.stringify(secondInningsScore),
  // });

  const partnershipData = document.querySelectorAll(".ds-p-4.ds-w-full");

  const partnershipsFirstInnings = Array.from(
    partnershipData[0].querySelectorAll(".ds-mb-3")
  ).map((partnership, index) => {
    const playerElements = partnership.querySelectorAll(
      ".ds-flex.ds-justify-between:first-child span"
    );
    const runElements = partnership.querySelectorAll(
      ".ds-flex.ds-justify-between.ds-items-center.ds-leading-none span.ds-text-tight-s.ds-font-medium"
    );

    const player1Name = playerElements[0] ? playerElements[0].textContent : "";
    const player1Details = runElements[0]
      ? runElements[0].textContent.match(/(\d+)\s*\((\d+)\)/)
      : [null, 0, 0];
    const player1Runs = parseInt(player1Details[1], 10);
    const player1BallsFaced = parseInt(player1Details[2], 10);

    const player2Name = playerElements[1] ? playerElements[1].textContent : "";
    const player2Details = runElements[1]
      ? runElements[1].textContent.match(/(\d+)\s*\((\d+)\)/)
      : [null, 0, 0];
    const player2Runs = parseInt(player2Details[1], 10);
    const player2BallsFaced = parseInt(player2Details[2], 10);

    const totalDetailsText = partnership.querySelector(".ds-w-\\38\\/12 div")
      ? partnership.querySelector(".ds-w-\\38\\/12 div").textContent
      : "0 (0)";
    const totalDetails = totalDetailsText.split(" (");
    const totalRuns = parseInt(totalDetails[0], 10);
    const totalBallsFaced = parseInt(totalDetails[1], 10);

    return {
      Innings: 1,
      Sequence: index + 1,
      "Player1 Name": player1Name,
      "Player1 Balls Faced": player1BallsFaced,
      "Player1 Runs": player1Runs,
      "Player2 Name": player2Name,
      "Player2 Balls Faced": player2BallsFaced,
      "Player2 Runs": player2Runs,
      "Total Balls Faced": totalBallsFaced,
      "Total Runs": totalRuns,
      "Partnership Between": `${player1Name} & ${player2Name}`,
    };
  });

  const partnershipsSecondInnings = Array.from(
    partnershipData[1].querySelectorAll(".ds-mb-3")
  ).map((partnership, index) => {
    const playerElements = partnership.querySelectorAll(
      ".ds-flex.ds-justify-between:first-child span"
    );
    const runElements = partnership.querySelectorAll(
      ".ds-flex.ds-justify-between.ds-items-center.ds-leading-none span.ds-text-tight-s.ds-font-medium"
    );

    const player1Name = playerElements[0] ? playerElements[0].textContent : "";
    const player1Details = runElements[0]
      ? runElements[0].textContent.match(/(\d+)\s*\((\d+)\)/)
      : [null, 0, 0];
    const player1Runs = parseInt(player1Details[1], 10);
    const player1BallsFaced = parseInt(player1Details[2], 10);

    const player2Name = playerElements[1] ? playerElements[1].textContent : "";
    const player2Details = runElements[1]
      ? runElements[1].textContent.match(/(\d+)\s*\((\d+)\)/)
      : [null, 0, 0];
    const player2Runs = parseInt(player2Details[1], 10);
    const player2BallsFaced = parseInt(player2Details[2], 10);

    const totalDetailsText = partnership.querySelector(".ds-w-\\38\\/12 div")
      ? partnership.querySelector(".ds-w-\\38\\/12 div").textContent
      : "0 (0)";
    const totalDetails = totalDetailsText.split(" (");
    const totalRuns = parseInt(totalDetails[0], 10);
    const totalBallsFaced = parseInt(totalDetails[1], 10);

    return {
      Innings: 2,
      Sequence: index + 1,
      "Player1 Name": player1Name,
      "Player1 Balls Faced": player1BallsFaced,
      "Player1 Runs": player1Runs,
      "Player2 Name": player2Name,
      "Player2 Balls Faced": player2BallsFaced,
      "Player2 Runs": player2Runs,
      "Total Balls Faced": totalBallsFaced,
      "Total Runs": totalRuns,
      "Partnership Between": `${player1Name} & ${player2Name}`,
    };
  });

  console.log("Second Inning Data Stored !!", {
    partnership: [...partnershipsFirstInnings, ...partnershipsSecondInnings],
    partnershipBetween: [
      ...partnershipsFirstInnings,
      ...partnershipsSecondInnings,
    ].map((obj) => obj["Partnership Between"]),
  });
};

/**
 * Handler to paste match of second innings from site
 */
const pasteSecondInningMatchScoreCard = async () => {
  let fetchedValue = await chrome.storage.local.get("match_second_innings");
  document.getElementById("second_innings_jsondata").value = "";
  document.getElementById("second_innings_jsondata").value =
    fetchedValue.match_second_innings;
  console.log("Second Inning Data Pasted !!");
};

/**
 * Handler to copy match MVP from site
 */

const scrapeMatchMVP = async () => {
  // let mvpAllData = [];
  // document
  //   .querySelectorAll(
  //     "table.ds-w-full.ds-table.ds-table-md.ds-table-auto > tbody > tr"
  //   )
  //   .forEach((ele, ind) => {
  //     let mvpOfPlayer = {};
  //     let tdElements = ele.querySelectorAll("td");
  //     let runAndBall = tdElements[3].textContent
  //       .replace("(", " ")
  //       .replace(")", "")
  //       .split(" ");
  //     let ballAndWicket = tdElements[6].textContent
  //       .replace("/", " ")
  //       .split(" ");
  //     mvpOfPlayer["name"] = tdElements[0].textContent;
  //     mvpOfPlayer["country"] = tdElements[1].textContent;
  //     mvpOfPlayer["totalImpact"] = Number(
  //       tdElements[2].textContent.replaceAll(" ", "")
  //     );
  //     mvpOfPlayer["run"] =
  //       runAndBall.length === 2
  //         ? Number(runAndBall[0].replaceAll(" ", ""))
  //         : -1000;
  //     mvpOfPlayer["ballPlayed"] =
  //       runAndBall.length === 2
  //         ? Number(runAndBall[1].replaceAll(" ", ""))
  //         : -1000;
  //     mvpOfPlayer["impactRun"] = !isNaN(
  //       tdElements[4].textContent.replaceAll(" ", "")
  //     )
  //       ? Number(tdElements[4].textContent.replaceAll(" ", ""))
  //       : -1000;
  //     mvpOfPlayer["runOnBalls"] =
  //       ballAndWicket.length === 2 ? Number(ballAndWicket[1]) : -1000;
  //     mvpOfPlayer["wickets"] =
  //       ballAndWicket.length === 2 ? Number(ballAndWicket[0]) : -1000;
  //     mvpOfPlayer["impactWicket"] = !isNaN(
  //       tdElements[7].textContent.replaceAll(" ", "")
  //     )
  //       ? Number(tdElements[7].textContent.replaceAll(" ", ""))
  //       : -1000;
  //     mvpAllData.push(mvpOfPlayer);
  //   });
  // let storedValueMVP = await chrome.storage.local.set({
  //   match_mvp: JSON.stringify(mvpAllData),
  // });
  const matchDetails = document
    .querySelector(".ds-text-tight-m.ds-font-regular.ds-text-typo-mid3")
    .childNodes[0].textContent.trim();

  // Adjusted regex patterns to accurately capture the data
  const matchNumberRegex = /(\d+)(?=(?:st|nd|rd|th)\s)/;
  const matchTypeRegex = /(T20I|ODI|Test)/;
  const matchDateRegex = /([A-Z][a-z]+ \d{1,2}, \d{4})/;

  const MatchNumber = matchNumberRegex.exec(matchDetails)
    ? parseInt(matchNumberRegex.exec(matchDetails)[1], 10)
    : null;
  const MatchType = matchTypeRegex.exec(matchDetails)
    ? matchTypeRegex.exec(matchDetails)[0]
    : null;
  const MatchDate = matchDateRegex.exec(matchDetails)
    ? matchDateRegex.exec(matchDetails)[0]
    : null;
  const SeriesName = document
    .querySelectorAll(".ds-text-tight-m.ds-font-regular.ds-text-typo-mid3")[1]
    .textContent.trim();
  const MatchBetween = `${
    document.querySelectorAll(
      ".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo.ds-mb-1"
    )[0].childNodes[0].textContent
  } vs ${
    document.querySelectorAll(
      ".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo.ds-mb-1"
    )[1].childNodes[0].textContent
  }`;
  const MatchWinner = document.querySelector(
    ".ds-text-tight-s.ds-font-medium.ds-truncate.ds-text-typo"
  ).textContent;
  const Venue = document.querySelectorAll(
    ".ds-w-full.ds-table.ds-table-sm.ds-table-auto.ds-border-line"
  )[
    document.querySelectorAll(
      ".ds-w-full.ds-table.ds-table-sm.ds-table-auto.ds-border-line"
    ).length - 1
  ].childNodes[0].childNodes[0].textContent;
  const TossWonByAndDecision = document.querySelectorAll(
    ".ds-w-full.ds-table.ds-table-sm.ds-table-auto.ds-border-line"
  )[
    document.querySelectorAll(
      ".ds-w-full.ds-table.ds-table-sm.ds-table-auto.ds-border-line"
    ).length - 1
  ].childNodes[0].childNodes[1].childNodes[1].textContent;
  const FirstInningsScore = document.querySelectorAll(
    ".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo.ds-mb-1"
  )[0].childNodes[1].textContent;
  const SecondInningsScore = document.querySelectorAll(
    ".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo.ds-mb-1"
  )[1].childNodes[1].textContent;
  const playerOfTheMatch = document.querySelector(
    ".ds-text-eyebrow-xs + div a span"
  ).textContent;
  console.log(
    `File Name : ${MatchBetween.replaceAll(
      " ",
      "-"
    )}-${MatchNumber}-Match-${MatchDate.replace(",", "").replaceAll(
      " ",
      "-"
    )}.txt \nSeries Name : ${SeriesName} \nMatch Between : ${MatchBetween} \nMatch Number : ${MatchNumber}\nMatch Type : ${MatchType} \nMatch Date : ${MatchDate} \nVenue : ${Venue} \nToss Won By And Decision : ${TossWonByAndDecision}\nFirst Innings Score : ${FirstInningsScore}\nSecond Innings Score : ${SecondInningsScore}\nMatch Winner : ${MatchWinner}\nPlayer of the Match : ${playerOfTheMatch}`
  );
  // setTimeout(() => {
  //   console.log("MVP Data Stored !!");
  // }, 3000);
};

/**
 * Handler to paste match MVP from site
 */

const pasteMatchMVP = async () => {
  let fetchedValue = await chrome.storage.local.get("match_mvp");
  document.getElementById("mvpjsondata").value = "";
  document.getElementById("mvpjsondata").value = fetchedValue.match_mvp;
  console.log("MVP Data pasted !!");
};

/**
 * Handler to copy match commentary from site
 */
const scrapeMatchCommentary = async () => {
  let allMatches = [];

  function parseMatchDetails(element) {
    const matchNoElement = element.querySelector(".match-no a");
    const matchNoText = matchNoElement.textContent;
    const matchNumber = matchNoText.trim().split(" ")[0]; // Get the second word, which should be the match number
    const venue = matchNoText.split(" at ")[1].split(" (")[0];
    const matchType = matchNoText.split(" (")[1].replace(")", "").trim(); // Remove spaces

    const team1 = element
      .querySelector(".innings-info-1")
      .childNodes[0].textContent.trim();
    const team2 = element
      .querySelector(".innings-info-2")
      .childNodes[0].textContent.trim();

    const matchDateText =
      element.querySelector(".match-info .bold").textContent;
    const matchDate = dayjs(matchDateText, "MMM DD, YYYY").format("MM/DD/YYYY"); // Format the date

    const blogSlug = `${team1.toLowerCase().replace(/ /g, "-")}-vs-${team2
      .toLowerCase()
      .replace(/ /g, "-")}-${matchNumber}-match-${matchDate.replace(
      /\//g,
      "-"
    )}`; // Replace slashes with hyphens in the date

    const result = {
      matchnumber: parseInt(matchNumber),
      team1: team1,
      team2: team2,
      matchdate: matchDate,
      venue: venue,
      matchtype: matchType,
      blogslug: blogSlug,
    };

    return result;
  }

  document.querySelectorAll(".default-match-block").forEach((ele, ind) => {
    const matchDetails = parseMatchDetails(ele);
    // console.log("matchDetails :: ", matchDetails);
    allMatches.push(matchDetails);
  });
  console.log("Commentary Data Stored !!", allMatches);
};

/**
 * Handler to paste match commentary from site
 */
const pasteMatchCommentary = async () => {
  let fetchedValue = await chrome.storage.local.get("match_commantary");
  document.getElementById("jsondata").value = "";
  document.getElementById("jsondata").value = fetchedValue.match_commantary;
};

/**
 * Handler to clear all the entries from chrome storage.
 */
const clearAllEntriesFromStorage = async () => {
  await chrome.storage.local.set({
    match_commantary: "",
  });
  await chrome.storage.local.set({
    match_mvp: "",
  });
  await chrome.storage.local.set({
    match_second_innings: "",
  });
  await chrome.storage.local.set({
    match_first_innings: "",
  });
  setTimeout(() => {
    console.log("Data Cleared !!");
  }, 3000);
};
