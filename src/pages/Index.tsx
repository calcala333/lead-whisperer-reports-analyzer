
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, User, Calendar, MapPin, Eye, Ruler, Weight, AlertTriangle, Shield } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecord, setShowRecord] = useState(false);

  // Sample wanted person data
  const wantedPerson = {
    name: "ASHBY JR WILLIAM R",
    alias: "BILLY ASHBY",
    address: "3550 W EVERGREEN AVE FL 2  CHICAGO  60651",
    sex: "M",
    dob: "11/21/1961",
    height: "5'05\"",
    weight: "160",
    hair: "BRO",
    eyes: "BRO",
    oln: "A210-9366-1331",
    olc: "D*",
    olt: "ORIGINAL",
    exp: "11/21/2028",
    iss: "09/21/2024",
    restrictions: "CORRECTIVE LENSES",
    charges: "IDENTITY THEFT, FRAUD, FORGERY",
    reward: "$50,000",
    dangerLevel: "HIGH",
    lastSeen: "CHICAGO, IL",
    caseNumber: "2024-7809-WNT",
    statuses: {
      dl: "SUSPENDED",
      tdl: "REVOKED",
      cdl: "INVALID",
      schlbus: "PROHIBITED"
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowRecord(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-red-900 text-white py-8 shadow-2xl border-b-4 border-red-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Shield className="h-12 w-12 text-red-300" />
            <div className="text-center">
              <h1 className="text-5xl font-bold tracking-wide">MOST WANTED</h1>
              <p className="text-red-200 text-xl mt-2 font-semibold">Federal Bureau of Investigation</p>
            </div>
            <Shield className="h-12 w-12 text-red-300" />
          </div>
          <div className="text-center">
            <p className="text-red-100 text-lg">Seeking Information Leading to Arrest</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8 shadow-2xl border-2 border-red-800 bg-gray-900/90 backdrop-blur-sm">
          <CardHeader className="bg-red-800 text-white rounded-t-lg border-b-2 border-red-600">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Search className="h-6 w-6" />
              FUGITIVE DATABASE SEARCH
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-gray-800">
            <div className="flex gap-4">
              <Input
                placeholder="Enter Name, Alias, or Case Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button 
                onClick={handleSearch}
                className="bg-red-700 hover:bg-red-800 px-8 text-lg font-bold"
              >
                <Search className="h-5 w-5 mr-2" />
                SEARCH
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wanted Person Display */}
        {showRecord && (
          <div className="space-y-6">
            {/* Alert Header */}
            <Card className="shadow-2xl border-4 border-red-600 bg-red-900/90 backdrop-blur-sm">
              <CardHeader className="bg-red-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <AlertTriangle className="h-8 w-8 animate-pulse" />
                  WANTED FUGITIVE - ARMED & DANGEROUS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <span className="text-sm font-medium text-red-200">REWARD</span>
                    <div className="text-4xl font-bold text-yellow-400">{wantedPerson.reward}</div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-red-200">DANGER LEVEL</span>
                    <Badge variant="destructive" className="ml-2 text-lg px-4 py-2 bg-red-600">
                      {wantedPerson.dangerLevel}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-red-200">CASE NUMBER</span>
                    <div className="text-xl font-mono font-bold text-white">{wantedPerson.caseNumber}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suspect Information */}
            <Card className="shadow-2xl border-2 border-gray-600 bg-gray-900/90 backdrop-blur-sm">
              <CardHeader className="bg-gray-800 text-white rounded-t-lg border-b-2 border-gray-700">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <User className="h-6 w-6" />
                  SUSPECT IDENTIFICATION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-gray-800 text-white">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-4xl font-bold text-red-400 mb-2">{wantedPerson.name}</h3>
                    <p className="text-xl text-gray-300">Also Known As: <span className="font-semibold text-yellow-400">{wantedPerson.alias}</span></p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="h-5 w-5 text-red-400" />
                    <span className="text-lg">Last Known Address: {wantedPerson.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <span className="text-lg font-semibold">Last Seen: {wantedPerson.lastSeen}</span>
                  </div>

                  <Separator className="my-6 bg-gray-600" />

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-400">SEX</span>
                      <p className="text-xl font-bold text-white">{wantedPerson.sex}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        DOB
                      </span>
                      <p className="text-xl font-bold text-white">{wantedPerson.dob}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                        <Ruler className="h-3 w-3" />
                        HEIGHT
                      </span>
                      <p className="text-xl font-bold text-white">{wantedPerson.height}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                        <Weight className="h-3 w-3" />
                        WEIGHT
                      </span>
                      <p className="text-xl font-bold text-white">{wantedPerson.weight}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400">HAIR</span>
                      <p className="text-xl font-bold text-white">{wantedPerson.hair}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        EYES
                      </span>
                      <p className="text-xl font-bold text-white">{wantedPerson.eyes}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Criminal Charges */}
            <Card className="shadow-2xl border-2 border-orange-600 bg-orange-900/90 backdrop-blur-sm">
              <CardHeader className="bg-orange-800 text-white rounded-t-lg">
                <CardTitle className="text-2xl">CRIMINAL CHARGES</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-orange-900 text-white">
                <div className="text-2xl font-bold text-orange-200">{wantedPerson.charges}</div>
                <Separator className="my-4 bg-orange-700" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm font-medium text-orange-300">LICENSE STATUS</span>
                    <Badge variant="destructive" className="ml-2 bg-red-700 text-white">
                      {wantedPerson.statuses.dl}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-orange-300">CDL STATUS</span>
                    <Badge variant="destructive" className="ml-2 bg-red-700 text-white">
                      {wantedPerson.statuses.cdl}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-orange-300">LICENSE NUMBER</span>
                    <p className="text-lg font-mono font-bold text-white">{wantedPerson.oln}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-orange-300">RESTRICTIONS</span>
                    <Badge variant="outline" className="ml-2 border-orange-400 text-orange-200">
                      {wantedPerson.restrictions}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning Notice */}
            <Card className="shadow-2xl border-4 border-yellow-500 bg-yellow-900/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-8 w-8 text-yellow-400 animate-pulse" />
                    <span className="text-2xl font-bold text-yellow-100">WARNING</span>
                    <AlertTriangle className="h-8 w-8 text-yellow-400 animate-pulse" />
                  </div>
                  <p className="text-xl font-semibold text-yellow-100">
                    DO NOT ATTEMPT TO APPREHEND. CONTACT LAW ENFORCEMENT IMMEDIATELY.
                  </p>
                  <p className="text-lg text-yellow-200">
                    If you have information regarding this fugitive, contact your local FBI office or call 1-800-CALL-FBI.
                  </p>
                </div>
                
                <Separator className="my-6 bg-yellow-700" />
                
                <div className="text-xs text-yellow-300 font-mono text-center space-y-1">
                  <p>FBI CASE FILE ACCESSED: 05JUN2025 10:08:25</p>
                  <p>CLASSIFICATION: CONFIDENTIAL - LAW ENFORCEMENT SENSITIVE</p>
                  <p>AUTHORIZED ACCESS ONLY - UNAUTHORIZED USE PROHIBITED</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!showRecord && (
          <div className="text-center py-16">
            <div className="space-y-4">
              <Shield className="h-24 w-24 text-red-400 mx-auto opacity-50" />
              <div className="text-gray-300 text-2xl font-semibold">
                Enter suspect information to search the fugitive database
              </div>
              <div className="text-gray-500 text-lg">
                Help us bring dangerous criminals to justice
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black text-white py-8 mt-12 border-t-4 border-red-600">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-red-400" />
            <p className="text-gray-300 text-lg font-semibold">
              Federal Bureau of Investigation - Most Wanted Division
            </p>
            <Shield className="h-6 w-6 text-red-400" />
          </div>
          <p className="text-sm text-gray-400">
            This system is for authorized law enforcement personnel only. Unauthorized access is a federal crime.
          </p>
          <p className="text-xs text-gray-500">
            Report tips: 1-800-CALL-FBI | Online: tips.fbi.gov
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
