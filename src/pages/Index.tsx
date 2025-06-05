
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, User, Calendar, MapPin, Eye, Ruler, Weight } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecord, setShowRecord] = useState(false);

  // Sample driver record data
  const driverRecord = {
    name: "ASHBY JR WILLIAM R",
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
    statuses: {
      dl: "VALID",
      tdl: "SEE ILOLNHELP",
      cdl: "SEE ILOLNHELP",
      schlbus: "NOT A SCHOOL BUS DRIVER (SEE ILOLNHELP)"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-blue-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Secretary of State</h1>
          <p className="text-blue-200 text-center mt-2">Driver License Information System</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-blue-800 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Driver Record Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Input
                placeholder="Enter Driver License Number or Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-lg"
              />
              <Button 
                onClick={handleSearch}
                className="bg-blue-700 hover:bg-blue-800 px-8"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Driver Record Display */}
        {showRecord && (
          <div className="space-y-6">
            {/* Status Header */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-green-700 text-white rounded-t-lg">
                <CardTitle>License Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">DL/IP STATUS</span>
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                      {driverRecord.statuses.dl}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">TDL/TIP STATUS</span>
                    <Badge variant="outline" className="ml-2">
                      {driverRecord.statuses.tdl}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">CDL/CIP STATUS</span>
                    <Badge variant="outline" className="ml-2">
                      {driverRecord.statuses.cdl}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">SCHOOL BUS</span>
                    <Badge variant="outline" className="ml-2">
                      NOT QUALIFIED
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-blue-800 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Driver Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{driverRecord.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span>{driverRecord.address}</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">SEX</span>
                      <p className="text-lg font-semibold">{driverRecord.sex}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        DOB
                      </span>
                      <p className="text-lg font-semibold">{driverRecord.dob}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Ruler className="h-3 w-3" />
                        HEIGHT
                      </span>
                      <p className="text-lg font-semibold">{driverRecord.height}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Weight className="h-3 w-3" />
                        WEIGHT
                      </span>
                      <p className="text-lg font-semibold">{driverRecord.weight}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">HAIR</span>
                      <p className="text-lg font-semibold">{driverRecord.hair}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        EYES
                      </span>
                      <p className="text-lg font-semibold">{driverRecord.eyes}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* License Details */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gray-800 text-white rounded-t-lg">
                <CardTitle>License Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-600">LICENSE NUMBER</span>
                    <p className="text-xl font-mono font-bold text-blue-900">{driverRecord.oln}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">CLASS</span>
                    <p className="text-lg font-semibold">{driverRecord.olc}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">TYPE</span>
                    <p className="text-lg font-semibold">{driverRecord.olt}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">ISSUED</span>
                    <p className="text-lg font-semibold">{driverRecord.iss}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">EXPIRES</span>
                    <p className="text-xl font-bold text-red-600">{driverRecord.exp}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">RESTRICTIONS</span>
                    <Badge variant="default" className="ml-2 bg-orange-100 text-orange-800">
                      {driverRecord.restrictions}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>NO STOPS IN EFFECT</strong></p>
                  <p><strong>NO CONV LAST 12 MO</strong></p>
                  <p><strong>DIGITAL ISSUE</strong></p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-xs text-gray-500 font-mono">
                  <p>MRI 478007 IN: SOS 73097 AT 05JUN2025 10:08:25</p>
                  <p>OUT: M7J 213 AT 05JUN2025 10:08:26</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!showRecord && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Enter a driver license number or name to begin your search
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            © 2025 Secretary of State - Driver License Information System
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Authorized personnel only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
