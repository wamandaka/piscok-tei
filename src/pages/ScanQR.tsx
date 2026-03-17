import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addPoints } from "../services/authService";
import QRScanner from "../components/QRScanner";

export default function ScanQR() {
  const { user, member, refreshMember } = useAuth();
  const [scanStatus, setScanStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [scanMessage, setScanMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = async (data: string) => {
    if (!user || isProcessing) return;

    setIsProcessing(true);
    setScanStatus("idle");

    try {
      const qrParts = data.split("-");

      if (qrParts.length < 3 || qrParts[0] !== "ST") {
        throw new Error("Invalid QR code format");
      }

      const basePoints = 100;
      const tierMultiplier =
        member?.tier === "Platinum" ? 2 : member?.tier === "Gold" ? 1.5 : 1;
      const earnedPoints = Math.floor(basePoints * tierMultiplier);

      const success = await addPoints(
        user.id,
        earnedPoints,
        `QR Scan: ${data.substring(0, 20)}...`,
        qrParts[1] || "Unknown Location",
      );

      if (success) {
        setScanStatus("success");
        setScanMessage(`✓ Successfully earned ${earnedPoints} points!`);
        await refreshMember();
      } else {
        throw new Error("Failed to add points");
      }
    } catch (error: any) {
      setScanStatus("error");
      setScanMessage(
        error.message || "Failed to process QR code. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: string) => {
    setScanStatus("error");
    setScanMessage(error);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📷 Scan QR Code
        </h1>
        <p className="text-gray-600 mb-6">
          Scan the QR code from your receipt to earn points
        </p>

        {/* Current Points Display */}
        {member && (
          <div className="card bg-gradient-to-r from-sushi-red to-red-600 text-white mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-75">Your Points</p>
                <p className="text-3xl font-bold">
                  {member.points.toLocaleString()}
                </p>
              </div>
              <div className="text-5xl">🍣</div>
            </div>
          </div>
        )}

        {/* Scanner */}
        <div className="card">
          <QRScanner onScan={handleScan} onError={handleError} />
        </div>

        {/* Status Messages */}
        {scanStatus === "success" && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-green-800 font-semibold text-lg">
              {scanMessage}
            </p>
            <button
              onClick={() => {
                setScanStatus("idle");
                setScanMessage("");
              }}
              className="mt-4 text-green-600 font-medium hover:underline"
            >
              Scan Another Code
            </button>
          </div>
        )}

        {scanStatus === "error" && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">❌</div>
            <p className="text-red-800 font-semibold">{scanMessage}</p>
            <button
              onClick={() => {
                setScanStatus("idle");
                setScanMessage("");
              }}
              className="mt-4 text-red-600 font-medium hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
            <p className="text-blue-800 font-medium">Processing your scan...</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 card bg-blue-50 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-3">
            ℹ️ How to Earn Points
          </h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Make a purchase at any Piscok Tei restaurant</li>
            <li>2. Find the QR code on your receipt</li>
            <li>3. Scan the QR code using this page</li>
            <li>4. Points will be added to your account instantly!</li>
          </ol>
          <div className="mt-4 pt-4 border-t border-blue-200 text-sm">
            <p className="font-medium">Tier Multipliers:</p>
            <ul className="mt-1 space-y-1">
              <li>🥈 Silver: 1x points</li>
              <li>🥇 Gold: 1.5x points</li>
              <li>💎 Platinum: 2x points</li>
            </ul>
          </div>
        </div>

        {/* Demo QR Code */}
        <div className="mt-6 card bg-gray-50">
          <h3 className="font-bold text-gray-700 mb-2">🧪 Test Mode</h3>
          <p className="text-sm text-gray-600 mb-3">
            Use this demo QR code to test the scanning feature:
          </p>
          <div className="bg-white p-4 rounded-lg inline-block">
            <p className="font-mono text-sm break-all">ST-MAIN-DEMO-1234</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter this code manually or create a QR code from it
          </p>
        </div>
      </div>
    </div>
  );
}
