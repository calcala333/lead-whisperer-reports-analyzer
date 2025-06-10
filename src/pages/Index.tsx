import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Settings, Home } from "lucide-react";
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

const initialPeople: WantedPerson[] = [
  {
    id: "1",
    lastName: "Doe",
    firstName: "John",
    middleName: "",
    sex: "M",
    race: "WHI",
    age: "35",
    birthDate: "12-JUN-1988",
    deceased: "N",
    height: "6'00\"",
    weight: "180",
    driversLicenseNumber: "DL12345",
    driversLicenseState: "CA",
    addressOfResidence: "123 Main St",
    district: "1",
    majorityDistrict: "1",
    idocNumber: "IDOC54321",
    idocAddressOfResidence: "456 Elm St",
    idocDistrict: "2",
    latestArrestCB: "CB98765",
    latestFelonyArrestCB: "FCB12345",
    onParole: "N",
    latestContact: "15-JUL-2023 @ 14:00",
    latestContactDistrict: "3",
    latestWarrant: "W12345",
    latestInvestigativeAlert: "IA67890",
    domesticViolenceArrestCount: "0",
    latestDomesticViolenceArrestDate: "N/A",
    weaponsPossession: "N",
    weaponsArrestCount: "0",
    latestWeaponsArrestDate: "N/A",
    narcoticsPossession: "N",
    narcoticsArrestCount: "0",
    latestNarcoticsArrestDate: "N/A",
    charges: "Theft",
    dangerLevel: "MEDIUM",
    lastSeen: "20-JUL-2023",
    orderOfProtection: false,
    protectionExpirationDate: "",
    photos: [],
  },
  {
    id: "2",
    lastName: "Smith",
    firstName: "Jane",
    middleName: "",
    sex: "F",
    race: "BLK",
    age: "28",
    birthDate: "03-MAR-1995",
    deceased: "N",
    height: "5'06\"",
    weight: "140",
    driversLicenseNumber: "DL67890",
    driversLicenseState: "NY",
    addressOfResidence: "789 Oak St",
    district: "4",
    majorityDistrict: "4",
    idocNumber: "IDOC98765",
    idocAddressOfResidence: "101 Pine St",
    idocDistrict: "5",
    latestArrestCB: "CB54321",
    latestFelonyArrestCB: "FCB67890",
    onParole: "Y",
    latestContact: "22-JUL-2023 @ 10:00",
    latestContactDistrict: "6",
    latestWarrant: "W67890",
    latestInvestigativeAlert: "IA12345",
    domesticViolenceArrestCount: "0",
    latestDomesticViolenceArrestDate: "N/A",
    weaponsPossession: "N",
    weaponsArrestCount: "0",
    latestWeaponsArrestDate: "N/A",
    narcoticsPossession: "N",
    narcoticsArrestCount: "0",
    latestNarcoticsArrestDate: "N/A",
    charges: "Assault",
    dangerLevel: "HIGH",
    lastSeen: "25-JUL-2023",
    orderOfProtection: true,
    protectionExpirationDate: "2024-01-01",
    photos: [],
  },
  {
    id: "3",
    lastName: "Garcia",
    firstName: "Maria",
    middleName: "",
    sex: "F",
    race: "HIS",
    age: "42",
    birthDate: "18-NOV-1981",
    deceased: "N",
    height: "5'03\"",
    weight: "130",
    driversLicenseNumber: "DL24680",
    driversLicenseState: "TX",
    addressOfResidence: "321 Maple St",
    district: "7",
    majorityDistrict: "7",
    idocNumber: "IDOC45678",
    idocAddressOfResidence: "654 Cherry St",
    idocDistrict: "8",
    latestArrestCB: "CB36985",
    latestFelonyArrestCB: "FCB24680",
    onParole: "N",
    latestContact: "10-JUL-2023 @ 16:00",
    latestContactDistrict: "9",
    latestWarrant: "W24680",
    latestInvestigativeAlert: "IA98765",
    domesticViolenceArrestCount: "0",
    latestDomesticViolenceArrestDate: "N/A",
    weaponsPossession: "N",
    weaponsArrestCount: "0",
    latestWeaponsArrestDate: "N/A",
    narcoticsPossession: "N",
    narcoticsArrestCount: "0",
    latestNarcoticsArrestDate: "N/A",
    charges: "Fraud",
    dangerLevel: "LOW",
    lastSeen: "15-JUL-2023",
    orderOfProtection: false,
    protectionExpirationDate: "",
    photos: [],
  },
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<WantedPerson | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [brandingName, setBrandingName] = useState("Police Database System");
  const [people, setPeople] = useState<WantedPerson[]>(initialPeople);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddPerson = (person: Omit<WantedPerson, 'id'>) => {
    const newPerson: WantedPerson = {
      ...person,
      id: String(Date.now()), // Generate a unique ID
    };
    setPeople(prevPeople => [...prevPeople, newPerson]);
  };

  const handleEditPerson = (id: string, person: Omit<WantedPerson, 'id'>) => {
    setPeople(prevPeople =>
      prevPeople.map(p => (p.id === id ? { ...p, ...person } : p))
    );
  };

  const handleDeletePerson = (id: string) => {
    setPeople(prevPeople => prevPeople.filter(person => person.id !== id));
  };

  const filteredPeople = people.filter(person => {
    const searchRegex = new RegExp(searchTerm, 'i');
    return (
      searchRegex.test(person.lastName) ||
      searchRegex.test(person.firstName) ||
      searchRegex.test(person.charges) ||
      searchRegex.test(person.dangerLevel)
    );
  });

  if (selectedPerson) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => setSelectedPerson(null)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <h1 className="text-3xl font-bold text-blue-400">{brandingName}</h1>
          </div>

          <Card className="bg-white text-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                {selectedPerson.name || `${selectedPerson.firstName} ${selectedPerson.lastName}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Charges:</strong> {selectedPerson.charges}
                </div>
                <div>
                  <strong>Danger Level:</strong> {selectedPerson.dangerLevel}
                </div>
                <div>
                  <strong>Last Seen:</strong> {selectedPerson.lastSeen}
                </div>
                {selectedPerson.orderOfProtection && (
                  <div>
                    <strong>Order of Protection:</strong> Yes (Expires on {selectedPerson.protectionExpirationDate})
                  </div>
                )}
              </div>
              {selectedPerson.photos && selectedPerson.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedPerson.photos.map((photo, index) => (
                    <img key={index} src={photo} alt={`Photo ${index + 1}`} className="rounded-md" />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">{brandingName}</h1>
          <Button
            onClick={() => setIsAdminOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Admin Panel
          </Button>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by name, charges, or danger level..."
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeople.map(person => (
            <Card
              key={person.id}
              className="bg-gray-800 border-gray-700 cursor-pointer hover:opacity-75 transition-opacity"
              onClick={() => setSelectedPerson(person)}
            >
              <CardHeader>
                <CardTitle className="text-xl">{person.name || `${person.firstName} ${person.lastName}`}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Charges: {person.charges}</p>
                <p className="text-gray-400">Danger Level: {person.dangerLevel}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <AdminPanel
          people={people}
          onAddPerson={handleAddPerson}
          onEditPerson={handleEditPerson}
          onDeletePerson={handleDeletePerson}
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          brandingName={brandingName}
          onBrandingChange={setBrandingName}
        />
      </div>
    </div>
  );
};

export default Index;
