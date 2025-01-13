"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { viewPolls, deletePoll, flagPoll, isAdmin } from "@/lib/polls";
import { castVote, getVoteCount, getTotalVoteCount } from "@/lib/votes";
import Loading from "@/components/ui/Loading";
import { formatDate } from "@/utils/dateUtils";
import { Avatar } from "@/components/ui/avatar";
import { CheckCheck, RefreshCcw, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import PollMenu from "@/components/pollsUi/PollMenu";
import { Button } from "@chakra-ui/react";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogCloseTrigger,
} from "@/components/ui/dialog";

interface Poll {
  id: string;
  title: string;
  slug?: string;
  statement?: string;
  options: string[];
  startDate: string; // From API, assume it's a string
  endDate: string; // From API, assume it's a string
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
  const [voteCounts, setVoteCounts] = useState<{ [option: string]: number }>(
    {}
  );
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confirmVote, setConfirmVote] = useState<string | null>(null);

  // Fetch poll data
  const fetchPollDetails = useCallback(async () => {
    if (!slug || Array.isArray(slug)) return;

    try {
      setLoading(true);
      const polls = await viewPolls({ slug });
      if (polls.length > 0) {
        const normalizedPoll = {
          ...polls[0],
          startDate: formatDate(polls[0].startDate),
          endDate: formatDate(polls[0].endDate),
        };
        setPoll(normalizedPoll);
      } else {
        setError("Poll not found.");
      }
    } catch (error) {
      console.error(error);
      setError("Error fetching poll details.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Fetch vote counts
  const fetchVoteCounts = useCallback(async () => {
    if (poll?.id) {
      const counts = await getVoteCount(poll.id);
      const total = await getTotalVoteCount(poll.id);
      setVoteCounts(counts);
      setTotalVotes(total);
    }
  }, [poll?.id]);

  useEffect(() => {
    if (poll?.id) {
      const storedOption = localStorage.getItem(`selectedOption-${poll.id}`);
      if (storedOption) {
        setSelectedOption(storedOption);
      }
    }
  }, [poll?.id]);

  // Check if the user is an admin
  const checkAdminStatus = useCallback(async () => {
    if (user?.uid) {
      const adminStatus = await isAdmin(user.uid);
      setIsAdminUser(adminStatus);
    }
  }, [user?.uid]);

  // Refresh component
  const refreshComponent = async () => {
    await fetchPollDetails();
    await fetchVoteCounts();
  };

  useEffect(() => {
    fetchPollDetails();
    checkAdminStatus();
  }, [fetchPollDetails, checkAdminStatus]);

  useEffect(() => {
    fetchVoteCounts();
  }, [poll?.id, fetchVoteCounts]);

  const handleVote = async () => {
    if (!user?.uid || !poll?.id || !confirmVote) return;

    try {
      await castVote(user.uid, poll.id, confirmVote);
      setSelectedOption(confirmVote);
      // Save the selected option to localStorage
      localStorage.setItem(`selectedOption-${poll.id}`, confirmVote);
      setConfirmVote(null);
      toast.success(`Voted for: ${confirmVote}`);
      await fetchVoteCounts();
    } catch (error) {
      console.error("Error casting vote:", error);
      toast.error("Failed to cast vote.");
    }
  };

  const calculatePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return (votes / totalVotes) * 100;
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
    startDate: new Date(poll.startDate), // Convert to Date
    endDate: new Date(poll.endDate), // Convert to Date
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
        <div className="flex flex-col gap-3">
          {poll.options.map((option) => {
            const votes = voteCounts[option] || 0;
            const percentage = calculatePercentage(votes);

            return (
              <div key={option} className="flex flex-col gap-2">
                <DialogRoot>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setConfirmVote(option)}
                      disabled={selectedOption !== null}
                      className={`relative overflow-hidden px-3 py-1 rounded-full cursor-pointer ${
                        selectedOption === option
                          ? "bg-blue-500 text-white border border-blue-700"
                          : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-transparent"
                      } hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out ${
                        selectedOption !== null && selectedOption !== option
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {/* Progress bar inside the button */}
                      <div
                        className="absolute inset-0 h-4/6 mx-1 my-auto rounded-full bg-blue-400 dark:bg-blue-700"
                        style={{
                          width: `${percentage}%`,
                          zIndex: 0,
                        }}
                      ></div>

                      {/* Text content of the button */}
                      <span className="relative z-10 text-left w-full">
                        {option} - {votes} votes ({percentage.toFixed(2)}%)
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Your Vote</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <p>
                        Are you sure you want to vote for &quot;{option}&quot;?
                      </p>
                    </DialogBody>
                    <DialogFooter>
                      <DialogActionTrigger asChild>
                        <Button
                          onClick={() => {
                            setConfirmVote(null);
                          }}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </DialogActionTrigger>
                      <Button onClick={handleVote}>Continue</Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                  </DialogContent>
                </DialogRoot>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 justify-between mb-2 mt-3 px-2">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {totalVotes} total votes
          </div>
          <div className="flex items-center gap-1">
            <RefreshCcw onClick={refreshComponent} className="cursor-pointer" />
          </div>
        </div>
        <div className="px-2 text-sm text-gray-600 dark:text-gray-400">
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
