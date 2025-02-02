// polls.ts
import { db } from "./firebase";
import {
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  FieldValue,
  // doc,
  // getDoc,
  // updateDoc,
  // DocumentData,
  // Query,
  // CollectionReference,
} from "firebase/firestore";
import toast from "react-hot-toast";

// Define the Vote interface for type safety
interface Vote {
  pollId: string;
  option: string;
  userId: string;
  createdAt: FieldValue;
}

// Function to cast a vote for a poll
// Function to cast a vote for a poll
export const castVote = async (
  userId: string,
  pollId: string,
  option: string
): Promise<void> => {
  try {
    const voteRef = collection(db, "votes");
    const existingVoteRef = query(
      voteRef,
      where("pollId", "==", pollId),
      where("userId", "==", userId)
    );
    const existingVoteSnapshot = await getDocs(existingVoteRef);

    if (existingVoteSnapshot.docs.length > 0) {
      toast.error("You have already voted for this poll.");
      return; // Stop further execution
    }

    const voteData: Vote = {
      pollId,
      option,
      userId,
      createdAt: serverTimestamp(),
    };

    // Add the vote data to Firestore
    await addDoc(voteRef, voteData);
  } catch (error) {
    toast.error("Error casting vote.");
    console.error("Error casting vote:", error);
  }
};

// Function to undo a vote for a poll
export const undoVote = async (
  userId: string,
  pollId: string
): Promise<void> => {
  try {
    const voteRef = collection(db, "votes");
    const existingVoteRef = query(
      voteRef,
      where("pollId", "==", pollId),
      where("userId", "==", userId)
    );
    const existingVoteSnapshot = await getDocs(existingVoteRef);

    if (existingVoteSnapshot.docs.length === 0) {
      throw new Error("You have not voted for this poll.");
    }

    await deleteDoc(existingVoteSnapshot.docs[0].ref);
  } catch (error) {
    console.error("Error undoing vote:", error);
    throw error;
  }
};

// Function to retrieve the vote count for a poll
export const getVoteCount = async (
  pollId: string
): Promise<{ [option: string]: number }> => {
  try {
    const voteRef = collection(db, "votes");
    const pollVotesRef = query(voteRef, where("pollId", "==", pollId));
    const pollVotesSnapshot = await getDocs(pollVotesRef);

    const voteCount: { [option: string]: number } = {};

    pollVotesSnapshot.docs.forEach((doc) => {
      const voteData = doc.data();
      if (voteCount[voteData.option]) {
        voteCount[voteData.option]++;
      } else {
        voteCount[voteData.option] = 1;
      }
    });

    return voteCount;
  } catch (error) {
    console.error("Error getting vote count:", error);
    throw error;
  }
};

// Function to retrieve the total vote count for a poll
export const getTotalVoteCount = async (pollId: string): Promise<number> => {
  try {
    const voteCount = await getVoteCount(pollId);
    return Object.values(voteCount).reduce((acc, count) => acc + count, 0);
  } catch (error) {
    console.error("Error getting total vote count:", error);
    throw error;
  }
};
