import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      console.error("Camera permission denied:", error);
      return false;
    }
  };

  const startScanning = async () => {
    setCameraError(null);

    // Check camera permission first
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      const errorMsg =
        "Camera permission denied. Please enable camera access in browser settings.";
      setCameraError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setScanResult(decodedText);
          onScan(decodedText);
          stopScanning();
        },
        () => {
          // Ignore scanning errors (they happen frequently during normal operation)
        },
      );

      setIsScanning(true);
    } catch (error: any) {
      console.error("Error starting scanner:", error);
      const errorMsg =
        error.message || "Unable to start camera. Please try again.";
      setCameraError(errorMsg);
      onError?.(errorMsg);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  const handleManualEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;
    if (code) {
      setScanResult(code);
      onScan(code);
    }
  };

  return (
    <div className="space-y-4">
      {cameraError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">⚠️ {cameraError}</p>
          <p className="text-red-600 text-sm mt-1">
            You can still enter the code manually below.
          </p>
        </div>
      )}

      <div id="qr-reader" className="rounded-lg overflow-hidden shadow-lg" />

      <div className="flex justify-center gap-4">
        {!isScanning ? (
          <button onClick={startScanning} className="btn-primary w-full">
            📷 Start Camera Scan
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="btn-primary w-full bg-gray-600 hover:bg-gray-700"
          >
            ⏹️ Stop Camera
          </button>
        )}
      </div>

      {scanResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-semibold">✓ Scanned Successfully</p>
          <p className="text-green-600 text-sm mt-1">{scanResult}</p>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or enter code manually
          </span>
        </div>
      </div>

      <form onSubmit={handleManualEntry} className="flex gap-2">
        <input
          type="text"
          name="code"
          placeholder="Enter QR code"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sushi-red focus:border-transparent"
          required
        />
        <button type="submit" className="btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
