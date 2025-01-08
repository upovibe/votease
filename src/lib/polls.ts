// polls.ts
import { db } from "./firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  // DocumentData,
  // Query,
  // CollectionReference,
} from "firebase/firestore";

interface Poll {
  id: string;
  title: string;
  statement?: string;
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

interface User {
  role: string;
}

// Function to check if the user is an admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      return userData.role === "admin";
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Function to create a poll (default: active, but flagged can override visibility)
export const createPoll = async (
  userId: string,
  pollData: {
    title: string;
    statement: string;
    options: string[];
    startDate: Date;
    endDate: Date;
  }
): Promise<void> => {
  try {
    if (!pollData?.title || !pollData?.options?.length) {
      throw new Error(
        "Invalid poll data. Ensure title, options, startDate, and endDate are provided."
      );
    }

    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      await addDoc(collection(db, "polls"), {
        ...pollData,
        creatorId: userId,
        creatorName: userData.name,
        creatorAvatar: userData.avatar,
        createdAt: serverTimestamp(),
        status: "active",
        flagged: false,
      });
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error("Error creating poll:", error);
    throw error;
  }
};

// Function to edit a poll (avoids overwriting protected fields)
export const editPoll = async (
  userId: string,
  pollId: string,
  pollData: Partial<Poll>
): Promise<void> => {
  try {
    const pollDocRef = doc(db, "polls", pollId);
    const pollDoc = await getDoc(pollDocRef);

    if (pollDoc.exists()) {
      const poll = pollDoc.data();
      if (poll.creatorId === userId || (await isAdmin(userId))) {
        await updateDoc(pollDocRef, pollData);
      } else {
        throw new Error("You do not have permission to edit this poll.");
      }
    } else {
      throw new Error("Poll not found.");
    }
  } catch (error) {
    console.error("Error editing poll:", error);
    throw error;
  }
};

// Function to delete a poll
export const deletePoll = async (
  userId: string,
  pollId: string
): Promise<void> => {
  try {
    const pollDocRef = doc(db, "polls", pollId);
    const pollDoc = await getDoc(pollDocRef);

    if (pollDoc.exists()) {
      const poll = pollDoc.data();
      if (poll.creatorId === userId || (await isAdmin(userId))) {
        await deleteDoc(pollDocRef);
      } else {
        throw new Error("You do not have permission to delete this poll.");
      }
    } else {
      throw new Error("Poll not found.");
    }
  } catch (error) {
    console.error("Error deleting poll:", error);
    throw error;
  }
};

// Function to fetch polls with optional filters
export const viewPolls = async (
  filter: Partial<Pick<Poll, "status" | "flagged" | "creatorId">> = {}
): Promise<Poll[]> => {
  try {
    const pollsRef = collection(db, "polls");

    const validFilters = Object.entries(filter).filter(
      ([, value]) => value !== undefined 
    );

    const queryConditions = validFilters.map(([field, value]) =>
      where(field, "==", value)
    );

    const pollsQuery = queryConditions.length
      ? query(pollsRef, ...queryConditions)
      : pollsRef;

    const snapshot = await getDocs(pollsQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Poll));
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw new Error("Unable to fetch polls.");
  }
};



// Function to flag a poll as inappropriate (admin only)
export const flagPoll = async (
  userId: string,
  pollId: string,
  flagType: "active" | "flagged"
): Promise<void> => {
  try {
    if (await isAdmin(userId)) {
      const pollDocRef = doc(db, "polls", pollId);
      if (flagType === "flagged") {
        await updateDoc(pollDocRef, { flagged: true, status: "inactive" });
      } else if (flagType === "active") {
        await updateDoc(pollDocRef, { status: "active", flagged: false });
      } else {
        throw new Error("Invalid flag type.");
      }
    } else {
      throw new Error("You do not have permission to flag polls.");
    }
  } catch (error) {
    console.error("Error flagging poll:", error);
    throw error;
  }
};
