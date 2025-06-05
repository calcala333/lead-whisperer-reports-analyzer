import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, User, Calendar, MapPin, Eye, Ruler, Weight, AlertTriangle, Shield, Settings, Users } from "lucide-react";
import AdminPanel from "@/components/AdminPanel";

interface WantedPerson {
  id: string;
  name: string;
  alias: string;
  address: string;
  sex: string;
  dob: string;
  height: string;
  weight: string;
  hair: string;
  eyes: string;
  oln?: string;
  olc?: string;
  olt?: string;
  exp?: string;
  iss?: string;
  restrictions?: string;
  charges: string;
  reward: string;
  dangerLevel: string;
  lastSeen: string;
  caseNumber: string;
  statuses?: {
    dl: string;
    tdl: string;
    cdl: string;
    schlbus: string;
  };
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecord, setShowRecord] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<WantedPerson | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Mock data with multiple wanted persons
  const [wantedPersons, setWantedPersons] = useState<WantedPerson[]>([
    {
      id: "1",
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
    },
    {
      id: "2",
      name: "RODRIGUEZ MARIA ELENA",
      alias: "LA SOMBRA",
      address: "1247 SUNSET BLVD  LOS ANGELES  90026",
      sex: "F",
      dob: "03/15/1985",
      height: "5'07\"",
      weight: "135",
      hair: "BLK",
      eyes: "BRO",
      charges: "DRUG TRAFFICKING, MONEY LAUNDERING, RACKETEERING",
      reward: "$100,000",
      dangerLevel: "EXTREME",
      lastSeen: "TIJUANA, MEXICO",
      caseNumber: "2024-8901-WNT"
    },
    {
      id: "3",
      name: "THOMPSON JAMES ROBERT",
      alias: "GHOST",
      address: "4521 MAPLE ST  DETROIT  48201",
      sex: "M",
      dob: "07/08/1978",
      height: "6'02\"",
      weight: "195",
      hair: "BLD",
      eyes: "BLU",
      charges: "ARMED ROBBERY, ASSAULT WITH DEADLY WEAPON",
      reward: "$25,000",
      dangerLevel: "HIGH",
      lastSeen: "DETROIT, MI",
      caseNumber: "2024-5634-WNT"
    },
    {
      id: "4",
      name: "CHEN WEI MING",
      alias: "THE PHANTOM",
      address: "789 BROADWAY  NEW YORK  10003",
      sex: "M",
      dob: "12/22/1990",
      height: "5'09\"",
      weight: "170",
      hair: "BLK",
      eyes: "BRO",
      charges: "CYBERCRIME, IDENTITY THEFT, WIRE FRAUD",
      reward: "$75,000",
      dangerLevel: "HIGH",
      lastSeen: "HONG KONG",
      caseNumber: "2024-9123-WNT"
    },
    {
      id: "5",
      name: "JACKSON TYRONE MARCUS",
      alias: "T-BONE",
      address: "2156 MLK JR BLVD  ATLANTA  30309",
      sex: "M",
      dob: "05/30/1983",
      height: "5'11\"",
      weight: "185",
      hair: "BLK",
      eyes: "BRO",
      charges: "MURDER, CONSPIRACY, RACKETEERING",
      reward: "$150,000",
      dangerLevel: "EXTREME",
      lastSeen: "MIAMI, FL",
      caseNumber: "2024-4567-WNT"
    },
    {
      id: "6",
      name: "VOLKOV DIMITRI ALEXEI",
      alias: "THE BEAR",
      address: "UNKNOWN",
      sex: "M",
      dob: "01/12/1975",
      height: "6'04\"",
      weight: "240",
      hair: "BRO",
      eyes: "GRN",
      charges: "TERRORISM, WEAPONS TRAFFICKING, MURDER",
      reward: "$500,000",
      dangerLevel: "EXTREME",
      lastSeen: "MOSCOW, RUSSIA",
      caseNumber: "2024-0001-WNT"
    }
  ]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const found = wantedPersons.find(person => 
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (found) {
        setSelectedPerson(found);
        setShowRecord(true);
      } else {
        // If not found, show the first person as example
        setSelectedPerson(wantedPersons[0]);
        setShowRecord(true);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddPerson = (personData: Omit<WantedPerson, 'id'>) => {
    const newPerson: WantedPerson = {
      ...personData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setWantedPersons([...wantedPersons, newPerson]);
  };

  const handleEditPerson = (id: string, personData: Omit<WantedPerson, 'id'>) => {
    setWantedPersons(wantedPersons.map(person => 
      person.id === id ? { ...personData, id } : person
    ));
  };

  const handleDeletePerson = (id: string) => {
    setWantedPersons(wantedPersons.filter(person => person.id !== id));
  };

  const currentPerson = selectedPerson || wantedPersons[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-red-900 text-white py-8 shadow-2xl border-b-4 border-red-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Shield className="h-12 w-12 text-red-300" />
              <div>
                <h1 className="text-5xl font-bold tracking-wide">MOST WANTED</h1>
                <p className="text-red-200 text-xl mt-2 font-semibold">Federal Bureau of Investigation</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowAdmin(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Settings className="h-5 w-5 mr-2" />
                Admin Panel
              </Button>
              <Badge variant="outline" className="border-red-300 text-red-100 text-lg px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                {wantedPersons.length} Active Cases
              </Badge>
            </div>
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
            <div className="mt-4 text-gray-300">
              <p className="text-sm">Try searching: {wantedPersons.slice(0, 3).map(p => p.name.split(' ')[0]).join(', ')}, or any case number</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Wanted Gallery */}
        {!showRecord && (
          <div className="mb-8">
            <Card className="shadow-2xl border-2 border-red-800 bg-gray-900/90 backdrop-blur-sm">
              <CardHeader className="bg-red-800 text-white rounded-t-lg">
                <CardTitle className="text-3xl text-center">TOP MOST WANTED FUGITIVES</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wantedPersons.slice(0, 6).map((person) => (
                    <Card 
                      key={person.id} 
                      className="bg-gray-800 border-red-600 cursor-pointer hover:bg-gray-700 transition-all duration-300 hover:scale-105 overflow-hidden relative"
                      onClick={() => {
                        setSelectedPerson(person);
                        setShowRecord(true);
                      }}
                    >
                      <div className="relative">
                        {/* Photo placeholder with overlay */}
                        <div className="h-64 bg-gradient-to-b from-gray-600 to-gray-800 flex items-center justify-center relative">
                          <User className="h-20 w-20 text-gray-400" />
                          
                          {/* High Risk Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge 
                              className={`text-white font-bold px-3 py-1 ${
                                person.dangerLevel === "EXTREME" ? "bg-red-600" : 
                                person.dangerLevel === "HIGH" ? "bg-orange-600" : "bg-yellow-600"
                              }`}
                            >
                              {person.dangerLevel} RISK
                            </Badge>
                          </div>

                          {/* Reward amount */}
                          <div className="absolute bottom-4 left-4">
                            <div className="text-green-400 font-bold text-2xl">
                              $ {person.reward.replace('$', '')}
                            </div>
                          </div>
                        </div>

                        {/* Person Details */}
                        <div className="p-4 space-y-3">
                          {/* Name */}
                          <div>
                            <h3 className="text-xl font-bold text-white tracking-wider">
                              {person.name}
                            </h3>
                            <p className="text-red-400 text-sm font-semibold">
                              AKA: {person.alias}
                            </p>
                            <p className="text-gray-400 text-xs font-mono">
                              #{person.caseNumber}
                            </p>
                          </div>

                          <Separator className="bg-gray-600" />

                          {/* Charges */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-400" />
                              <span className="text-red-300 font-semibold text-sm">CHARGES</span>
                            </div>
                            <p className="text-white text-sm">
                              {person.charges.length > 50 ? 
                                person.charges.substring(0, 50) + "..." : 
                                person.charges
                              }
                            </p>
                          </div>

                          {/* Last Seen */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-yellow-400" />
                              <span className="text-yellow-300 font-semibold text-sm">LAST SEEN</span>
                            </div>
                            <p className="text-white text-sm">{person.lastSeen}</p>
                          </div>

                          <Separator className="bg-gray-600" />

                          {/* Description */}
                          <div className="space-y-1">
                            <span className="text-gray-300 font-semibold text-sm">DESCRIPTION</span>
                            <p className="text-gray-300 text-xs">
                              {person.sex === 'M' ? 'Male' : 'Female'}, {
                                person.dob ? new Date().getFullYear() - new Date(person.dob).getFullYear() : 'Unknown'
                              } years old, {person.height}, {person.weight} lbs, {person.hair} hair, {person.eyes} eyes
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Wanted Person Display */}
        {showRecord && currentPerson && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setShowRecord(false)}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                ← Back to Gallery
              </Button>
            </div>

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
                    <div className="text-4xl font-bold text-yellow-400">{currentPerson.reward}</div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-red-200">DANGER LEVEL</span>
                    <Badge 
                      variant="destructive" 
                      className={`ml-2 text-lg px-4 py-2 ${
                        currentPerson.dangerLevel === "EXTREME" ? "bg-red-600" : "bg-orange-600"
                      }`}
                    >
                      {currentPerson.dangerLevel}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-red-200">CASE NUMBER</span>
                    <div className="text-xl font-mono font-bold text-white">{currentPerson.caseNumber}</div>
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
                    <h3 className="text-4xl font-bold text-red-400 mb-2">{currentPerson.name}</h3>
                    <p className="text-xl text-gray-300">Also Known As: <span className="font-semibold text-yellow-400">{currentPerson.alias}</span></p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="h-5 w-5 text-red-400" />
                    <span className="text-lg">Last Known Address: {currentPerson.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <span className="text-lg font-semibold">Last Seen: {currentPerson.lastSeen}</span>
                  </div>

                  <Separator className="my-6 bg-gray-600" />

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-400">SEX</span>
                      <p className="text-xl font-bold text-white">{currentPerson.sex}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        DOB
                      </span>
                      <p className="text-xl font-bold text-white">{currentPerson.dob}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                        <Ruler className="h-3 w-3" />
                        HEIGHT
                      </span>
                      <p className="text-xl font-bold text-white">{currentPerson.height}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                        <Weight className="h-3 w-3" />
                        WEIGHT
                      </span>
                      <p className="text-xl font-bold text-white">{currentPerson.weight}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400">HAIR</span>
                      <p className="text-xl font-bold text-white">{currentPerson.hair}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        EYES
                      </span>
                      <p className="text-xl font-bold text-white">{currentPerson.eyes}</p>
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
                <div className="text-2xl font-bold text-orange-200">{currentPerson.charges}</div>
                {currentPerson.statuses && (
                  <>
                    <Separator className="my-4 bg-orange-700" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm font-medium text-orange-300">LICENSE STATUS</span>
                        <Badge variant="destructive" className="ml-2 bg-red-700 text-white">
                          {currentPerson.statuses.dl}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-orange-300">CDL STATUS</span>
                        <Badge variant="destructive" className="ml-2 bg-red-700 text-white">
                          {currentPerson.statuses.cdl}
                        </Badge>
                      </div>
                      {currentPerson.oln && (
                        <div>
                          <span className="text-sm font-medium text-orange-300">LICENSE NUMBER</span>
                          <p className="text-lg font-mono font-bold text-white">{currentPerson.oln}</p>
                        </div>
                      )}
                      {currentPerson.restrictions && (
                        <div>
                          <span className="text-sm font-medium text-orange-300">RESTRICTIONS</span>
                          <Badge variant="outline" className="ml-2 border-orange-400 text-orange-200">
                            {currentPerson.restrictions}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </>
                )}
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
                Search the fugitive database or browse our most wanted
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

      {/* Admin Panel */}
      <AdminPanel
        people={wantedPersons}
        onAddPerson={handleAddPerson}
        onEditPerson={handleEditPerson}
        onDeletePerson={handleDeletePerson}
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
      />
    </div>
  );
};

export default Index;
