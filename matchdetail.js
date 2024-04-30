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
)[4].childNodes[0].childNodes[0].textContent;
const TossWonByAndDecision = document.querySelectorAll(
  ".ds-w-full.ds-table.ds-table-sm.ds-table-auto.ds-border-line"
)[4].childNodes[0].childNodes[1].childNodes[1].textContent;
const FirstInningsScore = document.querySelectorAll(
  ".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo.ds-mb-1"
)[0].childNodes[1].textContent;
const SecondInningsScore = document.querySelectorAll(
  ".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo.ds-mb-1"
)[1].childNodes[1].textContent;

console.log(
  `Series Name : ${SeriesName} \nMatch Between : ${MatchBetween} \nMatch Number : ${MatchNumber}\nMatch Type : ${MatchType} \nMatch Date : ${MatchDate} \nVenue : ${Venue} \nToss Won By And Decision : ${TossWonByAndDecision}\nFirst Innings Score : ${FirstInningsScore}\nSecond Innings Score : ${SecondInningsScore}\nMatch Winner : ${MatchWinner}`
);
