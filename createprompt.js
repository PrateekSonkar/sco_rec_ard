const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");

function createprompt(fileName, outputDir) {
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const jsonData = JSON.parse(data);
    const battingCSVParser = new Parser({
      fields: [
        "Innings",
        "Batsman",
        "Runs Scored",
        "Balls Faced",
        "4s by Batsman",
        "6s by Batsman",
        "Strike Rate",
        "Total Boundary",
        "Runs from Boundary",
        "Runs not from boundary",
      ],
    });
    const bowlingCSVParser = new Parser({
      fields: [
        "Innings",
        "Bowler",
        "Overs Bowled",
        "Maidens Bowled",
        "Runs Conceded",
        "Wickets Taken",
        "Economy Rate",
        "Dot Balls",
        "Fours Conceded",
        "Sixes Conceded",
        "Wides",
        "No Balls",
        "Total Boundaries Conceded",
        "Runs from Boundary Conceded",
        "Runs not from boundary Conceded",
        "Extra Runs Conceded (Wides & No Balls)",
      ],
    });
    const fowCSVParser = new Parser({
      fields: [
        "Innings",
        "Wicket Number",
        "Over And Ball",
        "At Runs",
        "Dismissed Player Name",
      ],
    });
    const partnershipCSVParser = new Parser({
      fields: [
        "Innings",
        "Player1 Name",
        "Player1 Balls Faced",
        "Player1 Runs",
        "Player2 Name",
        "Player2 Balls Faced",
        "Player2 Runs",
        "Total Balls Faced",
        "Total Runs",
        "Partnership Between",
      ],
    });

    let battingCSV = battingCSVParser.parse(jsonData.batting);
    let bowlingCSV = bowlingCSVParser.parse(jsonData.bowling);
    let fowCSV = fowCSVParser.parse(jsonData.fallofwickets);
    let partnershipCSV = partnershipCSVParser.parse(jsonData.partnership);

    const outputPathBatting = path.join(outputDir, "prompt.txt");
    //fs.writeFileSync(outputPathBatting, csvDataBatting);
    fs.writeFileSync(
      outputPathBatting,
      `
You are the Technical writer and public speaker. You have to analyze the data which I will provide to you and write a technical blog post based on your analysis of data. Blog should have an Introduction and Conclusion section. In case of multiple paragraphs in a section, give heading to paragraph. Include a paragraph for Man of the match mentioning bowling and batting performance. Blog Post should be SEO friendly. Content of the blog should be engaging with a good amount of perplexity and burstiness. Also propose 10 titles for the blog post.
Below are the details of data which will be provided to you.
Match Basic Details : It will have basic detail of series, venue, match type, toss winner, match winner, man of the match, playing 11 of both the teams
Table of "Batting Details", "Bowling Details", "Partnership Runs Details" and "Fall Of Wickets Details". Columns of each table are self explanatory.
Explain each table against innings. Find the relationship between data provided to you while explaining. Your writings should be in paragraphs instead of pointers. I don't want you to explain each section to me, rather I would like you to explain each innings in 6000 words each based on data provided to you. Find the relationship between data provided to you while explaining. 

Series Name : Zimbabwe tour of Bangladesh 
Match Between : Bangladesh vs Zimbabwe 
Match Number : 3
Match Type : T20I 
Match Date : May 07, 2024 
Venue : Zahur Ahmed Chowdhury Stadium, Chattogram 
Toss Won By And Decision : Zimbabwe, elected to field first
First Innings Score : 165/5
Second Innings Score : (20 ov, T:166) 156/9
Match Winner : Bangladesh won by 9 runs
Player of the Match : Towhid Hridoy
\n
Batting Details\n${battingCSV}
\n
Bowling Details\n${bowlingCSV}
\n\n
Partnership Runs Details\n${partnershipCSV}
\n\n
Fall of Wickets Details\n${fowCSV}`,

      function (err) {
        if (err) throw err;
        console.log("file saved");
      }
    );

    //read file ends
  });

  //   let batting = [
  //     {
  //       Innings: 1,
  //       Batsman: "Yashasvi Jaiswal ",
  //       "Runs Scored": 24,
  //       "Balls Faced": 19,
  //       "4s by Batsman": 5,
  //       "6s by Batsman": 0,
  //       "Strike Rate": 126.31,
  //       "Total Boundary": 5,
  //       "Runs from Boundary": 20,
  //       "Runs not from boundary": 4,
  //     },
  //     {
  //       Innings: 1,
  //       Batsman: "Jos Buttler ",
  //       "Runs Scored": 8,
  //       "Balls Faced": 10,
  //       "4s by Batsman": 0,
  //       "6s by Batsman": 0,
  //       "Strike Rate": 80,
  //       "Total Boundary": 0,
  //       "Runs from Boundary": 0,
  //       "Runs not from boundary": 8,
  //     },
  //     {
  //       Innings: 1,
  //       Batsman: "Sanju Samson (c)†",
  //       "Runs Scored": 68,
  //       "Balls Faced": 38,
  //       "4s by Batsman": 7,
  //       "6s by Batsman": 2,
  //       "Strike Rate": 178.94,
  //       "Total Boundary": 9,
  //       "Runs from Boundary": 40,
  //       "Runs not from boundary": 28,
  //     },
  //     {
  //       Innings: 1,
  //       Batsman: "Riyan Parag ",
  //       "Runs Scored": 76,
  //       "Balls Faced": 48,
  //       "4s by Batsman": 3,
  //       "6s by Batsman": 5,
  //       "Strike Rate": 158.33,
  //       "Total Boundary": 8,
  //       "Runs from Boundary": 42,
  //       "Runs not from boundary": 34,
  //     },
  //     {
  //       Innings: 1,
  //       Batsman: "Shimron Hetmyer ",
  //       "Runs Scored": 13,
  //       "Balls Faced": 5,
  //       "4s by Batsman": 1,
  //       "6s by Batsman": 1,
  //       "Strike Rate": 260,
  //       "Total Boundary": 2,
  //       "Runs from Boundary": 10,
  //       "Runs not from boundary": 3,
  //     },
  //     {
  //       Innings: 2,
  //       Batsman: "Sai Sudharsan ",
  //       "Runs Scored": 35,
  //       "Balls Faced": 29,
  //       "4s by Batsman": 3,
  //       "6s by Batsman": 1,
  //       "Strike Rate": 120.68,
  //       "Total Boundary": 4,
  //       "Runs from Boundary": 18,
  //       "Runs not from boundary": 17,
  //     },
  //     {
  //       Innings: 2,
  //       Batsman: "Shubman Gill (c)",
  //       "Runs Scored": 72,
  //       "Balls Faced": 44,
  //       "4s by Batsman": 6,
  //       "6s by Batsman": 2,
  //       "Strike Rate": 163.63,
  //       "Total Boundary": 8,
  //       "Runs from Boundary": 36,
  //       "Runs not from boundary": 36,
  //     },
  //     {
  //       Innings: 2,
  //       Batsman: "Matthew Wade †",
  //       "Runs Scored": 4,
  //       "Balls Faced": 6,
  //       "4s by Batsman": 0,
  //       "6s by Batsman": 0,
  //       "Strike Rate": 66.66,
  //       "Total Boundary": 0,
  //       "Runs from Boundary": 0,
  //       "Runs not from boundary": 4,
  //     },
  //     {
  //       Innings: 2,
  //       Batsman: "Abhinav Manohar ",
  //       "Runs Scored": 1,
  //       "Balls Faced": 2,
  //       "4s by Batsman": 0,
  //       "6s by Batsman": 0,
  //       "Strike Rate": 50,
  //       "Total Boundary": 0,
  //       "Runs from Boundary": 0,
  //       "Runs not from boundary": 1,
  //     },
  //     {
  //       Innings: 2,
  //       Batsman: "Vijay Shankar ",
  //       "Runs Scored": 16,
  //       "Balls Faced": 10,
  //       "4s by Batsman": 3,
  //       "6s by Batsman": 0,
  //       "Strike Rate": 160,
  //       "Total Boundary": 3,
  //       "Runs from Boundary": 12,
  //       "Runs not from boundary": 4,
  //     },
  //     {
  //       Innings: 2,
  //       Batsman: "Rahul Tewatia ",
  //       "Runs Scored": 22,
  //       "Balls Faced": 11,
  //       "4s by Batsman": 3,
  //       "6s by Batsman": 0,
  //       "Strike Rate": 200,
  //       "Total Boundary": 3,
  //       "Runs from Boundary": 12,
  //       "Runs not from boundary": 10,
  //     },
  //     {
  //       Innings: 2,
  //       Batsman: "M Shahrukh Khan ",
  //       "Runs Scored": 14,
  //       "Balls Faced": 8,
  //       "4s by Batsman": 1,
  //       "6s by Batsman": 1,
  //       "Strike Rate": 175,
  //       "Total Boundary": 2,
  //       "Runs from Boundary": 10,
  //       "Runs not from boundary": 4,
  //     },
  //     {
  //       Innings: 2,
  //       Batsman: "Rashid Khan ",
  //       "Runs Scored": 24,
  //       "Balls Faced": 11,
  //       "4s by Batsman": 4,
  //       "6s by Batsman": 0,
  //       "Strike Rate": 218.18,
  //       "Total Boundary": 4,
  //       "Runs from Boundary": 16,
  //       "Runs not from boundary": 8,
  //     },
  //     {
  //       Innings: 2,
  //       Batsman: "Noor Ahmad ",
  //       "Runs Scored": 0,
  //       "Balls Faced": 0,
  //       "4s by Batsman": 0,
  //       "6s by Batsman": 0,
  //       "Strike Rate": "-",
  //       "Total Boundary": 0,
  //       "Runs from Boundary": 0,
  //       "Runs not from boundary": 0,
  //     },
  //   ];

  //   let bowling = [
  //     {
  //       Innings: 1,
  //       Bowler: "Umesh Yadav",
  //       "Overs Bowled": 4,
  //       "Maidens Bowled": 0,
  //       "Runs Conceded": 47,
  //       "Wickets Taken": 1,
  //       "Economy Rate": 11.75,
  //       "Dot Balls": 9,
  //       "Fours Conceded": 6,
  //       "Sixes Conceded": 2,
  //       Wides: 2,
  //       "No Balls": 0,
  //       "Total Boundaries Conceded": 8,
  //       "Runs from Boundary Conceded": 36,
  //       "Runs not from boundary Conceded": 11,
  //       "Extra Runs Conceded (Wides & No Balls)": 2,
  //     },
  //     {
  //       Innings: 1,
  //       Bowler: "Spencer Johnson",
  //       "Overs Bowled": 4,
  //       "Maidens Bowled": 0,
  //       "Runs Conceded": 37,
  //       "Wickets Taken": 0,
  //       "Economy Rate": 9.25,
  //       "Dot Balls": 6,
  //       "Fours Conceded": 4,
  //       "Sixes Conceded": 1,
  //       Wides: 0,
  //       "No Balls": 0,
  //       "Total Boundaries Conceded": 5,
  //       "Runs from Boundary Conceded": 22,
  //       "Runs not from boundary Conceded": 15,
  //       "Extra Runs Conceded (Wides & No Balls)": 0,
  //     },
  //     {
  //       Innings: 1,
  //       Bowler: "Rashid Khan",
  //       "Overs Bowled": 4,
  //       "Maidens Bowled": 0,
  //       "Runs Conceded": 18,
  //       "Wickets Taken": 1,
  //       "Economy Rate": 4.5,
  //       "Dot Balls": 10,
  //       "Fours Conceded": 1,
  //       "Sixes Conceded": 0,
  //       Wides: 0,
  //       "No Balls": 0,
  //       "Total Boundaries Conceded": 1,
  //       "Runs from Boundary Conceded": 4,
  //       "Runs not from boundary Conceded": 14,
  //       "Extra Runs Conceded (Wides & No Balls)": 0,
  //     },
  //     {
  //       Innings: 1,
  //       Bowler: "Noor Ahmad",
  //       "Overs Bowled": 4,
  //       "Maidens Bowled": 0,
  //       "Runs Conceded": 43,
  //       "Wickets Taken": 0,
  //       "Economy Rate": 10.75,
  //       "Dot Balls": 6,
  //       "Fours Conceded": 1,
  //       "Sixes Conceded": 3,
  //       Wides: 1,
  //       "No Balls": 0,
  //       "Total Boundaries Conceded": 4,
  //       "Runs from Boundary Conceded": 22,
  //       "Runs not from boundary Conceded": 21,
  //       "Extra Runs Conceded (Wides & No Balls)": 1,
  //     },
  //     {
  //       Innings: 1,
  //       Bowler: "Mohit Sharma",
  //       "Overs Bowled": 4,
  //       "Maidens Bowled": 0,
  //       "Runs Conceded": 51,
  //       "Wickets Taken": 1,
  //       "Economy Rate": 12.75,
  //       "Dot Balls": 3,
  //       "Fours Conceded": 4,
  //       "Sixes Conceded": 2,
  //       Wides: 4,
  //       "No Balls": 0,
  //       "Total Boundaries Conceded": 6,
  //       "Runs from Boundary Conceded": 28,
  //       "Runs not from boundary Conceded": 23,
  //       "Extra Runs Conceded (Wides & No Balls)": 4,
  //     },
  //     {
  //       Innings: 2,
  //       Bowler: "Trent Boult",
  //       "Overs Bowled": 2,
  //       "Maidens Bowled": 0,
  //       "Runs Conceded": 8,
  //       "Wickets Taken": 0,
  //       "Economy Rate": 4,
  //       "Dot Balls": 7,
  //       "Fours Conceded": 1,
  //       "Sixes Conceded": 0,
  //       Wides: 0,
  //       "No Balls": 0,
  //       "Total Boundaries Conceded": 1,
  //       "Runs from Boundary Conceded": 4,
  //       "Runs not from boundary Conceded": 4,
  //       "Extra Runs Conceded (Wides & No Balls)": 0,
  //     },
  //     {
  //       Innings: 2,
  //       Bowler: "Avesh Khan",
  //       "Overs Bowled": 4,
  //       "Maidens Bowled": 0,
  //       "Runs Conceded": 48,
  //       "Wickets Taken": 1,
  //       "Economy Rate": 12,
  //       "Dot Balls": 3,
  //       "Fours Conceded": 4,
  //       "Sixes Conceded": 2,
  //       Wides: 2,
  //       "No Balls": 0,
  //       "Total Boundaries Conceded": 6,
  //       "Runs from Boundary Conceded": 28,
  //       "Runs not from boundary Conceded": 20,
  //       "Extra Runs Conceded (Wides & No Balls)": 2,
  //     },
  //     {
  //       Innings: 2,
  //       Bowler: "Keshav Maharaj",
  //       "Overs Bowled": 2,
  //       "Maidens Bowled": 0,
  //       "Runs Conceded": 16,
  //       "Wickets Taken": 0,
  //       "Economy Rate": 8,
  //       "Dot Balls": 3,
  //       "Fours Conceded": 0,
  //       "Sixes Conceded": 1,
  //       Wides: 0,
  //       "No Balls": 0,
  //       "Total Boundaries Conceded": 1,
  //       "Runs from Boundary Conceded": 6,
  //       "Runs not from boundary Conceded": 10,
  //       "Extra Runs Conceded (Wides & No Balls)": 0,
  //     },
  //     {
  //       Innings: 2,
  //       Bowler: "Ravichandran Ashwin",
  //       "Overs Bowled": 4,
  //       "Maidens Bowled": 0,
  //       "Runs Conceded": 40,
  //       "Wickets Taken": 0,
  //       "Economy Rate": 10,
  //       "Dot Balls": 4,
  //       "Fours Conceded": 4,
  //       "Sixes Conceded": 1,
  //       Wides: 0,
  //       "No Balls": 0,
  //       "Total Boundaries Conceded": 5,
  //       "Runs from Boundary Conceded": 22,
  //       "Runs not from boundary Conceded": 18,
  //       "Extra Runs Conceded (Wides & No Balls)": 0,
  //     },
  //     {
  //       Innings: 2,
  //       Bowler: "Yuzvendra Chahal",
  //       "Overs Bowled": 4,
  //       "Maidens Bowled": 0,
  //       "Runs Conceded": 43,
  //       "Wickets Taken": 2,
  //       "Economy Rate": 10.75,
  //       "Dot Balls": 4,
  //       "Fours Conceded": 6,
  //       "Sixes Conceded": 0,
  //       Wides: 1,
  //       "No Balls": 0,
  //       "Total Boundaries Conceded": 6,
  //       "Runs from Boundary Conceded": 24,
  //       "Runs not from boundary Conceded": 19,
  //       "Extra Runs Conceded (Wides & No Balls)": 1,
  //     },
  //     {
  //       Innings: 2,
  //       Bowler: "Kuldeep Sen",
  //       "Overs Bowled": 4,
  //       "Maidens Bowled": 0,
  //       "Runs Conceded": 41,
  //       "Wickets Taken": 3,
  //       "Economy Rate": 10.25,
  //       "Dot Balls": 7,
  //       "Fours Conceded": 5,
  //       "Sixes Conceded": 0,
  //       Wides: 4,
  //       "No Balls": 1,
  //       "Total Boundaries Conceded": 5,
  //       "Runs from Boundary Conceded": 20,
  //       "Runs not from boundary Conceded": 21,
  //       "Extra Runs Conceded (Wides & No Balls)": 5,
  //     },
  //   ];

  //   let fallOfWickets = [
  //     {
  //       Innings: 1,
  //       "Wicket Number": 1,
  //       "Over And Ball": 4.2,
  //       "At Runs": 32,
  //       "Dismissed Player Name": "Yashasvi Jaiswal",
  //     },
  //     {
  //       Innings: 1,
  //       "Wicket Number": 2,
  //       "Over And Ball": 5.4,
  //       "At Runs": 42,
  //       "Dismissed Player Name": "Jos Buttler",
  //     },
  //     {
  //       Innings: 1,
  //       "Wicket Number": 3,
  //       "Over And Ball": 18.4,
  //       "At Runs": 172,
  //       "Dismissed Player Name": "Riyan Parag",
  //     },
  //     {
  //       Innings: 2,
  //       "Wicket Number": 1,
  //       "Over And Ball": 8.2,
  //       "At Runs": 64,
  //       "Dismissed Player Name": "Sai Sudharsan",
  //     },
  //     {
  //       Innings: 2,
  //       "Wicket Number": 2,
  //       "Over And Ball": 10.1,
  //       "At Runs": 77,
  //       "Dismissed Player Name": "Matthew Wade",
  //     },
  //     {
  //       Innings: 2,
  //       "Wicket Number": 3,
  //       "Over And Ball": 10.4,
  //       "At Runs": 79,
  //       "Dismissed Player Name": "Abhinav Manohar",
  //     },
  //     {
  //       Innings: 2,
  //       "Wicket Number": 4,
  //       "Over And Ball": 13.6,
  //       "At Runs": 111,
  //       "Dismissed Player Name": "Vijay Shankar",
  //     },
  //     {
  //       Innings: 2,
  //       "Wicket Number": 5,
  //       "Over And Ball": 15.2,
  //       "At Runs": 133,
  //       "Dismissed Player Name": "Shubman Gill",
  //     },
  //     {
  //       Innings: 2,
  //       "Wicket Number": 6,
  //       "Over And Ball": 17.3,
  //       "At Runs": 157,
  //       "Dismissed Player Name": "M Shahrukh Khan",
  //     },
  //     {
  //       Innings: 2,
  //       "Wicket Number": 7,
  //       "Over And Ball": 19.5,
  //       "At Runs": 195,
  //       "Dismissed Player Name": "Rahul Tewatia",
  //     },
  //   ];

  //   let partnership = [
  //     {
  //       Innings: 1,
  //       "Player1 Name": "JC Buttler",
  //       "Player1 Balls Faced": 7,
  //       "Player1 Runs": 8,
  //       "Player2 Name": "YBK Jaiswal",
  //       "Player2 Balls Faced": 19,
  //       "Player2 Runs": 24,
  //       "Total Balls Faced": 26,
  //       "Total Runs": 32,
  //     },
  //     {
  //       Innings: 1,
  //       "Player1 Name": "JC Buttler",
  //       "Player1 Balls Faced": 3,
  //       "Player1 Runs": 0,
  //       "Player2 Name": "SV Samson",
  //       "Player2 Balls Faced": 5,
  //       "Player2 Runs": 10,
  //       "Total Balls Faced": 8,
  //       "Total Runs": 10,
  //     },
  //     {
  //       Innings: 1,
  //       "Player1 Name": "SV Samson",
  //       "Player1 Balls Faced": 30,
  //       "Player1 Runs": 49,
  //       "Player2 Name": "R Parag",
  //       "Player2 Balls Faced": 48,
  //       "Player2 Runs": 76,
  //       "Total Balls Faced": 78,
  //       "Total Runs": 130,
  //     },
  //     {
  //       Innings: 1,
  //       "Player1 Name": "SV Samson",
  //       "Player1 Balls Faced": 3,
  //       "Player1 Runs": 9,
  //       "Player2 Name": "SO Hetmyer",
  //       "Player2 Balls Faced": 5,
  //       "Player2 Runs": 13,
  //       "Total Balls Faced": 8,
  //       "Total Runs": 24,
  //     },
  //     {
  //       Innings: 2,
  //       "Player1 Name": "Shubman Gill",
  //       "Player1 Balls Faced": 21,
  //       "Player1 Runs": 28,
  //       "Player2 Name": "B Sai Sudharsan",
  //       "Player2 Balls Faced": 29,
  //       "Player2 Runs": 35,
  //       "Total Balls Faced": 50,
  //       "Total Runs": 64,
  //     },
  //     {
  //       Innings: 2,
  //       "Player1 Name": "MS Wade",
  //       "Player1 Balls Faced": 6,
  //       "Player1 Runs": 4,
  //       "Player2 Name": "Shubman Gill",
  //       "Player2 Balls Faced": 5,
  //       "Player2 Runs": 8,
  //       "Total Balls Faced": 11,
  //       "Total Runs": 13,
  //     },
  //     {
  //       Innings: 2,
  //       "Player1 Name": "A Manohar",
  //       "Player1 Balls Faced": 2,
  //       "Player1 Runs": 1,
  //       "Player2 Name": "Shubman Gill",
  //       "Player2 Balls Faced": 1,
  //       "Player2 Runs": 1,
  //       "Total Balls Faced": 3,
  //       "Total Runs": 2,
  //     },
  //     {
  //       Innings: 2,
  //       "Player1 Name": "V Shankar",
  //       "Player1 Balls Faced": 10,
  //       "Player1 Runs": 16,
  //       "Player2 Name": "Shubman Gill",
  //       "Player2 Balls Faced": 10,
  //       "Player2 Runs": 15,
  //       "Total Balls Faced": 20,
  //       "Total Runs": 32,
  //     },
  //     {
  //       Innings: 2,
  //       "Player1 Name": "R Tewatia",
  //       "Player1 Balls Faced": 1,
  //       "Player1 Runs": 1,
  //       "Player2 Name": "Shubman Gill",
  //       "Player2 Balls Faced": 7,
  //       "Player2 Runs": 20,
  //       "Total Balls Faced": 8,
  //       "Total Runs": 22,
  //     },
  //     {
  //       Innings: 2,
  //       "Player1 Name": "R Tewatia",
  //       "Player1 Balls Faced": 5,
  //       "Player1 Runs": 9,
  //       "Player2 Name": "M Shahrukh Khan",
  //       "Player2 Balls Faced": 8,
  //       "Player2 Runs": 14,
  //       "Total Balls Faced": 13,
  //       "Total Runs": 24,
  //     },
  //     {
  //       Innings: 2,
  //       "Player1 Name": "R Tewatia",
  //       "Player1 Balls Faced": 4,
  //       "Player1 Runs": 10,
  //       "Player2 Name": "Rashid Khan",
  //       "Player2 Balls Faced": 10,
  //       "Player2 Runs": 20,
  //       "Total Balls Faced": 14,
  //       "Total Runs": 36,
  //     },
  //     {
  //       Innings: 2,
  //       "Player1 Name": "Rashid Khan",
  //       "Player1 Balls Faced": 1,
  //       "Player1 Runs": 4,
  //       "Player2 Name": "Noor Ahmad",
  //       "Player2 Balls Faced": 0,
  //       "Player2 Runs": 0,
  //       "Total Balls Faced": 1,
  //       "Total Runs": 4,
  //     },
  //   ];
}

createprompt(
  "3rd-match-07-May-2024-bangladesh-vs-zimbabwe.json",
  "./2024/May/Zimbabwe in Bangladesh T20I Series May 2024/3rd-match-07-May-2024-bangladesh-vs-zimbabwe"
);