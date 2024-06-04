const mongoose = require("mongoose");
const GroupStandings = require("../models/GroupStandings.model");
const RoundOf16 = require("../models/RoundOf16.model");

const getQualifyingTeams = (standings) => {
  let qualifiers = {
    first: [],
    second: [],
    third: [],
  };

  Object.keys(standings).forEach((group) => {
    const teams = standings[group];
    qualifiers.first.push({ team: teams[0].name, group });
    qualifiers.second.push({ team: teams[1].name, group });
    qualifiers.third.push({ team: teams[2].name, group });
  });

  qualifiers.third.sort((a, b) => {
    const statsA = standings[a.group].find((team) => team.name === a.team);
    const statsB = standings[b.group].find((team) => team.name === b.team);
    if (statsB.points !== statsA.points) {
      return statsB.points - statsA.points;
    } else if (statsB.goalDifference !== statsA.goalDifference) {
      return statsB.goalDifference - statsA.goalDifference;
    } else {
      return statsB.goalsFor - statsA.goalsFor;
    }
  });

  qualifiers.third = qualifiers.third.slice(0, 4); // Best four third-placed teams
  return qualifiers;
};

const getThirdPlaceFixtures = (thirdPlaceTeams) => {
  const thirdPlaceGroups = thirdPlaceTeams
    .map((team) => team.group.replace("Group ", ""))
    .sort();

  const fixtureMappings = {
    "A,B,C,D": ["3A", "3B", "3C", "3D"],
    "A,B,C,E": ["3A", "3B", "3C", "3E"],
    "A,B,C,F": ["3A", "3B", "3C", "3F"],
    "A,B,D,E": ["3A", "3B", "3D", "3E"],
    "A,B,D,F": ["3A", "3B", "3D", "3F"],
    "A,B,E,F": ["3A", "3B", "3E", "3F"],
    "A,C,D,E": ["3A", "3C", "3D", "3E"],
    "A,C,D,F": ["3A", "3C", "3D", "3F"],
    "A,C,E,F": ["3A", "3C", "3E", "3F"],
    "A,D,E,F": ["3A", "3D", "3E", "3F"],
    "B,C,D,E": ["3B", "3C", "3D", "3E"],
    "B,C,D,F": ["3B", "3C", "3D", "3F"],
    "B,C,E,F": ["3B", "3C", "3E", "3F"],
    "B,D,E,F": ["3B", "3D", "3E", "3F"],
    "C,D,E,F": ["3C", "3D", "3E", "3F"],
  };

  const key = thirdPlaceGroups.join(",");
  const fixtures = fixtureMappings[key];

  if (!fixtures) {
    throw new Error(`Invalid combination of third-place groups: ${key}`);
  }

  return fixtures;
};

const getThirdPlaceTeam = (thirdPlaceTeams, group) => {
  const team = thirdPlaceTeams.find((team) =>
    group.includes(team.group.replace("Group ", ""))
  );
  if (!team) {
    throw new Error(`No third-place team found for groups: ${group}`);
  }
  return team;
};

const populateKnockoutStages = (standings) => {
  const qualifiers = getQualifyingTeams(standings);
  const thirdPlaceTeams = qualifiers.third;
  const thirdPlaceFixtures = getThirdPlaceFixtures(thirdPlaceTeams);

  const roundOf16Games = [
    {
      id: "R16-1",
      date: "29 Jun 18:00",
      team1: qualifiers.second[0].team,
      team2: qualifiers.second[1].team,
    },
    {
      id: "R16-2",
      date: "29 Jun 21:00",
      team1: qualifiers.first[0].team,
      team2: qualifiers.second[2].team,
    },
    {
      id: "R16-3",
      date: "30 Jun 18:00",
      team1: qualifiers.first[2].team,
      team2: getThirdPlaceTeam(thirdPlaceTeams, "3D/E/F").team,
    },
    {
      id: "R16-4",
      date: "30 Jun 21:00",
      team1: qualifiers.first[1].team,
      team2: getThirdPlaceTeam(thirdPlaceTeams, "3A/D/E/F").team,
    },
    {
      id: "R16-5",
      date: "01 Jul 18:00",
      team1: qualifiers.second[3].team,
      team2: qualifiers.second[4].team,
    },
    {
      id: "R16-6",
      date: "01 Jul 21:00",
      team1: qualifiers.first[5].team,
      team2: getThirdPlaceTeam(thirdPlaceTeams, "3A/B/C").team,
    },
    {
      id: "R16-7",
      date: "02 Jul 18:00",
      team1: qualifiers.first[4].team,
      team2: getThirdPlaceTeam(thirdPlaceTeams, "3A/B/C/D").team,
    },
    {
      id: "R16-8",
      date: "02 Jul 21:00",
      team1: qualifiers.first[3].team,
      team2: qualifiers.second[5].team,
    },
  ];

  const quarterFinalGames = [
    {
      id: "Q1",
      date: "05 Jul 17:00",
      team1: roundOf16Games[3].id,
      team2: roundOf16Games[1].id,
    },
    {
      id: "Q2",
      date: "05 Jul 20:00",
      team1: roundOf16Games[5].id,
      team2: roundOf16Games[4].id,
    },
    {
      id: "Q3",
      date: "06 Jul 17:00",
      team1: roundOf16Games[2].id,
      team2: roundOf16Games[0].id,
    },
    {
      id: "Q4",
      date: "06 Jul 20:00",
      team1: roundOf16Games[6].id,
      team2: roundOf16Games[7].id,
    },
  ];

  const semiFinalGames = [
    {
      id: "S1",
      date: "09 Jul 20:00",
      team1: quarterFinalGames[0].id,
      team2: quarterFinalGames[1].id,
    },
    {
      id: "S2",
      date: "10 Jul 20:00",
      team1: quarterFinalGames[2].id,
      team2: quarterFinalGames[3].id,
    },
  ];

  const finalGame = [
    {
      id: "F1",
      date: "14 Jul 20:00",
      team1: semiFinalGames[0].id,
      team2: semiFinalGames[1].id,
    },
  ];

  return { roundOf16Games, quarterFinalGames, semiFinalGames, finalGame };
};

const allGroupsFinished = (groupGames) => {
  return Object.keys(groupGames).every((group) =>
    groupGames[group].every(
      (game) => game.team1Score !== undefined && game.team2Score !== undefined
    )
  );
};

const calculateStandings = async (groupGames) => {
  const standings = {};

  // Initialize standings object
  Object.keys(groupGames).forEach((group) => {
    standings[group] = [];
    groupGames[group].forEach((game) => {
      if (!standings[group].find((team) => team.name === game.team1)) {
        standings[group].push({
          name: game.team1,
          points: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalDifference: 0,
          previousPosition: null,
          movement: "",
        });
      }
      if (!standings[group].find((team) => team.name === game.team2)) {
        standings[group].push({
          name: game.team2,
          points: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalDifference: 0,
          previousPosition: null,
          movement: "",
        });
      }
    });
  });

  console.log("Standings initialized:", standings);

  // Update standings with game results
  Object.keys(groupGames).forEach((group) => {
    groupGames[group].forEach((game) => {
      const team1 = standings[group].find((team) => team.name === game.team1);
      const team2 = standings[group].find((team) => team.name === game.team2);
      if (game.team1Score !== undefined && game.team2Score !== undefined) {
        team1.goalsFor += game.team1Score;
        team1.goalsAgainst += game.team2Score;
        team2.goalsFor += game.team2Score;
        team2.goalsAgainst += game.team1Score;

        if (game.team1Score > game.team2Score) {
          team1.points += 3;
          team1.wins += 1;
          team2.losses += 1;
        } else if (game.team1Score < game.team2Score) {
          team2.points += 3;
          team2.wins += 1;
          team1.losses += 1;
        } else {
          team1.points += 1;
          team2.points += 1;
          team1.draws += 1;
          team2.draws += 1;
        }
        team1.goalDifference = team1.goalsFor - team1.goalsAgainst;
        team2.goalDifference = team2.goalsFor - team2.goalsAgainst;
      }
    });
  });

  console.log("Standings updated with game results:", standings);

  // Sort teams in each group
  Object.keys(standings).forEach((group) => {
    standings[group].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      } else if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      } else {
        return b.goalsFor - a.goalsFor;
      }
    });
  });

  console.log("Standings sorted:", standings);

  // Update standings in the database
  for (const group of Object.keys(standings)) {
    try {
      const updatedGroup = await GroupStandings.findOneAndUpdate(
        { groupName: group },
        { teams: standings[group] },
        { upsert: true, new: true }
      );
      console.log(`Standings updated for ${group}:`, updatedGroup);
    } catch (error) {
      console.error(`Error updating standings for ${group}:`, error);
    }
  }

  // Check if all group stage games are completed
  if (allGroupsFinished(groupGames)) {
    try {
      const knockoutStages = populateKnockoutStages(standings);

      // Update the Round of 16 in the database
      for (const game of knockoutStages.roundOf16Games) {
        await RoundOf16.findOneAndUpdate({ id: game.id }, game, {
          upsert: true,
          new: true,
        });
      }
      console.log("Knockout stages populated");
    } catch (error) {
      console.error("Error populating knockout stages:", error);
    }
  }
};

module.exports = calculateStandings;
