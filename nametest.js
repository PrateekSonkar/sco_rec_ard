const StringComparisons = require("string-comparisons");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

const JaroWrinker = StringComparisons.JaroWrinker;

function sortByKey(array, key) {
  return array.sort((a, b) => {
    if (a[key] < b[key]) {
      return -1;
    } else if (a[key] > b[key]) {
      return 1;
    } else {
      return 0;
    }
  });
}

function getSimilarityScores(
  nameToBeCompared,
  listOfNames,
  minPlayerNameLength,
  maxPlayerNameLength
) {
  let comparisionScore = listOfNames.map((name) => {
    console.log(
      "nameToBeCompared :: ",
      nameToBeCompared,
      "by name in list :: ",
      name,
      " => ",
      name.includes(nameToBeCompared)
    );
    if (name.includes(nameToBeCompared)) {
      return {
        name,
        score: JaroWrinker.similarity(nameToBeCompared, name),
        doesIncludes: name.includes(nameToBeCompared),
      };
    } else {
      let splittedName = nameToBeCompared.split(" ");
      //if splittedName[0] length equal to or less than min player name length
      if (splittedName[0].length <= minPlayerNameLength) {
        return {
          name,
          score: JaroWrinker.similarity(nameToBeCompared, name),
          doesIncludes: name.includes(splittedName[splittedName.length - 1]),
        };
      } else {
        return {
          name,
          score: JaroWrinker.similarity(nameToBeCompared, name),
          doesIncludes: name.includes(nameToBeCompared),
        };
      }
    }
  });
  return comparisionScore;
}

function getHighestScoreObject(array) {
  return array.reduce((max, obj) => (max.score > obj.score ? max : obj));
}

function mergeArrays(array1, array2, key) {
  return array1.map((item1) => {
    let item2 = array2.find(
      (item2) => item1[key] === item2[key] && item1.Innings === item2.Innings
    );
    return item2 ? { ...item1, ...item2 } : item1;
  });
}

function mergeLanguageArrays(arr1, arr2) {
  //   console.log("Arr1 :: ", arr1);
  //   console.log("Arr2 :: ", arr2);
  // Check if the arrays are of the same length
  if (arr1.length !== arr2.length) {
    console.error("The arrays do not have the same length.");
    return;
  }

  // Merge the arrays
  const mergedArray = arr1.map((item, index) => {
    return { ...item, ...arr2[index] };
  });

  return mergedArray;
}

function multiSort(dataArray, sortKeys, sortOrders) {
  return dataArray.sort((obj1, obj2) => {
    for (let i = 0; i < sortKeys.length; i++) {
      const key = sortKeys[i];
      const order = sortOrders[i].toLowerCase() === "asc" ? 1 : -1;

      // Handle different data types (numbers, strings) gracefully
      // console.log("obj1 :: ", obj1);
      // console.log("obj1[key] :: ", key, obj1[key]);

      // console.log("obj2 :: ", obj2);
      // console.log("obj2[key] :: ", key, obj2[key]);
      const value1 =
        typeof obj1[key] === "number" ? obj1[key] : obj1[key]?.toLowerCase();
      const value2 =
        typeof obj2[key] === "number" ? obj2[key] : obj2[key]?.toLowerCase();

      if (value1 !== value2) {
        return (value1 - value2) * order; // Ascending for positive, descending for negative
      }
    }
    // If all keys are equal, return 0 to maintain original order
    return 0;
  });
}

function findDuplicateBatsmen(data) {
  let duplicates = {};
  let seenNames = {};

  data.forEach((item) => {
    let lastName = item.Batsman.split(" ").pop();

    if (!seenNames[item.Innings]) {
      seenNames[item.Innings] = {};
    }

    if (seenNames[item.Innings][lastName]) {
      if (!duplicates[item.Innings]) {
        duplicates[item.Innings] = [];
      }
      if (
        !duplicates[item.Innings].includes(seenNames[item.Innings][lastName])
      ) {
        duplicates[item.Innings].push(seenNames[item.Innings][lastName]);
      }
      duplicates[item.Innings].push(item.Batsman);
    } else {
      seenNames[item.Innings][lastName] = item.Batsman;
    }
  });

  return duplicates;
}

function findDuplicateBowlers(data) {
  let duplicates = {};
  let seenNames = {};

  data.forEach((item) => {
    let lastName = item.Bowler.split(" ").pop();

    if (!seenNames[item.Innings]) {
      seenNames[item.Innings] = {};
    }

    if (seenNames[item.Innings][lastName]) {
      if (!duplicates[item.Innings]) {
        duplicates[item.Innings] = [];
      }
      if (
        !duplicates[item.Innings].includes(seenNames[item.Innings][lastName])
      ) {
        duplicates[item.Innings].push(seenNames[item.Innings][lastName]);
      }
      duplicates[item.Innings].push(item.Bowler);
    } else {
      seenNames[item.Innings][lastName] = item.Bowler;
    }
  });

  return duplicates;
}

function getGlobalCharacterExtremes(names) {
  let allWordLengths = [];

  // Collecting all word lengths from all names
  names.forEach((name) => {
    const words = name.split(" ");
    const wordLengths = words.map((word) => word.length);
    allWordLengths = allWordLengths.concat(wordLengths);
  });

  // Finding global max and min character counts across all names
  const maxCount = Math.max(...allWordLengths);
  const minCount = Math.min(...allWordLengths);

  return { max: maxCount, min: minCount };
}

function readAndParseJsonFile(fileName, outputDir) {
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const jsonData = JSON.parse(data);

    console.log(
      "Duplicate Batsmen :: ",
      findDuplicateBatsmen([...jsonData.batting, ...jsonData.doNotBatPlayers])
    );
    console.log(
      "Duplicate Bowlers :: ",
      findDuplicateBowlers([...jsonData.bowling])
    );

    jsonData.batting = mergeLanguageArrays(
      jsonData.batting,
      jsonData.batsmanHindi
    );
    jsonData.bowling = mergeLanguageArrays(
      jsonData.bowling,
      jsonData.bowlerHindi
    );
    jsonData.doNotBatPlayers = mergeLanguageArrays(
      jsonData.doNotBatPlayers,
      jsonData.doNotBatPlayersHindi
    );
    let allPlayers = [
      ...jsonData.batting.map((player) =>
        player.Batsman.replaceAll(",", "")
          .replaceAll("†", "")
          .replaceAll("(c)", "")
          .trim()
      ),
      ...jsonData.bowling.map((player) =>
        player.Bowler.replaceAll(",", "")
          .replaceAll("†", "")
          .replaceAll("(c)", "")
          .trim()
      ),
      ...jsonData.doNotBatPlayers.map((player) =>
        player.Batsman.replaceAll(",", "")
          .replaceAll("†", "")
          .replaceAll("(c)", "")
          .trim()
      ),
    ];
    allPlayers = [...new Set(allPlayers)];
    console.log("All Players :: ", allPlayers);
    let minCharCountPlayer = getGlobalCharacterExtremes(allPlayers).min;
    let maxCharCountPlayer = getGlobalCharacterExtremes(allPlayers).max;
    console.log("1st Innings Batsmen :: ", [
      ...new Set(
        jsonData.commentaryInnigsOne.map((commentary) => commentary.batsman)
      ),
    ]);
    console.log("1st Innings Bowlers :: ", [
      ...new Set(
        jsonData.commentaryInnigsOne.map((commentary) => commentary.bowler)
      ),
    ]);
    console.log("2nd Innings Batsmen :: ", [
      ...new Set(
        jsonData.commentaryInnigsTwo.map((commentary) => commentary.batsman)
      ),
    ]);
    console.log("2nd Innings Bowlers :: ", [
      ...new Set(
        jsonData.commentaryInnigsTwo.map((commentary) => commentary.bowler)
      ),
    ]);

    let modifiedCommentaryInnigsOne = jsonData.commentaryInnigsOne.map(
      (commentary) => {
        // console.log(
        //   "batsman :: modifiedCommentaryInnigsOne :: ",
        //   commentary.batsman
        // );
        let allScoresForBatsman = getSimilarityScores(
          commentary.batsman,
          [...allPlayers],
          minCharCountPlayer,
          maxCharCountPlayer
        );
        let ActualBatsman = "";
        if (allScoresForBatsman.filter((bat) => bat.doesIncludes).length > 0) {
          ActualBatsman = allScoresForBatsman.filter(
            (bat) => bat.doesIncludes
          )[0].name;
        } else {
          ActualBatsman = getHighestScoreObject(allScoresForBatsman).name;
        }
        // console.log("Actual Batsman :: ", ActualBatsman);

        console.log("bowler innings 1 :: ", commentary.bowler);
        let allScoresForBowler = getSimilarityScores(
          commentary.bowler,
          [...allPlayers],
          minCharCountPlayer,
          maxCharCountPlayer
        );
        let ActualBowler = "";
        if (allScoresForBowler.filter((bowl) => bowl.doesIncludes).length > 0) {
          ActualBowler = allScoresForBowler.filter(
            (bowl) => bowl.doesIncludes
          )[0].name;
        } else {
          ActualBowler = getHighestScoreObject(allScoresForBowler).name;
        }

        console.log("Actual Bowler innings 1 :: ", ActualBowler);
        delete commentary.ballcommentary;
        delete commentary.battingteam;
        delete commentary.match_fk;
        delete commentary.innings;
        return {
          ...commentary,
          ActualBatsman: ActualBatsman,
          ActualBowler: ActualBowler,
          battingTeam: jsonData.battingOrder[0].team,
          bowlingTeam: jsonData.bowlingOrder[0].team,
          battingTeamInHindi: jsonData.battingOrder[0].teamInHindi,
          bowlingTeamInHindi: jsonData.bowlingOrder[0].teamInHindi,
          Innings: 1,
          over_ball: Number(`${commentary.over}.${commentary.ball}`),
        };
      }
    );

    let modifiedCommentaryInnigsTwo = jsonData.commentaryInnigsTwo.map(
      (commentary) => {
        // console.log(
        //   "batsman :: modifiedCommentaryInnigsTwo :: ",
        //   commentary.batsman
        // );
        let allScoresForBatsman = getSimilarityScores(
          commentary.batsman,
          [...allPlayers],
          minCharCountPlayer,
          maxCharCountPlayer
        );
        //console.log("All Scores For Batsman :: ", allScoresForBatsman);
        let ActualBatsman = "";
        if (allScoresForBatsman.filter((bat) => bat.doesIncludes).length > 0) {
          ActualBatsman = allScoresForBatsman.filter(
            (bat) => bat.doesIncludes
          )[0].name;
        } else {
          ActualBatsman = getHighestScoreObject(allScoresForBatsman).name;
        }
        // console.log("Actual Batsman :: ", ActualBatsman);

        console.log("bowler innings 2 :: ", commentary.bowler);
        let allScoresForBowler = getSimilarityScores(
          commentary.bowler,
          [...allPlayers],
          minCharCountPlayer,
          maxCharCountPlayer
        );
        console.log("All Scores For Bowler :: ", allScoresForBowler);
        let ActualBowler = "";
        if (allScoresForBowler.filter((bowl) => bowl.doesIncludes).length > 0) {
          ActualBowler = allScoresForBowler.filter(
            (bowl) => bowl.doesIncludes
          )[0].name;
        } else {
          ActualBowler = getHighestScoreObject(allScoresForBowler).name;
        }

        console.log("Actual Bowler innings 2 :: ", ActualBowler);
        delete commentary.ballcommentary;
        delete commentary.battingteam;
        delete commentary.match_fk;
        delete commentary.innings;
        return {
          ...commentary,
          ActualBatsman: ActualBatsman,
          ActualBowler: ActualBowler,
          battingTeam: jsonData.battingOrder[1].team,
          bowlingTeam: jsonData.bowlingOrder[1].team,
          battingTeamInHindi: jsonData.battingOrder[1].teamInHindi,
          bowlingTeamInHindi: jsonData.bowlingOrder[1].teamInHindi,
          Innings: 2,
          over_ball: Number(`${commentary.over}.${commentary.ball}`),
        };
      }
    );

    let modifiedDataInning1 = JSON.stringify(
      modifiedCommentaryInnigsOne,
      null,
      2
    );
    //fs.writeFileSync("modifiedCommentaryInnigsOne.json", modifiedDataInning1);
    let modifiedDataInning2 = JSON.stringify(
      modifiedCommentaryInnigsTwo,
      null,
      2
    );
    //fs.writeFileSync("modifiedCommentaryInnigsTwo.json", modifiedDataInning2);
    //let allScores = getSimilarityScores("UT Yadav", [...allPlayers]);
    const commentaryCSVParser = new Parser({
      fields: [
        "over",
        "ball",
        "who_to_who",
        "batsman",
        "bowler",
        "iswicket",
        "isboundary",
        "isExtraRun",
        "runscored",
        "ActualBatsman",
        "ActualBowler",
        "battingTeam",
        "bowlingTeam",
        "over_ball",
      ],
    });
    let allCommentary = [
      ...modifiedCommentaryInnigsOne,
      ...modifiedCommentaryInnigsTwo,
    ];
    let allBatsmen = [
      ...new Set(allCommentary.map((commentary) => commentary.ActualBatsman)),
    ];
    let allBowlers = [
      ...new Set(allCommentary.map((commentary) => commentary.ActualBowler)),
    ];

    console.log("Unique Batsmen :: ", allBatsmen);
    console.log("Unique Bowlers :: ", allBowlers);

    let enrichedBatsmen = allBatsmen.map((batsman) => {
      let batsmanInnings = allCommentary.filter(
        (commentary) => commentary.ActualBatsman === batsman
      );

      let sixesByBatsman = batsmanInnings.filter(
        (commentary) =>
          commentary.isboundary === true && commentary.runscored >= 6
      );
      let foursByBatsman = batsmanInnings.filter(
        (commentary) =>
          commentary.isboundary === true &&
          commentary.runscored >= 4 &&
          commentary.runscored < 6
      );
      let lastBallWithoutBoundary = sortByKey(
        batsmanInnings,
        "over_ball"
      ).filter(
        (commentary) =>
          commentary.isboundary === false &&
          commentary.iswicket === false &&
          commentary.isExtraRun === false &&
          commentary.runscored > 0
      );

      let lastBoundaryBall = batsmanInnings.filter(
        (commentary) => commentary.isboundary === true
      );

      return {
        Batsman: batsman,
        Innings: batsmanInnings[0].Innings,
        Team: batsmanInnings[0].battingTeam,
        TeamHindi: batsmanInnings[0].battingTeamInHindi,
        lastBallfaced: batsmanInnings.length
          ? sortByKey(batsmanInnings, "over_ball")[batsmanInnings.length - 1]
              ?.over_ball
          : -1,
        lastBallToSix: sixesByBatsman.length
          ? sortByKey(sixesByBatsman, "over_ball")[sixesByBatsman.length - 1]
              ?.over_ball
          : -1,
        lastBallToFour: foursByBatsman.length
          ? sortByKey(foursByBatsman, "over_ball")[foursByBatsman.length - 1]
              .over_ball
          : -1,
        lastBallToBoundary:
          lastBoundaryBall.length > 0
            ? sortByKey(lastBoundaryBall, "over_ball")[
                lastBoundaryBall.length - 1
              ].over_ball
            : -1,
        lastBallWithoutBoundary: lastBallWithoutBoundary.length
          ? sortByKey(lastBallWithoutBoundary, "over_ball")[
              lastBallWithoutBoundary.length - 1
            ].over_ball
          : -1,

        //batsmanInnings,
        // batsmanInningsWithoutBoundary: sortByKey(
        //   batsmanInnings,
        //   "over_ball"
        // ).filter(
        //   (commentary) =>
        //     commentary.isboundary === false &&
        //     commentary.iswicket === false &&
        //     commentary.isExtraRun === false &&
        //     commentary.runscored > 0
        // ),
        //sixesByBatsman,
        //foursByBatsman,
      };
    });

    let enrichedBowler = allBowlers.map((bowler) => {
      let bowlersInnings = allCommentary.filter(
        (commentary) => commentary.ActualBowler === bowler
      );
      let wicketsByBowler = bowlersInnings.filter(
        (commentary) => commentary.iswicket === true
      );
      let dotBallByBowler = bowlersInnings.filter(
        (commentary) => commentary.runscored === 0
      );
      let sixesByBowler = bowlersInnings.filter(
        (commentary) =>
          commentary.isboundary === true && commentary.runscored >= 6
      );
      let foursByBowler = bowlersInnings.filter(
        (commentary) =>
          commentary.isboundary === true &&
          commentary.runscored >= 4 &&
          commentary.runscored < 6
      );
      let extraRunsByBowler = bowlersInnings.filter(
        (commentary) => commentary.isExtraRun === true
      );
      let boundaryByBowler = bowlersInnings.filter(
        (commentary) => commentary.isboundary === true
      );
      let bowlerWithoutBoundary = bowlersInnings.filter(
        (commentary) =>
          commentary.isboundary === false &&
          commentary.runscored > 0 &&
          commentary.isExtraRun === false &&
          commentary.iswicket === false
      );
      return {
        Bowler: bowler,
        Innings: bowlersInnings[0].Innings,
        Team: bowlersInnings[0].bowlingTeam,
        TeamHindi: bowlersInnings[0].bowlingTeamInHindi,
        lastBallByBowler: bowlersInnings.length
          ? sortByKey(bowlersInnings, "over_ball")[bowlersInnings.length - 1]
              .over_ball
          : -1,
        lastBallOfWickets: wicketsByBowler.length
          ? sortByKey(wicketsByBowler, "over_ball")[wicketsByBowler.length - 1]
              .over_ball
          : -1,
        lastDotBallByBowler: dotBallByBowler.length
          ? sortByKey(dotBallByBowler, "over_ball")[dotBallByBowler.length - 1]
              .over_ball
          : -1,
        lastBallToSixes: sixesByBowler.length
          ? sortByKey(sixesByBowler, "over_ball")[sixesByBowler.length - 1]
              .over_ball
          : -1,
        lastBallToFours: foursByBowler.length
          ? sortByKey(foursByBowler, "over_ball")[foursByBowler.length - 1]
              .over_ball
          : -1,
        lastBallToExtraRuns: extraRunsByBowler.length
          ? sortByKey(extraRunsByBowler, "over_ball")[
              extraRunsByBowler.length - 1
            ].over_ball
          : -1,
        lastBallToBoundary: boundaryByBowler.length
          ? sortByKey(boundaryByBowler, "over_ball")[
              boundaryByBowler.length - 1
            ].over_ball
          : -1,
        lastBallWithoutBoundary: bowlerWithoutBoundary.length
          ? sortByKey(bowlerWithoutBoundary, "over_ball")[
              bowlerWithoutBoundary.length - 1
            ].over_ball
          : -1,
      };
    });

    let mergedArrayBatsmen = mergeArrays(
      jsonData.batting,
      enrichedBatsmen,
      "Batsman"
    );

    let mergedArrayBowlers = mergeArrays(
      jsonData.bowling,
      enrichedBowler,
      "Bowler"
    );
    //console.log("Merged Bowlers :: ", mergedArrayBowlers);
    //console.log("Merged Batsmen :: ", mergedArrayBatsmen);

    /**
     * Batting Stats Starts
     */

    // Strike Rate
    let playerByStrikeRate = multiSort(
      mergedArrayBatsmen.filter((obj) => obj["Strike Rate"] > 0),
      ["Strike Rate", "Innings", "lastBallfaced"],
      ["desc", "asc", "asc"]
    );
    const playerByStrikeRateParserEnglish = new Parser({
      fields: ["Batsman", "Team", "Strike Rate", "Innings", "lastBallfaced"],
    });
    const playerByStrikeRateCSVEnglish =
      playerByStrikeRateParserEnglish.parse(playerByStrikeRate);

    const playerByStrikeRateParserHindi = new Parser({
      fields: ["hindi", "TeamHindi", "Strike Rate", "Innings", "lastBallfaced"],
    });
    const playerByStrikeRateCSVHindi =
      playerByStrikeRateParserHindi.parse(playerByStrikeRate);

    //Runs
    const playerByRuns = multiSort(
      mergedArrayBatsmen.filter((obj) => obj["Runs Scored"] > 0),
      ["Runs Scored", "Innings", "lastBallfaced"],
      ["desc", "asc", "asc"]
    );
    const playerByRunsParserEnglish = new Parser({
      fields: ["Batsman", "Team", "Runs Scored", "Innings", "lastBallfaced"],
    });
    const playerByRunsCSVEnglish =
      playerByRunsParserEnglish.parse(playerByRuns);

    const playerByRunsParserHindi = new Parser({
      fields: ["hindi", "TeamHindi", "Runs Scored", "Innings", "lastBallfaced"],
    });
    const playerByRunsCSVHindi = playerByRunsParserHindi.parse(playerByRuns);
    //Sixes
    let playerBySixes = multiSort(
      mergedArrayBatsmen.filter((obj) => obj["6s by Batsman"] !== 0),
      ["6s by Batsman", "Innings", "lastBallToSix"],
      ["desc", "asc", "asc"]
    );
    const playerBySixesParserEnglish = new Parser({
      fields: ["Batsman", "Team", "6s by Batsman", "Innings", "lastBallToSix"],
    });

    const playerBySixesCSVEnglish =
      playerBySixesParserEnglish.parse(playerBySixes);
    const playerBySixesParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "6s by Batsman",
        "Innings",
        "lastBallToSix",
      ],
    });

    const playerBySixesCSVHindi = playerBySixesParserHindi.parse(playerBySixes);

    //Fours
    const playerByFours = multiSort(
      mergedArrayBatsmen.filter((obj) => obj["4s by Batsman"] !== 0),
      ["4s by Batsman", "Innings", "lastBallToFour"],
      ["desc", "asc", "asc"]
    );
    const playerByFoursParserEnglish = new Parser({
      fields: ["Batsman", "Team", "4s by Batsman", "Innings", "lastBallToFour"],
    });
    const playerByFoursCSVEnglish =
      playerByFoursParserEnglish.parse(playerByFours);
    const playerByFoursParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "4s by Batsman",
        "Innings",
        "lastBallToFour",
      ],
    });
    const playerByFoursCSVHindi = playerByFoursParserHindi.parse(playerByFours);
    //Ball Faced
    const playerByBallFaced = multiSort(
      mergedArrayBatsmen.filter((obj) => obj["Balls Faced"] !== 0),
      ["Balls Faced", "Innings", "lastBallfaced"],
      ["desc", "asc", "asc"]
    );
    const playerByBallFacedParserEnglish = new Parser({
      fields: ["Batsman", "Team", "Balls Faced", "Innings", "lastBallfaced"],
    });
    const playerByBallFacedCSVEnglish =
      playerByBallFacedParserEnglish.parse(playerByBallFaced);
    const playerByBallFacedParserHindi = new Parser({
      fields: ["hindi", "TeamHindi", "Balls Faced", "Innings", "lastBallfaced"],
    });
    const playerByBallFacedCSVHindi =
      playerByBallFacedParserHindi.parse(playerByBallFaced);
    //Most Aggressive Batsmen (By 6s & 4s - Descending)
    const playerByAggByBoundary = multiSort(
      mergedArrayBatsmen.filter((obj) => obj["Runs from Boundary"] !== 0),
      ["Runs from Boundary", "Innings", "lastBallToBoundary"],
      ["desc", "asc", "asc"]
    );
    const playerByAggByBoundaryParserEnglish = new Parser({
      fields: [
        "Batsman",
        "Team",
        "Runs from Boundary",
        "Innings",
        "lastBallToBoundary",
      ],
    });
    const playerByAggByBoundaryCSVEnglish =
      playerByAggByBoundaryParserEnglish.parse(playerByAggByBoundary);
    const playerByAggByBoundaryParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Runs from Boundary",
        "Innings",
        "lastBallToBoundary",
      ],
    });
    const playerByAggByBoundaryCSVHindi =
      playerByAggByBoundaryParserHindi.parse(playerByAggByBoundary);

    //By Runs Scored (Excluding 6s & 4s) - Descending
    const playerByAggWithoutBoundary = multiSort(
      mergedArrayBatsmen.filter((obj) => obj["Runs not from boundary"] !== 0),
      ["Runs not from boundary", "Innings", "lastBallWithoutBoundary"],
      ["desc", "asc", "asc"]
    );
    const playerByAggWithoutBoundaryParserEnglish = new Parser({
      fields: [
        "Batsman",
        "Team",
        "Runs not from boundary",
        "Innings",
        "lastBallWithoutBoundary",
      ],
    });
    const playerByAggWithoutBoundaryCSVEnglish =
      playerByAggWithoutBoundaryParserEnglish.parse(playerByAggWithoutBoundary);
    const playerByAggWithoutBoundaryParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Runs not from boundary",
        "Innings",
        "lastBallWithoutBoundary",
      ],
    });
    const playerByAggWithoutBoundaryCSVHindi =
      playerByAggWithoutBoundaryParserHindi.parse(playerByAggWithoutBoundary);

    const csvDataBatting = `
Batsmen By Strike Rate (Highest to Lowest)
${playerByStrikeRateCSVEnglish}

Run Scorers (Highest to Lowest)
${playerByRunsCSVEnglish}

Batsmen By Sixes Hits (Most to Least)
${playerBySixesCSVEnglish}

Batsmen By Fours Hits (Most to Least)
${playerByFoursCSVEnglish}

Batsmen By Balls Faced (Most to Least)
${playerByBallFacedCSVEnglish}

Most Aggressive Batsmen (By 6s & 4s - Most to Least)
${playerByAggByBoundaryCSVEnglish}

Batsmen By Runs Scored (Excluding 6s & 4s - Most to Least)
${playerByAggWithoutBoundaryCSVEnglish}

स्ट्राइक रेट के अनुसार बल्लेबाज (उच्चतम से न्यूनतम)
${playerByStrikeRateCSVHindi}

रन बनाने वाले बल्लेबाज (अधिक से कम)
${playerByRunsCSVHindi}

छक्के मारने वाले बल्लेबाज (अधिक से कम)
${playerBySixesCSVHindi}

चौके मारने वाले बल्लेबाज (अधिक से कम)
${playerByFoursCSVHindi}

गेंदों का सामना करने वाले बल्लेबाज (अधिक से कम)
${playerByBallFacedCSVHindi}

बाउंड्री के द्वारा रन बनाने वाले बल्लेबाज (अधिक से कम)
${playerByAggByBoundaryCSVHindi}

बाउंड्री के बिना रन बनाने वाले बल्लेबाज (अधिक से कम)
${playerByAggWithoutBoundaryCSVHindi}
              `;
    const outputPathBatting = path.join(outputDir, "batting.csv");
    fs.writeFileSync(outputPathBatting, csvDataBatting);

    /**
     * Bowling Stats Starts
     */

    //Economy Rate
    const playerByEconRate = multiSort(
      mergedArrayBowlers.filter((obj) => obj["Economy Rate"] !== 0),
      ["Economy Rate", "Innings", "lastBallByBowler"],
      ["asc", "asc", "asc"]
    );
    const playerByEconRateParserEnglish = new Parser({
      fields: ["Bowler", "Team", "Economy Rate", "Innings", "lastBallByBowler"],
    });
    const playerByEconRateCSVEnglish =
      playerByEconRateParserEnglish.parse(playerByEconRate);
    const playerByEconRateParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Economy Rate",
        "Innings",
        "lastBallByBowler",
      ],
    });
    const playerByEconRateCSVHindi =
      playerByEconRateParserHindi.parse(playerByEconRate);
    // Wicktes
    const playerByWicketsTaken = multiSort(
      mergedArrayBowlers.filter((obj) => obj["Wickets Taken"] !== 0),
      ["Wickets Taken", "Innings", "lastBallOfWickets"],
      ["desc", "asc", "asc"]
    );
    const playerByWicketsTakenParserEnglish = new Parser({
      fields: [
        "Bowler",
        "Team",
        "Wickets Taken",
        "Innings",
        "lastBallOfWickets",
      ],
    });
    const playerByWicketsTakenCSVEnglish =
      playerByWicketsTakenParserEnglish.parse(playerByWicketsTaken);
    const playerByWicketsTakenParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Wickets Taken",
        "Innings",
        "lastBallOfWickets",
      ],
    });
    const playerByWicketsTakenCSVHindi =
      playerByWicketsTakenParserHindi.parse(playerByWicketsTaken);
    //Dot Balls Bowled
    const playerByDotBalls = multiSort(
      mergedArrayBowlers.filter((obj) => obj["Dot Balls"] !== 0),
      ["Dot Balls", "Innings", "lastDotBallByBowler"],
      ["desc", "asc", "asc"]
    );
    const playerByDotBallsParserEnglish = new Parser({
      fields: ["Bowler", "Team", "Dot Balls", "Innings", "lastDotBallByBowler"],
    });
    const playerByDotBallsCSVEnglish =
      playerByDotBallsParserEnglish.parse(playerByDotBalls);
    const playerByDotBallsParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Dot Balls",
        "Innings",
        "lastDotBallByBowler",
      ],
    });
    const playerByDotBallsCSVHindi =
      playerByDotBallsParserHindi.parse(playerByDotBalls);
    //Most Expensive for Sixes
    const bowlersBySixes = multiSort(
      mergedArrayBowlers.filter((obj) => obj["Sixes Conceded"] !== 0),
      ["Sixes Conceded", "Innings", "lastBallToSixes"],
      ["desc", "asc", "asc"]
    );
    const bowlersBySixesParserEnglish = new Parser({
      fields: [
        "Bowler",
        "Team",
        "Sixes Conceded",
        "Innings",
        "lastBallToSixes",
      ],
    });
    const bowlersBySixesCSVEnglish =
      bowlersBySixesParserEnglish.parse(bowlersBySixes);
    const bowlersBySixesParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Sixes Conceded",
        "Innings",
        "lastBallToSixes",
      ],
    });
    const bowlersBySixesCSVHindi =
      bowlersBySixesParserHindi.parse(bowlersBySixes);

    //Most Expensive for Fours
    const bowlerByMostFours = multiSort(
      mergedArrayBowlers.filter((obj) => obj["Fours Conceded"] !== 0),
      ["Fours Conceded", "Innings", "lastBallToFours"],
      ["desc", "asc", "asc"]
    );
    const bowlerByMostFoursParserEnglish = new Parser({
      fields: [
        "Bowler",
        "Team",
        "Fours Conceded",
        "Innings",
        "lastBallToFours",
      ],
    });
    const bowlerByMostFoursCSVEnglish =
      bowlerByMostFoursParserEnglish.parse(bowlerByMostFours);

    const bowlerByMostFoursParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Fours Conceded",
        "Innings",
        "lastBallToFours",
      ],
    });
    const bowlerByMostFoursCSVHindi =
      bowlerByMostFoursParserHindi.parse(bowlerByMostFours);
    //By Extras (Wides & No Balls)
    const bowlerByExtra = multiSort(
      mergedArrayBowlers.filter(
        (obj) => obj["Extra Runs Conceded (Wides & No Balls)"] !== 0
      ),
      [
        "Extra Runs Conceded (Wides & No Balls)",
        "Innings",
        "lastBallToExtraRuns",
      ],
      ["desc", "asc", "asc"]
    );
    const bowlerByExtraParserEnglish = new Parser({
      fields: [
        "Bowler",
        "Team",
        "Extra Runs Conceded (Wides & No Balls)",
        "Innings",
        "lastBallToExtraRuns",
      ],
    });
    const bowlerByExtraCSVEnglish =
      bowlerByExtraParserEnglish.parse(bowlerByExtra);
    const bowlerByExtraParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Extra Runs Conceded (Wides & No Balls)",
        "Innings",
        "lastBallToExtraRuns",
      ],
    });
    const bowlerByExtraCSVHindi = bowlerByExtraParserHindi.parse(bowlerByExtra);

    //Most Expensive for Boundaries
    const bowlerRunsByBoundaries = multiSort(
      mergedArrayBowlers.filter(
        (obj) => obj["Runs from Boundary Conceded"] !== 0
      ),
      ["Runs from Boundary Conceded", "Innings", "lastBallToBoundary"],
      ["desc", "asc", "asc"]
    );
    const bowlerRunsByBoundariesParserEnglish = new Parser({
      fields: [
        "Bowler",
        "Team",
        "Runs from Boundary Conceded",
        "Innings",
        "lastBallToBoundary",
      ],
    });
    const bowlerRunsByBoundariesCSVEnglish =
      bowlerRunsByBoundariesParserEnglish.parse(bowlerRunsByBoundaries);
    const bowlerRunsByBoundariesParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Runs from Boundary Conceded",
        "Innings",
        "lastBallToBoundary",
      ],
    });
    const bowlerRunsByBoundariesCSVHindi =
      bowlerRunsByBoundariesParserHindi.parse(bowlerRunsByBoundaries);

    //Runs Conceded (Excluding Boundaries)
    const bowlerRunsWithoutBoundaries = multiSort(
      mergedArrayBowlers.filter(
        (obj) => obj["Runs not from boundary Conceded"] !== 0
      ),
      ["Runs not from boundary Conceded", "Innings", "lastBallWithoutBoundary"],
      ["desc", "asc", "asc"]
    );
    const bowlerRunsWithoutBoundariesParserEnglish = new Parser({
      fields: [
        "Bowler",
        "Team",
        "Runs not from boundary Conceded",
        "Innings",
        "lastBallWithoutBoundary",
      ],
    });
    const bowlerRunsWithoutBoundariesCSVEnglish =
      bowlerRunsWithoutBoundariesParserEnglish.parse(
        bowlerRunsWithoutBoundaries
      );

    const bowlerRunsWithoutBoundariesParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Runs not from boundary Conceded",
        "Innings",
        "lastBallWithoutBoundary",
      ],
    });
    const bowlerRunsWithoutBoundariesCSVHindi =
      bowlerRunsWithoutBoundariesParserHindi.parse(bowlerRunsWithoutBoundaries);

    const csvDataBowling = `
Bowlers By Economy Rate (Lowest to Highest)
${playerByEconRateCSVEnglish}

Bowlers By Wickets Taken (Most to Least)
${playerByWicketsTakenCSVEnglish}

Bowlers By Dot Balls Bowled (Most to Least)
${playerByDotBallsCSVEnglish}

Most Expensive Bowler for Sixes (Most to Least)
${bowlersBySixesCSVEnglish}

Most Expensive Bowler for Fours (Most to Least)
${bowlerByMostFoursCSVEnglish}

Bowlers Run Conceded By Wides & No Balls (Most to Least)
${bowlerByExtraCSVEnglish}

Bowlers Run Conceded By Boundaries (Most to Least)
${bowlerRunsByBoundariesCSVEnglish}

Bowlers Runs Conceded without Boundaries (Most to Least)
${bowlerRunsWithoutBoundariesCSVEnglish}

गेंदबाजों द्वारा इकोनॉमी रेट (न्यूनतम से अधिकतम)
${playerByEconRateCSVHindi}

विकेट लेने वाले गेंदबाज (अधिक से कम)
${playerByWicketsTakenCSVHindi}

डॉट बॉल्स फेंकने वाले गेंदबाज (अधिक से कम)
${playerByDotBallsCSVHindi}

छक्के देने वाले सबसे महंगे गेंदबाज (अधिक से कम)
${bowlersBySixesCSVHindi}

चौके देने वाले सबसे महंगे गेंदबाज (अधिक से कम)
${bowlerByMostFoursCSVHindi}

वाइड्स और नो बॉल्स से रन देने वाले गेंदबाज (अधिक से कम)
${bowlerByExtraCSVHindi}

बाउंड्री से रन देने वाले गेंदबाज (अधिक से कम)
${bowlerRunsByBoundariesCSVHindi}

बाउंड्री के बिना रन देने वाले गेंदबाज (अधिक से कम)
${bowlerRunsWithoutBoundariesCSVHindi}
      `;
    const outputPathBowling = path.join(outputDir, "bowling.csv");
    fs.writeFileSync(outputPathBowling, csvDataBowling);

    /**
     * Partnership Stats Starts
     */

    const partnership = mergeLanguageArrays(
      jsonData.partnership,
      jsonData.partnershipHindi
    ).map((player) => ({
      ...player,
      Team:
        player.Innings === 1
          ? jsonData.battingOrder[0].team
          : jsonData.battingOrder[1].team,
      TeamHindi:
        player.Innings === 1
          ? jsonData.battingOrder[0].teamInHindi
          : jsonData.battingOrder[1].teamInHindi,
      "Impact Partnership": Number(
        Number(
          (player["Total Runs"] / player["Total Balls Faced"]) * 100
        ).toFixed(2)
      ),
    }));

    //Partnership By Runs Contribution (Highest to Lowest)
    const partershipByRunContribution = multiSort(
      partnership.filter((batsmen) => batsmen["Total Runs"] !== 0),
      ["Total Runs", "Innings", "Sequence"],
      ["desc", "asc", "asc"]
    );
    const partershipByRunContributionParserEnglish = new Parser({
      fields: [
        "Partnership Between",
        "Team",
        "Total Runs",
        "Innings",
        "Sequence",
      ],
    });
    const partershipByRunContributionCSVEnglish =
      partershipByRunContributionParserEnglish.parse(
        partershipByRunContribution
      );
    const partershipByRunContributionParserHindi = new Parser({
      fields: ["hindi", "TeamHindi", "Total Runs", "Innings", "Sequence"],
    });
    const partershipByRunContributionCSVHindi =
      partershipByRunContributionParserHindi.parse(partershipByRunContribution);

    //Partnership By Ball Played (Highest to Lowest)
    const partershipByBallPlayed = multiSort(
      partnership.filter((batsmen) => batsmen["Total Balls Faced"] !== 0),
      ["Total Balls Faced", "Innings", "Sequence"],
      ["desc", "asc", "asc"]
    );

    const partershipByBallPlayedParserEnglish = new Parser({
      fields: [
        "Partnership Between",
        "Team",
        "Total Balls Faced",
        "Innings",
        "Sequence",
      ],
    });
    const partershipByBallPlayedCSVEnglish =
      partershipByBallPlayedParserEnglish.parse(partershipByBallPlayed);
    const partershipByBallPlayedParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Total Balls Faced",
        "Innings",
        "Sequence",
      ],
    });
    const partershipByBallPlayedCSVHindi =
      partershipByBallPlayedParserHindi.parse(partershipByBallPlayed);

    //Partnership By Impact (Highest to Lowest) "Impact Partnership"
    const partershipByImpact = multiSort(
      partnership.filter((batsmen) => batsmen["Impact Partnership"] !== 0),
      ["Impact Partnership", "Innings", "Sequence"],
      ["desc", "asc", "asc"]
    );
    const partershipByImpactParserEnglish = new Parser({
      fields: [
        "Partnership Between",
        "Team",
        "Impact Partnership",
        "Innings",
        "Sequence",
      ],
    });
    const partershipByImpactCSVEnglish =
      partershipByImpactParserEnglish.parse(partershipByImpact);

    const partershipByImpactParserHindi = new Parser({
      fields: [
        "hindi",
        "TeamHindi",
        "Impact Partnership",
        "Innings",
        "Sequence",
      ],
    });
    const partershipByImpactCSVHindi =
      partershipByImpactParserHindi.parse(partershipByImpact);

    const csvDataPartnership = `
Partnership By Runs Contribution (Highest to Lowest)
${partershipByRunContributionCSVEnglish}

Partnership By Ball Played (Highest to Lowest)
${partershipByBallPlayedCSVEnglish}

Partnership Strike Rate (Highest to Lowest)
${partershipByImpactCSVEnglish}

रन योगदान के अनुसार साझेदारी (उच्चतम से न्यूनतम)
${partershipByRunContributionCSVHindi}

गेंदों का सामना करने वाली साझेदारियां (अधिक से कम)
${partershipByBallPlayedCSVHindi}

साझेदारी स्ट्राइक रेट (उच्चतम से न्यूनतम)
${partershipByImpactCSVHindi}
            `;
    const outputPathPartnership = path.join(outputDir, "partnership.csv");
    fs.writeFileSync(outputPathPartnership, csvDataPartnership);

    const allCommentaryToCSV = commentaryCSVParser.parse(allCommentary);
    const outputPathCommantary = path.join(outputDir, "commentary.csv");
    //fs.writeFileSync(outputPathCommantary, allCommentaryToCSV);
  });
}

readAndParseJsonFile(
  "32nd-match-17-Apr-2024-gujarat-titans-vs-delhi-capitals.json",
  "./2024/March/IPL/32nd-match-17-Apr-2024-gujarat-titans-vs-delhi-capitals"
);
