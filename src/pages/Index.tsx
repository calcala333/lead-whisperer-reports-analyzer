import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, Shield, AlertTriangle, FileText, Download } from "lucide-react";
import AdminPanel from "@/components/AdminPanel";

interface WantedPerson {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  sex: string;
  race: string;
  age: string;
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
  lastKnownVehicle?: string;
  orderOfProtection?: boolean;
  orderOfProtectionType?: 'plenary' | 'stalking' | 'civil' | 'order' | 'emergency' | '';
  protectionExpirationDate?: string;
  protectionNotes?: string;
  protectionDescription?: string;
  protectionPetitioner?: string;
  protectionRespondent?: string;
  protectionDocuments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  photos?: string[];
}

const Index = () => {
  const [people, setPeople] = useState<WantedPerson[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<WantedPerson | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [systemName, setSystemName] = useState("Wanted Persons Database");
  const [disclaimerText, setDisclaimerText] = useState("This system contains sensitive law enforcement information. Access is restricted to authorized personnel only. All activities are logged and monitored. Unauthorized access is prohibited and subject to prosecution.");

  useEffect(() => {
    const savedPeople = localStorage.getItem('wantedPeople');
    const savedSystemName = localStorage.getItem('systemName');
    const savedDisclaimer = localStorage.getItem('disclaimerText');
    
    if (savedPeople) {
      setPeople(JSON.parse(savedPeople));
    } else {
      // Add mock data if no saved data exists
      const mockData: WantedPerson[] = [
        {
          id: "1",
          lastName: "Johnson",
          firstName: "Michael",
          middleName: "David",
          name: "Michael David Johnson",
          alias: "Mike, MDJ",
          sex: "Male",
          race: "White",
          age: "34",
          dob: "1989-03-15",
          deceased: "No",
          height: "6'2\"",
          weight: "185 lbs",
          hair: "Brown",
          eyes: "Blue",
          tattoos: "Eagle on right shoulder, 'MOM' on left forearm",
          piercings: "None",
          scars: "2-inch scar above left eyebrow",
          driversLicenseNumber: "D123456789",
          driversLicenseState: "IL",
          address: "1234 Oak Street, Chicago, IL 60601",
          addressOfResidence: "1234 Oak Street, Chicago, IL 60601",
          district: "Central",
          majorityDistrict: "District 1",
          idocNumber: "R12345",
          idocAddressOfResidence: "Last known: 1234 Oak Street",
          idocDistrict: "Central",
          latestArrestCB: "2023-08-15",
          latestFelonyArrestCB: "2022-12-10",
          onParole: "Yes",
          latestContact: "2023-09-01",
          latestContactDistrict: "Central",
          latestWarrant: "2023-08-20",
          latestInvestigativeAlert: "2023-09-05",
          domesticViolenceArrestCount: "2",
          latestDomesticViolenceArrestDate: "2023-06-12",
          weaponsPossession: "Yes",
          weaponsArrestCount: "1",
          latestWeaponsArrestDate: "2022-12-10",
          narcoticsPossession: "No",
          narcoticsArrestCount: "0",
          latestNarcoticsArrestDate: "",
          charges: "Aggravated Battery, Violation of Order of Protection, Resisting Arrest",
          dangerLevel: "HIGH",
          lastSeen: "September 1, 2023 - Near downtown Chicago",
          lastKnownVehicle: "2018 Black Ford F-150, License: ABC-1234",
          orderOfProtection: true,
          orderOfProtectionType: "plenary",
          protectionExpirationDate: "2024-12-31",
          protectionNotes: "Subject has violated order multiple times",
          protectionDescription: "No contact with Jane Johnson, stay 500 feet away from residence and workplace",
          protectionPetitioner: "Jane Johnson",
          protectionRespondent: "Michael Johnson",
          protectionDocuments: [
            {
              name: "Order of Protection - Case #2023-CV-12345",
              url: "#",
              type: "pdf"
            },
            {
              name: "Violation Report - 08/20/2023",
              url: "#",
              type: "pdf"
            }
          ],
          photos: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face&angle=45"
          ]
        },
        {
          id: "2",
          lastName: "Rodriguez",
          firstName: "Maria",
          middleName: "Elena",
          name: "Maria Elena Rodriguez",
          alias: "Mari, Elena",
          sex: "Female",
          race: "Hispanic",
          age: "28",
          dob: "1995-07-22",
          deceased: "No",
          height: "5'4\"",
          weight: "130 lbs",
          hair: "Black",
          eyes: "Brown",
          tattoos: "Rose on left wrist, butterfly on right ankle",
          piercings: "Ears pierced",
          scars: "Small scar on chin",
          driversLicenseNumber: "D987654321",
          driversLicenseState: "IL",
          address: "567 Maple Ave, Apartment 3B, Chicago, IL 60610",
          addressOfResidence: "567 Maple Ave, Apartment 3B, Chicago, IL 60610",
          district: "North",
          majorityDistrict: "District 2",
          idocNumber: "R67890",
          idocAddressOfResidence: "567 Maple Ave, Apartment 3B",
          idocDistrict: "North",
          latestArrestCB: "2023-07-28",
          latestFelonyArrestCB: "2023-07-28",
          onParole: "No",
          latestContact: "2023-08-15",
          latestContactDistrict: "North",
          latestWarrant: "2023-08-01",
          latestInvestigativeAlert: "2023-08-20",
          domesticViolenceArrestCount: "0",
          latestDomesticViolenceArrestDate: "",
          weaponsPossession: "No",
          weaponsArrestCount: "0",
          latestWeaponsArrestDate: "",
          narcoticsPossession: "Yes",
          narcoticsArrestCount: "3",
          latestNarcoticsArrestDate: "2023-07-28",
          charges: "Possession of Controlled Substance, Intent to Distribute, Failure to Appear",
          dangerLevel: "LOW",
          lastSeen: "August 15, 2023 - North Side neighborhood",
          lastKnownVehicle: "2020 White Honda Civic, License: XYZ-9876",
          orderOfProtection: false,
          photos: [
            "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=300&h=400&fit=crop&crop=face"
          ]
        },
        {
          id: "3",
          lastName: "Thompson",
          firstName: "Robert",
          middleName: "James",
          name: "Robert James Thompson",
          alias: "Bobby, RJ, Tank",
          sex: "Male",
          race: "Black",
          age: "42",
          dob: "1981-11-08",
          deceased: "No",
          height: "6'0\"",
          weight: "220 lbs",
          hair: "Black",
          eyes: "Brown",
          tattoos: "Skull on neck, 'RESPECT' across knuckles, tribal sleeve on right arm",
          piercings: "Left ear pierced",
          scars: "Bullet wound scar on left shoulder, knife scar on right hand",
          driversLicenseNumber: "D555666777",
          driversLicenseState: "IL",
          address: "890 Pine Street, Chicago, IL 60615",
          addressOfResidence: "890 Pine Street, Chicago, IL 60615",
          district: "South",
          majorityDistrict: "District 3",
          idocNumber: "R11111",
          idocAddressOfResidence: "890 Pine Street",
          idocDistrict: "South",
          latestArrestCB: "2023-09-10",
          latestFelonyArrestCB: "2023-09-10",
          onParole: "Yes",
          latestContact: "2023-09-15",
          latestContactDistrict: "South",
          latestWarrant: "2023-09-12",
          latestInvestigativeAlert: "2023-09-18",
          domesticViolenceArrestCount: "1",
          latestDomesticViolenceArrestDate: "2022-05-15",
          weaponsPossession: "Yes",
          weaponsArrestCount: "4",
          latestWeaponsArrestDate: "2023-09-10",
          narcoticsPossession: "Yes",
          narcoticsArrestCount: "2",
          latestNarcoticsArrestDate: "2023-01-20",
          charges: "Armed Robbery, Unlawful Use of Weapon, Aggravated Assault, Parole Violation",
          dangerLevel: "EXTREME",
          lastSeen: "September 15, 2023 - South Side, armed and dangerous",
          lastKnownVehicle: "2015 Blue Chevrolet Impala, License: DEF-4567",
          orderOfProtection: true,
          orderOfProtectionType: "emergency",
          protectionExpirationDate: "2024-06-30",
          protectionNotes: "Subject is considered armed and extremely dangerous. Do not approach alone.",
          protectionDescription: "Emergency protective order - stay away from Lisa Thompson and children",
          protectionPetitioner: "Lisa Thompson",
          protectionRespondent: "Robert Thompson",
          protectionDocuments: [
            {
              name: "Emergency Order of Protection - Case #2023-OP-5678",
              url: "#",
              type: "pdf"
            }
          ],
          photos: [
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face&sat=-50"
          ]
        }
      ];
      setPeople(mockData);
      localStorage.setItem('wantedPeople', JSON.stringify(mockData));
    }
    if (savedSystemName) {
      setSystemName(savedSystemName);
    }
    if (savedDisclaimer) {
      setDisclaimerText(savedDisclaimer);
    }
  }, []);

  const savePeople = (newPeople: WantedPerson[]) => {
    setPeople(newPeople);
    localStorage.setItem('wantedPeople', JSON.stringify(newPeople));
  };

  const handleAddPerson = (person: Omit<WantedPerson, 'id'>) => {
    const newPerson = { ...person, id: Date.now().toString() };
    const newPeople = [...people, newPerson];
    savePeople(newPeople);
  };

  const handleEditPerson = (id: string, updatedPerson: Omit<WantedPerson, 'id'>) => {
    const newPeople = people.map(person => 
      person.id === id ? { ...updatedPerson, id } : person
    );
    savePeople(newPeople);
  };

  const handleDeletePerson = (id: string) => {
    const newPeople = people.filter(person => person.id !== id);
    savePeople(newPeople);
  };

  const handleUpdateSystemName = (name: string) => {
    setSystemName(name);
    localStorage.setItem('systemName', name);
  };

  const handleUpdateDisclaimer = (disclaimer: string) => {
    setDisclaimerText(disclaimer);
    localStorage.setItem('disclaimerText', disclaimer);
  };

  const getDangerLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'EXTREME':
        return 'bg-red-600 text-white';
      case 'HIGH':
        return 'bg-orange-500 text-white';
      case 'LOW':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getOrderOfProtectionTypeLabel = (type: string) => {
    switch (type) {
      case 'plenary':
        return 'Plenary Order of Protection';
      case 'stalking':
        return 'Stalking No Contact Order';
      case 'civil':
        return 'Civil No-Contact Order';
      case 'order':
        return 'Order of Protection';
      case 'emergency':
        return 'Emergency Order of Protection';
      default:
        return 'Order of Protection';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">{systemName}</h1>
          <Button
            variant="secondary"
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Admin Panel
          </Button>
        </div>
      </header>

      {/* Disclaimer */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700">{disclaimerText}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {people.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No Wanted Persons Listed</h2>
            <p className="text-gray-500 mb-6">Use the Admin Panel to add wanted persons to the database.</p>
            <Button onClick={() => setIsAdminOpen(true)}>
              Add First Person
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <Card 
                key={person.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedPerson(person)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {person.name || `${person.firstName} ${person.lastName}`}
                    </CardTitle>
                    <Badge className={getDangerLevelColor(person.dangerLevel)}>
                      {person.dangerLevel}
                    </Badge>
                  </div>
                  {person.alias && (
                    <p className="text-sm text-gray-600">AKA: {person.alias}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Display first photo if available */}
                  {person.photos && person.photos.length > 0 && (
                    <div className="mb-3">
                      <img 
                        src={person.photos[0]} 
                        alt={person.name || `${person.firstName} ${person.lastName}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {person.age && <p><strong>Age:</strong> {person.age}</p>}
                    {person.height && <p><strong>Height:</strong> {person.height}</p>}
                    {person.weight && <p><strong>Weight:</strong> {person.weight}</p>}
                    {person.hair && <p><strong>Hair:</strong> {person.hair}</p>}
                    {person.eyes && <p><strong>Eyes:</strong> {person.eyes}</p>}
                    <p><strong>Last Seen:</strong> {person.lastSeen || 'Unknown'}</p>
                    {person.lastKnownVehicle && <p><strong>Vehicle:</strong> {person.lastKnownVehicle}</p>}
                    
                    {person.orderOfProtection && (
                      <div className="flex items-center gap-1 text-red-600 font-semibold">
                        <Shield className="h-4 w-4" />
                        <span>Order of Protection</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Person Detail Dialog */}
        {selectedPerson && (
          <Dialog open={true} onOpenChange={() => setSelectedPerson(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedPerson.name || `${selectedPerson.firstName} ${selectedPerson.lastName}`}
                  <Badge className={`ml-2 ${getDangerLevelColor(selectedPerson.dangerLevel)}`}>
                    {selectedPerson.dangerLevel} DANGER
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-6">
                {/* Photos Section */}
                {selectedPerson.photos && selectedPerson.photos.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Photos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedPerson.photos.map((photo, index) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Name:</strong> {selectedPerson.name || `${selectedPerson.firstName} ${selectedPerson.lastName}`}</p>
                    {selectedPerson.alias && <p><strong>Alias:</strong> {selectedPerson.alias}</p>}
                    <p><strong>Age:</strong> {selectedPerson.age}</p>
                    <p><strong>DOB:</strong> {selectedPerson.dob}</p>
                    <p><strong>Sex:</strong> {selectedPerson.sex}</p>
                    <p><strong>Race:</strong> {selectedPerson.race}</p>
                    <p><strong>Height:</strong> {selectedPerson.height}</p>
                    <p><strong>Weight:</strong> {selectedPerson.weight}</p>
                    <p><strong>Hair:</strong> {selectedPerson.hair}</p>
                    <p><strong>Eyes:</strong> {selectedPerson.eyes}</p>
                  </div>
                </div>

                {/* Physical Descriptors */}
                {(selectedPerson.tattoos || selectedPerson.piercings || selectedPerson.scars) && (
                  <div>
                    <h3 className="text-lg font-bold mb-2">Physical Descriptors</h3>
                    <div className="space-y-2 text-sm">
                      {selectedPerson.tattoos && <p><strong>Tattoos:</strong> {selectedPerson.tattoos}</p>}
                      {selectedPerson.piercings && <p><strong>Piercings:</strong> {selectedPerson.piercings}</p>}
                      {selectedPerson.scars && <p><strong>Scars:</strong> {selectedPerson.scars}</p>}
                    </div>
                  </div>
                )}

                {/* Order of Protection */}
                {selectedPerson.orderOfProtection && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="text-lg font-bold mb-2 text-red-700 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Order of Protection Active
                    </h3>
                    <div className="space-y-2 text-sm">
                      {selectedPerson.orderOfProtectionType && (
                        <p><strong>Type:</strong> {getOrderOfProtectionTypeLabel(selectedPerson.orderOfProtectionType)}</p>
                      )}
                      {selectedPerson.protectionPetitioner && (
                        <p><strong>Petitioner:</strong> {selectedPerson.protectionPetitioner}</p>
                      )}
                      {selectedPerson.protectionRespondent && (
                        <p><strong>Respondent:</strong> {selectedPerson.protectionRespondent}</p>
                      )}
                      {selectedPerson.protectionExpirationDate && (
                        <p><strong>Expiration Date:</strong> {selectedPerson.protectionExpirationDate}</p>
                      )}
                      {selectedPerson.protectionDescription && (
                        <p><strong>Description:</strong> {selectedPerson.protectionDescription}</p>
                      )}
                      {selectedPerson.protectionNotes && (
                        <p><strong>Notes:</strong> {selectedPerson.protectionNotes}</p>
                      )}
                      
                      {/* Protection Documents */}
                      {selectedPerson.protectionDocuments && selectedPerson.protectionDocuments.length > 0 && (
                        <div className="mt-3">
                          <p className="font-semibold mb-2">Court Documents:</p>
                          <div className="space-y-1">
                            {selectedPerson.protectionDocuments.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-red-600" />
                                  <span className="text-sm">{doc.name}</span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(doc.url, '_blank')}
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

                {/* Charges */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Charges</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedPerson.charges}</p>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Last Known Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Address:</strong> {selectedPerson.address || selectedPerson.addressOfResidence}</p>
                    <p><strong>Last Seen:</strong> {selectedPerson.lastSeen}</p>
                    {selectedPerson.lastKnownVehicle && (
                      <p><strong>Last Known Vehicle:</strong> {selectedPerson.lastKnownVehicle}</p>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>

      {/* Admin Panel */}
      <AdminPanel
        people={people}
        onAddPerson={handleAddPerson}
        onEditPerson={handleEditPerson}
        onDeletePerson={handleDeletePerson}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        systemName={systemName}
        onUpdateSystemName={handleUpdateSystemName}
        disclaimerText={disclaimerText}
        onUpdateDisclaimer={handleUpdateDisclaimer}
      />
    </div>
  );
};

export default Index;
