import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon, Settings } from "lucide-react";

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

interface AdminPanelProps {
  people: WantedPerson[];
  onAddPerson: (person: Omit<WantedPerson, 'id'>) => void;
  onEditPerson: (id: string, person: Omit<WantedPerson, 'id'>) => void;
  onDeletePerson: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  brandingName: string;
  onBrandingChange: (name: string) => void;
}

const AdminPanel = ({ people, onAddPerson, onEditPerson, onDeletePerson, isOpen, onClose, brandingName, onBrandingChange }: AdminPanelProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showBrandingSettings, setShowBrandingSettings] = useState(false);
  const [tempBrandingName, setTempBrandingName] = useState(brandingName);

  const [formData, setFormData] = useState({
    // Subject Demographics
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
    
    // Identification
    driversLicenseNumber: "",
    driversLicenseState: "",
    
    // Address of Residence
    addressOfResidence: "",
    district: "",
    majorityDistrict: "",
    
    // IDOC Information
    idocNumber: "",
    idocAddressOfResidence: "",
    idocDistrict: "",
    
    // Criminal Record Details
    latestArrestCB: "",
    latestFelonyArrestCB: "",
    onParole: "",
    latestContact: "",
    latestContactDistrict: "",
    latestWarrant: "",
    latestInvestigativeAlert: "",
    
    // Domestic Violence Arrest Record
    domesticViolenceArrestCount: "",
    latestDomesticViolenceArrestDate: "",
    
    // Weapons Arrest Record
    weaponsPossession: "N",
    weaponsArrestCount: "",
    latestWeaponsArrestDate: "",
    
    // Narcotics Arrest Record
    narcoticsPossession: "N",
    narcoticsArrestCount: "",
    latestNarcoticsArrestDate: "",

    // Legacy/Additional fields
    charges: "",
    dangerLevel: "",
    lastSeen: "",
    orderOfProtection: false,
    protectionExpirationDate: "",
    photos: [] as string[]
  });

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
      charges: "",
      dangerLevel: "",
      lastSeen: "",
      orderOfProtection: false,
      protectionExpirationDate: "",
      photos: []
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: string[] = [];
      const fileArray = Array.from(files);
      
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            if (newPhotos.length === fileArray.length) {
              setFormData(prev => ({
                ...prev,
                photos: [...prev.photos, ...newPhotos]
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const isOrderOfProtectionActive = (person: WantedPerson) => {
    if (!person.orderOfProtection || !person.protectionExpirationDate) return false;
    const expirationDate = new Date(person.protectionExpirationDate);
    const today = new Date();
    return expirationDate > today;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that if order of protection is checked, expiration date is provided
    if (formData.orderOfProtection && !formData.protectionExpirationDate) {
      alert("Please provide an expiration date for the order of protection.");
      return;
    }
    
    // Create legacy fields for compatibility
    const personData = {
      ...formData,
      name: `${formData.lastName}, ${formData.firstName} ${formData.middleName}`.trim(),
      alias: "", // Will need to be added separately if needed
      address: formData.addressOfResidence,
      dob: formData.birthDate,
      hair: "", // Will need to be added if needed
      eyes: "", // Will need to be added if needed
    };

    if (editingId) {
      onEditPerson(editingId, personData);
      setEditingId(null);
    } else {
      onAddPerson(personData);
      setIsAddingNew(false);
    }
    resetForm();
  };

  const startEdit = (person: WantedPerson) => {
    setFormData({
      lastName: person.lastName || "",
      firstName: person.firstName || "",
      middleName: person.middleName || "",
      sex: person.sex || "",
      race: person.race || "",
      age: person.age || "",
      birthDate: person.birthDate || person.dob || "",
      deceased: person.deceased || "N",
      height: person.height || "",
      weight: person.weight || "",
      driversLicenseNumber: person.driversLicenseNumber || "",
      driversLicenseState: person.driversLicenseState || "",
      addressOfResidence: person.addressOfResidence || person.address || "",
      district: person.district || "",
      majorityDistrict: person.majorityDistrict || "",
      idocNumber: person.idocNumber || "",
      idocAddressOfResidence: person.idocAddressOfResidence || "",
      idocDistrict: person.idocDistrict || "",
      latestArrestCB: person.latestArrestCB || "",
      latestFelonyArrestCB: person.latestFelonyArrestCB || "",
      onParole: person.onParole || "",
      latestContact: person.latestContact || "",
      latestContactDistrict: person.latestContactDistrict || "",
      latestWarrant: person.latestWarrant || "",
      latestInvestigativeAlert: person.latestInvestigativeAlert || "",
      domesticViolenceArrestCount: person.domesticViolenceArrestCount || "",
      latestDomesticViolenceArrestDate: person.latestDomesticViolenceArrestDate || "",
      weaponsPossession: person.weaponsPossession || "N",
      weaponsArrestCount: person.weaponsArrestCount || "",
      latestWeaponsArrestDate: person.latestWeaponsArrestDate || "",
      narcoticsPossession: person.narcoticsPossession || "N",
      narcoticsArrestCount: person.narcoticsArrestCount || "",
      latestNarcoticsArrestDate: person.latestNarcoticsArrestDate || "",
      charges: person.charges || "",
      dangerLevel: person.dangerLevel || "",
      lastSeen: person.lastSeen || "",
      orderOfProtection: person.orderOfProtection || false,
      protectionExpirationDate: person.protectionExpirationDate || "",
      photos: person.photos || []
    });
    setEditingId(person.id);
    setIsAddingNew(true);
  };

  const handleBrandingUpdate = () => {
    onBrandingChange(tempBrandingName);
    setShowBrandingSettings(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-auto border-2 border-blue-200">
        <div className="flex items-center justify-between p-6 border-b border-blue-200 bg-blue-600">
          <h2 className="text-2xl font-bold text-white">Admin Panel - Manage Records</h2>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowBrandingSettings(true)}
              className="text-white hover:bg-blue-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Branding
            </Button>
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-blue-700">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6 bg-white">
          {showBrandingSettings && (
            <Card className="bg-white border-2 border-green-200">
              <CardHeader className="bg-green-500 text-white rounded-t-lg">
                <CardTitle>System Branding Settings</CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="brandingName" className="text-gray-700">System Name</Label>
                    <Input
                      id="brandingName"
                      value={tempBrandingName}
                      onChange={(e) => setTempBrandingName(e.target.value)}
                      className="border-gray-300 text-gray-800"
                      placeholder="Enter system name (e.g., Police Database System)"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleBrandingUpdate}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Update Branding
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowBrandingSettings(false);
                        setTempBrandingName(brandingName);
                      }}
                      className="border-gray-400 text-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Database Records</h3>
            <Button 
              onClick={() => setIsAddingNew(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Person
            </Button>
          </div>

          {isAddingNew && (
            <Card className="bg-white border-2 border-blue-200">
              <CardHeader className="bg-blue-500 text-white rounded-t-lg">
                <CardTitle>
                  {editingId ? "Edit Person" : "Add New Person"}
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Photo Upload Section */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">PHOTO UPLOAD</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photos
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <span className="text-sm text-gray-600">Upload multiple photos for this person</span>
                      </div>
                      
                      {formData.photos.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.photos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-32 object-cover rounded border"
                              />
                              <Button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 h-auto"
                                size="sm"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subject Demographics */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">SUBJECT DEMOGRAPHICS</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="middleName" className="text-gray-700">Middle Name</Label>
                        <Input
                          id="middleName"
                          value={formData.middleName}
                          onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                          className="border-gray-300 text-gray-800"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sex" className="text-gray-700">Sex</Label>
                        <Input
                          id="sex"
                          value={formData.sex}
                          onChange={(e) => setFormData({...formData, sex: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="M/F"
                        />
                      </div>
                      <div>
                        <Label htmlFor="race" className="text-gray-700">Race</Label>
                        <Input
                          id="race"
                          value={formData.race}
                          onChange={(e) => setFormData({...formData, race: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="WHI, BLK, HIS, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="age" className="text-gray-700">Age</Label>
                        <Input
                          id="age"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                          className="border-gray-300 text-gray-800"
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthDate" className="text-gray-700">Birth Date</Label>
                        <Input
                          id="birthDate"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="DD-MMM-YYYY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deceased" className="text-gray-700">Deceased</Label>
                        <Input
                          id="deceased"
                          value={formData.deceased}
                          onChange={(e) => setFormData({...formData, deceased: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="Y/N"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height" className="text-gray-700">Height</Label>
                        <Input
                          id="height"
                          value={formData.height}
                          onChange={(e) => setFormData({...formData, height: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="6'00&quot;"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight" className="text-gray-700">Weight</Label>
                        <Input
                          id="weight"
                          value={formData.weight}
                          onChange={(e) => setFormData({...formData, weight: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="155"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Identification */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">IDENTIFICATION</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="driversLicenseNumber" className="text-gray-700">Driver's License #</Label>
                        <Input
                          id="driversLicenseNumber"
                          value={formData.driversLicenseNumber}
                          onChange={(e) => setFormData({...formData, driversLicenseNumber: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                      <div>
                        <Label htmlFor="driversLicenseState" className="text-gray-700">Driver's License State</Label>
                        <Input
                          id="driversLicenseState"
                          value={formData.driversLicenseState}
                          onChange={(e) => setFormData({...formData, driversLicenseState: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address of Residence */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">ADDRESS OF RESIDENCE</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <Label htmlFor="addressOfResidence" className="text-gray-700">Address of Residence</Label>
                        <Input
                          id="addressOfResidence"
                          value={formData.addressOfResidence}
                          onChange={(e) => setFormData({...formData, addressOfResidence: e.target.value})}
                          className="border-gray-300 text-gray-800"
                        />
                      </div>
                      <div>
                        <Label htmlFor="district" className="text-gray-700">District</Label>
                        <Input
                          id="district"
                          value={formData.district}
                          onChange={(e) => setFormData({...formData, district: e.target.value})}
                          className="border-gray-300 text-gray-800"
                        />
                      </div>
                      <div>
                        <Label htmlFor="majorityDistrict" className="text-gray-700">Majority District</Label>
                        <Input
                          id="majorityDistrict"
                          value={formData.majorityDistrict}
                          onChange={(e) => setFormData({...formData, majorityDistrict: e.target.value})}
                          className="border-gray-300 text-gray-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* IDOC Information */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">IDOC INFORMATION</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="idocNumber" className="text-gray-700">IDOC #</Label>
                        <Input
                          id="idocNumber"
                          value={formData.idocNumber}
                          onChange={(e) => setFormData({...formData, idocNumber: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                      <div>
                        <Label htmlFor="idocAddressOfResidence" className="text-gray-700">IDOC Address of Residence</Label>
                        <Input
                          id="idocAddressOfResidence"
                          value={formData.idocAddressOfResidence}
                          onChange={(e) => setFormData({...formData, idocAddressOfResidence: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                      <div>
                        <Label htmlFor="idocDistrict" className="text-gray-700">District</Label>
                        <Input
                          id="idocDistrict"
                          value={formData.idocDistrict}
                          onChange={(e) => setFormData({...formData, idocDistrict: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Criminal Record Details */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">CRIMINAL RECORD DETAILS</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="latestArrestCB" className="text-gray-700">Latest Arrest CB #</Label>
                        <Input
                          id="latestArrestCB"
                          value={formData.latestArrestCB}
                          onChange={(e) => setFormData({...formData, latestArrestCB: e.target.value})}
                          className="border-gray-300 text-gray-800"
                        />
                      </div>
                      <div>
                        <Label htmlFor="latestFelonyArrestCB" className="text-gray-700">Latest Felony Arrest CB #</Label>
                        <Input
                          id="latestFelonyArrestCB"
                          value={formData.latestFelonyArrestCB}
                          onChange={(e) => setFormData({...formData, latestFelonyArrestCB: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                      <div>
                        <Label htmlFor="onParole" className="text-gray-700">On Parole</Label>
                        <Input
                          id="onParole"
                          value={formData.onParole}
                          onChange={(e) => setFormData({...formData, onParole: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                      <div>
                        <Label htmlFor="latestContact" className="text-gray-700">Latest Contact</Label>
                        <Input
                          id="latestContact"
                          value={formData.latestContact}
                          onChange={(e) => setFormData({...formData, latestContact: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="DD MMM YYYY @ HH:MM"
                        />
                      </div>
                      <div>
                        <Label htmlFor="latestContactDistrict" className="text-gray-700">Latest Contact District</Label>
                        <Input
                          id="latestContactDistrict"
                          value={formData.latestContactDistrict}
                          onChange={(e) => setFormData({...formData, latestContactDistrict: e.target.value})}
                          className="border-gray-300 text-gray-800"
                        />
                      </div>
                      <div>
                        <Label htmlFor="latestWarrant" className="text-gray-700">Latest Warrant</Label>
                        <Input
                          id="latestWarrant"
                          value={formData.latestWarrant}
                          onChange={(e) => setFormData({...formData, latestWarrant: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                      <div>
                        <Label htmlFor="latestInvestigativeAlert" className="text-gray-700">Latest Investigative Alert</Label>
                        <Input
                          id="latestInvestigativeAlert"
                          value={formData.latestInvestigativeAlert}
                          onChange={(e) => setFormData({...formData, latestInvestigativeAlert: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Domestic Violence Arrest Record */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">DOMESTIC VIOLENCE ARREST RECORD</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="domesticViolenceArrestCount" className="text-gray-700">Arrest Count</Label>
                        <Input
                          id="domesticViolenceArrestCount"
                          value={formData.domesticViolenceArrestCount}
                          onChange={(e) => setFormData({...formData, domesticViolenceArrestCount: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                      <div>
                        <Label htmlFor="latestDomesticViolenceArrestDate" className="text-gray-700">Latest Arrest Date</Label>
                        <Input
                          id="latestDomesticViolenceArrestDate"
                          value={formData.latestDomesticViolenceArrestDate}
                          onChange={(e) => setFormData({...formData, latestDomesticViolenceArrestDate: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Weapons Arrest Record */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">WEAPONS ARREST RECORD</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="weaponsPossession" className="text-gray-700">Possession</Label>
                        <Input
                          id="weaponsPossession"
                          value={formData.weaponsPossession}
                          onChange={(e) => setFormData({...formData, weaponsPossession: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="Y/N"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weaponsArrestCount" className="text-gray-700">Arrest Count</Label>
                        <Input
                          id="weaponsArrestCount"
                          value={formData.weaponsArrestCount}
                          onChange={(e) => setFormData({...formData, weaponsArrestCount: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                      <div>
                        <Label htmlFor="latestWeaponsArrestDate" className="text-gray-700">Latest Arrest Date</Label>
                        <Input
                          id="latestWeaponsArrestDate"
                          value={formData.latestWeaponsArrestDate}
                          onChange={(e) => setFormData({...formData, latestWeaponsArrestDate: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Narcotics Arrest Record */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">NARCOTICS ARREST RECORD</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="narcoticsPossession" className="text-gray-700">Possession</Label>
                        <Input
                          id="narcoticsPossession"
                          value={formData.narcoticsPossession}
                          onChange={(e) => setFormData({...formData, narcoticsPossession: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="Y/N"
                        />
                      </div>
                      <div>
                        <Label htmlFor="narcoticsArrestCount" className="text-gray-700">Arrest Count</Label>
                        <Input
                          id="narcoticsArrestCount"
                          value={formData.narcoticsArrestCount}
                          onChange={(e) => setFormData({...formData, narcoticsArrestCount: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                      <div>
                        <Label htmlFor="latestNarcoticsArrestDate" className="text-gray-700">Latest Arrest Date</Label>
                        <Input
                          id="latestNarcoticsArrestDate"
                          value={formData.latestNarcoticsArrestDate}
                          onChange={(e) => setFormData({...formData, latestNarcoticsArrestDate: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="No Data"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">ADDITIONAL INFORMATION</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="charges" className="text-gray-700">Charges</Label>
                        <Input
                          id="charges"
                          value={formData.charges}
                          onChange={(e) => setFormData({...formData, charges: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dangerLevel" className="text-gray-700">Danger Level</Label>
                        <Input
                          id="dangerLevel"
                          value={formData.dangerLevel}
                          onChange={(e) => setFormData({...formData, dangerLevel: e.target.value})}
                          className="border-gray-300 text-gray-800"
                          placeholder="HIGH, MEDIUM, LOW, EXTREME"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastSeen" className="text-gray-700">Last Seen</Label>
                        <Input
                          id="lastSeen"
                          value={formData.lastSeen}
                          onChange={(e) => setFormData({...formData, lastSeen: e.target.value})}
                          className="border-gray-300 text-gray-800"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="orderOfProtection"
                          checked={formData.orderOfProtection}
                          onChange={(e) => setFormData({...formData, orderOfProtection: e.target.checked})}
                          className="rounded"
                        />
                        <Label htmlFor="orderOfProtection" className="text-gray-700">Order of Protection</Label>
                      </div>
                      {formData.orderOfProtection && (
                        <div>
                          <Label htmlFor="protectionExpirationDate" className="text-gray-700">Protection Expiration Date</Label>
                          <Input
                            id="protectionExpirationDate"
                            type="date"
                            value={formData.protectionExpirationDate}
                            onChange={(e) => setFormData({...formData, protectionExpirationDate: e.target.value})}
                            className="border-gray-300 text-gray-800"
                            required={formData.orderOfProtection}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      {editingId ? "Update Person" : "Add Person"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingId(null);
                        resetForm();
                      }}
                      className="border-gray-400 text-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white border-2 border-blue-200">
            <CardHeader className="bg-blue-500 text-white rounded-t-lg">
              <CardTitle>Current Database ({people.length} records)</CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-300">
                    <TableHead className="text-gray-700">Photo</TableHead>
                    <TableHead className="text-gray-700">Name</TableHead>
                    <TableHead className="text-gray-700">Charges</TableHead>
                    <TableHead className="text-gray-700">Danger Level</TableHead>
                    <TableHead className="text-gray-700">Order of Protection</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {people.map((person) => {
                    const isProtectionActive = isOrderOfProtectionActive(person);
                    const hasPhotos = person.photos && person.photos.length > 0;
                    
                    return (
                      <TableRow key={person.id} className="border-gray-300">
                        <TableCell>
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {hasPhotos ? (
                              <img 
                                src={person.photos[0]} 
                                alt={`${person.firstName} ${person.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-800">
                          <div>
                            <div className="font-semibold">
                              {person.name || `${person.lastName || ''}, ${person.firstName || ''} ${person.middleName || ''}`.trim()}
                            </div>
                            <div className="text-sm text-gray-500">{person.alias || 'No alias'}</div>
                            {hasPhotos && (
                              <div className="text-xs text-blue-600">
                                {person.photos.length} photo{person.photos.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-800">{person.charges}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={person.dangerLevel === "HIGH" || person.dangerLevel === "EXTREME" ? "destructive" : "secondary"}
                            className={person.dangerLevel === "HIGH" || person.dangerLevel === "EXTREME" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800"}
                          >
                            {person.dangerLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-800">
                          {person.orderOfProtection ? (
                            <div>
                              <Badge className={isProtectionActive ? "bg-purple-600 text-white" : "bg-gray-400 text-white"}>
                                {isProtectionActive ? "Active" : "Expired"}
                              </Badge>
                              <div className="text-xs text-gray-500 mt-1">
                                Expires: {person.protectionExpirationDate ? new Date(person.protectionExpirationDate).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(person)}
                              className="border-gray-400 text-gray-700"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onDeletePerson(person.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
