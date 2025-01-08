"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { viewPolls } from "@/lib/polls";
import Loading from "@/components/ui/Loading";
import { formatDate } from "@/utils/dateUtils";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { CheckCheck, X } from "lucide-react";

interface Poll {
  id: string;
  title: string;
  slug?: string;
  statement?: string;
  options: string[];
  startDate: string; // Assuming dates are coming as strings
  endDate: string;
  creatorId: string;
  createdAt: Date | string;
  status: string;
  flagged: boolean;
  creatorName?: string;
  creatorAvatar?: string;
  totalVotes?: number;
}

const PollDetails: React.FC = () => {
  const { slug } = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
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

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    console.log(`User voted for: ${option}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!poll) {
    return <div>Poll not found.</div>;
  }

  const totalVotes = poll.totalVotes || 37;

  return (
    <div className="container mx-auto flex flex-col w-full p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Avatar name="avatar" src={poll.creatorAvatar} className="size-10" />
          <span className="text-3xl font-bold capitalize">
            {poll.creatorName}
          </span>
        </div>
        <Link
          href={"#"}
          className=" bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition-all duration-300 h-9 px-3 leading-[2.25rem] hover:shadow rounded-md"
        >
          Visit profile
        </Link>
      </div>
      <div className="bg-gradient-to-r from-transparent via-gray-900 to-transparent dark:via-gray-500 h-[1px] w-full my-5 "></div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between">
          <h1 className="text-2xl font-bold capitalize mr-5">{poll.title}</h1>
          <div className="flex items-center space-x-3">
            <strong className="text-sm">{formatDate(poll.createdAt)}</strong>
            <span
              className={`text-sm font-medium flex items-center ${
                poll.status === "active"
                  ? "text-green-500 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {poll.status === "active" ? (
                <>
                  <CheckCheck size={16} className="inline-block mr-1" />
                  Active
                </>
              ) : (
                <>
                  <X size={16} className="inline-block mr-1" />
                  Inactive
                </>
              )}
            </span>
          </div>
        </div>
        <p className="text-gray-600 lowercase mb-8">{poll.statement}</p>
      </div>
      <div className="border border-gray-500/50 dark:border-gray-700/50 bg-white/80 dark:bg-[#0a0a0a] rounded-lg shadow p-5 hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-200 ease-linear">
        <ul className="space-y-3">
          {poll.options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`px-3 py-1 rounded-full cursor-pointer border-4 hover:shadow-lg ${
                selectedOption === option
                  ? "bg-gray-500 text-white dark:border-gray-300 border-gray-700" // Selected option with themed border in light mode
                  : "bg-gray-100 dark:bg-gray-900 dark:text-white border-transparent" // Unselected option with transparent border
              } hover:bg-gray-500 hover:text-white hover:dark:border-gray-300 hover:border-gray-700 transition-all duration-300 ease-in-out`}
            >
              {option}
            </li>
          ))}
        </ul>
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          {totalVotes} votes
        </div>
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Start Date: {formatDate(poll.startDate)} • End Date:{" "}
          {formatDate(poll.endDate)}
        </div>
      </div>

      {poll.flagged && (
        <p className="text-red-500 mt-4">This poll is flagged.</p>
      )}
    </div>
  );
};

export default PollDetails;
