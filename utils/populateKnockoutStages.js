const getQualifyingTeams = (standings) => {
  let qualifiers = {
    first: [],
    second: [],
    third: [],
  };

  Object.keys(standings).forEach((group) => {
    const teams = Object.keys(standings[group]);
    qualifiers.first.push({ team: teams[0], group });
    qualifiers.second.push({ team: teams[1], group });
    qualifiers.third.push({ team: teams[2], group });
  });

  qualifiers.third.sort((a, b) => {
    const statsA = standings[a.group][a.team];
    const statsB = standings[b.group][b.team];
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

  console.log("Third-place groups:", thirdPlaceGroups);

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
    console.error(
      `Invalid combination of third-place groups: ${key}`,
      thirdPlaceTeams
    );
    throw new Error(`Invalid combination of third-place groups: ${key}`);
  }

  return fixtures;
};

const getThirdPlaceTeam = (thirdPlaceTeams, group) => {
  const team = thirdPlaceTeams.find((team) =>
    group.includes(team.group.replace("Group ", ""))
  );
  if (!team) {
    console.error(
      `No third-place team found for groups: ${group}`,
      thirdPlaceTeams
    );
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

  return { roundOf16Games };
};

module.exports = populateKnockoutStages;
