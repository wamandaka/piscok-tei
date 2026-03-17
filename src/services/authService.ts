import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, googleProvider, db } from "../config/firebase";
import type { User, Member } from "../types";

// Generate unique member number
const generateMemberNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ST-${timestamp}-${random}`;
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if member exists, if not create new member
    const memberRef = doc(db, "members", user.uid);
    const memberDoc = await getDoc(memberRef);

    if (!memberDoc.exists()) {
      // Create new member document
      const newMember: Omit<Member, "id"> = {
        userId: user.uid,
        memberNumber: generateMemberNumber(),
        tier: "Silver",
        points: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        joinedAt: new Date(),
        lastActivity: new Date(),
      };

      await setDoc(memberRef, {
        ...newMember,
        joinedAt: serverTimestamp(),
        lastActivity: serverTimestamp(),
      });
    }

    return {
      id: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || undefined,
      phoneNumber: user.phoneNumber || undefined,
    };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return null;
  }
};

// Sign out
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// Get current user
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve({
          id: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || undefined,
          phoneNumber: user.phoneNumber || undefined,
        });
      } else {
        resolve(null);
      }
    });
  });
};

// Get member data
export const getMemberData = async (userId: string): Promise<Member | null> => {
  try {
    const memberRef = doc(db, "members", userId);
    const memberDoc = await getDoc(memberRef);

    if (memberDoc.exists()) {
      const data = memberDoc.data();
      return {
        id: memberDoc.id,
        ...data,
        joinedAt: data.joinedAt?.toDate() || new Date(),
        lastActivity: data.lastActivity?.toDate(),
      } as Member;
    }
    return null;
  } catch (error) {
    console.error("Error getting member data:", error);
    return null;
  }
};

// Add points to member
export const addPoints = async (
  memberId: string,
  points: number,
  description: string,
  restaurantLocation?: string,
): Promise<boolean> => {
  try {
    const memberRef = doc(db, "members", memberId);
    const memberDoc = await getDoc(memberRef);

    if (!memberDoc.exists()) return false;

    const currentData = memberDoc.data();
    const newPoints = (currentData.points || 0) + points;
    const newTotalEarned = (currentData.totalEarned || 0) + points;

    // Calculate new tier based on points
    let newTier: Member["tier"] = "Silver";
    if (newPoints >= 5000) {
      newTier = "Platinum";
    } else if (newPoints >= 1000) {
      newTier = "Gold";
    }

    await updateDoc(memberRef, {
      points: newPoints,
      totalEarned: newTotalEarned,
      tier: newTier,
      lastActivity: serverTimestamp(),
    });

    // Add transaction record
    const transactionRef = doc(collection(db, "transactions"));
    await setDoc(transactionRef, {
      memberId,
      type: "earn",
      points,
      description,
      restaurantLocation,
      timestamp: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error adding points:", error);
    return false;
  }
};

// Redeem points for reward
export const redeemPoints = async (
  memberId: string,
  points: number,
  rewardId: string,
  description: string,
): Promise<boolean> => {
  try {
    const memberRef = doc(db, "members", memberId);
    const memberDoc = await getDoc(memberRef);

    if (!memberDoc.exists()) return false;

    const currentData = memberDoc.data();
    const currentPoints = currentData.points || 0;

    if (currentPoints < points) {
      console.error("Insufficient points");
      return false;
    }

    await updateDoc(memberRef, {
      points: currentPoints - points,
      totalRedeemed: (currentData.totalRedeemed || 0) + points,
      lastActivity: serverTimestamp(),
    });

    // Add transaction record
    const transactionRef = doc(collection(db, "transactions"));
    await setDoc(transactionRef, {
      memberId,
      type: "redeem",
      points: -points,
      description,
      rewardId,
      timestamp: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error redeeming points:", error);
    return false;
  }
};

// Get member transactions
export const getMemberTransactions = async (memberId: string) => {
  try {
    const transactionsRef = collection(db, "transactions");
    const q = query(transactionsRef, where("memberId", "==", memberId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error("Error getting transactions:", error);
    return [];
  }
};
