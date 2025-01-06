"use client";

import React, { useState, useEffect } from "react";
import { viewPolls, deletePoll, flagPoll, isAdmin } from "@/lib/polls";
import { Avatar } from "@/components/ui/avatar";
import { PlayCircle, Lock, Trash, Flag, FlagOff } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/dateUtils";

interface Poll {
  id: string;
  title: string;
  statement: string;
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
  const [currentUserId] = useState<string>("5nAhIg1OJCWT6xrvPgHfkeJ3tLr1"); // Example user ID
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const fetchedPolls = await viewPolls({ creatorId: currentUserId });
        setPolls(fetchedPolls);
      } catch (error) {
        setError(error instanceof Error ? `Error fetching polls: ${error.message}` : "An unknown error occurred");
      }
    };

    const checkAdminStatus = async () => {
      const adminStatus = await isAdmin(currentUserId);
      setIsAdminUser(adminStatus);
    };

    fetchPolls();
    checkAdminStatus();
  }, [currentUserId]);

  const handleDelete = async (pollId: string) => {
    try {
      await deletePoll(currentUserId, pollId);
      setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
      toast.success("Poll deleted successfully.");
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Failed to delete poll.");
    }
  };

  const handleFlagToggle = async (pollId: string, flagged: boolean) => {
    try {
      await flagPoll(currentUserId, pollId, flagged ? "active" : "flagged");
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.id === pollId ? { ...poll, flagged: !flagged, status: flagged ? "active" : "inactive" } : poll
        )
      );
      toast.success(flagged ? "Poll unflagged successfully." : "Poll flagged successfully.");
    } catch (error) {
      console.error("Error flagging/unflagging poll:", error);
      toast.error("Failed to flag/unflag poll.");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      {polls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {polls.map((poll) => (
            <div
              key={poll.id}
              className="border rounded-lg shadow-md p-4 bg-white flex flex-col"
            >
              <div className="flex items-center mb-2">
                <Avatar
                  size="sm"
                  name="avatar"
                  src={poll.creatorAvatar}
                  className="mr-2"
                />
                <span className="font-semibold">{poll.creatorName || "Unknown Creator"}</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{poll.title}</h3>
              <p className="text-gray-600 mb-3">{poll.statement}</p>
              <p className="text-sm text-gray-500">
                <strong>Created:</strong> {formatDate(poll.createdAt)}
                {poll.endDate && (
                  <>
                    {" | "}
                    <strong>Ends:</strong> {formatDate(poll.endDate)}
                  </>
                )}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span
                  className={`text-sm font-medium ${
                    poll.status === "active" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {poll.status === "active" ? (
                    <>
                      <PlayCircle size={16} className="inline-block mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <Lock size={16} className="inline-block mr-1" />
                      Inactive
                    </>
                  )}
                </span>
                <span
                  className={`text-sm ${
                    poll.flagged ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {poll.flagged ? (
                    <Flag size={16} className="inline-block" />
                  ) : (
                    <FlagOff size={16} className="inline-block" />
                  )}
                </span>
              </div>
              {(poll.creatorId === currentUserId || isAdminUser) && (
                <div className="flex justify-end space-x-2 mt-4">
                  {isAdminUser && (
                    <button
                      onClick={() => handleFlagToggle(poll.id, poll.flagged)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {poll.flagged ? "Unflag" : "Flag"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(poll.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={16} className="inline-block mr-1" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No polls available.</p>
      )}
    </div>
  );
};

export default PollsList;
