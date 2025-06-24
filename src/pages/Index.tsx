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
