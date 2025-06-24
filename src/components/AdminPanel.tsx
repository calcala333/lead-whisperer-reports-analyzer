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
import { Trash2, Edit, Plus, X, Settings } from "lucide-react";

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
  
  // Enhanced Order of Protection
  orderOfProtection?: boolean;
  orderOfProtectionType?: 'plenary' | 'stalking' | 'civil' | '';
  protectionExpirationDate?: string;
  protectionNotes?: string;
  protectionDescription?: string;
  
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
  const [birthDate, setBirthDate] = useState("");
  const [deceased, setDeceased] = useState("N");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  
  // New physical descriptor fields
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
  const [orderOfProtection, setOrderOfProtection] = useState(false);
  const [orderOfProtectionType, setOrderOfProtectionType] = useState<'plenary' | 'stalking' | 'civil' | ''>('');
  const [protectionExpirationDate, setProtectionExpirationDate] = useState("");
  const [protectionNotes, setProtectionNotes] = useState("");
  const [protectionDescription, setProtectionDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    setTempSystemName(systemName);
    setTempDisclaimerText(disclaimerText);
  }, [systemName, disclaimerText]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setSex("M");
    setRace("WHI");
    setAge("");
    setBirthDate("");
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
    setOrderOfProtection(false);
    setOrderOfProtectionType('');
    setProtectionExpirationDate("");
    setProtectionNotes("");
    setProtectionDescription("");
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
      birthDate,
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
      orderOfProtection,
      orderOfProtectionType,
      protectionExpirationDate,
      protectionNotes,
      protectionDescription,
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
        birthDate,
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
        orderOfProtection,
        orderOfProtectionType,
        protectionExpirationDate,
        protectionNotes,
        protectionDescription,
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
    setBirthDate(person.birthDate);
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
    setOrderOfProtection(person.orderOfProtection || false);
    setOrderOfProtectionType(person.orderOfProtectionType || '');
    setProtectionExpirationDate(person.protectionExpirationDate || "");
    setProtectionNotes(person.protectionNotes || "");
    setProtectionDescription(person.protectionDescription || "");
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

          {/* Add Person Tab */}
          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingPerson ? "Edit Person" : "Add New Person"}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
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
                      type="text"
                      id="dob"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hair">Hair Color</Label>
                    <Input
                      type="text"
                      id="hair"
                      value={hair}
                      onChange={(e) => setHair(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="eyes">Eye Color</Label>
                    <Input
                      type="text"
                      id="eyes"
                      value={eyes}
                      onChange={(e) => setEyes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Physical Descriptors Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Physical Descriptors</h3>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sex">Sex</Label>
                    <Select value={sex} onValueChange={setSex}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
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
                      </SelectContent>
                    </Select>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      type="number"
                      id="age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input
                      type="text"
                      id="birthDate"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      type="text"
                      id="height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      type="text"
                      id="weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
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

                {/* Enhanced Order of Protection Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">Order of Protection</h3>
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
                          onValueChange={(value) => setOrderOfProtectionType(value as 'plenary' | 'stalking' | 'civil' | '')}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plenary">Plenary Order of Protection</SelectItem>
                            <SelectItem value="stalking">Stalking No Contact Order</SelectItem>
                            <SelectItem value="civil">Civil No-Contact Order</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  {orderOfProtection && (
                    <>
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
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="driversLicenseNumber">Driver's License Number</Label>
                    <Input
                      type="text"
                      id="driversLicenseNumber"
                      value={driversLicenseNumber}
                      onChange={(e) => setDriversLicenseNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="driversLicenseState">Driver's License State</Label>
                    <Input
                      type="text"
                      id="driversLicenseState"
                      value={driversLicenseState}
                      onChange={(e) => setDriversLicenseState(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="addressOfResidence">Address of Residence</Label>
                    <Input
                      type="text"
                      id="addressOfResidence"
                      value={addressOfResidence}
                      onChange={(e) => setAddressOfResidence(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      type="text"
                      id="district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="majorityDistrict">Majority District</Label>
                    <Input
                      type="text"
                      id="majorityDistrict"
                      value={majorityDistrict}
                      onChange={(e) => setMajorityDistrict(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="idocNumber">IDOC Number</Label>
                    <Input
                      type="text"
                      id="idocNumber"
                      value={idocNumber}
                      onChange={(e) => setIdocNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="idocAddressOfResidence">IDOC Address of Residence</Label>
                    <Input
                      type="text"
                      id="idocAddressOfResidence"
                      value={idocAddressOfResidence}
                      onChange={(e) => setIdocAddressOfResidence(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="idocDistrict">IDOC District</Label>
                    <Input
                      type="text"
                      id="idocDistrict"
                      value={idocDistrict}
                      onChange={(e) => setIdocDistrict(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latestArrestCB">Latest Arrest CB</Label>
                    <Input
                      type="text"
                      id="latestArrestCB"
                      value={latestArrestCB}
                      onChange={(e) => setLatestArrestCB(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="latestFelonyArrestCB">Latest Felony Arrest CB</Label>
                    <Input
                      type="text"
                      id="latestFelonyArrestCB"
                      value={latestFelonyArrestCB}
                      onChange={(e) => setLatestFelonyArrestCB(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="onParole">On Parole</Label>
                    <Input
                      type="text"
                      id="onParole"
                      value={onParole}
                      onChange={(e) => setOnParole(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="latestContact">Latest Contact</Label>
                    <Input
                      type="text"
                      id="latestContact"
                      value={latestContact}
                      onChange={(e) => setLatestContact(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latestContactDistrict">Latest Contact District</Label>
                    <Input
                      type="text"
                      id="latestContactDistrict"
                      value={latestContactDistrict}
                      onChange={(e) => setLatestContactDistrict(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="latestWarrant">Latest Warrant</Label>
                    <Input
                      type="text"
                      id="latestWarrant"
                      value={latestWarrant}
                      onChange={(e) => setLatestWarrant(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latestInvestigativeAlert">Latest Investigative Alert</Label>
                    <Input
                      type="text"
                      id="latestInvestigativeAlert"
                      value={latestInvestigativeAlert}
                      onChange={(e) => setLatestInvestigativeAlert(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="domesticViolenceArrestCount">Domestic Violence Arrest Count</Label>
                    <Input
                      type="text"
                      id="domesticViolenceArrestCount"
                      value={domesticViolenceArrestCount}
                      onChange={(e) => setDomesticViolenceArrestCount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latestDomesticViolenceArrestDate">Latest Domestic Violence Arrest Date</Label>
                    <Input
                      type="text"
                      id="latestDomesticViolenceArrestDate"
                      value={latestDomesticViolenceArrestDate}
                      onChange={(e) => setLatestDomesticViolenceArrestDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weaponsPossession">Weapons Possession</Label>
                    <Select value={weaponsPossession} onValueChange={setWeaponsPossession}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Y">Yes</SelectItem>
                        <SelectItem value="N">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weaponsArrestCount">Weapons Arrest Count</Label>
                    <Input
                      type="text"
                      id="weaponsArrestCount"
                      value={weaponsArrestCount}
                      onChange={(e) => setWeaponsArrestCount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="latestWeaponsArrestDate">Latest Weapons Arrest Date</Label>
                    <Input
                      type="text"
                      id="latestWeaponsArrestDate"
                      value={latestWeaponsArrestDate}
                      onChange={(e) => setLatestWeaponsArrestDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="narcoticsPossession">Narcotics Possession</Label>
                    <Select value={narcoticsPossession} onValueChange={setNarcoticsPossession}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Y">Yes</SelectItem>
                        <SelectItem value="N">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="narcoticsArrestCount">Narcotics Arrest Count</Label>
                    <Input
                      type="text"
                      id="narcoticsArrestCount"
                      value={narcoticsArrestCount}
                      onChange={(e) => setNarcoticsArrestCount(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="latestNarcoticsArrestDate">Latest Narcotics Arrest Date</Label>
                  <Input
                    type="text"
                    id="latestNarcoticsArrestDate"
                    value={latestNarcoticsArrestDate}
                    onChange={(e) => setLatestNarcoticsArrestDate(e.target.value)}
                  />
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
