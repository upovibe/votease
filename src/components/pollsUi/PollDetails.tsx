"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { viewPolls, deletePoll, flagPoll, isAdmin } from "@/lib/polls";
import {
  castVote,
  undoVote,
  getVoteCount,
  getTotalVoteCount,
} from "@/lib/votes";
import Loading from "@/components/ui/Loading";
import { formatDate } from "@/utils/dateUtils";
import { Avatar } from "@/components/ui/avatar";
import { CheckCheck, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import PollMenu from "@/components/pollsUi/PollMenu";

interface Poll {
  id: string;
  title: string;
  slug?: string;
  statement?: string;
  options: string[];
  startDate: string;
  endDate: string;
  creatorId: string;
  createdAt: Date | string;
  status: string;
  flagged: boolean;
  creatorName?: string;
  creatorAvatar?: string;
}

interface PollData {
  title: string;
  statement: string;
  options: string[];
  startDate: Date;
  endDate: Date;
}

const PollDetails: React.FC = () => {
  const router = useRouter();
  const { slug } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voteCounts, setVoteCounts] = useState<{ [option: string]: number }>(
    {}
  );
  const [totalVotes, setTotalVotes] = useState<number>(0);

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

    const checkAdminStatus = async () => {
      if (user?.uid) {
        const adminStatus = await isAdmin(user.uid);
        setIsAdminUser(adminStatus);
      }
    };

    const fetchVoteCounts = async () => {
      if (poll?.id) {
        const counts = await getVoteCount(poll.id);
        const total = await getTotalVoteCount(poll.id);
        setVoteCounts(counts);
        setTotalVotes(total);
      }
    };

    fetchPollDetails();
    checkAdminStatus();
    fetchVoteCounts();
  }, [slug, user?.uid, poll?.id]);

  const handleVote = async (option: string) => {
    if (!user?.uid || !poll?.id) return;

    try {
      if (selectedOption === option) {
        toast.error("Already voted. Undo to vote again.");
        return;
      }

      if (selectedOption) {
        toast.error("Already voted. Undo to change.");
        return;
      }

      await castVote(user.uid, poll.id, option);
      setSelectedOption(option);
      toast.success(`Voted for: ${option}`);

      // Refresh vote counts
      const counts = await getVoteCount(poll.id);
      const total = await getTotalVoteCount(poll.id);
      setVoteCounts(counts);
      setTotalVotes(total);
    } catch (error) {
      console.error("Error casting vote:", error);
      toast.error("Failed to cast vote.");
    }
  };

  const handleUndoVote = async () => {
    if (!user?.uid || !poll?.id || !selectedOption) return;

    try {
      await undoVote(user.uid, poll.id);
      setSelectedOption(null);
      toast.success("Vote undone.");

      // Refresh vote counts
      const counts = await getVoteCount(poll.id);
      const total = await getTotalVoteCount(poll.id);
      setVoteCounts(counts);
      setTotalVotes(total);
    } catch (error) {
      console.error("Error undoing vote:", error);
      toast.error("Failed to undo vote.");
    }
  };

  const handleDelete = async (pollId: string) => {
    if (!user?.uid) return;

    try {
      await deletePoll(user.uid, pollId);
      toast.success("Poll deleted successfully.");
      router.push("/dashboard/polls"); // Navigate back to the polls list
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Failed to delete poll.");
    }
  };

  const handleFlagToggle = async (pollId: string) => {
    if (!user?.uid) return;

    try {
      const newStatus = poll?.flagged ? "active" : "flagged";
      await flagPoll(user.uid, pollId, newStatus);
      setPoll((prev) =>
        prev ? { ...prev, flagged: !prev.flagged, status: newStatus } : null
      );
      toast.success(
        poll?.flagged
          ? "Poll unflagged successfully."
          : "Poll flagged successfully."
      );
    } catch (error) {
      console.error("Error flagging/unflagging poll:", error);
      toast.error("Failed to flag/unflag poll.");
    }
  };

  const mapPollToPollData = (poll: Poll): PollData => ({
    title: poll.title,
    statement: poll.statement || "",
    options: poll.options,
    startDate: new Date(poll.startDate),
    endDate: new Date(poll.endDate),
  });

  if (authLoading || loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!poll) {
    return <div>Poll not found.</div>;
  }

  const isCreator = poll.creatorId === user?.uid;
  const canEditOrDelete = isAdminUser || isCreator;

  return (
    <div className="container mx-auto flex flex-col w-full p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Avatar name="avatar" src={poll.creatorAvatar} className="size-10" />
          <span className="text-3xl font-bold capitalize">
            {poll.creatorName || "Unknown Creator"}
          </span>
        </div>
        <PollMenu
          isAdminUser={isAdminUser}
          canEditOrDelete={canEditOrDelete}
          poll={poll}
          onFlagToggle={handleFlagToggle}
          onDelete={handleDelete}
          mapPollToPollData={mapPollToPollData}
        />
      </div>
      <div className="bg-gradient-to-r from-transparent via-gray-900 to-transparent dark:via-gray-500 h-[1px] w-full my-5 " />
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
              onClick={() => handleVote(option)}
              className={`px-3 py-1 rounded-full cursor-pointer border-4 hover:shadow-lg ${
                selectedOption === option
                  ? "bg-gray-500 text-white dark:border-gray-300 border-gray-700"
                  : "bg-gray-100 dark:bg-gray-900 dark:text-white border-transparent"
              } hover:bg-gray-500 hover:text-white hover:dark:border-gray-300 hover:border-gray-700 transition-all duration-300 ease-in-out`}
            >
              {option} - {voteCounts[option] || 0} votes
            </li>
          ))}
        </ul>

        {selectedOption && (
          <button
            onClick={handleUndoVote}
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
          >
            Undo Vote
          </button>
        )}

        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          {totalVotes} total votes
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
