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
  DocumentData,
  Query,
  CollectionReference,
} from "firebase/firestore";

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
  pollData: { title: string; statement: string; options: string[]; startDate: Date; endDate: Date }
): Promise<void> => {
  try {
    if (!pollData?.title || !pollData?.options?.length) {
      throw new Error("Invalid poll data. Ensure title, options, startDate, and endDate are provided.");
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
        createdAt: new Date(),
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
export const deletePoll = async (userId: string, pollId: string): Promise<void> => {
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

// Function to view polls (with optional filters and proper typing)
export const viewPolls = async (filter: { 
  status?: string; 
  flagged?: boolean; 
  creatorId?: string 
} = {}): Promise<Poll[]> => {
  try {
    const pollsQuery = collection(db, "polls");
    const conditions = [];
    
    if (filter.status) {
      conditions.push(where("status", "==", filter.status));
    }
    if (filter.flagged !== undefined) {
      conditions.push(where("flagged", "==", filter.flagged));
    }
    if (filter.creatorId) {
      conditions.push(where("creatorId", "==", filter.creatorId));
    }

    const finalQuery = conditions.length > 0 ? query(pollsQuery, ...conditions) : pollsQuery;
    const querySnapshot = await getDocs(finalQuery);

    const polls = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Poll));
    console.log("Fetched polls from Firestore:", polls); // Debugging
    return polls;
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw error;
  }
};



// Function to flag a poll as inappropriate (admin only)
export const flagPoll = async (userId: string, pollId: string, flagType: "active" | "flagged"): Promise<void> => {
  try {
    if (await isAdmin(userId)) {
      const pollDocRef = doc(db, "polls", pollId);
      if (flagType === "flagged") {
        await updateDoc(pollDocRef, { flagged: true, status: "inactive" }); // Mark as flagged and inactive
      } else if (flagType === "active") {
        await updateDoc(pollDocRef, { status: "active", flagged: false }); // Approve and unflag
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