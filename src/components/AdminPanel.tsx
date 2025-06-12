
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Settings, Users, User, Calendar, MapPin, AlertTriangle, Shield, CreditCard, Home, Building2, Zap, Target, Pill, FileText, Ruler, Weight } from "lucide-react";

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
  protectionExpirationDate?: string;
  photos?: string[];
}

interface AdminPanelProps {
  people: WantedPerson[];
  onAddPerson: (person: Omit<WantedPerson, 'id'>) => void;
  onEditPerson: (id: string, person: Omit<WantedPerson, 'id'>) => void;
  onDeletePerson: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  systemName: string;
  onUpdateSystemName: (name: string) => void;
}

const AdminPanel = ({ 
  people, 
  onAddPerson, 
  onEditPerson, 
  onDeletePerson, 
  isOpen, 
  onClose,
  systemName,
  onUpdateSystemName
}: AdminPanelProps) => {
  const [brandingName, setBrandingName] = useState(systemName);
  const [editingPerson, setEditingPerson] = useState<WantedPerson | null>(null);
  const [formData, setFormData] = useState<Omit<WantedPerson, 'id'>>({
    lastName: "",
    firstName: "",
    middleName: "",
    sex: "",
    race: "",
    age: "",
    birthDate: "",
    deceased: "N",
    height: "",
    weight: "",
    driversLicenseNumber: "",
    driversLicenseState: "",
    addressOfResidence: "",
    district: "",
    majorityDistrict: "",
    idocNumber: "",
    idocAddressOfResidence: "",
    idocDistrict: "",
    latestArrestCB: "",
    latestFelonyArrestCB: "",
    onParole: "",
    latestContact: "",
    latestContactDistrict: "",
    latestWarrant: "",
    latestInvestigativeAlert: "",
    domesticViolenceArrestCount: "",
    latestDomesticViolenceArrestDate: "",
    weaponsPossession: "N",
    weaponsArrestCount: "",
    latestWeaponsArrestDate: "",
    narcoticsPossession: "N",
    narcoticsArrestCount: "",
    latestNarcoticsArrestDate: "",
    name: "",
    alias: "",
    address: "",
    dob: "",
    hair: "",
    eyes: "",
    charges: "",
    dangerLevel: "LOW",
    lastSeen: "",
    orderOfProtection: false,
    protectionExpirationDate: "",
    photos: []
  });

  const handleSaveBranding = () => {
    onUpdateSystemName(brandingName);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitPerson = () => {
    if (editingPerson) {
      onEditPerson(editingPerson.id, formData);
      setEditingPerson(null);
    } else {
      onAddPerson(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      lastName: "",
      firstName: "",
      middleName: "",
      sex: "",
      race: "",
      age: "",
      birthDate: "",
      deceased: "N",
      height: "",
      weight: "",
      driversLicenseNumber: "",
      driversLicenseState: "",
      addressOfResidence: "",
      district: "",
      majorityDistrict: "",
      idocNumber: "",
      idocAddressOfResidence: "",
      idocDistrict: "",
      latestArrestCB: "",
      latestFelonyArrestCB: "",
      onParole: "",
      latestContact: "",
      latestContactDistrict: "",
      latestWarrant: "",
      latestInvestigativeAlert: "",
      domesticViolenceArrestCount: "",
      latestDomesticViolenceArrestDate: "",
      weaponsPossession: "N",
      weaponsArrestCount: "",
      latestWeaponsArrestDate: "",
      narcoticsPossession: "N",
      narcoticsArrestCount: "",
      latestNarcoticsArrestDate: "",
      name: "",
      alias: "",
      address: "",
      dob: "",
      hair: "",
      eyes: "",
      charges: "",
      dangerLevel: "LOW",
      lastSeen: "",
      orderOfProtection: false,
      protectionExpirationDate: "",
      photos: []
    });
    setEditingPerson(null);
  };

  const handleEditPerson = (person: WantedPerson) => {
    setEditingPerson(person);
    setFormData({
      lastName: person.lastName,
      firstName: person.firstName,
      middleName: person.middleName,
      sex: person.sex,
      race: person.race,
      age: person.age,
      birthDate: person.birthDate,
      deceased: person.deceased,
      height: person.height,
      weight: person.weight,
      driversLicenseNumber: person.driversLicenseNumber,
      driversLicenseState: person.driversLicenseState,
      addressOfResidence: person.addressOfResidence,
      district: person.district,
      majorityDistrict: person.majorityDistrict,
      idocNumber: person.idocNumber,
      idocAddressOfResidence: person.idocAddressOfResidence,
      idocDistrict: person.idocDistrict,
      latestArrestCB: person.latestArrestCB,
      latestFelonyArrestCB: person.latestFelonyArrestCB,
      onParole: person.onParole,
      latestContact: person.latestContact,
      latestContactDistrict: person.latestContactDistrict,
      latestWarrant: person.latestWarrant,
      latestInvestigativeAlert: person.latestInvestigativeAlert,
      domesticViolenceArrestCount: person.domesticViolenceArrestCount,
      latestDomesticViolenceArrestDate: person.latestDomesticViolenceArrestDate,
      weaponsPossession: person.weaponsPossession,
      weaponsArrestCount: person.weaponsArrestCount,
      latestWeaponsArrestDate: person.latestWeaponsArrestDate,
      narcoticsPossession: person.narcoticsPossession,
      narcoticsArrestCount: person.narcoticsArrestCount,
      latestNarcoticsArrestDate: person.latestNarcoticsArrestDate,
      name: person.name || "",
      alias: person.alias || "",
      address: person.address || "",
      dob: person.dob || "",
      hair: person.hair || "",
      eyes: person.eyes || "",
      charges: person.charges,
      dangerLevel: person.dangerLevel,
      lastSeen: person.lastSeen,
      orderOfProtection: person.orderOfProtection || false,
      protectionExpirationDate: person.protectionExpirationDate || "",
      photos: person.photos || []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Settings className="h-6 w-6" />
            Admin Panel
          </DialogTitle>
          <DialogDescription>
            Manage wanted persons database and system settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="people" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage People
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Person
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Manage People ({people.length} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Alias</TableHead>
                      <TableHead>Charges</TableHead>
                      <TableHead>Danger Level</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {people.map((person) => (
                      <TableRow key={person.id}>
                        <TableCell className="font-medium">
                          {person.name || `${person.lastName}, ${person.firstName}`}
                        </TableCell>
                        <TableCell>{person.alias || 'N/A'}</TableCell>
                        <TableCell>{person.charges}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              person.dangerLevel === "EXTREME" ? "bg-red-600" : 
                              person.dangerLevel === "HIGH" ? "bg-orange-600" : "bg-yellow-600"
                            }
                          >
                            {person.dangerLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPerson(person)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onDeletePerson(person.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingPerson ? 'Edit Person' : 'Add New Person'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject Demographics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Subject Demographics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Last Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) => handleInputChange('middleName', e.target.value)}
                        placeholder="Middle Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sex">Sex</Label>
                      <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="race">Race</Label>
                      <Input
                        id="race"
                        value={formData.race}
                        onChange={(e) => handleInputChange('race', e.target.value)}
                        placeholder="Race"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <Input
                        id="birthDate"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        placeholder="MM/DD/YYYY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="5'10&quot;"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="Weight (lbs)"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="addressOfResidence">Address of Residence</Label>
                      <Input
                        id="addressOfResidence"
                        value={formData.addressOfResidence}
                        onChange={(e) => handleInputChange('addressOfResidence', e.target.value)}
                        placeholder="Full Address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        placeholder="District"
                      />
                    </div>
                    <div>
                      <Label htmlFor="majorityDistrict">Majority District</Label>
                      <Input
                        id="majorityDistrict"
                        value={formData.majorityDistrict}
                        onChange={(e) => handleInputChange('majorityDistrict', e.target.value)}
                        placeholder="Majority District"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Criminal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Criminal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="charges">Charges</Label>
                      <Textarea
                        id="charges"
                        value={formData.charges}
                        onChange={(e) => handleInputChange('charges', e.target.value)}
                        placeholder="List of charges"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dangerLevel">Danger Level</Label>
                      <Select value={formData.dangerLevel} onValueChange={(value) => handleInputChange('dangerLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select danger level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="EXTREME">Extreme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="lastSeen">Last Seen</Label>
                      <Input
                        id="lastSeen"
                        value={formData.lastSeen}
                        onChange={(e) => handleInputChange('lastSeen', e.target.value)}
                        placeholder="Last known location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="alias">Alias</Label>
                      <Input
                        id="alias"
                        value={formData.alias}
                        onChange={(e) => handleInputChange('alias', e.target.value)}
                        placeholder="Known aliases"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSubmitPerson} className="bg-blue-600 hover:bg-blue-700">
                    {editingPerson ? 'Update Person' : 'Add Person'}
                  </Button>
                  {editingPerson && (
                    <Button variant="outline" onClick={resetForm}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Branding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={brandingName}
                    onChange={(e) => setBrandingName(e.target.value)}
                    placeholder="Enter system name"
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSaveBranding} className="bg-blue-600 hover:bg-blue-700">
                  Save Branding
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
