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
      .replace(/ /g, "-")}-${matchNumber}-match-${dayjs(
      matchDate,
      "MM/DD/YYYY"
    ).format("DD-MMM-YYYY")}`; // Replace slashes with hyphens in the date

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

function convertSlugToTitle(slug) {
  const parts = slug.split("-");
  const titleParts = parts.map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  });
  return titleParts.join(" ");
}

function sortByKey(array, key, ascending = true) {
  return array.sort((a, b) => {
    if (a[key] < b[key]) {
      return ascending ? -1 : 1;
    } else if (a[key] > b[key]) {
      return ascending ? 1 : -1;
    } else {
      return 0;
    }
  });
}

// const sortedArrayAsc = sortByKey(array, 'age', true); // Sorts in ascending order
// const sortedArrayDesc = sortByKey(array, 'age', false); // Sorts in descending order

// {
//   "Innings": 2,
//   "Batsman": "Harpreet Brar ",
//   "Runs Scored": 2,
//   "Balls Faced": 2,
//   "4s by Batsman": 0,
//   "6s by Batsman": 0,
//   "Strike Rate": 100,
//   "Total Boundary": 0,
//   "Runs from Boundary": 0,
//   "Runs not from boundary": 2
// }
