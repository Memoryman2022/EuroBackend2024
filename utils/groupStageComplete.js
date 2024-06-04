import React, { useEffect, useState } from "react";
import { calculateStandings } from "./calculateStandings"; // Assuming calculateStandings is in a separate file

const GroupStageCompletion = () => {
  const [groupGames, setGroupGames] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchGroupGames = async () => {
      try {
        // Replace with your logic to fetch group stage games from the database
        const response = await fetch("/api/realResults"); // Example API endpoint
        const data = await response.json();
        setGroupGames(data);
      } catch (error) {
        console.error("Error fetching group stage games:", error);
      }
    };

    fetchGroupGames();
  }, []);

  useEffect(() => {
    if (groupGames) {
      const totalGames = Object.values(groupGames).reduce(
        (acc, curr) => acc + curr.length,
        0
      );
      setCompleted(totalGames === 36); // Assuming 36 games in the group stage
    }
  }, [groupGames]);

  useEffect(() => {
    if (completed) {
      calculateStandings(groupGames); // Trigger calculation when group stage is complete
    }
  }, [completed, groupGames]);
};

export default GroupStageCompletion;
