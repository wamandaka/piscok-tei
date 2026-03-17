import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addPoints, getMemberTransactions } from "../services/authService";
import type { Transaction } from "../types";
import PointsCard from "../components/PointsCard";

export default function Dashboard() {
  const { user, member, isLoading, refreshMember } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const loadTransactions = async () => {
    if (user) {
      const txData = await getMemberTransactions(user.id);
      setTransactions(txData as Transaction[]);
    }
  };

  const handleQuickAddPoints = async () => {
    if (!user) return;

    const success = await addPoints(user.id, 100, "Quick add - Demo");
    if (success) {
      await refreshMember();
      await loadTransactions();
      alert("✓ 100 points added successfully!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sushi-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.displayName || "Member"}!
          </h1>
          <p className="text-gray-600">
            Track your points and redeem exciting rewards
          </p>
        </div>

        {/* Points Card */}
        {member && <PointsCard member={member} />}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/scan")}
            className="card text-center hover:shadow-xl transition-shadow bg-sushi-red text-white"
          >
            <div className="text-3xl mb-2">📷</div>
            <p className="font-semibold">Scan QR</p>
          </button>
          <button
            onClick={() => navigate("/rewards")}
            className="card text-center hover:shadow-xl transition-shadow bg-sushi-red text-white"
          >
            <div className="text-3xl mb-2">🎁</div>
            <p className="font-semibold">Rewards</p>
          </button>
        </div>

        {/* Demo Button */}
        <button
          onClick={handleQuickAddPoints}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          🎯 Demo: Add 100 Points
        </button>

        {/* Transaction History */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recent Transactions
          </h2>
          <div className="card">
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No transactions yet. Start earning points by scanning QR codes!
              </p>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {tx.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {tx.timestamp instanceof Date
                          ? tx.timestamp.toLocaleDateString()
                          : new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`font-bold ${
                        tx.type === "earn" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "earn" ? "+" : ""}
                      {tx.points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* How to Earn Section */}
        <div className="mt-8 card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <h2 className="text-xl font-bold mb-4">How to Earn Points</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>Dine in at any Piscok Tei restaurant</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>Scan QR code on your receipt</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>Participate in special promotions</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>Refer friends to join</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
