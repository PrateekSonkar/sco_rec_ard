function convertSlugToTitle(slug) {
  const parts = slug.split("-");
  const titleParts = parts.map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  });
  console.log(titleParts.join(" "));
  return titleParts.join(" ");
}

//function to create entries for table seriesdetalils execute it on https://www.espncricinfo.com/ci/engine/series/index.html?view=month
function parseMatchDetails(element) {
  const matchNoElement = element.querySelector(".match-no a");
  const matchNoText = matchNoElement.textContent;
  const matchNumber = matchNoText.trim().split(" ")[0]; // Get the second word, which should be the match number
  const venue = matchNoText.split(" at ")[1].split(" (")[0];
  const matchType = matchNoText.split(" (")[1]?.replace(")", "").trim(); // Remove spaces

  const team1 = element
    .querySelector(".innings-info-1")
    .childNodes[0].textContent.trim();
  const team2 = element
    .querySelector(".innings-info-2")
    .childNodes[0].textContent.trim();

  const matchDateText = element.querySelector(".match-info .bold").textContent;
  const matchDate = dayjs(matchDateText, "MMM DD, YYYY").format("MM/DD/YYYY"); // Format the date

  const blogSlug = `${team1.toLowerCase().replace(/ /g, "-")}-vs-${team2
    .toLowerCase()
    .replace(/ /g, "-")}-${matchNumber}-match-${dayjs(
    matchDate,
    "MM/DD/YYYY"
  ).format("DD-MMM-YYYY")}`; // Replace slashes with hyphens in the date

  const blogSlugForJSON = `${matchNumber}-match-${dayjs(
    matchDate,
    "MM/DD/YYYY"
  ).format("DD-MMM-YYYY")}-${team1.toLowerCase().replace(/ /g, "-")}-vs-${team2
    .toLowerCase()
    .replace(/ /g, "-")}`;

  const result = {
    matchnumber: parseInt(matchNumber),
    team1: team1,
    team2: team2,
    matchdate: matchDate,
    venue: venue,
    matchtype: matchType,
    blogslug: blogSlugForJSON,
  };

  return result;
}

let allMatches = [];
document.querySelectorAll(".default-match-block").forEach((ele, ind) => {
  const matchDetails = parseMatchDetails(ele);
  // console.log("matchDetails :: ", matchDetails);
  allMatches.push(matchDetails);
});

//document.querySelectorAll(".ds-text-tight-s.ds-font-regular.ds-leading-4.ds-text-typo-mid1")[0]?.querySelectorAll(".ds-popper-wrapper.ds-inline")

//function to get do not bat players
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
  console.log(doNotBatPlayers);
  // return doNotBatPlayers;
}

[index]?.querySelectorAll(".ds-popper-wrapper.ds-inline").forEach((ele) =>
  doNotBatPlayers.push({
    Batsman: ele.innerText
      .replaceAll(",", "")
      .replaceAll("†", "")
      .replaceAll("(c)", "")
      .trim(),
    Innings: index === 0 ? 1 : 2,
  })
);

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

/**
 * This function iterates over array1 and array2. For each pair of elements, it checks if the "over" and "ball" values are the same.
 * If they are, it replaces the element in array2 with the element from array1. The function returns the modified array2.
 * @param {*} array1
 * @param {*} array2
 * @returns
 */
function replaceElements(array1, array2) {
  array1.forEach((item1) => {
    array2.forEach((item2, index2) => {
      if (item1.over === item2.over && item1.ball === item2.ball) {
        array2[index2] = item1;
      }
    });
  });
  return array2;
}

let array1 = [
  /* your first array data */
];
let array2 = [
  /* your second array data */
];
let result = replaceElements(array1, array2);
console.log(result);

/**
 * Code to update batsman and bowler names in with full names
 */

a.map((obj) => ({
  ...obj,
  batsman: "Ashutosh Sharma",
  who_to_who: obj.who_to_who.replace("Sharma", "Ashutosh Sharma"),
}));

a.map((obj) => ({
  ...obj,
  bowler: "Ashutosh Sharma",
  who_to_who: obj.who_to_who.replace("Sharma", "Ashutosh Sharma"),
}));
