import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, Plus, X, Settings, Upload, FileText, Download } from "lucide-react";

// ---------- Order of Protection Remedies ----------
export const ABUSE_TYPES = [
  "Harassment",
  "Intimidation of a Dependent",
  "Physical Abuse",
  "Exploitation of a High-Risk Adult with Disabilities",
  "Stalking",
  "Neglect of a High-Risk Adult with Disabilities",
  "Willful Deprivation",
  "Interference with Personal Liberty",
] as const;

export interface RemediesState {
  r01?: { enabled?: boolean; abuseTypes?: string[] };
  r02?: { enabled?: boolean; text?: string };
  r03?: {
    enabled?: boolean;
    stayAwayGeneral?: boolean;
    employmentAddresses?: string;
    addressConfidential?: boolean;
    otherAddresses?: string;
  };
  r05?: { enabled?: boolean; text?: string };
  r08?: { enabled?: boolean; text?: string };
  r10?: { enabled?: boolean; text?: string };
  r11?: { enabled?: boolean; text?: string };
  r11_5?: { enabled?: boolean; text?: string };
  r14?: { enabled?: boolean; text?: string };
  r14_5?: { enabled?: boolean };
  r17?: { enabled?: boolean; text?: string };
}

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
  knownAssailants?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehiclePlate?: string;

  // Elopement risk
  elopementRisk?: string;
  frequentLocations?: string;
  
  // Enhanced Order of Protection
  orderOfProtection?: boolean;
  orderOfProtectionType?: 'order' | 'stalking' | 'civil' | 'firearms' | '';
  orderStatusFlags?: string[];
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

  // Order of Protection remedies (R01, R02, R03, R05, R08, R10, R11, R11.5, R14, R14.5, R17)
  remedies?: RemediesState;
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
  logoUrl: string;
  onUpdateLogo: (logo: string) => void;
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
  logoUrl,
  onUpdateLogo,
}) => {
  const [activeTab, setActiveTab] = useState("add");
  const [editingPerson, setEditingPerson] = useState<WantedPerson | null>(null);
  const [tempSystemName, setTempSystemName] = useState(systemName);
  const [tempDisclaimerText, setTempDisclaimerText] = useState(disclaimerText);
  const [tempLogoUrl, setTempLogoUrl] = useState(logoUrl);

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
  const [knownAssailants, setKnownAssailants] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [elopementRisk, setElopementRisk] = useState("N");
  const [frequentLocations, setFrequentLocations] = useState("");
  const [orderOfProtection, setOrderOfProtection] = useState(false);
  const [orderOfProtectionType, setOrderOfProtectionType] = useState<'order' | 'stalking' | 'civil' | 'firearms' | ''>('');
  const [orderStatusFlags, setOrderStatusFlags] = useState<string[]>([]);
  const [protectionExpirationDate, setProtectionExpirationDate] = useState("");
  const [protectionNotes, setProtectionNotes] = useState("");
  const [protectionDescription, setProtectionDescription] = useState("");
  const [protectionPetitioner, setProtectionPetitioner] = useState("");
  const [protectionRespondent, setProtectionRespondent] = useState("");
  const [protectionDocuments, setProtectionDocuments] = useState<Array<{ name: string; url: string; type: string }>>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [remedies, setRemedies] = useState<RemediesState>({});

  // Helpers to update nested remedy state cleanly.
  const updateRemedy = <K extends keyof RemediesState>(key: K, patch: Partial<NonNullable<RemediesState[K]>>) => {
    setRemedies((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as object || {}), ...patch },
    }));
  };
  const toggleAbuseType = (type: string) => {
    setRemedies((prev) => {
      const current = prev.r01?.abuseTypes || [];
      const next = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      return { ...prev, r01: { ...(prev.r01 || {}), abuseTypes: next } };
    });
  };

  useEffect(() => {
    setTempSystemName(systemName);
    setTempDisclaimerText(disclaimerText);
    setTempLogoUrl(logoUrl);
  }, [systemName, disclaimerText, logoUrl]);

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

  const uploadToServer = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return (await res.json()) as { name: string; url: string; type: string };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'photo') => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(async (file) => {
      if (type === 'document' && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        try {
          const stored = await uploadToServer(file);
          setProtectionDocuments(prev => [...prev, {
            name: stored.name,
            url: stored.url,
            type: stored.type || file.type,
          }]);
        } catch (err) {
          console.warn("Server upload unavailable, falling back to local blob URL.", err);
          const url = URL.createObjectURL(file);
          setProtectionDocuments(prev => [...prev, {
            name: file.name,
            url,
            type: file.type,
          }]);
        }
      } else if (type === 'photo' && file.type.startsWith('image/')) {
        try {
          const stored = await uploadToServer(file);
          setPhotos(prev => [...prev, stored.url]);
        } catch (err) {
          console.warn("Server upload unavailable, falling back to data URL.", err);
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setPhotos(prev => [...prev, e.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        }
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
    setKnownAssailants("");
    setVehicleMake("");
    setVehicleModel("");
    setVehicleColor("");
    setVehiclePlate("");
    setElopementRisk("N");
    setFrequentLocations("");
    setOrderOfProtection(false);
    setOrderOfProtectionType('');
    setProtectionExpirationDate("");
    setProtectionNotes("");
    setProtectionDescription("");
    setProtectionPetitioner("");
    setProtectionRespondent("");
    setProtectionDocuments([]);
    setPhotos([]);
    setRemedies({});
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
      knownAssailants,
      vehicleMake,
      vehicleModel,
      vehicleColor,
      vehiclePlate,
      elopementRisk,
      frequentLocations,
      orderOfProtection,
      orderOfProtectionType,
      protectionExpirationDate,
      protectionNotes,
      protectionDescription,
      protectionPetitioner,
      protectionRespondent,
      protectionDocuments,
      photos,
      remedies
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
        knownAssailants,
        vehicleMake,
        vehicleModel,
        vehicleColor,
        vehiclePlate,
        elopementRisk,
        frequentLocations,
        orderOfProtection,
        orderOfProtectionType,
        protectionExpirationDate,
        protectionNotes,
        protectionDescription,
        protectionPetitioner,
        protectionRespondent,
        protectionDocuments,
        photos,
        remedies
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
    setKnownAssailants(person.knownAssailants || "");
    setVehicleMake(person.vehicleMake || "");
    setVehicleModel(person.vehicleModel || "");
    setVehicleColor(person.vehicleColor || "");
    setVehiclePlate(person.vehiclePlate || "");
    setElopementRisk(person.elopementRisk || "N");
    setFrequentLocations(person.frequentLocations || "");
    setOrderOfProtection(person.orderOfProtection || false);
    setOrderOfProtectionType(person.orderOfProtectionType || '');
    setProtectionExpirationDate(person.protectionExpirationDate || "");
    setProtectionNotes(person.protectionNotes || "");
    setProtectionDescription(person.protectionDescription || "");
    setProtectionPetitioner(person.protectionPetitioner || "");
    setProtectionRespondent(person.protectionRespondent || "");
    setProtectionDocuments(person.protectionDocuments || []);
    setPhotos(person.photos || []);
    setRemedies(person.remedies || {});
    setActiveTab("add");
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setTempLogoUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSystemSettingsSave = () => {
    onUpdateSystemName(tempSystemName);
    onUpdateDisclaimer(tempDisclaimerText);
    onUpdateLogo(tempLogoUrl);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Admin Panel</DialogTitle>
          <DialogDescription className="sr-only">
            Manage system settings, add or edit records, and configure the database
          </DialogDescription>
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

                {/* Identification Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Identification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="driversLicenseNumber">Driver&apos;s License #</Label>
                      <Input
                        type="text"
                        id="driversLicenseNumber"
                        value={driversLicenseNumber}
                        onChange={(e) => setDriversLicenseNumber(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                    <div>
                      <Label htmlFor="driversLicenseState">Driver&apos;s License State</Label>
                      <Input
                        type="text"
                        id="driversLicenseState"
                        value={driversLicenseState}
                        onChange={(e) => setDriversLicenseState(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                  </div>
                </div>

                {/* Address of Residence Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Address of Residence</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="addressOfResidence">Address of Residence</Label>
                      <Input
                        type="text"
                        id="addressOfResidence"
                        value={addressOfResidence}
                        onChange={(e) => setAddressOfResidence(e.target.value)}
                        placeholder="e.g., 6400 N CICERO AVE"
                      />
                    </div>
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        type="text"
                        id="district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g., 31"
                      />
                    </div>
                    <div>
                      <Label htmlFor="majorityDistrict">Majority District</Label>
                      <Input
                        type="text"
                        id="majorityDistrict"
                        value={majorityDistrict}
                        onChange={(e) => setMajorityDistrict(e.target.value)}
                        placeholder="e.g., 16"
                      />
                    </div>
                  </div>
                </div>

                {/* IDOC Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">IDOC Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="idocNumber">IDOC #</Label>
                      <Input
                        type="text"
                        id="idocNumber"
                        value={idocNumber}
                        onChange={(e) => setIdocNumber(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                    <div>
                      <Label htmlFor="idocAddressOfResidence">IDOC Address of Residence</Label>
                      <Input
                        type="text"
                        id="idocAddressOfResidence"
                        value={idocAddressOfResidence}
                        onChange={(e) => setIdocAddressOfResidence(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                    <div>
                      <Label htmlFor="idocDistrict">District</Label>
                      <Input
                        type="text"
                        id="idocDistrict"
                        value={idocDistrict}
                        onChange={(e) => setIdocDistrict(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                  </div>
                </div>

                {/* Criminal Record Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Criminal Record Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="latestArrestCB">Latest Arrest CB #</Label>
                      <Input
                        type="text"
                        id="latestArrestCB"
                        value={latestArrestCB}
                        onChange={(e) => setLatestArrestCB(e.target.value)}
                        placeholder="e.g., 30421811"
                      />
                    </div>
                    <div>
                      <Label htmlFor="latestFelonyArrestCB">Latest Felony Arrest CB #</Label>
                      <Input
                        type="text"
                        id="latestFelonyArrestCB"
                        value={latestFelonyArrestCB}
                        onChange={(e) => setLatestFelonyArrestCB(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                    <div>
                      <Label htmlFor="onParole">On Parole</Label>
                      <Input
                        type="text"
                        id="onParole"
                        value={onParole}
                        onChange={(e) => setOnParole(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                    <div>
                      <Label htmlFor="latestContact">Latest Contact</Label>
                      <Input
                        type="text"
                        id="latestContact"
                        value={latestContact}
                        onChange={(e) => setLatestContact(e.target.value)}
                        placeholder="e.g., 23 DEC 2024 @ 15:09"
                      />
                    </div>
                    <div>
                      <Label htmlFor="latestContactDistrict">Latest Contact District</Label>
                      <Input
                        type="text"
                        id="latestContactDistrict"
                        value={latestContactDistrict}
                        onChange={(e) => setLatestContactDistrict(e.target.value)}
                        placeholder="e.g., 31"
                      />
                    </div>
                    <div>
                      <Label htmlFor="latestWarrant">Latest Warrant</Label>
                      <Input
                        type="text"
                        id="latestWarrant"
                        value={latestWarrant}
                        onChange={(e) => setLatestWarrant(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                    <div>
                      <Label htmlFor="latestInvestigativeAlert">Latest Investigative Alert</Label>
                      <Input
                        type="text"
                        id="latestInvestigativeAlert"
                        value={latestInvestigativeAlert}
                        onChange={(e) => setLatestInvestigativeAlert(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                  </div>
                </div>

                {/* Domestic Violence Arrest Record Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Domestic Violence Arrest Record</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="domesticViolenceArrestCount">Arrest Count</Label>
                      <Input
                        type="text"
                        id="domesticViolenceArrestCount"
                        value={domesticViolenceArrestCount}
                        onChange={(e) => setDomesticViolenceArrestCount(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                    <div>
                      <Label htmlFor="latestDomesticViolenceArrestDate">Latest Arrest Date</Label>
                      <Input
                        type="text"
                        id="latestDomesticViolenceArrestDate"
                        value={latestDomesticViolenceArrestDate}
                        onChange={(e) => setLatestDomesticViolenceArrestDate(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                  </div>
                </div>

                {/* Weapons Arrest Record Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Weapons Arrest Record</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="weaponsPossession">Possession</Label>
                      <Select value={weaponsPossession} onValueChange={setWeaponsPossession}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N">N</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="weaponsArrestCount">Arrest Count</Label>
                      <Input
                        type="text"
                        id="weaponsArrestCount"
                        value={weaponsArrestCount}
                        onChange={(e) => setWeaponsArrestCount(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                    <div>
                      <Label htmlFor="latestWeaponsArrestDate">Latest Arrest Date</Label>
                      <Input
                        type="text"
                        id="latestWeaponsArrestDate"
                        value={latestWeaponsArrestDate}
                        onChange={(e) => setLatestWeaponsArrestDate(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                  </div>
                </div>

                {/* Narcotics Arrest Record Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Narcotics Arrest Record</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="narcoticsPossession">Possession</Label>
                      <Select value={narcoticsPossession} onValueChange={setNarcoticsPossession}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N">N</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="narcoticsArrestCount">Arrest Count</Label>
                      <Input
                        type="text"
                        id="narcoticsArrestCount"
                        value={narcoticsArrestCount}
                        onChange={(e) => setNarcoticsArrestCount(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
                    <div>
                      <Label htmlFor="latestNarcoticsArrestDate">Latest Arrest Date</Label>
                      <Input
                        type="text"
                        id="latestNarcoticsArrestDate"
                        value={latestNarcoticsArrestDate}
                        onChange={(e) => setLatestNarcoticsArrestDate(e.target.value)}
                        placeholder="No Data"
                      />
                    </div>
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
                        <SelectItem value="4&apos;0&quot;">4&apos;0&quot;</SelectItem>
                        <SelectItem value="4&apos;6&quot;">4&apos;6&quot;</SelectItem>
                        <SelectItem value="5&apos;0&quot;">5&apos;0&quot;</SelectItem>
                        <SelectItem value="5&apos;1&quot;">5&apos;1&quot;</SelectItem>
                        <SelectItem value="5&apos;2&quot;">5&apos;2&quot;</SelectItem>
                        <SelectItem value="5&apos;3&quot;">5&apos;3&quot;</SelectItem>
                        <SelectItem value="5&apos;4&quot;">5&apos;4&quot;</SelectItem>
                        <SelectItem value="5&apos;5&quot;">5&apos;5&quot;</SelectItem>
                        <SelectItem value="5&apos;6&quot;">5&apos;6&quot;</SelectItem>
                        <SelectItem value="5&apos;7&quot;">5&apos;7&quot;</SelectItem>
                        <SelectItem value="5&apos;8&quot;">5&apos;8&quot;</SelectItem>
                        <SelectItem value="5&apos;9&quot;">5&apos;9&quot;</SelectItem>
                        <SelectItem value="5&apos;10&quot;">5&apos;10&quot;</SelectItem>
                        <SelectItem value="5&apos;11&quot;">5&apos;11&quot;</SelectItem>
                        <SelectItem value="6&apos;0&quot;">6&apos;0&quot;</SelectItem>
                        <SelectItem value="6&apos;1&quot;">6&apos;1&quot;</SelectItem>
                        <SelectItem value="6&apos;2&quot;">6&apos;2&quot;</SelectItem>
                        <SelectItem value="6&apos;3&quot;">6&apos;3&quot;</SelectItem>
                        <SelectItem value="6&apos;4&quot;">6&apos;4&quot;</SelectItem>
                        <SelectItem value="6&apos;5&quot;">6&apos;5&quot;</SelectItem>
                        <SelectItem value="6&apos;6&quot;">6&apos;6&quot;</SelectItem>
                        <SelectItem value="7&apos;0&quot;">7&apos;0&quot;</SelectItem>
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
                  <Label htmlFor="knownAssailants">Known Assailants</Label>
                  <Textarea
                    id="knownAssailants"
                    value={knownAssailants}
                    onChange={(e) => setKnownAssailants(e.target.value)}
                    placeholder="List known associates or accomplices..."
                    className="resize-none"
                  />
                </div>

                {/* Elopement Risk Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Elopement Risk</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="elopementRisk">Person Wanders / Elopement Risk</Label>
                      <Select value={elopementRisk} onValueChange={setElopementRisk}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N">No</SelectItem>
                          <SelectItem value="Y">Yes</SelectItem>
                          <SelectItem value="UNK">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="frequentLocations">Places Frequently Visited</Label>
                    <Textarea
                      id="frequentLocations"
                      value={frequentLocations}
                      onChange={(e) => setFrequentLocations(e.target.value)}
                      placeholder="List parks, stores, relatives' homes, transit stops, or any locations the subject is known to visit..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </div>


                {/* Vehicle Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Last Known Registered Vehicle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="vehicleMake">Make</Label>
                      <Select value={vehicleMake} onValueChange={setVehicleMake}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Acura">Acura</SelectItem>
                          <SelectItem value="Audi">Audi</SelectItem>
                          <SelectItem value="BMW">BMW</SelectItem>
                          <SelectItem value="Buick">Buick</SelectItem>
                          <SelectItem value="Cadillac">Cadillac</SelectItem>
                          <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                          <SelectItem value="Chrysler">Chrysler</SelectItem>
                          <SelectItem value="Dodge">Dodge</SelectItem>
                          <SelectItem value="Ford">Ford</SelectItem>
                          <SelectItem value="GMC">GMC</SelectItem>
                          <SelectItem value="Honda">Honda</SelectItem>
                          <SelectItem value="Hyundai">Hyundai</SelectItem>
                          <SelectItem value="Infiniti">Infiniti</SelectItem>
                          <SelectItem value="Jeep">Jeep</SelectItem>
                          <SelectItem value="Kia">Kia</SelectItem>
                          <SelectItem value="Lexus">Lexus</SelectItem>
                          <SelectItem value="Lincoln">Lincoln</SelectItem>
                          <SelectItem value="Mazda">Mazda</SelectItem>
                          <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                          <SelectItem value="Mitsubishi">Mitsubishi</SelectItem>
                          <SelectItem value="Nissan">Nissan</SelectItem>
                          <SelectItem value="Pontiac">Pontiac</SelectItem>
                          <SelectItem value="Ram">Ram</SelectItem>
                          <SelectItem value="Subaru">Subaru</SelectItem>
                          <SelectItem value="Tesla">Tesla</SelectItem>
                          <SelectItem value="Toyota">Toyota</SelectItem>
                          <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                          <SelectItem value="Volvo">Volvo</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="vehicleModel">Model</Label>
                      <Input
                        type="text"
                        id="vehicleModel"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="e.g., Camry, F-150"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicleColor">Color</Label>
                      <Select value={vehicleColor} onValueChange={setVehicleColor}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Black">Black</SelectItem>
                          <SelectItem value="White">White</SelectItem>
                          <SelectItem value="Silver">Silver</SelectItem>
                          <SelectItem value="Gray">Gray</SelectItem>
                          <SelectItem value="Red">Red</SelectItem>
                          <SelectItem value="Blue">Blue</SelectItem>
                          <SelectItem value="Green">Green</SelectItem>
                          <SelectItem value="Yellow">Yellow</SelectItem>
                          <SelectItem value="Orange">Orange</SelectItem>
                          <SelectItem value="Brown">Brown</SelectItem>
                          <SelectItem value="Purple">Purple</SelectItem>
                          <SelectItem value="Gold">Gold</SelectItem>
                          <SelectItem value="Maroon">Maroon</SelectItem>
                          <SelectItem value="Tan">Tan</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="vehiclePlate">License Plate</Label>
                      <Input
                        type="text"
                        id="vehiclePlate"
                        value={vehiclePlate}
                        onChange={(e) => setVehiclePlate(e.target.value)}
                        placeholder="e.g., ABC-1234"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastKnownVehicle">Legacy Vehicle Field (Optional)</Label>
                  <Input
                    type="text"
                    id="lastKnownVehicle"
                    value={lastKnownVehicle}
                    onChange={(e) => setLastKnownVehicle(e.target.value)}
                    placeholder="Legacy format: 2018 Black Ford F-150, License: ABC-1234"
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
                          onValueChange={(value) => setOrderOfProtectionType(value as 'order' | 'stalking' | 'civil' | 'firearms' | '')}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="order">Order of Protection</SelectItem>
                            <SelectItem value="stalking">Stalking No Contact Order</SelectItem>
                            <SelectItem value="civil">Civil No Contact Order</SelectItem>
                            <SelectItem value="firearms">Firearms Restraining Order</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {orderOfProtection && (
                    <div>
                      <Label>Order Status (check all that apply)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 p-3 border rounded-md">
                        {[
                          { value: 'no-unlawful-contact', label: 'No Unlawful Contact' },
                          { value: 'no-contact', label: 'No Contact' },
                          { value: 'emergency', label: 'Emergency' },
                          { value: 'durational', label: 'Durational' },
                          { value: 'plenary', label: 'Plenary' },
                        ].map((opt) => (
                          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={orderStatusFlags.includes(opt.value)}
                              onCheckedChange={(checked) => {
                                setOrderStatusFlags((prev) =>
                                  checked
                                    ? [...prev, opt.value]
                                    : prev.filter((v) => v !== opt.value)
                                );
                              }}
                            />
                            <span className="text-sm">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
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

                      {/* ---------- Remedies ---------- */}
                      <div className="rounded-lg border border-purple-200 bg-purple-50/40 p-4 space-y-5">
                        <div>
                          <h4 className="text-base font-bold text-purple-900">Remedies</h4>
                          <p className="text-xs text-purple-900/70">
                            Select the remedies granted by the court and fill in the required details.
                          </p>
                        </div>

                        {/* R01 - No Abuse */}
                        <div className="rounded border bg-white p-3 space-y-3">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Checkbox
                              checked={!!remedies.r01?.enabled}
                              onCheckedChange={(v) => updateRemedy("r01", { enabled: !!v })}
                            />
                            <span className="text-sm font-semibold">
                              1. No Abuse (R01){" "}
                              <span className="text-xs font-normal text-muted-foreground">(Police Enforced)</span>
                            </span>
                          </label>
                          {remedies.r01?.enabled && (
                            <div className="pl-6 space-y-2">
                              <p className="text-xs text-muted-foreground">
                                Respondent shall not threaten or commit the following acts of abuse (check all that apply):
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {ABUSE_TYPES.map((type) => (
                                  <label key={type} className="flex items-start gap-2 text-sm cursor-pointer">
                                    <Checkbox
                                      checked={remedies.r01?.abuseTypes?.includes(type) || false}
                                      onCheckedChange={() => toggleAbuseType(type)}
                                    />
                                    <span>{type}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* R02 - Possession of Residence */}
                        <div className="rounded border bg-white p-3 space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Checkbox
                              checked={!!remedies.r02?.enabled}
                              onCheckedChange={(v) => updateRemedy("r02", { enabled: !!v })}
                            />
                            <span className="text-sm font-semibold">
                              2. Possession of Residence (R02){" "}
                              <span className="text-xs font-normal text-muted-foreground">(Police Enforced)</span>
                            </span>
                          </label>
                          {remedies.r02?.enabled && (
                            <Textarea
                              value={remedies.r02?.text || ""}
                              onChange={(e) => updateRemedy("r02", { text: e.target.value })}
                              placeholder="Petitioner is granted exclusive possession of the residence located at…"
                              rows={3}
                            />
                          )}
                        </div>

                        {/* R03 - Stay Away */}
                        <div className="rounded border bg-white p-3 space-y-3">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Checkbox
                              checked={!!remedies.r03?.enabled}
                              onCheckedChange={(v) => updateRemedy("r03", { enabled: !!v })}
                            />
                            <span className="text-sm font-semibold">
                              3. Stay Away from Petitioner, Protected People, and Certain Places (R03){" "}
                              <span className="text-xs font-normal text-muted-foreground">(Police Enforced)</span>
                            </span>
                          </label>
                          {remedies.r03?.enabled && (
                            <div className="pl-6 space-y-3">
                              <label className="flex items-start gap-2 text-sm cursor-pointer">
                                <Checkbox
                                  checked={!!remedies.r03?.stayAwayGeneral}
                                  onCheckedChange={(v) => updateRemedy("r03", { stayAwayGeneral: !!v })}
                                />
                                <span>
                                  Respondent shall stay away from Petitioner and protected people at all times, and shall
                                  not have any contact, including through third parties.
                                </span>
                              </label>
                              <div>
                                <Label className="text-xs">Petitioner's places of employment (name, street, city, state, ZIP)</Label>
                                <Textarea
                                  value={remedies.r03?.employmentAddresses || ""}
                                  onChange={(e) => updateRemedy("r03", { employmentAddresses: e.target.value })}
                                  placeholder="Name&#10;Street Address, City, State ZIP"
                                  rows={3}
                                />
                                <label className="mt-2 flex items-center gap-2 text-xs cursor-pointer">
                                  <Checkbox
                                    checked={!!remedies.r03?.addressConfidential}
                                    onCheckedChange={(v) => updateRemedy("r03", { addressConfidential: !!v })}
                                  />
                                  <span>Address is confidential and is omitted from these forms.</span>
                                </label>
                              </div>
                              <div>
                                <Label className="text-xs">Other places Respondent must stay away from</Label>
                                <Textarea
                                  value={remedies.r03?.otherAddresses || ""}
                                  onChange={(e) => updateRemedy("r03", { otherAddresses: e.target.value })}
                                  placeholder="Name&#10;Street Address, City, State ZIP"
                                  rows={3}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* R05 - Care and Possession of Children */}
                        <div className="rounded border bg-white p-3 space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Checkbox
                              checked={!!remedies.r05?.enabled}
                              onCheckedChange={(v) => updateRemedy("r05", { enabled: !!v })}
                            />
                            <span className="text-sm font-semibold">
                              5. Care and Possession of Children (R05){" "}
                              <span className="text-xs font-normal text-muted-foreground">(Police/Court Enforced)</span>
                            </span>
                          </label>
                          {remedies.r05?.enabled && (
                            <Textarea
                              value={remedies.r05?.text || ""}
                              onChange={(e) => updateRemedy("r05", { text: e.target.value })}
                              placeholder="Details of care and possession of children…"
                              rows={3}
                            />
                          )}
                        </div>

                        {/* R08 - No Concealment or Removal of Children */}
                        <div className="rounded border bg-white p-3 space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Checkbox
                              checked={!!remedies.r08?.enabled}
                              onCheckedChange={(v) => updateRemedy("r08", { enabled: !!v })}
                            />
                            <span className="text-sm font-semibold">
                              8. No Concealment or Removal of Children (R08){" "}
                              <span className="text-xs font-normal text-muted-foreground">(Police Enforced)</span>
                            </span>
                          </label>
                          {remedies.r08?.enabled && (
                            <Textarea
                              value={remedies.r08?.text || ""}
                              onChange={(e) => updateRemedy("r08", { text: e.target.value })}
                              placeholder="Respondent shall not hide the minor children within the State or remove the children from Illinois. Details…"
                              rows={3}
                            />
                          )}
                        </div>

                        {/* R10 - Possession of Personal Property */}
                        <div className="rounded border bg-white p-3 space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Checkbox
                              checked={!!remedies.r10?.enabled}
                              onCheckedChange={(v) => updateRemedy("r10", { enabled: !!v })}
                            />
                            <span className="text-sm font-semibold">
                              10. Possession of Personal Property (R10){" "}
                              <span className="text-xs font-normal text-muted-foreground">(Court Enforced)</span>
                            </span>
                          </label>
                          {remedies.r10?.enabled && (
                            <Textarea
                              value={remedies.r10?.text || ""}
                              onChange={(e) => updateRemedy("r10", { text: e.target.value })}
                              placeholder="Petitioner is awarded possession of the following property…"
                              rows={3}
                            />
                          )}
                        </div>

                        {/* R11 - Restrictions on Property */}
                        <div className="rounded border bg-white p-3 space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Checkbox
                              checked={!!remedies.r11?.enabled}
                              onCheckedChange={(v) => updateRemedy("r11", { enabled: !!v })}
                            />
                            <span className="text-sm font-semibold">
                              11. Restrictions on Property (R11){" "}
                              <span className="text-xs font-normal text-muted-foreground">(Court Enforced)</span>
                            </span>
                          </label>
                          {remedies.r11?.enabled && (
                            <Textarea
                              value={remedies.r11?.text || ""}
                              onChange={(e) => updateRemedy("r11", { text: e.target.value })}
                              placeholder="The following property is protected…"
                              rows={3}
                            />
                          )}
                        </div>

                        {/* R11.5 - Possession of Animals */}
                        <div className="rounded border bg-white p-3 space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Checkbox
                              checked={!!remedies.r11_5?.enabled}
                              onCheckedChange={(v) => updateRemedy("r11_5", { enabled: !!v })}
                            />
                            <span className="text-sm font-semibold">
                              11.5 Possession of Animals (R11.5){" "}
                              <span className="text-xs font-normal text-muted-foreground">(Court Enforced)</span>
                            </span>
                          </label>
                          {remedies.r11_5?.enabled && (
                            <Textarea
                              value={remedies.r11_5?.text || ""}
                              onChange={(e) => updateRemedy("r11_5", { text: e.target.value })}
                              placeholder="Animals (name, type, breed)…"
                              rows={3}
                            />
                          )}
                        </div>

                        {/* R14 - No Entry Under Influence */}
                        <div className="rounded border bg-white p-3 space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Checkbox
                              checked={!!remedies.r14?.enabled}
                              onCheckedChange={(v) => updateRemedy("r14", { enabled: !!v })}
                            />
                            <span className="text-sm font-semibold">
                              14. No Entry or Presence Under Influence (R14){" "}
                              <span className="text-xs font-normal text-muted-foreground">(Police Enforced)</span>
                            </span>
                          </label>
                          {remedies.r14?.enabled && (
                            <Textarea
                              value={remedies.r14?.text || ""}
                              onChange={(e) => updateRemedy("r14", { text: e.target.value })}
                              placeholder="Details / conditions…"
                              rows={2}
                            />
                          )}
                        </div>

                        {/* R14.5 - Firearms */}
                        <div className="rounded border bg-white p-3 space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Checkbox
                              checked={!!remedies.r14_5?.enabled}
                              onCheckedChange={(v) => updateRemedy("r14_5", { enabled: !!v })}
                            />
                            <span className="text-sm font-semibold">
                              14.5 Firearms (R14.5){" "}
                              <span className="text-xs font-normal text-muted-foreground">(Police Enforced)</span>
                            </span>
                          </label>
                          {remedies.r14_5?.enabled && (
                            <p className="pl-6 text-xs text-muted-foreground">
                              Respondent is prohibited from possessing firearms for the duration of this order and must
                              surrender firearms, firearm parts, FOID card, and/or Concealed Carry License to law
                              enforcement.
                            </p>
                          )}
                        </div>

                        {/* R17 - Miscellaneous */}
                        <div className="rounded border bg-white p-3 space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <Checkbox
                              checked={!!remedies.r17?.enabled}
                              onCheckedChange={(v) => updateRemedy("r17", { enabled: !!v })}
                            />
                            <span className="text-sm font-semibold">
                              17. Miscellaneous Remedies (R17){" "}
                              <span className="text-xs font-normal text-muted-foreground">(Court Enforced)</span>
                            </span>
                          </label>
                          {remedies.r17?.enabled && (
                            <Textarea
                              value={remedies.r17?.text || ""}
                              onChange={(e) => updateRemedy("r17", { text: e.target.value })}
                              placeholder="The court further orders as follows…"
                              rows={3}
                            />
                          )}
                        </div>
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

                {/* Photo Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-700">Headshot Photos</h3>
                  <div>
                    <Label htmlFor="photoUpload">Upload Headshot Photos</Label>
                    <Input
                      id="photoUpload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'photo')}
                      className="mt-1"
                    />
                    {photos.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={photo} 
                              alt={`Photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
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

                <div className="space-y-2">
                  <Label htmlFor="logoUpload">System Logo</Label>
                  <Input
                    id="logoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="mt-1"
                  />
                  {tempLogoUrl && (
                    <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
                      <img 
                        src={tempLogoUrl} 
                        alt="System Logo" 
                        className="max-h-20 object-contain"
                      />
                    </div>
                  )}
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