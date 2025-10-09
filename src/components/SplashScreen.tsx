import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield } from "lucide-react";

interface SplashScreenProps {
  onAccept: () => void;
  disclaimerText: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAccept, disclaimerText }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="h-8 w-8" />
            <h1 className="text-3xl font-bold">RESTRICTED ACCESS</h1>
            <Shield className="h-8 w-8" />
          </div>
          <p className="text-center text-sm opacity-90">
            Law Enforcement Personnel Only
          </p>
        </div>

        {/* Disclaimer Content */}
        <div className="p-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-bold text-yellow-900 mb-2">
                  IMPORTANT DISCLAIMER
                </h2>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  {disclaimerText}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">
              By clicking "I Accept", you acknowledge that:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>You are authorized law enforcement personnel</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>You understand the sensitive nature of this information</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>You will use this system in accordance with department policies</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Your access and activities are logged and monitored</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Unauthorized access or misuse is subject to prosecution</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={onAccept}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-bold rounded-lg shadow-lg"
            >
              I ACCEPT - ENTER SYSTEM
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            This acknowledgment is required each time you access this system
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
