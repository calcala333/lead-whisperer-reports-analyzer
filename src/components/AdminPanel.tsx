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

  const handleSaveBranding = () => {
    onUpdateSystemName(brandingName);
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
