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
                    <p><strong>DOB:</strong> {selectedPerson.dob || selectedPerson.birthDate}</p>
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
                    <h3 className="text-lg font-semibold mb-2">Physical Descriptors</h3>
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
                    <h3 className="text-lg font-semibold mb-2 text-red-700 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Order of Protection Active
                    </h3>
                    <div className="space-y-2 text-sm">
                      {selectedPerson.orderOfProtectionType && (
                        <p><strong>Type:</strong> {getOrderOfProtectionTypeLabel(selectedPerson.orderOfProtectionType)}</p>
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
