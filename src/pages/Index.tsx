import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminPanel from "@/components/AdminPanel";
import { Settings, Search, Shield, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WantedPerson {
  id: string;
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
  tattoos?: string;
  piercings?: string;
  scars?: string;
  driversLicenseNumber: string;
  driversLicenseState: string;
  addressOfResidence: string;
  district: string;
  majorityDistrict: string;
  idocNumber: string;
  idocAddressOfResidence: string;
  idocDistrict: string;
  latestArrestCB: string;
  latestFelonyArrestCB: string;
  onParole: string;
  latestContact: string;
  latestContactDistrict: string;
  latestWarrant: string;
  latestInvestigativeAlert: string;
  domesticViolenceArrestCount: string;
  latestDomesticViolenceArrestDate: string;
  weaponsPossession: string;
  weaponsArrestCount: string;
  latestWeaponsArrestDate: string;
  narcoticsPossession: string;
  narcoticsArrestCount: string;
  latestNarcoticsArrestDate: string;
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
  orderOfProtectionType?: 'plenary' | 'stalking' | 'civil' | '';
  protectionExpirationDate?: string;
  protectionNotes?: string;
  protectionDescription?: string;
  protectionDocuments?: Array<{
    name: string;
    url: string;
    type: string;
    uploadDate: string;
  }>;
  photos?: string[];
}

const mockData: WantedPerson[] = [
  {
    id: "WP001",
    lastName: "Johnson",
    firstName: "Michael",
    middleName: "Robert",
    sex: "Male",
    race: "White",
    age: "32",
    birthDate: "1991-03-15",
    deceased: "No",
    height: "6'2\"",
    weight: "185 lbs",
    tattoos: "Dragon on left arm, 'REBEL' on knuckles",
    piercings: "Ear piercings",
    scars: "Scar above left eyebrow",
    driversLicenseNumber: "D123456789",
    driversLicenseState: "IL",
    addressOfResidence: "123 Main St, Chicago, IL",
    district: "District 1",
    majorityDistrict: "District 1",
    idocNumber: "",
    idocAddressOfResidence: "",
    idocDistrict: "",
    latestArrestCB: "2024-01-15",
    latestFelonyArrestCB: "2023-08-20",
    onParole: "No",
    latestContact: "2024-02-10",
    latestContactDistrict: "District 1",
    latestWarrant: "Active",
    latestInvestigativeAlert: "None",
    domesticViolenceArrestCount: "3",
    latestDomesticViolenceArrestDate: "2024-01-15",
    weaponsPossession: "Yes",
    weaponsArrestCount: "2",
    latestWeaponsArrestDate: "2023-11-05",
    narcoticsPossession: "No",
    narcoticsArrestCount: "0",
    latestNarcoticsArrestDate: "",
    charges: "Domestic Battery, Aggravated Assault",
    dangerLevel: "EXTREME",
    lastSeen: "Downtown Chicago - 2024-06-20",
    orderOfProtection: true,
    orderOfProtectionType: "plenary",
    protectionExpirationDate: "2025-01-15",
    protectionNotes: "Subject has history of violent behavior toward ex-spouse",
    protectionDescription: "Full no-contact order including residence and workplace",
    protectionDocuments: [
      {
        name: "Protection_Order_Johnson.pdf",
        url: "blob:mock-url-1",
        type: "application/pdf",
        uploadDate: "2024-01-16"
      }
    ]
  },
  {
    id: "WP002",
    lastName: "Smith",
    firstName: "Sarah",
    middleName: "Ann",
    sex: "Female",
    race: "Black",
    age: "28",
    birthDate: "1995-07-22",
    deceased: "No",
    height: "5'6\"",
    weight: "140 lbs",
    tattoos: "Rose on ankle",
    piercings: "Nose ring, multiple ear piercings",
    scars: "None visible",
    driversLicenseNumber: "D987654321",
    driversLicenseState: "IL",
    addressOfResidence: "456 Oak Ave, Chicago, IL",
    district: "District 2",
    majorityDistrict: "District 2",
    idocNumber: "",
    idocAddressOfResidence: "",
    idocDistrict: "",
    latestArrestCB: "2024-03-10",
    latestFelonyArrestCB: "2024-03-10",
    onParole: "Yes",
    latestContact: "2024-06-15",
    latestContactDistrict: "District 2",
    latestWarrant: "None",
    latestInvestigativeAlert: "Drug Activity",
    domesticViolenceArrestCount: "0",
    latestDomesticViolenceArrestDate: "",
    weaponsPossession: "No",
    weaponsArrestCount: "0",
    latestWeaponsArrestDate: "",
    narcoticsPossession: "Yes",
    narcoticsArrestCount: "4",
    latestNarcoticsArrestDate: "2024-03-10",
    charges: "Possession with Intent to Distribute",
    dangerLevel: "HIGH",
    lastSeen: "West Side - 2024-06-22"
  },
  {
    id: "WP003",
    lastName: "Garcia",
    firstName: "Carlos",
    middleName: "Luis",
    sex: "Male",
    race: "Hispanic",
    age: "45",
    birthDate: "1978-11-08",
    deceased: "No",
    height: "5'10\"",
    weight: "200 lbs",
    tattoos: "Sleeve on right arm, cross on chest",
    piercings: "None",
    scars: "Bullet wound scar on left shoulder",
    driversLicenseNumber: "D555666777",
    driversLicenseState: "IL",
    addressOfResidence: "789 Pine St, Chicago, IL",
    district: "District 3",
    majorityDistrict: "District 3",
    idocNumber: "I123456",
    idocAddressOfResidence: "Stateville Correctional Center",
    idocDistrict: "IDOC District 3",
    latestArrestCB: "2023-12-05",
    latestFelonyArrestCB: "2023-12-05",
    onParole: "No",
    latestContact: "2024-05-20",
    latestContactDistrict: "District 3",
    latestWarrant: "Active",
    latestInvestigativeAlert: "Gang Activity",
    domesticViolenceArrestCount: "1",
    latestDomesticViolenceArrestDate: "2022-06-10",
    weaponsPossession: "Yes",
    weaponsArrestCount: "5",
    latestWeaponsArrestDate: "2023-12-05",
    narcoticsPossession: "Yes",
    narcoticsArrestCount: "3",
    latestNarcoticsArrestDate: "2023-09-15",
    charges: "Armed Robbery, Unlawful Use of Weapon",
    dangerLevel: "EXTREME",
    lastSeen: "South Side - 2024-06-18",
    orderOfProtection: true,
    orderOfProtectionType: "stalking",
    protectionExpirationDate: "2024-05-15",
    protectionNotes: "Order has expired - subject was stalking neighbor",
    protectionDescription: "No-contact order for stalking behavior",
    protectionDocuments: [
      {
        name: "Stalking_Order_Garcia.pdf",
        url: "blob:mock-url-2",
        type: "application/pdf",
        uploadDate: "2023-05-16"
      }
    ]
  },
  {
    id: "WP004",
    lastName: "Williams",
    firstName: "James",
    middleName: "David",
    sex: "Male",
    race: "Black",
    age: "38",
    birthDate: "1985-04-12",
    deceased: "No",
    height: "6'0\"",
    weight: "175 lbs",
    tattoos: "None visible",
    piercings: "None",
    scars: "Knife scar on right hand",
    driversLicenseNumber: "D111222333",
    driversLicenseState: "IL",
    addressOfResidence: "321 Elm St, Chicago, IL",
    district: "District 4",
    majorityDistrict: "District 4",
    idocNumber: "",
    idocAddressOfResidence: "",
    idocDistrict: "",
    latestArrestCB: "2024-02-28",
    latestFelonyArrestCB: "2023-10-12",
    onParole: "Yes",
    latestContact: "2024-06-20",
    latestContactDistrict: "District 4",
    latestWarrant: "None",
    latestInvestigativeAlert: "None",
    domesticViolenceArrestCount: "2",
    latestDomesticViolenceArrestDate: "2024-02-28",
    weaponsPossession: "No",
    weaponsArrestCount: "1",
    latestWeaponsArrestDate: "2022-03-20",
    narcoticsPossession: "No",
    narcoticsArrestCount: "0",
    latestNarcoticsArrestDate: "",
    charges: "Domestic Battery, Violation of Order of Protection",
    dangerLevel: "HIGH",
    lastSeen: "North Side - 2024-06-23",
    orderOfProtection: true,
    orderOfProtectionType: "civil",
    protectionExpirationDate: "2025-02-28",
    protectionNotes: "Civil order related to domestic dispute with ex-girlfriend",
    protectionDescription: "No-contact order with 500ft restriction",
    protectionDocuments: [
      {
        name: "Civil_Order_Williams.docx",
        url: "blob:mock-url-3",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploadDate: "2024-03-01"
      },
      {
        name: "Court_Filing_Williams.pdf",
        url: "blob:mock-url-4",
        type: "application/pdf",
        uploadDate: "2024-03-01"
      }
    ]
  },
  {
    id: "WP005",
    lastName: "Thompson",
    firstName: "Lisa",
    middleName: "Marie",
    sex: "Female",
    race: "White",
    age: "29",
    birthDate: "1994-09-30",
    deceased: "No",
    height: "5'4\"",
    weight: "125 lbs",
    tattoos: "Butterfly on shoulder blade",
    piercings: "Belly button, ears",
    scars: "Small scar on chin",
    driversLicenseNumber: "D777888999",
    driversLicenseState: "IL",
    addressOfResidence: "654 Maple Dr, Chicago, IL",
    district: "District 5",
    majorityDistrict: "District 5",
    idocNumber: "",
    idocAddressOfResidence: "",
    idocDistrict: "",
    latestArrestCB: "2024-04-05",
    latestFelonyArrestCB: "2024-04-05",
    onParole: "No",
    latestContact: "2024-06-10",
    latestContactDistrict: "District 5",
    latestWarrant: "Active",
    latestInvestigativeAlert: "Fraud",
    domesticViolenceArrestCount: "0",
    latestDomesticViolenceArrestDate: "",
    weaponsPossession: "No",
    weaponsArrestCount: "0",
    latestWeaponsArrestDate: "",
    narcoticsPossession: "No",
    narcoticsArrestCount: "1",
    latestNarcoticsArrestDate: "2023-01-15",
    charges: "Identity Theft, Credit Card Fraud",
    dangerLevel: "MODERATE",
    lastSeen: "Downtown - 2024-06-24"
  }
];

const Index = () => {
  const [people, setPeople] = useState<WantedPerson[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<WantedPerson | null>(null);
  const [systemName, setSystemName] = useState("Law Enforcement Database");
  const [disclaimerText, setDisclaimerText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedPeople = localStorage.getItem("people");
    const storedSystemName = localStorage.getItem("systemName");
    const storedDisclaimer = localStorage.getItem("disclaimer");

    if (storedPeople) {
      setPeople(JSON.parse(storedPeople));
    } else {
      // Load mock data if no stored data exists
      setPeople(mockData);
    }
    if (storedSystemName) {
      setSystemName(storedSystemName);
    }
    if (storedDisclaimer) {
      setDisclaimerText(storedDisclaimer);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("people", JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem("systemName", systemName);
  }, [systemName]);

  useEffect(() => {
    localStorage.setItem("disclaimer", disclaimerText);
  }, [disclaimerText]);

  const handleAddPerson = (person: Omit<WantedPerson, 'id'>) => {
    const newPerson = { ...person, id: Math.random().toString(36).substring(7) };
    setPeople([...people, newPerson]);
    toast({
      title: "Person Added",
      description: "The person has been successfully added to the database.",
    });
  };

  const handleEditPerson = (id: string, person: Omit<WantedPerson, 'id'>) => {
    const updatedPeople = people.map((p) => (p.id === id ? { ...person, id } : p));
    setPeople(updatedPeople);
    toast({
      title: "Person Updated",
      description: "The person's information has been successfully updated.",
    });
  };

  const handleDeletePerson = (id: string) => {
    setPeople(people.filter((person) => person.id !== id));
    toast({
      title: "Person Deleted",
      description: "The person has been successfully deleted from the database.",
    });
  };

  const isOrderOfProtectionActive = (person: WantedPerson) => {
    if (!person.orderOfProtection || !person.protectionExpirationDate) return false;
    const expirationDate = new Date(person.protectionExpirationDate);
    const today = new Date();
    return expirationDate > today;
  };

  const isOrderOfProtectionExpired = (person: WantedPerson) => {
    if (!person.orderOfProtection || !person.protectionExpirationDate) return false;
    const expirationDate = new Date(person.protectionExpirationDate);
    const today = new Date();
    return expirationDate <= today;
  };

  const getOrderOfProtectionTypeDisplay = (type: string) => {
    switch (type) {
      case 'plenary':
        return 'Plenary Order of Protection';
      case 'stalking':
        return 'Stalking No Contact Order';
      case 'civil':
        return 'Civil No-Contact Order';
      default:
        return 'Order of Protection';
    }
  };

  const handleViewDocument = (doc: { name: string; url: string; type: string }) => {
    // Create a temporary link to download/view the document
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPeople = people.filter((person) => {
    const fullName = `${person.firstName || ''} ${person.lastName || ''} ${person.name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      person.charges.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "all") return matchesSearch;
    if (filterType === "high") return matchesSearch && person.dangerLevel === "HIGH";
    if (filterType === "extreme") return matchesSearch && person.dangerLevel === "EXTREME";
    if (filterType === "active-protection") return matchesSearch && isOrderOfProtectionActive(person);
    
    return matchesSearch;
  });

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{systemName}</h1>
          <Button
            onClick={() => setIsAdminOpen(true)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Admin Panel
          </Button>
        </div>
      </header>

      {/* Disclaimer */}
      {disclaimerText && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mx-4 mt-4 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 whitespace-pre-wrap">{disclaimerText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name, charges, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="md:w-64">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All People</SelectItem>
                <SelectItem value="high">High Danger</SelectItem>
                <SelectItem value="extreme">Extreme Danger</SelectItem>
                <SelectItem value="active-protection">Active Order of Protection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredPeople.length} of {people.length} people
          </p>
        </div>

        {/* People Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeople.map((person) => (
            <Card key={person.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPerson(person)}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{person.name || `${person.firstName} ${person.lastName}`}</span>
                  <Badge 
                    variant={person.dangerLevel === "EXTREME" ? "destructive" : person.dangerLevel === "HIGH" ? "secondary" : "default"}
                  >
                    {person.dangerLevel}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>ID:</strong> {person.id}</p>
                  <p><strong>Age:</strong> {person.age}</p>
                  <p><strong>Charges:</strong> {person.charges}</p>
                  <p><strong>Last Seen:</strong> {person.lastSeen}</p>
                  
                  {/* Order of Protection Status */}
                  {person.orderOfProtection && (
                    <div className="mt-3 p-2 rounded-md bg-red-50 border border-red-200">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-semibold text-red-800">
                          {isOrderOfProtectionActive(person) ? 'Active' : 'Expired'} {getOrderOfProtectionTypeDisplay(person.orderOfProtectionType || '')}
                        </span>
                      </div>
                      {person.protectionExpirationDate && (
                        <p className="text-xs text-red-600 mt-1">
                          Expires: {new Date(person.protectionExpirationDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Person Details Modal */}
      {selectedPerson && (
        <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedPerson.name || `${selectedPerson.firstName} ${selectedPerson.lastName}`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="space-y-2">
                  <p><strong>ID:</strong> {selectedPerson.id}</p>
                  <p><strong>Name:</strong> {selectedPerson.name || `${selectedPerson.firstName} ${selectedPerson.lastName}`}</p>
                  {selectedPerson.alias && <p><strong>Alias:</strong> {selectedPerson.alias}</p>}
                  <p><strong>Age:</strong> {selectedPerson.age}</p>
                  <p><strong>Sex:</strong> {selectedPerson.sex}</p>
                  <p><strong>Race:</strong> {selectedPerson.race}</p>
                  <p><strong>Height:</strong> {selectedPerson.height}</p>
                  <p><strong>Weight:</strong> {selectedPerson.weight}</p>
                  <div className="flex items-center gap-2">
                    <span><strong>Danger Level:</strong></span>
                    <Badge variant={selectedPerson.dangerLevel === "EXTREME" ? "destructive" : selectedPerson.dangerLevel === "HIGH" ? "secondary" : "default"}>
                      {selectedPerson.dangerLevel}
                    </Badge>
                  </div>
                </div>

                {/* Physical Descriptors */}
                {(selectedPerson.tattoos || selectedPerson.piercings || selectedPerson.scars) && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Physical Descriptors</h4>
                    {selectedPerson.tattoos && <p><strong>Tattoos:</strong> {selectedPerson.tattoos}</p>}
                    {selectedPerson.piercings && <p><strong>Piercings:</strong> {selectedPerson.piercings}</p>}
                    {selectedPerson.scars && <p><strong>Scars:</strong> {selectedPerson.scars}</p>}
                  </div>
                )}
              </div>

              {/* Criminal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Criminal Information</h3>
                <div className="space-y-2">
                  <p><strong>Charges:</strong> {selectedPerson.charges}</p>
                  <p><strong>Last Seen:</strong> {selectedPerson.lastSeen}</p>
                  {selectedPerson.latestArrestCB && <p><strong>Latest Arrest:</strong> {selectedPerson.latestArrestCB}</p>}
                  {selectedPerson.latestWarrant && <p><strong>Latest Warrant:</strong> {selectedPerson.latestWarrant}</p>}
                </div>

                {/* Order of Protection */}
                {selectedPerson.orderOfProtection && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-800">Order of Protection</h4>
                    <div className="p-3 rounded-md bg-red-50 border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-red-600" />
                        <span className="font-semibold text-red-800">
                          {isOrderOfProtectionActive(selectedPerson) ? 'Active' : 'Expired'} {getOrderOfProtectionTypeDisplay(selectedPerson.orderOfProtectionType || '')}
                        </span>
                      </div>
                      
                      {selectedPerson.protectionExpirationDate && (
                        <p className="text-sm text-red-600 mb-2">
                          <strong>Expires:</strong> {new Date(selectedPerson.protectionExpirationDate).toLocaleDateString()}
                          {isOrderOfProtectionExpired(selectedPerson) && <span className="ml-2 text-red-800 font-semibold">(EXPIRED)</span>}
                        </p>
                      )}
                      
                      {selectedPerson.protectionDescription && (
                        <p className="text-sm text-red-700 mb-2">
                          <strong>Description:</strong> {selectedPerson.protectionDescription}
                        </p>
                      )}
                      
                      {selectedPerson.protectionNotes && (
                        <p className="text-sm text-red-700">
                          <strong>Notes:</strong> {selectedPerson.protectionNotes}
                        </p>
                      )}

                      {/* Supporting Documents */}
                      {selectedPerson.protectionDocuments && selectedPerson.protectionDocuments.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold text-red-800 mb-2">Supporting Documents:</p>
                          <div className="space-y-2">
                            {selectedPerson.protectionDocuments.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white border border-red-200 rounded">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-red-600" />
                                  <span className="text-sm text-red-800">{doc.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {new Date(doc.uploadDate).toLocaleDateString()}
                                  </Badge>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDocument(doc)}
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Admin Panel */}
      <AdminPanel
        people={people}
        onAddPerson={handleAddPerson}
        onEditPerson={handleEditPerson}
        onDeletePerson={handleDeletePerson}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        systemName={systemName}
        onUpdateSystemName={setSystemName}
        disclaimerText={disclaimerText}
        onUpdateDisclaimer={setDisclaimerText}
      />
    </div>
  );
};

export default Index;
