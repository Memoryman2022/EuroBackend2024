const calculateStandings = (groupGames) => {
  const standings = {};

  // Initialize standings object
  Object.keys(groupGames).forEach((group) => {
    standings[group] = {};
    groupGames[group].forEach((game) => {
      if (!standings[group][game.team1]) {
        standings[group][game.team1] = {
          points: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalDifference: 0,
          previousPosition: null,
          movement: "",
        };
      }
      if (!standings[group][game.team2]) {
        standings[group][game.team2] = {
          points: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalDifference: 0,
          previousPosition: null,
          movement: "",
        };
      }
    });
  });

  // Calculate standings
  Object.keys(groupGames).forEach((group) => {
    groupGames[group].forEach((game) => {
      const { team1, team2, team1Score, team2Score } = game;
      const team1Stats = standings[group][team1];
      const team2Stats = standings[group][team2];

      if (team1Score !== undefined && team2Score !== undefined) {
        // Update goals for and against
        team1Stats.goalsFor += team1Score;
        team1Stats.goalsAgainst += team2Score;
        team2Stats.goalsFor += team2Score;
        team2Stats.goalsAgainst += team1Score;

        // Update goal difference
        team1Stats.goalDifference =
          team1Stats.goalsFor - team1Stats.goalsAgainst;
        team2Stats.goalDifference =
          team2Stats.goalsFor - team2Stats.goalsAgainst;

        // Determine match outcome
        if (team1Score > team2Score) {
          team1Stats.wins += 1;
          team1Stats.points += 3;
          team2Stats.losses += 1;
        } else if (team1Score < team2Score) {
          team2Stats.wins += 1;
          team2Stats.points += 3;
          team1Stats.losses += 1;
        } else {
          team1Stats.draws += 1;
          team2Stats.draws += 1;
          team1Stats.points += 1;
          team2Stats.points += 1;
        }
      }
    });
  });

  // Sort teams within each group
  Object.keys(standings).forEach((group) => {
    const sortedTeams = Object.entries(standings[group]).sort(
      ([, statsA], [, statsB]) => {
        if (statsB.points !== statsA.points) {
          return statsB.points - statsA.points;
        } else if (statsB.goalDifference !== statsA.goalDifference) {
          return statsB.goalDifference - statsA.goalDifference;
        } else {
          return statsB.goalsFor - statsA.goalsFor;
        }
      }
    );

    // Update positions and movement
    sortedTeams.forEach(([team, stats], index) => {
      const newPosition = index + 1;
      if (stats.previousPosition !== null) {
        if (stats.previousPosition > newPosition) {
          stats.movement = "up";
        } else if (stats.previousPosition < newPosition) {
          stats.movement = "down";
        } else {
          stats.movement = "";
        }
      }
      stats.previousPosition = stats.position || newPosition;
      stats.position = newPosition;
    });

    standings[group] = Object.fromEntries(sortedTeams);
  });

  return standings;
};

module.exports = calculateStandings;
