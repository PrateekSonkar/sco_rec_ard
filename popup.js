document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fetchHeading").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: scrapeData,
        },
        (results) => {
          console.log(" Results: ", results);
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            const matchHeading = results[0].result;
            document.getElementById("matchHeading").value = matchHeading;
            chrome.storage.local.set(
              {
                matchHeading: matchHeading,
              },
              () => {
                console.log("Match heading saved:", matchHeading);
              }
            );
          }
        }
      );
    });
  });

  document.getElementById("saveData").addEventListener("click", () => {
    const customId = document.getElementById("customId").value;
    const matchData = JSON.parse(document.getElementById("matchData").value);
    const id = customId || "default-id";
    console.log(
      "Saving data with ID:",
      chrome.storage.local.get("matchHeading", (data) => {
        console.log(data);
      })
    );

    fetch(`http://localhost:8000/matches/${id}`)
      .then((response) => {
        if (response.status === 404) {
          // Entry not found, create new entry
          return fetch("http://localhost:8000/matches", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, ...matchData }),
          });
        } else {
          // Entry found, merge new data with existing data
          return response.json().then((existingData) => {
            const updatedData = { ...existingData, ...matchData };
            return fetch(`http://localhost:8000/matches/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedData),
            });
          });
        }
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data saved:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  //Innings Scores Copy Button Start
  document.getElementById("inningsCopy").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: copyInningsDetails,
        },
        (results) => {
          console.log(" Results: inningsCopy :: ", results);
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            const innings = results[0].result;
            chrome.storage.local.set(
              {
                innings,
              },
              () => {
                console.log("Innings Detail saved:", innings);
              }
            );
          }
        }
      );
    });
  });
  //Innings Scores Copy Button Ends

  //Innings Scores Save to server Button Start
  document.getElementById("inningsSave").addEventListener("click", () => {
    const customId = document.getElementById("customId").value;
    const id = customId || "default-id";

    chrome.storage.local.get("innings", (data) => {
      console.log("saved innings data :: ", data);
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        const innings = data.innings || "";
        fetch(`http://localhost:8000/matches/${id}`)
          .then((response) => {
            if (response.status === 404) {
              // Entry not found, create new entry
              return fetch("http://localhost:8000/matches", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, ...innings }),
              });
            } else {
              // Entry found, merge new data with existing data
              return response.json().then((existingData) => {
                const updatedData = { ...existingData, ...innings };
                return fetch(`http://localhost:8000/matches/${id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedData),
                });
              });
            }
          })
          .then((response) => response.json())
          .then((data) => {
            console.log("Data saved:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  });
  //Innings Scores Save to server Button Ends

  //Partnership Scores Copy Button Start
  document.getElementById("partnerCopy").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: copyPartnershipDetails,
        },
        (results) => {
          console.log(" Results: partnerCopy :: ", results);
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            const partnership = results[0].result;
            chrome.storage.local.set(
              {
                partnership,
              },
              () => {
                console.log("partnership Detail saved:", partnership);
              }
            );
          }
        }
      );
    });
  });
  //Partnership Scores Copy Button Ends

  //partnership Scores Save to server Button Start
  document.getElementById("partnerSave").addEventListener("click", () => {
    const customId = document.getElementById("customId").value;
    const id = customId || "default-id";

    chrome.storage.local.get("partnership", (data) => {
      console.log("saved partnership data :: ", data);
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        const partnership = data.partnership || "";
        fetch(`http://localhost:8000/matches/${id}`)
          .then((response) => {
            if (response.status === 404) {
              // Entry not found, create new entry
              return fetch("http://localhost:8000/matches", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, ...partnership }),
              });
            } else {
              // Entry found, merge new data with existing data
              return response.json().then((existingData) => {
                const updatedData = { ...existingData, ...partnership };
                return fetch(`http://localhost:8000/matches/${id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedData),
                });
              });
            }
          })
          .then((response) => response.json())
          .then((data) => {
            console.log("Data saved:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  });
  //Partnership Scores Save to server Button Start

  // First Innings Commentaries Copy Button Start
  document.getElementById("commentaryCopyOne").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: copyMatchCommentary,
        },
        (results) => {
          console.log(" Results: copyMatchCommentary one :: ", results);
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            const commentaryOne = results[0].result;
            chrome.storage.local.set(
              {
                commentaryOne,
              },
              () => {
                console.log("commentary Detail saved:", commentaryOne);
              }
            );
          }
        }
      );
    });
  });
  //First Innings Commentaries Copy Button Ends
  //First Innings Commentaries Save to server Button Start
  document.getElementById("commentarySaveOne").addEventListener("click", () => {
    const customId = document.getElementById("customId").value;
    const id = customId || "default-id";

    chrome.storage.local.get("commentaryOne", (data) => {
      console.log("saved commentaryOne data :: ", data);
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        const commentaryOne = data.commentaryOne || "";
        fetch(`http://localhost:8000/matches/${id}`)
          .then((response) => {
            if (response.status === 404) {
              // Entry not found, create new entry
              return fetch("http://localhost:8000/matches", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id,
                  commentaryInnigsOne: [...commentaryOne],
                }),
              });
            } else {
              // Entry found, merge new data with existing data
              return response.json().then((existingData) => {
                const updatedData = {
                  ...existingData,
                  commentaryInnigsOne: [...commentaryOne],
                };
                return fetch(`http://localhost:8000/matches/${id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedData),
                });
              });
            }
          })
          .then((response) => response.json())
          .then((data) => {
            console.log("Data saved:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  });
  //First Innings Commentaries Save to server Button Ends

  // Second Innings Commentaries Copy Button Start
  document.getElementById("commentaryCopyTwo").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: copyMatchCommentary,
        },
        (results) => {
          console.log(" Results: copyMatchCommentary two :: ", results);
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            const commentaryTwo = results[0].result;
            chrome.storage.local.set(
              {
                commentaryTwo,
              },
              () => {
                console.log("commentary Detail saved:", commentaryTwo);
              }
            );
          }
        }
      );
    });
  });
  //Second Innings Commentaries Copy Button Ends

  //Second Innings Commentaries Save to server Button Start
  document.getElementById("commentarySaveTwo").addEventListener("click", () => {
    const customId = document.getElementById("customId").value;
    const id = customId || "default-id";

    chrome.storage.local.get("commentaryTwo", (data) => {
      console.log("saved commentaryTwo data :: ", data);
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        const commentaryTwo = data.commentaryTwo || "";
        fetch(`http://localhost:8000/matches/${id}`)
          .then((response) => {
            if (response.status === 404) {
              // Entry not found, create new entry
              return fetch("http://localhost:8000/matches", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id,
                  commentaryInnigsTwo: [...commentaryTwo],
                }),
              });
            } else {
              // Entry found, merge new data with existing data
              return response.json().then((existingData) => {
                const updatedData = {
                  ...existingData,
                  commentaryInnigsTwo: [...commentaryTwo],
                };
                return fetch(`http://localhost:8000/matches/${id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedData),
                });
              });
            }
          })
          .then((response) => response.json())
          .then((data) => {
            console.log("Data saved:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  });
  //Second Innings Commentaries Save to server Button Ends
});

function scrapeData() {
  const matchHeading = document.querySelector(
    ".ds-text-title-xs.ds-font-bold.ds-mb-2.ds-m-1"
  ).innerText;
  return matchHeading;
}

// Scrapping Data of Innings
function copyInningsDetails() {
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

  // console.log("First Inning Data Stored !!", firstInningsScore);
  // console.log(`
  // Convert following Batsmen name in English to Hindi, If you find acronymn in name like AK then hindi translation should have space between A and K in translated text

  // ${firstInningsScore.battingPlayers.join(", ")}

  // outcome should be JSON like {"batsmanHindi" : [{"hindi": "translated name in Hindi", ...}]}
  // `);
  // console.log(`
  // Convert following Bowlers name in English to Hindi, If you find acronymn in name like AK then hindi translation should have space between A and K in translated text

  // ${firstInningsScore.bowlingPlayers.join(", ")}

  // outcome should be JSON like {"bowlerHindi" : [{"hindi": "क्विंटन डी कॉक", ...}]}
  // `);
  // console.log(`
  // Convert following Do no bat Batsmen name in English to Hindi, If you find acronymn in name like AK then hindi translation should have space between A and K in translated text

  // ${firstInningsScore.doNotBatPlayersNames.join(", ")}

  // outcome should be JSON like {"doNotBatPlayersHindi" : [{"hindi": "क्विंटन डी कॉक", ...}]}
  // `);

  //

  console.log(`
  Translate the Players name in English to Hindi, follow the following instructions.

- 1st list of players will be of batsmen outcome should be JSON like {"batsmanHindi" : [{"hindi": "क्विंटन डी कॉक", ...}]}
- 2nd list of players will be of bowlers outcome should be JSON like {"bowlerHindi" : [{"hindi": "क्विंटन डी कॉक", ...}]}
- 3rd list of players will be of Do no bat Batsmen outcome should be JSON like {"doNotBatPlayersHindi" : [{"hindi": "क्विंटन डी कॉक", ...}]}
- All 3 listed outcome should be converted to single JSON. Output should be {
"batsmanHindi" : [{"hindi": "क्विंटन डी कॉक", ...}],
"bowlerHindi" : [{"hindi": "क्विंटन डी कॉक", ...}],
"doNotBatPlayersHindi" : [{"hindi": "क्विंटन डी कॉक", ...}]
}
- If you find acronymn in name like AK then hindi translation should have space between A and K in translated text

Below is the list of players
1) ${
    firstInningsScore.battingPlayers.length > 0
      ? firstInningsScore.battingPlayers.join(", ")
      : "-"
  }

2) ${
    firstInningsScore.bowlingPlayers.length > 0
      ? firstInningsScore.bowlingPlayers.join(", ")
      : "-"
  }

3) ${
    firstInningsScore.doNotBatPlayersNames.length > 0
      ? firstInningsScore.doNotBatPlayersNames.join(", ")
      : "-"
  }
  `);

  return firstInningsScore;
}

//Function Scrapping data of Partnership
function copyPartnershipDetails() {
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

  console.log(`
    Convert following Batting partnership info from English to Hindi, If you find acronymn in name like AK then hindi translation should have space between A and K in translated text
  
  ${[...partnershipsFirstInnings, ...partnershipsSecondInnings]
    .map((obj) => obj["Partnership Between"])
    .join(", ")}
  
  outcome should be JSON like {"partnershipHindi":[{"hindi": "क्विंटन डी कॉक", ...}]}
  
    `);

  return {
    partnership: [...partnershipsFirstInnings, ...partnershipsSecondInnings],
    partnershipBetween: [
      ...partnershipsFirstInnings,
      ...partnershipsSecondInnings,
    ].map((obj) => obj["Partnership Between"]),
  };
}

//Function for scrapping data of Commentaries
const copyMatchCommentary = async () => {
  let allData = [];
  const wideRegex = new RegExp("(wide$|leg bye$)");
  const noRunRegex = new RegExp("no run$");
  const outRegex = new RegExp("OUT$");
  const boundaryRegex = new RegExp("(SIX|FOUR) runs$");
  document
    .querySelectorAll("div.ds-hover-parent.ds-relative")
    .forEach((ele, ind) => {
      if (
        ele.childElementCount === 1 &&
        !!ele.querySelector("p.ci-html-content")
      ) {
        let overText = ele.children[0].children[0]
          .getElementsByTagName("span")[0]
          .textContent.split(".");
        let runsText =
          ele.children[0].children[0].getElementsByTagName("span")[1]
            .textContent;
        let quickText =
          ele.children[0].children[1].children[0].children[0].getElementsByTagName(
            "span"
          )[0].textContent;
        let ballcommentary =
          ele?.children[0]?.children[1]?.children[0]?.children[0]?.getElementsByClassName(
            "ci-html-content"
          )[0]?.textContent;

        let containsExtra = wideRegex.test(quickText) ? true : false;
        let containsWicket = outRegex.test(quickText) ? true : false;
        let containsBoundary = boundaryRegex.test(quickText) ? true : false;
        let dotBall = noRunRegex.test(quickText) ? true : false;
        let ballByBall = {};
        ballByBall["over"] = overText[0];
        ballByBall["ball"] = overText[1];
        ballByBall["who_to_who"] = quickText;
        ballByBall["batsman"] = quickText.split(",")[0].split(" to ")[1];
        ballByBall["bowler"] = quickText.split(",")[0].split(" to ")[0];
        ballByBall["ballcommentary"] = ballcommentary;
        ballByBall["iswicket"] = containsWicket;
        ballByBall["isboundary"] = containsBoundary;
        ballByBall["isExtraRun"] = containsExtra;
        ballByBall["runscored"] = containsWicket
          ? 0
          : dotBall
          ? 0
          : parseInt(runsText);
        ballByBall["battingteam"] = "";
        ballByBall["match_fk"] = "";
        ballByBall["innings"] = "";
        allData.push(ballByBall);
      }
    });
  console.log(allData);
  return allData;
};
