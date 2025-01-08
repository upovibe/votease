"use client";

import React, { useState, useEffect } from "react";
import { viewPolls, deletePoll, flagPoll, isAdmin } from "@/lib/polls";
import { Avatar } from "@/components/ui/avatar";
import { Flag, FlagOff, CheckCheck, X, Vote, View } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { EllipsisVertical } from "lucide-react";
import DeletePollDialog from "@/components/layouts/DeletePollDialog";
import FlagPollDialog from "@/components/layouts/FlagPollDialog";
import EditPollDialog from "@/components/layouts/EditPollDialog";
import Toolbar from "@/components/layouts/Toolbar";
import FirstPollCTA from "@/components/layouts/FirstPollCTA";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";

interface Poll {
  id: string;
  title: string;
  slug?: string;
  statement: string;
  options: string[];
  creatorId: string;
  createdAt: Date;
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

interface PollsListProps {
  filterByCreator?: boolean;
}

const PollsList: React.FC<PollsListProps> = ({ filterByCreator = false }) => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pollLoading, setPollLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      if (!user?.uid) return;

      try {
        setPollLoading(true);
        const fetchedPolls = await viewPolls({
          creatorId: filterByCreator ? user.uid : undefined,
        });
        setPolls(
          fetchedPolls.map((poll) => ({
            ...poll,
            statement: poll.statement ?? "",
          }))
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? `Error fetching polls: ${error.message}`
            : "An unknown error occurred"
        );
      } finally {
        setPollLoading(false);
      }
    };

    const checkAdminStatus = async () => {
      if (user?.uid) {
        const adminStatus = await isAdmin(user.uid);
        setIsAdminUser(adminStatus);
      }
    };

    fetchPolls();
    checkAdminStatus();
  }, [user?.uid, filterByCreator]);

  const handleDelete = async (pollId: string) => {
    if (!user?.uid) return;

    try {
      await deletePoll(user.uid, pollId);
      setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
      toast.success("Poll deleted successfully.");
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Failed to delete poll.");
    }
  };

  const handleFlagToggle = async (pollId: string) => {
    if (!user?.uid) return;

    try {
      const poll = polls.find((p) => p.id === pollId);
      if (poll) {
        const newStatus = poll.flagged ? "active" : "flagged";
        await flagPoll(user.uid, pollId, newStatus);
        setPolls((prevPolls) =>
          prevPolls.map((poll) =>
            poll.id === pollId
              ? { ...poll, flagged: !poll.flagged, status: newStatus }
              : poll
          )
        );
        toast.success(
          poll.flagged
            ? "Poll unflagged successfully."
            : "Poll flagged successfully."
        );
      }
    } catch (error) {
      console.error("Error flagging/unflagging poll:", error);
      toast.error("Failed to flag/unflag poll.");
    }
  };

  const mapPollToPollData = (poll: Poll): PollData => ({
    title: poll.title,
    statement: poll.statement,
    options: poll.options,
    startDate: new Date(),
    endDate: new Date(),
  });

  const filteredPolls = polls.filter(
    (poll) =>
      poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.statement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || pollLoading) {
    return <Loading />;
  }

  if (!user) {
    return <div>Please log in to view polls.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle navigation
  const handleViewPoll = (poll: Poll) => {
    if (poll.slug) {
      router.push(`/dashboard/polls/${poll.slug}`);
    } else {
      console.error("Poll slug is missing.");
    }
  };

  return (
    <div className="p-4 space-y-5">
      {polls.length > 0 && <Toolbar setSearchQuery={setSearchQuery} />}

      {polls.length === 0 ? (
        <FirstPollCTA />
      ) : filteredPolls.length > 0 ? (
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPolls.map((poll) => (
            <div
              key={poll.id}
              onClick={() => handleViewPoll(poll)}
              className="border border-gray-500/50 dark:border-gray-700/50 bg-white/80 dark:bg-[#0a0a0a] rounded-lg shadow p-5 flex flex-col gap-3 cursor-pointer hover:border-gray-500 dark:hover:border-gray-400 transition-all duration-200 ease-linear"
            >
              <div className="flex items-center w-full justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Avatar
                    name="avatar"
                    src={poll.creatorAvatar}
                    className="size-6"
                  />
                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {poll.creatorName || "Unknown Creator"}
                  </span>
                </div>
                {(isAdminUser || poll.creatorId === user.uid) && (
                  <MenuRoot>
                    <MenuTrigger asChild>
                      <div onClick={(event) => event.stopPropagation()}>
                        <EllipsisVertical />
                      </div>
                    </MenuTrigger>
                    <MenuContent>
                      <MenuItem value="view">
                        <Link
                          href={"/dashboard/polls/slug"}
                          className="w-full h-5 flex justify-start items-center rounded-md border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-200 gap-2"
                        >
                          <View className="size-4" />
                          <span>View</span>
                        </Link>
                      </MenuItem>
                      {isAdminUser && (
                        <MenuItem value="flag">
                          <FlagPollDialog
                            pollId={poll.id}
                            flagged={poll.flagged}
                            onFlagToggle={handleFlagToggle}
                          />
                        </MenuItem>
                      )}
                      <MenuItem value="edit">
                        <EditPollDialog
                          pollId={poll.id}
                          currentData={mapPollToPollData(poll)}
                        />
                      </MenuItem>
                      <MenuItem value="delete">
                        <DeletePollDialog
                          pollId={poll.id}
                          onDelete={handleDelete}
                        />
                      </MenuItem>
                    </MenuContent>
                  </MenuRoot>
                )}
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 dark:bg-gray-200/50 w-fit px-3 py-1 rounded-full">
                <Vote className="size-4 text-white dark:text-black" />
                <h3 className="font-semibold text-sm text-white dark:text-black">
                  {poll.title}
                </h3>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <Link
                  href="/dashboard/polls/slug"
                  className="text-gray-600 dark:text-gray-200 hover:underline"
                >
                  {poll.statement}
                </Link>
                <br />
                <div className="flex items-center justify-between">
                  <p className="space-x-1">
                    <strong> {formatDate(poll.createdAt)}</strong>
                    <span
                      className={`text-sm font-medium ${
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
                  </p>
                  <span
                    className={`text-sm ${
                      poll.flagged
                        ? "text-red-500 dark:text-red-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {poll.flagged ? (
                      <Flag size={16} className="inline-block" />
                    ) : (
                      <FlagOff size={16} className="inline-block" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No polls match your search criteria.
        </p>
      )}
    </div>
  );
};

export default PollsList;
