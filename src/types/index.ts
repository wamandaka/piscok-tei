export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
}

export interface Member {
  id: string;
  userId: string;
  memberNumber: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  points: number;
  totalEarned: number;
  totalRedeemed: number;
  joinedAt: Date;
  lastActivity?: Date;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  imageUrl?: string;
  category: 'voucher' | 'free_item' | 'discount' | 'exclusive';
  isActive: boolean;
  termsAndConditions?: string;
}

export interface Transaction {
  id: string;
  memberId: string;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  timestamp: Date;
  rewardId?: string;
  restaurantLocation?: string;
  receiptImage?: string;
}

export interface ScanHistory {
  id: string;
  memberId: string;
  qrCodeData: string;
  scannedAt: Date;
  pointsEarned: number;
  isValid: boolean;
}
