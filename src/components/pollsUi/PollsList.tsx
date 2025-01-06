"use client";

import React, { useState, useEffect } from "react";
import { viewPolls } from "@/lib/polls";
import { Avatar } from "@/components/ui/avatar";
import { PlayCircle, Lock } from "lucide-react";

interface Poll {
  id: string;
  title: string;
  options: string[];
  startDate: Date;
  endDate: Date;
  creatorId: string;
  createdAt: Date;
  status: string;
  flagged: boolean;
  creatorName?: string;
  creatorAvatar?: string;
}

const PollsList = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [error, setError] = useState<string | null>(null);
  const creatorId = "5nAhIg1OJCWT6xrvPgHfkeJ3tLr1";

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const polls = await viewPolls({ creatorId });
        console.log("Fetched Polls:", polls); // Debugging
        setPolls(polls);
      } catch (error) {
        if (error instanceof Error) {
          setError("Error fetching polls: " + error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };
    fetchPolls();
  }, [creatorId]);
  

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      {polls.length > 0 ? (
        <>
          <h2>Polls by {polls[0].creatorName || "Unknown Creator"}</h2>
          <Avatar
            size="xs"
            name="avatar"
            src={polls[0].creatorAvatar}
            className="size-6"
          />
          <ul>
            {polls.map((poll) => (
              <li key={poll.id}>{poll.title}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>No polls available.</p>
      )}
    </div>
  );
  
};

export default PollsList;
