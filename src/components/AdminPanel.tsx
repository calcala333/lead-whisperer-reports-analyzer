
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, X, Settings, Upload, FileText, Download } from "lucide-react";

interface WantedPerson {
  id: string;
  // Subject Demographics
  lastName: string;
  firstName: string;
  middleName: string;
  sex: string;
  race: string;
  age: string;
  deceased: string;
  height: string;
  weight: string;
  
  // Physical Descriptors
  tattoos?: string;
  piercings?: string;
  scars?: string;
  
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
  lastKnownVehicle?: string;
  
  // Enhanced Order of Protection
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

interface AdminPanelProps {
  people: WantedPerson[];
  onAddPerson: (person: Omit<WantedPerson, 'id'>) => void;
  onEditPerson: (id: string, person: Omit<WantedPerson, 'id'>) => void;
  onDeletePerson: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  systemName: string;
  onUpdateSystemName: (name: string) => void;
  disclaimerText: string;
  onUpdateDisclaimer: (disclaimer: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  people,
  onAddPerson,
  onEditPerson,
  onDeletePerson,
  isOpen,
  onClose,
  systemName,
  onUpdateSystemName,
  disclaimerText,
  onUpdateDisclaimer,
}) => {
  const [activeTab, setActiveTab] = useState("add");
  const [editingPerson, setEditingPerson] = useState<WantedPerson | null>(null);
  const [tempSystemName, setTempSystemName] = useState(systemName);
  const [tempDisclaimerText, setTempDisclaimerText] = useState(disclaimerText);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [sex, setSex] = useState("M");
  const [race, setRace] = useState("WHI");
  const [age, setAge] = useState("");
  const [deceased, setDeceased] = useState("N");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  
  // Physical descriptor fields
  const [tattoos, setTattoos] = useState("");
  const [piercings, setPiercings] = useState("");
  const [scars, setScars] = useState("");
  
  const [driversLicenseNumber, setDriversLicenseNumber] = useState("");
  const [driversLicenseState, setDriversLicenseState] = useState("");
  const [addressOfResidence, setAddressOfResidence] = useState("");
  const [district, setDistrict] = useState("");
  const [majorityDistrict, setMajorityDistrict] = useState("");
  const [idocNumber, setIdocNumber] = useState("");
  const [idocAddressOfResidence, setIdocAddressOfResidence] = useState("");
  const [idocDistrict, setIdocDistrict] = useState("");
  const [latestArrestCB, setLatestArrestCB] = useState("");
  const [latestFelonyArrestCB, setLatestFelonyArrestCB] = useState("");
  const [onParole, setOnParole] = useState("");
  const [latestContact, setLatestContact] = useState("");
  const [latestContactDistrict, setLatestContactDistrict] = useState("");
  const [latestWarrant, setLatestWarrant] = useState("");
  const [latestInvestigativeAlert, setLatestInvestigativeAlert] = useState("");
  const [domesticViolenceArrestCount, setDomesticViolenceArrestCount] = useState("");
  const [latestDomesticViolenceArrestDate, setLatestDomesticViolenceArrestDate] = useState("");
  const [weaponsPossession, setWeaponsPossession] = useState("N");
  const [weaponsArrestCount, setWeaponsArrestCount] = useState("");
  const [latestWeaponsArrestDate, setLatestWeaponsArrestDate] = useState("");
  const [narcoticsPossession, setNarcoticsPossession] = useState("N");
  const [narcoticsArrestCount, setNarcoticsArrestCount] = useState("");
  const [latestNarcoticsArrestDate, setLatestNarcoticsArrestDate] = useState("");
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [hair, setHair] = useState("");
  const [eyes, setEyes] = useState("");
  const [charges, setCharges] = useState("");
  const [dangerLevel, setDangerLevel] = useState("HIGH");
  const [lastSeen, setLastSeen] = useState("");
  const [lastKnownVehicle, setLastKnownVehicle] = useState("");
  const [orderOfProtection, setOrderOfProtection] = useState(false);
  const [orderOfProtectionType, setOrderOfProtectionType] = useState<'plenary' | 'stalking' | 'civil' | 'order' | 'emergency' | ''>('');
  const [protectionExpirationDate, setProtectionExpirationDate] = useState("");
  const [protectionNotes, setProtectionNotes] = useState("");
  const [protectionDescription, setProtectionDescription] = useState("");
  const [protectionPetitioner, setProtectionPetitioner] = useState("");
  const [protectionRespondent, setProtectionRespondent] = useState("");
  const [protectionDocuments, setProtectionDocuments] = useState<Array<{ name: string; url: string; type: string }>>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    setTempSystemName(systemName);
    setTempDisclaimerText(disclaimerText);
  }, [systemName, disclaimerText]);

  // Calculate age from DOB
  const calculateAge = (dobString: string) => {
    if (!dobString) return "";
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleDobChange = (dobValue: string) => {
    setDob(dobValue);
    const calculatedAge = calculateAge(dobValue);
    setAge(calculatedAge);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'photo') => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (type === 'document' && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        const url = URL.createObjectURL(file);
        setProtectionDocuments(prev => [...prev, {
          name: file.name,
          url: url,
          type: file.type
        }]);
      } else if (type === 'photo' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPhotos(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeDocument = (index: number) => {
    setProtectionDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setSex("M");
    setRace("WHI");
    setAge("");
    setDeceased("N");
    setHeight("");
    setWeight("");
    setTattoos("");
    setPiercings("");
    setScars("");
    setDriversLicenseNumber("");
    setDriversLicenseState("");
    setAddressOfResidence("");
    setDistrict("");
    setMajorityDistrict("");
    setIdocNumber("");
    setIdocAddressOfResidence("");
    setIdocDistrict("");
    setLatestArrestCB("");
    setLatestFelonyArrestCB("");
    setOnParole("");
    setLatestContact("");
    setLatestContactDistrict("");
    setLatestWarrant("");
    setLatestInvestigativeAlert("");
    setDomesticViolenceArrestCount("");
    setLatestDomesticViolenceArrestDate("");
    setWeaponsPossession("N");
    setWeaponsArrestCount("");
    setLatestWeaponsArrestDate("");
    setNarcoticsPossession("N");
    setNarcoticsArrestCount("");
    setLatestNarcoticsArrestDate("");
    setName("");
    setAlias("");
    setAddress("");
    setDob("");
    setHair("");
    setEyes("");
    setCharges("");
    setDangerLevel("HIGH");
    setLastSeen("");
    setLastKnownVehicle("");
    setOrderOfProtection(false);
    setOrderOfProtectionType('');
    setProtectionExpirationDate("");
    setProtectionNotes("");
    setProtectionDescription("");
    setProtectionPetitioner("");
    setProtectionRespondent("");
    setProtectionDocuments([]);
    setPhotos([]);
  };

  const handleAdd = () => {
    const newPerson = {
      lastName,
      firstName,
      middleName,
      sex,
      race,
      age,
      deceased,
      height,
      weight,
      tattoos,
      piercings,
      scars,
      driversLicenseNumber,
      driversLicenseState,
      addressOfResidence,
      district,
      majorityDistrict,
      idocNumber,
      idocAddressOfResidence,
      idocDistrict,
      latestArrestCB,
      latestFelonyArrestCB,
      onParole,
      latestContact,
      latestContactDistrict,
      latestWarrant,
      latestInvestigativeAlert,
      domesticViolenceArrestCount,
      latestDomesticViolenceArrestDate,
      weaponsPossession,
      weaponsArrestCount,
      latestWeaponsArrestDate,
      narcoticsPossession,
      narcoticsArrestCount,
      latestNarcoticsArrestDate,
      name,
      alias,
      address,
      dob,
      hair,
      eyes,
      charges,
      dangerLevel,
      lastSeen,
      lastKnownVehicle,
      orderOfProtection,
      orderOfProtectionType,
      protectionExpirationDate,
      protectionNotes,
      protectionDescription,
      protectionPetitioner,
      protectionRespondent,
      protectionDocuments,
      photos
    };
    onAddPerson(newPerson);
    resetForm();
    setActiveTab("manage");
  };

  const handleEdit = (id: string) => {
    if (editingPerson) {
      const updatedPerson: Omit<WantedPerson, 'id'> = {
        lastName,
        firstName,
        middleName,
        sex,
        race,
        age,
        deceased,
        height,
        weight,
        tattoos,
        piercings,
        scars,
        driversLicenseNumber,
        driversLicenseState,
        addressOfResidence,
        district,
        majorityDistrict,
        idocNumber,
        idocAddressOfResidence,
        idocDistrict,
        latestArrestCB,
        latestFelonyArrestCB,
        onParole,
        latestContact,
        latestContactDistrict,
        latestWarrant,
        latestInvestigativeAlert,
        domesticViolenceArrestCount,
        latestDomesticViolenceArrestDate,
        weaponsPossession,
        weaponsArrestCount,
        latestWeaponsArrestDate,
        narcoticsPossession,
        narcoticsArrestCount,
        latestNarcoticsArrestDate,
        name,
        alias,
        address,
        dob,
        hair,
        eyes,
        charges,
        dangerLevel,
        lastSeen,
        lastKnownVehicle,
        orderOfProtection,
        orderOfProtectionType,
        protectionExpirationDate,
        protectionNotes,
        protectionDescription,
        protectionPetitioner,
        protectionRespondent,
        protectionDocuments,
        photos
      };
      onEditPerson(id, updatedPerson);
      setEditingPerson(null);
      resetForm();
      setActiveTab("manage");
    }
  };

  const handleDelete = (id: string) => {
    onDeletePerson(id);
  };

  const startEditing = (person: WantedPerson) => {
    setEditingPerson(person);
    setFirstName(person.firstName);
    setLastName(person.lastName);
    setMiddleName(person.middleName);
    setSex(person.sex);
    setRace(person.race);
    setAge(person.age);
    setDeceased(person.deceased);
    setHeight(person.height);
    setWeight(person.weight);
    setTattoos(person.tattoos || "");
    setPiercings(person.piercings || "");
    setScars(person.scars || "");
    setDriversLicenseNumber(person.driversLicenseNumber);
    setDriversLicenseState(person.driversLicenseState);
    setAddressOfResidence(person.addressOfResidence);
    setDistrict(person.district);
    setMajorityDistrict(person.majorityDistrict);
    setIdocNumber(person.idocNumber);
    setIdocAddressOfResidence(person.idocAddressOfResidence);
    setIdocDistrict(person.idocDistrict);
    setLatestArrestCB(person.latestArrestCB);
    setLatestFelonyArrestCB(person.latestFelonyArrestCB);
    setOnParole(person.onParole);
    setLatestContact(person.latestContact);
    setLatestContactDistrict(person.latestContactDistrict);
    setLatestWarrant(person.latestWarrant);
    setLatestInvestigativeAlert(person.latestInvestigativeAlert);
    setDomesticViolenceArrestCount(person.domesticViolenceArrestCount);
    setLatestDomesticViolenceArrestDate(person.latestDomesticViolenceArrestDate);
    setWeaponsPossession(person.weaponsPossession);
    setWeaponsArrestCount(person.weaponsArrestCount);
    setLatestWeaponsArrestDate(person.latestWeaponsArrestDate);
    setNarcoticsPossession(person.narcoticsPossession);
    setNarcoticsArrestCount(person.narcoticsArrestCount);
    setLatestNarcoticsArrestDate(person.latestNarcoticsArrestDate);
    setName(person.name || "");
    setAlias(person.alias || "");
    setAddress(person.address || "");
    setDob(person.dob || "");
    setHair(person.hair || "");
    setEyes(person.eyes || "");
    setCharges(person.charges);
    setDangerLevel(person.dangerLevel);
    setLastSeen(person.lastSeen);
    setLastKnownVehicle(person.lastKnownVehicle || "");
    setOrderOfProtection(person.orderOfProtection || false);
    setOrderOfProtectionType(person.orderOfProtectionType || '');
    setProtectionExpirationDate(person.protectionExpirationDate || "");
    setProtectionNotes(person.protectionNotes || "");
    setProtectionDescription(person.protectionDescription || "");
    setProtectionPetitioner(person.protectionPetitioner || "");
    setProtectionRespondent(person.protectionRespondent || "");
    setProtectionDocuments(person.protectionDocuments || []);
    setPhotos(person.photos || []);
    setActiveTab("add");
  };

  const handleSystemSettingsSave = () => {
    onUpdateSystemName(tempSystemName);
    onUpdateDisclaimer(tempDisclaimerText);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Admin Panel</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add">Add Person</TabsTrigger>
            <TabsTrigger value="manage">Manage People</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingPerson ? "Edit Person" : "Add New Person"}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* Photo Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Photos</h3>
                  <div>
                    <Label htmlFor="photoUpload">Upload Photos</Label>
                    <Input
                      id="photoUpload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'photo')}
                      className="mt-1"
                    />
                    {photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-24 object-cover rounded" />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => removePhoto(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      type="text"
                      id="middleName"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="alias">Alias</Label>
                    <Input
                      type="text"
                      id="alias"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      type="date"
                      id="dob"
                      value={dob}
                      onChange={(e) => handleDobChange(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age (Auto-calculated)</Label>
                    <Input
                      type="text"
                      id="age"
                      value={age}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hair">Hair Color</Label>
                    <Select value={hair} onValueChange={setHair}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select hair color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BLK">Black</SelectItem>
                        <SelectItem value="BRO">Brown</SelectItem>
                        <SelectItem value="BLN">Blonde</SelectItem>
                        <SelectItem value="RED">Red</SelectItem>
                        <SelectItem value="GRY">Gray</SelectItem>
                        <SelectItem value="WHI">White</SelectItem>
                        <SelectItem value="BAL">Bald</SelectItem>
                        <SelectItem value="UNK">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="eyes">Eye Color</Label>
                    <Select value={eyes} onValueChange={setEyes}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select eye color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRO">Brown</SelectItem>
                        <SelectItem value="BLU">Blue</SelectItem>
                        <SelectItem value="GRN">Green</SelectItem>
                        <SelectItem value="HAZ">Hazel</SelectItem>
                        <SelectItem value="GRY">Gray</SelectItem>
                        <SelectItem value="BLK">Black</SelectItem>
                        <SelectItem value="UNK">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Physical Descriptors Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Physical Descriptors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="tattoos">Tattoos</Label>
                      <Textarea
                        id="tattoos"
                        value={tattoos}
                        onChange={(e) => setTattoos(e.target.value)}
                        placeholder="Describe tattoos..."
                        className="resize-none"
                      />
                    </div>
                    <div>
                      <Label htmlFor="piercings">Piercings</Label>
                      <Textarea
                        id="piercings"
                        value={piercings}
                        onChange={(e) => setPiercings(e.target.value)}
                        placeholder="Describe piercings..."
                        className="resize-none"
                      />
                    </div>
                    <div>
                      <Label htmlFor="scars">Scars</Label>
                      <Textarea
                        id="scars"
                        value={scars}
                        onChange={(e) => setScars(e.target.value)}
                        placeholder="Describe scars..."
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="sex">Sex</Label>
                    <Select value={sex} onValueChange={setSex}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="U">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="race">Race</Label>
                    <Select value={race} onValueChange={setRace}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WHI">White</SelectItem>
                        <SelectItem value="BLK">Black</SelectItem>
                        <SelectItem value="HIS">Hispanic</SelectItem>
                        <SelectItem value="ASI">Asian</SelectItem>
                        <SelectItem value="NAT">Native American</SelectItem>
                        <SelectItem value="UNK">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Select value={height} onValueChange={setHeight}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select height" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4'0\"">4'0"</SelectItem>
                        <SelectItem value="4'6\"">4'6"</SelectItem>
                        <SelectItem value="5'0\"">5'0"</SelectItem>
                        <SelectItem value="5'1\"">5'1"</SelectItem>
                        <SelectItem value="5'2\"">5'2"</SelectItem>
                        <SelectItem value="5'3\"">5'3"</SelectItem>
                        <SelectItem value="5'4\"">5'4"</SelectItem>
                        <SelectItem value="5'5\"">5'5"</SelectItem>
                        <SelectItem value="5'6\"">5'6"</SelectItem>
                        <SelectItem value="5'7\"">5'7"</SelectItem>
                        <SelectItem value="5'8\"">5'8"</SelectItem>
                        <SelectItem value="5'9\"">5'9"</SelectItem>
                        <SelectItem value="5'10\"">5'10"</SelectItem>
                        <SelectItem value="5'11\"">5'11"</SelectItem>
                        <SelectItem value="6'0\"">6'0"</SelectItem>
                        <SelectItem value="6'1\"">6'1"</SelectItem>
                        <SelectItem value="6'2\"">6'2"</SelectItem>
                        <SelectItem value="6'3\"">6'3"</SelectItem>
                        <SelectItem value="6'4\"">6'4"</SelectItem>
                        <SelectItem value="6'5\"">6'5"</SelectItem>
                        <SelectItem value="6'6\"">6'6"</SelectItem>
                        <SelectItem value="7'0\"">7'0"</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight</Label>
                    <Select value={weight} onValueChange={setWeight}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90-100">90-100 lbs</SelectItem>
                        <SelectItem value="100-110">100-110 lbs</SelectItem>
                        <SelectItem value="110-120">110-120 lbs</SelectItem>
                        <SelectItem value="120-130">120-130 lbs</SelectItem>
                        <SelectItem value="130-140">130-140 lbs</SelectItem>
                        <SelectItem value="140-150">140-150 lbs</SelectItem>
                        <SelectItem value="150-160">150-160 lbs</SelectItem>
                        <SelectItem value="160-170">160-170 lbs</SelectItem>
                        <SelectItem value="170-180">170-180 lbs</SelectItem>
                        <SelectItem value="180-190">180-190 lbs</SelectItem>
                        <SelectItem value="190-200">190-200 lbs</SelectItem>
                        <SelectItem value="200-210">200-210 lbs</SelectItem>
                        <SelectItem value="210-220">210-220 lbs</SelectItem>
                        <SelectItem value="220-230">220-230 lbs</SelectItem>
                        <SelectItem value="230-240">230-240 lbs</SelectItem>
                        <SelectItem value="240-250">240-250 lbs</SelectItem>
                        <SelectItem value="250-260">250-260 lbs</SelectItem>
                        <SelectItem value="260-270">260-270 lbs</SelectItem>
                        <SelectItem value="270-280">270-280 lbs</SelectItem>
                        <SelectItem value="280-290">280-290 lbs</SelectItem>
                        <SelectItem value="290-300">290-300 lbs</SelectItem>
                        <SelectItem value="300+">300+ lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dangerLevel">Danger Level</Label>
                  <Select value={dangerLevel} onValueChange={setDangerLevel}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="EXTREME">Extreme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="charges">Charges</Label>
                    <Textarea
                      id="charges"
                      value={charges}
                      onChange={(e) => setCharges(e.target.value)}
                      className="resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastSeen">Last Seen</Label>
                    <Input
                      type="text"
                      id="lastSeen"
                      value={lastSeen}
                      onChange={(e) => setLastSeen(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastKnownVehicle">Last Known Registered Vehicle</Label>
                  <Input
                    type="text"
                    id="lastKnownVehicle"
                    value={lastKnownVehicle}
                    onChange={(e) => setLastKnownVehicle(e.target.value)}
                    placeholder="Make, model, year, color, license plate..."
                  />
                </div>

                {/* Order of Protection Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Order of Protection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="orderOfProtection">Order of Protection</Label>
                      <Select
                        value={orderOfProtection ? "true" : "false"}
                        onValueChange={(value) => setOrderOfProtection(value === "true")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {orderOfProtection && (
                      <div>
                        <Label htmlFor="orderOfProtectionType">Type of Order</Label>
                        <Select 
                          value={orderOfProtectionType} 
                          onValueChange={(value) => setOrderOfProtectionType(value as 'plenary' | 'stalking' | 'civil' | 'order' | 'emergency' | '')}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plenary">Plenary Order of Protection</SelectItem>
                            <SelectItem value="stalking">Stalking No Contact Order</SelectItem>
                            <SelectItem value="civil">Civil No-Contact Order</SelectItem>
                            <SelectItem value="order">Order of Protection</SelectItem>
                            <SelectItem value="emergency">Emergency Order of Protection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  {orderOfProtection && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="protectionPetitioner">Petitioner</Label>
                          <Input
                            type="text"
                            id="protectionPetitioner"
                            value={protectionPetitioner}
                            onChange={(e) => setProtectionPetitioner(e.target.value)}
                            placeholder="Name of petitioner..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="protectionRespondent">Respondent</Label>
                          <Input
                            type="text"
                            id="protectionRespondent"
                            value={protectionRespondent}
                            onChange={(e) => setProtectionRespondent(e.target.value)}
                            placeholder="Name of respondent..."
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="protectionExpirationDate">Protection Expiration Date</Label>
                        <Input
                          type="date"
                          id="protectionExpirationDate"
                          value={protectionExpirationDate}
                          onChange={(e) => setProtectionExpirationDate(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="protectionDescription">Protection Description</Label>
                        <Textarea
                          id="protectionDescription"
                          value={protectionDescription}
                          onChange={(e) => setProtectionDescription(e.target.value)}
                          placeholder="Describe the protection order details..."
                          className="resize-none"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="protectionNotes">Protection Notes</Label>
                        <Textarea
                          id="protectionNotes"
                          value={protectionNotes}
                          onChange={(e) => setProtectionNotes(e.target.value)}
                          placeholder="Additional notes about the protection order..."
                          className="resize-none"
                          rows={2}
                        />
                      </div>

                      {/* Document Upload Section */}
                      <div>
                        <Label htmlFor="documentUpload">Upload Court Documents (PDF/DOCX)</Label>
                        <Input
                          id="documentUpload"
                          type="file"
                          multiple
                          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(e) => handleFileUpload(e, 'document')}
                          className="mt-1"
                        />
                        {protectionDocuments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {protectionDocuments.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="text-sm">{doc.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(doc.url, '_blank')}
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeDocument(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <Button onClick={() => {
                  if (editingPerson) {
                    handleEdit(editingPerson.id);
                  } else {
                    handleAdd();
                  }
                }}>
                  {editingPerson ? "Update Person" : "Add Person"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage People Tab */}
          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manage Existing People</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {people.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-4 rounded-md shadow-sm border"
                    >
                      <div>
                        <h3 className="text-lg font-semibold">{person.name || `${person.firstName} ${person.lastName}`}</h3>
                        <p className="text-sm text-gray-500">ID: {person.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => startEditing(person)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(person.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={tempSystemName}
                    onChange={(e) => setTempSystemName(e.target.value)}
                    placeholder="Enter system name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disclaimerText">Disclaimer Text</Label>
                  <Textarea
                    id="disclaimerText"
                    value={tempDisclaimerText}
                    onChange={(e) => setTempDisclaimerText(e.target.value)}
                    placeholder="Enter disclaimer text"
                    rows={8}
                    className="resize-none"
                  />
                </div>

                <Button 
                  onClick={handleSystemSettingsSave}
                  className="w-full"
                >
                  Save System Settings
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
