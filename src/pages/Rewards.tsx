import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { redeemPoints } from "../services/authService";
import type { Reward } from "../types";
import PointsCard from "../components/PointsCard";

const sampleRewards: Reward[] = [
  {
    id: "1",
    name: "Free Miso Soup",
    description: "Get a free miso soup with any purchase",
    pointsRequired: 200,
    category: "free_item",
    isActive: true,
    termsAndConditions:
      "Valid for one-time use. Cannot be combined with other offers.",
  },
  {
    id: "2",
    name: "10% Discount Voucher",
    description: "Get 10% off your next purchase",
    pointsRequired: 500,
    category: "discount",
    isActive: true,
    termsAndConditions: "Valid for 30 days. Maximum discount of Rp 50,000.",
  },
  {
    id: "3",
    name: "Free Salmon Sushi (2 pcs)",
    description: "Enjoy 2 pieces of salmon sushi on us",
    pointsRequired: 800,
    category: "free_item",
    isActive: true,
    termsAndConditions: "Valid for dine-in only.",
  },
  {
    id: "4",
    name: "Rp 50,000 Voucher",
    description: "Get Rp 50,000 off your bill",
    pointsRequired: 1000,
    category: "voucher",
    isActive: true,
    termsAndConditions:
      "Valid for 60 days. Minimum purchase of Rp 200,000 required.",
  },
  {
    id: "5",
    name: "Free Tempura Ice Cream",
    description: "Delicious tempura ice cream dessert",
    pointsRequired: 600,
    category: "free_item",
    isActive: true,
    termsAndConditions: "While stocks last.",
  },
  {
    id: "6",
    name: "20% Discount Voucher",
    description: "Get 20% off your next purchase",
    pointsRequired: 1500,
    category: "discount",
    isActive: true,
    termsAndConditions: "Valid for 30 days. Maximum discount of Rp 100,000.",
  },
  {
    id: "7",
    name: "Free Chirashi Don",
    description: "Enjoy a free Chirashi Don bowl",
    pointsRequired: 2000,
    category: "free_item",
    isActive: true,
    termsAndConditions: "Valid for dine-in only. One per visit.",
  },
  {
    id: "8",
    name: "VIP Omakase Experience",
    description: "Exclusive omakase dinner for two",
    pointsRequired: 10000,
    category: "exclusive",
    isActive: true,
    termsAndConditions: "Reservation required. Subject to availability.",
  },
];

export default function Rewards() {
  const { user, member, refreshMember } = useAuth();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const handleRedeem = async () => {
    if (!user || !selectedReward || !member) return;

    if (member.points < selectedReward.pointsRequired) {
      alert("Insufficient points!");
      return;
    }

    setIsRedeeming(true);
    try {
      const success = await redeemPoints(
        user.id,
        selectedReward.pointsRequired,
        selectedReward.id,
        `Redeemed: ${selectedReward.name}`,
      );

      if (success) {
        alert(`✓ Successfully redeemed ${selectedReward.name}!`);
        setSelectedReward(null);
        await refreshMember();
      } else {
        alert("Failed to redeem. Please try again.");
      }
    } catch (error) {
      console.error("Error redeeming:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsRedeeming(false);
    }
  };

  const filteredRewards =
    filter === "all"
      ? sampleRewards
      : sampleRewards.filter((r) => r.category === filter);

  const categories = ["all", "voucher", "free_item", "discount", "exclusive"];

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🎁 Rewards</h1>

        {/* Points Summary */}
        {member && <PointsCard member={member} />}

        {/* Category Filter */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                filter === cat
                  ? "bg-sushi-red text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat === "all"
                ? "All Rewards"
                : cat.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className="card hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reward.category === "exclusive"
                      ? "bg-purple-100 text-purple-700"
                      : reward.category === "voucher"
                        ? "bg-blue-100 text-blue-700"
                        : reward.category === "discount"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {reward.category.replace("_", " ")}
                </span>
                <span className="text-2xl">
                  {reward.category === "exclusive"
                    ? "💎"
                    : reward.category === "voucher"
                      ? "🎫"
                      : reward.category === "discount"
                        ? "🏷️"
                        : "🍣"}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {reward.name}
              </h3>
              <p className="text-gray-600 mb-4">{reward.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-sushi-red">
                  {reward.pointsRequired.toLocaleString()} pts
                </span>
                <button
                  onClick={() => setSelectedReward(reward)}
                  disabled={!member || member.points < reward.pointsRequired}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    member && member.points >= reward.pointsRequired
                      ? "bg-sushi-red text-white hover:bg-red-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Redeem
                </button>
              </div>

              {member && member.points < reward.pointsRequired && (
                <p className="text-sm text-gray-500 mt-2">
                  Need{" "}
                  {(reward.pointsRequired - member.points).toLocaleString()}{" "}
                  more points
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Redeem Modal */}
        {selectedReward && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Confirm Redemption</h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-semibold text-lg">{selectedReward.name}</p>
                <p className="text-gray-600">{selectedReward.description}</p>
                <p className="text-sushi-red font-bold mt-2">
                  {selectedReward.pointsRequired.toLocaleString()} points
                </p>
              </div>

              {selectedReward.termsAndConditions && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Terms:</strong> {selectedReward.termsAndConditions}
                  </p>
                </div>
              )}

              {member && (
                <p className="text-sm text-gray-600 mb-4">
                  Your balance:{" "}
                  <strong>{member.points.toLocaleString()}</strong> points →
                  After:{" "}
                  <strong>
                    {(
                      member.points - selectedReward.pointsRequired
                    ).toLocaleString()}
                  </strong>{" "}
                  points
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedReward(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRedeem}
                  disabled={isRedeeming}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {isRedeeming ? "Processing..." : "Confirm Redeem"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
