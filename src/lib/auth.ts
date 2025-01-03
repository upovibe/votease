import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    UserCredential,
    User,
  } from "firebase/auth";
  import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    // collection,
    // query,
    // where,
    // getDocs,
    DocumentData,
    DocumentReference,
  } from "firebase/firestore";
  import { auth, db } from "./firebase";
  
  // Use environment variable for admin email
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "default_admin_email";
  
  // Type for user profile update data
  type UserProfileUpdate = {
    name?: string;
    email?: string;
    provider?: string;
    photoURL?: string;
  };
  
  // Function to sign up a new user
  export const signupUser = async (
    email: string,
    password: string
  ): Promise<User> => {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
  
      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.email ? user.email.split("@")[0] : "",
        provider: "email",
        photoURL: user.photoURL,
        createdAt: new Date(),
      });
  
      return user;
    } catch (error: unknown) {
      if ((error as { code?: string }).code === 'auth/email-already-in-use') {
        console.error("Error signing up user: Email already in use");
        throw new Error("Email already in use. Please use a different email.");
      } else {
        console.error("Error signing up user:", (error as Error).message);
        throw error;
      }
    }
  };
  
  // Function to sign in with Google
  export const signInWithGoogle = async (): Promise<User> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Save user data to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          name: user.email?.split("@")[0] || "",
          provider: "google",
          photoURL: user.photoURL,
          lastLogin: new Date(),
        },
        { merge: true }
      );
  
      return user;
    } catch (error) {
      console.error("Error signing in with Google:", (error as Error).message);
      throw error;
    }
  };
  
  // Function to sign in with email and password
  export const signinUser = async (
    email: string,
    password: string
  ): Promise<User> => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in user:", (error as Error).message);
      throw error;
    }
  };
  
  // Function to log out the user
  export const logoutUser = async (): Promise<void> => {
    try {
      await signOut(auth);
      console.log("User successfully signed out");
    } catch (error) {
      console.error("Error signing out user:", (error as Error).message);
      throw error;
    }
  };
  
  // Function to update user profile
  export const updateUserProfile = async (
    userId: string,
    updateData: UserProfileUpdate
  ): Promise<void> => {
    try {
      const userRef: DocumentReference<DocumentData> = doc(db, "users", userId);
      await updateDoc(userRef, updateData);
      console.log("User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", (error as Error).message);
      throw error;
    }
  };
  
  // Function to fetch user details by user ID
  export const fetchUserDetails = async (
    userId: string
  ): Promise<DocumentData | undefined> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user details:", (error as Error).message);
      throw error;
    }
  };
  
  // Function to check if the user is an admin
  export const isAdmin = (email: string): boolean => email === adminEmail;