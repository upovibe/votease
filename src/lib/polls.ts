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

// Function to check if the user is an admin
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() && userDoc.data()?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Function to create a poll (default: active, but flagged can override visibility)
export const createPoll = async (
  userId: string,
  pollData: { title: string; options: string[]; startDate: Date; endDate: Date }
): Promise<void> => {
  try {
    if (!pollData || !pollData.title || !pollData.options?.length) {
      throw new Error("Invalid poll data. Ensure title, options, startDate, and endDate are provided.");
    }

    await addDoc(collection(db, "polls"), {
      ...pollData,
      creatorId: userId,
      createdAt: new Date(),
      status: "active",
      flagged: false,
    });
  } catch (error) {
    console.error("Error creating poll:", error);
    throw error;
  }
};

// Function to edit a poll (avoids overwriting protected fields)
export const editPoll = async (
  userId: string,
  pollId: string,
  pollData: Partial<{ title: string; options: string[]; startDate: Date; endDate: Date }>
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
export const viewPolls = async (filter: { status?: string; flagged?: boolean } = {}): Promise<DocumentData[]> => {
  try {
    let pollsQuery: Query<DocumentData> | CollectionReference<DocumentData> = collection(db, "polls");
    if (filter.status) {
      pollsQuery = query(pollsQuery, where("status", "==", filter.status));
    }
    if (filter.flagged !== undefined) {
      pollsQuery = query(pollsQuery, where("flagged", "==", filter.flagged));
    }
    const querySnapshot = await getDocs(pollsQuery);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
