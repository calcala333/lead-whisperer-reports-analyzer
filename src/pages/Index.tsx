import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, User, Calendar, MapPin, Eye, Ruler, Weight, AlertTriangle, Shield, Settings, Users, ChevronLeft, ChevronRight, CreditCard, Home, Building2, Zap, Target, Pill, FileText } from "lucide-react";
import AdminPanel from "@/components/AdminPanel";

interface WantedPerson {
  id: string;
  // Subject Demographics
  lastName: string;
  firstName: string;
  middleName: string;
  sex: string;
  race: string;
  age: string;
  birthDate: string;
  deceased: string;
  height: string;
  weight: string;
  
  // Identification
  driversLicenseNumber: string;
  driversLicenseState: string;
  
  // Address of Residence
  addressOfResidence: string;
  district: string;
  majorityDistrict: string;
  
  // IDOC Information
  idocNumber: string;
  idocAddressOfResidence: string;
  idocDistrict: string;
  
  // Criminal Record Details
  latestArrestCB: string;
  latestFelonyArrestCB: string;
  onParole: string;
  latestContact: string;
  latestContactDistrict: string;
  latestWarrant: string;
  latestInvestigativeAlert: string;
  
  // Domestic Violence Arrest Record
  domesticViolenceArrestCount: string;
  latestDomesticViolenceArrestDate: string;
  
  // Weapons Arrest Record
  weaponsPossession: string;
  weaponsArrestCount: string;
  latestWeaponsArrestDate: string;
  
  // Narcotics Arrest Record
  narcoticsPossession: string;
  narcoticsArrestCount: string;
  latestNarcoticsArrestDate: string;

  // Legacy fields for compatibility
  name?: string;
  alias?: string;
  address?: string;
  dob?: string;
  hair?: string;
  eyes?: string;
  charges: string;
  dangerLevel: string;
  lastSeen: string;
  orderOfProtection?: boolean;
  protectionExpirationDate?: string;
  photos?: string[];
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecord, setShowRecord] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<WantedPerson | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [photoIndexes, setPhotoIndexes] = useState<{[key: string]: number}>({});
  const [systemName, setSystemName] = useState("Police Wanted System");

  // Mock data with multiple wanted persons - updated to match new interface
  const [wantedPersons, setWantedPersons] = useState<WantedPerson[]>([
    {
      id: "1",
      lastName: "ASHBY JR",
      firstName: "WILLIAM",
      middleName: "R",
      sex: "M",
      race: "WHI",
      age: "62",
      birthDate: "11/21/1961",
      deceased: "N",
      height: "5'05\"",
      weight: "160",
      driversLicenseNumber: "A210-9366-1331",
      driversLicenseState: "IL",
      addressOfResidence: "3550 W EVERGREEN AVE FL 2  CHICAGO  60651",
      district: "011",
      majorityDistrict: "011",
      idocNumber: "No Data",
      idocAddressOfResidence: "No Data",
      idocDistrict: "No Data",
      latestArrestCB: "HX123456",
      latestFelonyArrestCB: "No Data",
      onParole: "No Data",
      latestContact: "15 NOV 2024 @ 14:30",
      latestContactDistrict: "011",
      latestWarrant: "No Data",
      latestInvestigativeAlert: "No Data",
      domesticViolenceArrestCount: "No Data",
      latestDomesticViolenceArrestDate: "No Data",
      weaponsPossession: "N",
      weaponsArrestCount: "No Data",
      latestWeaponsArrestDate: "No Data",
      narcoticsPossession: "N",
      narcoticsArrestCount: "No Data",
      latestNarcoticsArrestDate: "No Data",
      name: "ASHBY JR WILLIAM R",
      alias: "BILLY ASHBY",
      address: "3550 W EVERGREEN AVE FL 2  CHICAGO  60651",
      dob: "11/21/1961",
      hair: "BRO",
      eyes: "BRO",
      charges: "IDENTITY THEFT, FRAUD, FORGERY",
      dangerLevel: "HIGH",
      lastSeen: "CHICAGO, IL",
      orderOfProtection: true,
      protectionExpirationDate: "2029-11-21",
      photos: []
    },
    {
      id: "2",
      lastName: "RODRIGUEZ",
      firstName: "MARIA",
      middleName: "ELENA",
      sex: "F",
      race: "HIS",
      age: "39",
      birthDate: "03/15/1985",
      deceased: "N",
      height: "5'07\"",
      weight: "135",
      driversLicenseNumber: "No Data",
      driversLicenseState: "No Data",
      addressOfResidence: "1247 SUNSET BLVD  LOS ANGELES  90026",
      district: "Unknown",
      majorityDistrict: "Unknown",
      idocNumber: "No Data",
      idocAddressOfResidence: "No Data",
      idocDistrict: "No Data",
      latestArrestCB: "LA987654",
      latestFelonyArrestCB: "LA987654",
      onParole: "No Data",
      latestContact: "No Data",
      latestContactDistrict: "Unknown",
      latestWarrant: "Active",
      latestInvestigativeAlert: "Armed & Dangerous",
      domesticViolenceArrestCount: "No Data",
      latestDomesticViolenceArrestDate: "No Data",
      weaponsPossession: "Y",
      weaponsArrestCount: "3",
      latestWeaponsArrestDate: "12 JAN 2024",
      narcoticsPossession: "Y",
      narcoticsArrestCount: "5",
      latestNarcoticsArrestDate: "20 FEB 2024",
      name: "RODRIGUEZ MARIA ELENA",
      alias: "LA SOMBRA",
      address: "1247 SUNSET BLVD  LOS ANGELES  90026",
      dob: "03/15/1985",
      hair: "BLK",
      eyes: "BRO",
      charges: "DRUG TRAFFICKING, MONEY LAUNDERING, RACKETEERING",
      dangerLevel: "EXTREME",
      lastSeen: "TIJUANA, MEXICO",
      orderOfProtection: false
    },
    {
      id: "3",
      lastName: "THOMPSON",
      firstName: "JAMES",
      middleName: "ROBERT",
      sex: "M",
      race: "BLK",
      age: "46",
      birthDate: "07/08/1978",
      deceased: "N",
      height: "6'02\"",
      weight: "195",
      driversLicenseNumber: "No Data",
      driversLicenseState: "No Data",
      addressOfResidence: "4521 MAPLE ST  DETROIT  48201",
      district: "003",
      majorityDistrict: "003",
      idocNumber: "No Data",
      idocAddressOfResidence: "No Data",
      idocDistrict: "No Data",
      latestArrestCB: "DT456789",
      latestFelonyArrestCB: "DT456789",
      onParole: "No Data",
      latestContact: "08 OCT 2024 @ 09:15",
      latestContactDistrict: "003",
      latestWarrant: "Active",
      latestInvestigativeAlert: "No Data",
      domesticViolenceArrestCount: "2",
      latestDomesticViolenceArrestDate: "15 SEP 2024",
      weaponsPossession: "Y",
      weaponsArrestCount: "1",
      latestWeaponsArrestDate: "08 OCT 2024",
      narcoticsPossession: "N",
      narcoticsArrestCount: "No Data",
      latestNarcoticsArrestDate: "No Data",
      name: "THOMPSON JAMES ROBERT",
      alias: "GHOST",
      address: "4521 MAPLE ST  DETROIT  48201",
      dob: "07/08/1978",
      hair: "BLD",
      eyes: "BLU",
      charges: "ARMED ROBBERY, ASSAULT WITH DEADLY WEAPON",
      dangerLevel: "HIGH",
      lastSeen: "DETROIT, MI",
      orderOfProtection: true,
      protectionExpirationDate: "2026-07-08"
    },
    {
      id: "4",
      lastName: "CHEN",
      firstName: "WEI",
      middleName: "MING",
      sex: "M",
      race: "ASI",
      age: "34",
      birthDate: "12/22/1990",
      deceased: "N",
      height: "5'09\"",
      weight: "170",
      driversLicenseNumber: "No Data",
      driversLicenseState: "No Data",
      addressOfResidence: "789 BROADWAY  NEW YORK  10003",
      district: "001",
      majorityDistrict: "001",
      idocNumber: "No Data",
      idocAddressOfResidence: "No Data",
      idocDistrict: "No Data",
      latestArrestCB: "NY112233",
      latestFelonyArrestCB: "NY112233",
      onParole: "No Data",
      latestContact: "No Data",
      latestContactDistrict: "001",
      latestWarrant: "Active",
      latestInvestigativeAlert: "Cyber Criminal",
      domesticViolenceArrestCount: "No Data",
      latestDomesticViolenceArrestDate: "No Data",
      weaponsPossession: "N",
      weaponsArrestCount: "No Data",
      latestWeaponsArrestDate: "No Data",
      narcoticsPossession: "N",
      narcoticsArrestCount: "No Data",
      latestNarcoticsArrestDate: "No Data",
      name: "CHEN WEI MING",
      alias: "THE PHANTOM",
      address: "789 BROADWAY  NEW YORK  10003",
      dob: "12/22/1990",
      hair: "BLK",
      eyes: "BRO",
      charges: "CYBERCRIME, IDENTITY THEFT, WIRE FRAUD",
      dangerLevel: "HIGH",
      lastSeen: "HONG KONG",
      orderOfProtection: false
    },
    {
      id: "5",
      lastName: "JACKSON",
      firstName: "TYRONE",
      middleName: "MARCUS",
      sex: "M",
      race: "BLK",
      age: "41",
      birthDate: "05/30/1983",
      deceased: "N",
      height: "5'11\"",
      weight: "185",
      driversLicenseNumber: "No Data",
      driversLicenseState: "No Data",
      addressOfResidence: "2156 MLK JR BLVD  ATLANTA  30309",
      district: "005",
      majorityDistrict: "005",
      idocNumber: "No Data",
      idocAddressOfResidence: "No Data",
      idocDistrict: "No Data",
      latestArrestCB: "AT789012",
      latestFelonyArrestCB: "AT789012",
      onParole: "No Data",
      latestContact: "No Data",
      latestContactDistrict: "005",
      latestWarrant: "Active",
      latestInvestigativeAlert: "Extremely Dangerous",
      domesticViolenceArrestCount: "No Data",
      latestDomesticViolenceArrestDate: "No Data",
      weaponsPossession: "Y",
      weaponsArrestCount: "4",
      latestWeaponsArrestDate: "18 MAR 2024",
      narcoticsPossession: "Y",
      narcoticsArrestCount: "2",
      latestNarcoticsArrestDate: "05 JAN 2024",
      name: "JACKSON TYRONE MARCUS",
      alias: "T-BONE",
      address: "2156 MLK JR BLVD  ATLANTA  30309",
      dob: "05/30/1983",
      hair: "BLK",
      eyes: "BRO",
      charges: "MURDER, CONSPIRACY, RACKETEERING",
      dangerLevel: "EXTREME",
      lastSeen: "MIAMI, FL",
      orderOfProtection: true,
      protectionExpirationDate: "2035-05-30"
    },
    {
      id: "6",
      lastName: "VOLKOV",
      firstName: "DIMITRI",
      middleName: "ALEXEI",
      sex: "M",
      race: "WHI",
      age: "49",
      birthDate: "01/12/1975",
      deceased: "N",
      height: "6'04\"",
      weight: "240",
      driversLicenseNumber: "No Data",
      driversLicenseState: "No Data",
      addressOfResidence: "UNKNOWN",
      district: "Unknown",
      majorityDistrict: "Unknown",
      idocNumber: "No Data",
      idocAddressOfResidence: "No Data",
      idocDistrict: "No Data",
      latestArrestCB: "No Data",
      latestFelonyArrestCB: "No Data",
      onParole: "No Data",
      latestContact: "No Data",
      latestContactDistrict: "Unknown",
      latestWarrant: "International",
      latestInvestigativeAlert: "Terrorist",
      domesticViolenceArrestCount: "No Data",
      latestDomesticViolenceArrestDate: "No Data",
      weaponsPossession: "Y",
      weaponsArrestCount: "Unknown",
      latestWeaponsArrestDate: "No Data",
      narcoticsPossession: "N",
      narcoticsArrestCount: "No Data",
      latestNarcoticsArrestDate: "No Data",
      name: "VOLKOV DIMITRI ALEXEI",
      alias: "THE BEAR",
      address: "UNKNOWN",
      dob: "01/12/1975",
      hair: "BRO",
      eyes: "GRN",
      charges: "TERRORISM, WEAPONS TRAFFICKING, MURDER",
      dangerLevel: "EXTREME",
      lastSeen: "MOSCOW, RUSSIA",
      orderOfProtection: false
    }
  ]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const found = wantedPersons.find(person => 
        (person.name && person.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (person.alias && person.alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
        `${person.lastName} ${person.firstName}`.toLowerCase().includes(searchQuery.toLowerCase())
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

  const nextPhoto = (personId: string, totalPhotos: number) => {
    setPhotoIndexes(prev => ({
      ...prev,
      [personId]: ((prev[personId] || 0) + 1) % totalPhotos
    }));
  };

  const prevPhoto = (personId: string, totalPhotos: number) => {
    setPhotoIndexes(prev => ({
      ...prev,
      [personId]: ((prev[personId] || 0) - 1 + totalPhotos) % totalPhotos
    }));
  };

  const getCurrentPhotoIndex = (personId: string) => photoIndexes[personId] || 0;

  const isOrderOfProtectionActive = (person: WantedPerson) => {
    if (!person.orderOfProtection || !person.protectionExpirationDate) return false;
    const expirationDate = new Date(person.protectionExpirationDate);
    const today = new Date();
    return expirationDate > today;
  };

  const handleUpdateSystemName = (newName: string) => {
    setSystemName(newName);
  };

  const currentPerson = selectedPerson || wantedPersons[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white py-8 shadow-2xl border-b-4 border-blue-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Shield className="h-12 w-12 text-blue-200" />
              <h1 className="text-3xl font-bold">{systemName}</h1>
            </div>
            <div className="flex gap-4">
              {showRecord && (
                <Button
                  onClick={() => setShowRecord(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Home
                </Button>
              )}
              <Button
                onClick={() => setShowAdmin(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                <Settings className="h-5 w-5 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8 shadow-2xl border-2 border-blue-200">
          <CardHeader className="bg-blue-500 text-white rounded-t-lg border-b-2 border-blue-300">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Search className="h-6 w-6" />
              Search Database
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="flex gap-4">
              <Input
                placeholder="Enter Name or Alias"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-lg border-gray-300"
              />
              <Button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 px-8 text-lg font-bold"
              >
                <Search className="h-5 w-5 mr-2" />
                SEARCH
              </Button>
            </div>
            <div className="mt-4 text-gray-600">
              <p className="text-sm">Try searching: {wantedPersons.slice(0, 3).map(p => p.firstName).join(', ')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Wanted Gallery */}
        {!showRecord && (
          <div className="mb-8">
            <Card className="shadow-2xl border-2 border-blue-200">
              <CardHeader className="bg-blue-500 text-white rounded-t-lg">
                <CardTitle className="text-3xl text-center">Wanted Individuals</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wantedPersons.slice(0, 6).map((person) => {
                    const currentPhotoIndex = getCurrentPhotoIndex(person.id);
                    const hasPhotos = person.photos && person.photos.length > 0;
                    const hasMultiplePhotos = person.photos && person.photos.length > 1;
                    const isProtectionActive = isOrderOfProtectionActive(person);
                    
                    return (
                      <Card 
                        key={person.id} 
                        className="bg-white border-gray-300 cursor-pointer hover:bg-gray-50 transition-all duration-300 hover:scale-105 overflow-hidden relative shadow-lg"
                        onClick={() => {
                          setSelectedPerson(person);
                          setShowRecord(true);
                        }}
                      >
                        <div className="relative">
                          {/* Photo placeholder with overlay */}
                          <div className="h-64 bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center relative">
                            {hasPhotos ? (
                              <img 
                                src={person.photos[currentPhotoIndex]} 
                                alt={`${person.firstName} ${person.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-20 w-20 text-gray-500" />
                            )}
                            
                            {/* Photo navigation for multiple photos */}
                            {hasMultiplePhotos && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    prevPhoto(person.id, person.photos!.length);
                                  }}
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    nextPhoto(person.id, person.photos!.length);
                                  }}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                  {person.photos!.map((_, index) => (
                                    <div
                                      key={index}
                                      className={`w-2 h-2 rounded-full ${
                                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                            
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

                            {/* Order of Protection Bubble */}
                            {isProtectionActive && (
                              <div className="absolute top-3 right-3">
                                <div className="relative group">
                                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                                    <Shield className="h-5 w-5 text-white" />
                                  </div>
                                  {/* Tooltip */}
                                  <div className="absolute right-0 top-10 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Order of Protection
                                    <br />
                                    Expires: {person.protectionExpirationDate ? new Date(person.protectionExpirationDate).toLocaleDateString() : 'N/A'}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Person Details */}
                          <div className="p-4 space-y-3">
                            {/* Name */}
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 tracking-wider cursor-pointer hover:text-blue-600 transition-colors">
                                {person.name || `${person.lastName}, ${person.firstName} ${person.middleName}`.trim()}
                              </h3>
                              <p className="text-red-600 text-sm font-semibold">
                                AKA: {person.alias || 'Unknown'}
                              </p>
                              
                              {/* Active Order of Protection - Prominently displayed under name */}
                              {isProtectionActive && (
                                <div className="mt-2 bg-purple-100 border-2 border-purple-400 rounded-lg p-2 shadow-sm">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-purple-600 animate-pulse" />
                                    <span className="text-purple-800 font-bold text-sm">ACTIVE ORDER OF PROTECTION</span>
                                  </div>
                                  <p className="text-purple-700 text-xs mt-1 font-medium">
                                    Expires: {person.protectionExpirationDate ? new Date(person.protectionExpirationDate).toLocaleDateString() : 'N/A'}
                                  </p>
                                </div>
                              )}
                            </div>

                            <Separator className="bg-gray-200" />

                            {/* Charges */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-red-600 font-semibold text-sm">CHARGES</span>
                              </div>
                              <p className="text-gray-800 text-sm">
                                {person.charges.length > 50 ? 
                                  person.charges.substring(0, 50) + "..." : 
                                  person.charges
                                }
                              </p>
                            </div>

                            {/* Last Seen */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-orange-500" />
                                <span className="text-orange-600 font-semibold text-sm">LAST SEEN</span>
                              </div>
                              <p className="text-gray-800 text-sm">{person.lastSeen}</p>
                            </div>

                            <Separator className="bg-gray-200" />

                            {/* Description */}
                            <div className="space-y-1">
                              <span className="text-gray-700 font-semibold text-sm">DESCRIPTION</span>
                              <p className="text-gray-600 text-xs">
                                {person.sex === 'M' ? 'Male' : 'Female'}, {person.age} years old, {person.height}, {person.weight} lbs, {person.hair || 'Unknown'} hair, {person.eyes || 'Unknown'} eyes
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
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
                className="border-gray-400 text-gray-700"
              >
                ← Back to Gallery
              </Button>
            </div>

            {/* Alert Header */}
            <Card className="shadow-2xl border-4 border-red-600 bg-red-50">
              <CardHeader className="bg-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <AlertTriangle className="h-8 w-8 animate-pulse" />
                  SUSPECT INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <span className="text-sm font-medium text-red-700">DANGER LEVEL</span>
                    <Badge 
                      variant="destructive" 
                      className={`ml-2 text-lg px-4 py-2 ${
                        currentPerson.dangerLevel === "EXTREME" ? "bg-red-600" : "bg-orange-600"
                      }`}
                    >
                      {currentPerson.dangerLevel}
                    </Badge>
                  </div>
                  {isOrderOfProtectionActive(currentPerson) && (
                    <div className="text-center">
                      <span className="text-sm font-medium text-red-700">ORDER OF PROTECTION</span>
                      <div className="text-xl font-bold text-purple-600">
                        Active - Expires: {currentPerson.protectionExpirationDate ? new Date(currentPerson.protectionExpirationDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Subject Demographics */}
            <Card className="shadow-2xl border-2 border-gray-300 bg-white">
              <CardHeader className="bg-blue-500 text-white rounded-t-lg border-b-2 border-blue-200">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <User className="h-6 w-6" />
                  SUBJECT DEMOGRAPHICS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white text-gray-800">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Name</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.lastName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">First Name</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.firstName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Middle Name</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.middleName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Sex</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.sex}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Race</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.race}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Age</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.age}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Birth Date
                    </span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.birthDate}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Deceased</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.deceased}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Ruler className="h-3 w-3" />
                      Height
                    </span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.height}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Weight className="h-3 w-3" />
                      Weight
                    </span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.weight}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Identification */}
            <Card className="shadow-2xl border-2 border-gray-300 bg-white">
              <CardHeader className="bg-green-500 text-white rounded-t-lg border-b-2 border-green-200">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <CreditCard className="h-6 w-6" />
                  IDENTIFICATION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Driver's License #</span>
                    <p className="text-xl font-mono font-bold text-gray-800">{currentPerson.driversLicenseNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Driver's License State</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.driversLicenseState}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address of Residence */}
            <Card className="shadow-2xl border-2 border-gray-300 bg-white">
              <CardHeader className="bg-purple-500 text-white rounded-t-lg border-b-2 border-purple-200">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Home className="h-6 w-6" />
                  ADDRESS OF RESIDENCE
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-500">Address of Residence</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.addressOfResidence}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">District</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.district}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Majority District</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.majorityDistrict}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* IDOC Information */}
            <Card className="shadow-2xl border-2 border-gray-300 bg-white">
              <CardHeader className="bg-indigo-500 text-white rounded-t-lg border-b-2 border-indigo-200">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Building2 className="h-6 w-6" />
                  IDOC INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">IDOC #</span>
                    <p className="text-xl font-mono font-bold text-gray-800">{currentPerson.idocNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">District</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.idocDistrict}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-500">IDOC Address of Residence</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.idocAddressOfResidence}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Criminal Record Details */}
            <Card className="shadow-2xl border-2 border-gray-300 bg-white">
              <CardHeader className="bg-red-500 text-white rounded-t-lg border-b-2 border-red-200">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Zap className="h-6 w-6" />
                  CRIMINAL RECORD DETAILS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Latest Arrest CB #</span>
                    <p className="text-xl font-mono font-bold text-gray-800">{currentPerson.latestArrestCB}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Latest Felony Arrest CB #</span>
                    <p className="text-xl font-mono font-bold text-gray-800">{currentPerson.latestFelonyArrestCB}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">On Parole</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.onParole}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Latest Contact</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.latestContact}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Latest Contact District</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.latestContactDistrict}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Latest Warrant</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.latestWarrant}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-500">Latest Investigative Alert</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.latestInvestigativeAlert}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Domestic Violence Arrest Record */}
            <Card className="shadow-2xl border-2 border-gray-300 bg-white">
              <CardHeader className="bg-pink-500 text-white rounded-t-lg border-b-2 border-pink-200">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <AlertTriangle className="h-6 w-6" />
                  DOMESTIC VIOLENCE ARREST RECORD
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Arrest Count</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.domesticViolenceArrestCount}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Latest Arrest Date</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.latestDomesticViolenceArrestDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weapons Arrest Record */}
            <Card className="shadow-2xl border-2 border-gray-300 bg-white">
              <CardHeader className="bg-orange-500 text-white rounded-t-lg border-b-2 border-orange-200">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Target className="h-6 w-6" />
                  WEAPONS ARREST RECORD
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Possession</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.weaponsPossession}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Arrest Count</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.weaponsArrestCount}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Latest Arrest Date</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.latestWeaponsArrestDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Narcotics Arrest Record */}
            <Card className="shadow-2xl border-2 border-gray-300 bg-white">
              <CardHeader className="bg-yellow-500 text-white rounded-t-lg border-b-2 border-yellow-200">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Pill className="h-6 w-6" />
                  NARCOTICS ARREST RECORD
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Possession</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.narcoticsPossession}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Arrest Count</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.narcoticsArrestCount}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Latest Arrest Date</span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.latestNarcoticsArrestDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="shadow-2xl border-2 border-gray-300 bg-white">
              <CardHeader className="bg-gray-600 text-white rounded-t-lg border-b-2 border-gray-300">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FileText className="h-6 w-6" />
                  ADDITIONAL INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white text-gray-800">
                <div className="space-y-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Charges</span>
                    <p className="text-xl font-bold text-red-600">{currentPerson.charges}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Danger Level</span>
                    <Badge 
                      className={`ml-2 text-lg px-4 py-2 ${
                        currentPerson.dangerLevel === "EXTREME" ? "bg-red-600" : 
                        currentPerson.dangerLevel === "HIGH" ? "bg-orange-600" : "bg-yellow-600"
                      }`}
                    >
                      {currentPerson.dangerLevel}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Last Seen
                    </span>
                    <p className="text-xl font-bold text-gray-800">{currentPerson.lastSeen}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order of Protection */}
            {currentPerson.orderOfProtection && (
              <Card className="shadow-2xl border-2 border-purple-300 bg-purple-50">
                <CardHeader className="bg-purple-600 text-white rounded-t-lg border-b-2 border-purple-300">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="h-6 w-6" />
                    ORDER OF PROTECTION
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-purple-50 text-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-purple-700">Status</span>
                      <p className="text-xl font-bold text-purple-800">
                        {isOrderOfProtectionActive(currentPerson) ? 'ACTIVE' : 'EXPIRED'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-purple-700">Protection Expiration Date</span>
                      <p className="text-xl font-bold text-purple-800">
                        {currentPerson.protectionExpirationDate ? new Date(currentPerson.protectionExpirationDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!showRecord && (
          <div className="text-center py-16">
            <div className="space-y-4">
              <Shield className="h-24 w-24 text-gray-400 mx-auto opacity-50" />
              <div className="text-gray-600 text-2xl font-semibold">
              </div>
              <div className="text-gray-400 text-lg">
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-12 border-t-4 border-blue-600">
      </div>

      {/* Admin Panel */}
      <AdminPanel
        people={wantedPersons}
        onAddPerson={handleAddPerson}
        onEditPerson={handleEditPerson}
        onDeletePerson={handleDeletePerson}
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        systemName={systemName}
        onUpdateSystemName={handleUpdateSystemName}
      />
    </div>
  );
};

export default Index;
