const GroupStandings = require("../models/GroupStandings.model");
const RoundOf16Game = require("../models/RoundOf16.model");

const updateRoundOf16Games = async () => {
  try {
    const standings = await GroupStandings.find();

    const groupPositions = {};
    standings.forEach((group) => {
      group.teams.forEach((team, index) => {
        groupPositions[`${index + 1}${group.groupName}`] = team.name;
      });
    });

    const thirdPlaceTeams = [];
    standings.forEach((group) => {
      const thirdPlaceTeam = group.teams[2];
      thirdPlaceTeams.push({
        group: group.groupName,
        name: thirdPlaceTeam.name,
        points: thirdPlaceTeam.points,
        goalDifference: thirdPlaceTeam.goalDifference,
        goalsFor: thirdPlaceTeam.goalsFor,
      });
    });

    // Sort third-place teams
    thirdPlaceTeams.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      } else if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      } else {
        return b.goalsFor - a.goalsFor;
      }
    });

    const bestThirdPlaceTeams = thirdPlaceTeams.slice(0, 4);
    const thirdPlaceGroups = bestThirdPlaceTeams.map((team) => team.group);

    // Initialize assignments object
    const thirdPlaceAssignments = {};

    // Assign third-place teams to slots
    const assignmentsMap = {
      "3DEF": null,
      "3ADEF": null,
      "3ABC": null,
      "3ABCD": null,
    };

    bestThirdPlaceTeams.forEach((team, index) => {
      if (index === 0) {
        assignmentsMap["3DEF"] = team.name;
      } else if (index === 1) {
        assignmentsMap["3ADEF"] = team.name;
      } else if (index === 2) {
        assignmentsMap["3ABC"] = team.name;
      } else if (index === 3) {
        assignmentsMap["3ABCD"] = team.name;
      }
    });

    console.log("Third place assignments:", assignmentsMap);

    const roundOf16Games = [
      {
        id: "R16-1",
        date: "29 Jun 18:00",
        team1: groupPositions["2GA"],
        team2: groupPositions["2GB"],
      },
      {
        id: "R16-2",
        date: "29 Jun 21:00",
        team1: groupPositions["1GA"],
        team2: groupPositions["2GC"],
      },
      {
        id: "R16-3",
        date: "30 Jun 18:00",
        team1: groupPositions["1GC"],
        team2: assignmentsMap["3DEF"],
      },
      {
        id: "R16-4",
        date: "30 Jun 21:00",
        team1: groupPositions["1GB"],
        team2: assignmentsMap["3ADEF"],
      },
      {
        id: "R16-5",
        date: "01 Jul 18:00",
        team1: groupPositions["2GD"],
        team2: groupPositions["2GE"],
      },
      {
        id: "R16-6",
        date: "01 Jul 21:00",
        team1: groupPositions["1GF"],
        team2: assignmentsMap["3ABC"],
      },
      {
        id: "R16-7",
        date: "02 Jul 18:00",
        team1: groupPositions["1GE"],
        team2: assignmentsMap["3ABCD"],
      },
      {
        id: "R16-8",
        date: "02 Jul 21:00",
        team1: groupPositions["1GD"],
        team2: groupPositions["2GF"],
      },
    ];

    await RoundOf16Game.deleteMany({});
    await RoundOf16Game.insertMany(roundOf16Games);

    console.log("Round of 16 games updated successfully");
  } catch (error) {
    console.error("Error updating round of 16 games:", error);
  }
};

module.exports = updateRoundOf16Games;
