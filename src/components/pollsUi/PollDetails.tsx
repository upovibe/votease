"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { viewPolls } from "@/lib/polls";
import Loading from "@/components/ui/Loading";
import { formatDate } from "@/utils/dateUtils";

interface Poll {
  id: string;
  title: string;
  slug?: string;
  statement?: string;
  options: string[];
  startDate: Date;
  endDate: Date;
  creatorId: string;
  createdAt: Date | string;
  status: string;
  flagged: boolean;
  creatorName?: string;
  creatorAvatar?: string;
}

const PollDetails: React.FC = () => {
  const { slug } = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure slug is a string, and handle the case where it might be an array.
    if (!slug || Array.isArray(slug)) return;

    const fetchPollDetails = async () => {
      try {
        setLoading(true);
        const polls = await viewPolls({ slug });
        if (polls.length > 0) {
          setPoll(polls[0]);
        } else {
          setError("Poll not found.");
        }
      } catch (error) {
        console.error(error);
        setError("Error fetching poll details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPollDetails();
  }, [slug]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!poll) {
    return <div>Poll not found.</div>;
  }

  return (
    <div className="p-4 space-y-4 container mx-auto">
      <h1 className="text-2xl font-bold">{poll.title}</h1>
      <p className="text-gray-600">{poll.statement}</p>
      <ul className="list-disc pl-5">
        {poll.options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
      <p className="text-gray-500">
        Created by: {poll.creatorName || "Unknown"} on{" "}
        <strong>{formatDate(poll.createdAt)}</strong>
      </p>
      <p
        className={`font-medium ${
          poll.status === "active" ? "text-green-500" : "text-red-500"
        }`}
      >
        {poll.status === "active" ? "Active" : "Inactive"}
      </p>
      {poll.flagged && <p className="text-red-500">This poll is flagged.</p>}
    </div>
  );
};

export default PollDetails;
