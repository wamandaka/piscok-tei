import type { Member } from "../types";

interface PointsCardProps {
  member: Member;
}

export default function PointsCard({ member }: PointsCardProps) {
  const tierColors = {
    Silver: "from-gray-400 to-gray-600",
    Gold: "from-yellow-400 to-yellow-600",
    Platinum: "from-purple-400 to-purple-600",
  };

  const tierBenefits = {
    Silver: { multiplier: "1x", bonus: "0%" },
    Gold: { multiplier: "1.5x", bonus: "10%" },
    Platinum: { multiplier: "2x", bonus: "20%" },
  };

  const nextTier =
    member.tier === "Silver"
      ? "Gold (1000 pts)"
      : member.tier === "Gold"
        ? "Platinum (5000 pts)"
        : "Max Tier";

  const pointsToNextTier =
    member.tier === "Silver"
      ? 1000 - member.points
      : member.tier === "Gold"
        ? 5000 - member.points
        : 0;

  return (
    <div className="card bg-gradient-to-br from-sushi-red to-red-700 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-medium opacity-90">Member Points</h2>
          <p className="text-sm opacity-75">#{member.memberNumber}</p>
        </div>
        <div
          className={`px-4 py-2 rounded-full bg-gradient-to-r ${tierColors[member.tier]} font-bold text-sm`}
        >
          {member.tier}
        </div>
      </div>

      <div className="text-center py-6">
        <p className="text-5xl font-bold mb-2">
          {member.points.toLocaleString()}
        </p>
        <p className="text-sm opacity-75">Available Points</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center mb-4">
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-2xl font-bold">
            {member.totalEarned.toLocaleString()}
          </p>
          <p className="text-xs opacity-75">Total Earned</p>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-2xl font-bold">
            {member.totalRedeemed.toLocaleString()}
          </p>
          <p className="text-xs opacity-75">Total Redeemed</p>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-2xl font-bold">
            {tierBenefits[member.tier].multiplier}
          </p>
          <p className="text-xs opacity-75">Points Multiplier</p>
        </div>
      </div>

      {member.tier !== "Platinum" && (
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to {nextTier}</span>
            <span>
              {Math.max(0, pointsToNextTier).toLocaleString()} pts needed
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{
                width: `${Math.min(100, (member.points / (member.tier === "Silver" ? 1000 : 5000)) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 text-xs opacity-75 text-center">
        <p>💰 {tierBenefits[member.tier].bonus} bonus on all purchases</p>
      </div>
    </div>
  );
}
