
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, X } from "lucide-react";

interface WantedPerson {
  id: string;
  name: string;
  alias: string;
  address: string;
  sex: string;
  dob: string;
  height: string;
  weight: string;
  hair: string;
  eyes: string;
  charges: string;
  reward: string;
  dangerLevel: string;
  lastSeen: string;
  caseNumber: string;
}

interface AdminPanelProps {
  people: WantedPerson[];
  onAddPerson: (person: Omit<WantedPerson, 'id'>) => void;
  onEditPerson: (id: string, person: Omit<WantedPerson, 'id'>) => void;
  onDeletePerson: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel = ({ people, onAddPerson, onEditPerson, onDeletePerson, isOpen, onClose }: AdminPanelProps) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    alias: "",
    address: "",
    sex: "",
    dob: "",
    height: "",
    weight: "",
    hair: "",
    eyes: "",
    charges: "",
    reward: "",
    dangerLevel: "",
    lastSeen: "",
    caseNumber: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      alias: "",
      address: "",
      sex: "",
      dob: "",
      height: "",
      weight: "",
      hair: "",
      eyes: "",
      charges: "",
      reward: "",
      dangerLevel: "",
      lastSeen: "",
      caseNumber: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onEditPerson(editingId, formData);
      setEditingId(null);
    } else {
      onAddPerson(formData);
      setIsAddingNew(false);
    }
    resetForm();
  };

  const startEdit = (person: WantedPerson) => {
    setFormData(person);
    setEditingId(person.id);
    setIsAddingNew(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Admin Panel - Manage Wanted Persons</h2>
          <Button variant="ghost" onClick={onClose} className="text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Wanted Persons Database</h3>
            <Button 
              onClick={() => setIsAddingNew(true)}
              className="bg-red-700 hover:bg-red-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Person
            </Button>
          </div>

          {isAddingNew && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingId ? "Edit Person" : "Add New Wanted Person"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="alias" className="text-gray-300">Alias</Label>
                    <Input
                      id="alias"
                      value={formData.alias}
                      onChange={(e) => setFormData({...formData, alias: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="charges" className="text-gray-300">Charges</Label>
                    <Input
                      id="charges"
                      value={formData.charges}
                      onChange={(e) => setFormData({...formData, charges: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reward" className="text-gray-300">Reward</Label>
                    <Input
                      id="reward"
                      value={formData.reward}
                      onChange={(e) => setFormData({...formData, reward: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="$50,000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dangerLevel" className="text-gray-300">Danger Level</Label>
                    <Input
                      id="dangerLevel"
                      value={formData.dangerLevel}
                      onChange={(e) => setFormData({...formData, dangerLevel: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="HIGH, MEDIUM, LOW"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastSeen" className="text-gray-300">Last Seen</Label>
                    <Input
                      id="lastSeen"
                      value={formData.lastSeen}
                      onChange={(e) => setFormData({...formData, lastSeen: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="col-span-full">
                    <Label htmlFor="address" className="text-gray-300">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sex" className="text-gray-300">Sex</Label>
                    <Input
                      id="sex"
                      value={formData.sex}
                      onChange={(e) => setFormData({...formData, sex: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="M/F"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob" className="text-gray-300">Date of Birth</Label>
                    <Input
                      id="dob"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="MM/DD/YYYY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-gray-300">Height</Label>
                    <Input
                      id="height"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="5'10&quot;"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-gray-300">Weight</Label>
                    <Input
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="180"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hair" className="text-gray-300">Hair</Label>
                    <Input
                      id="hair"
                      value={formData.hair}
                      onChange={(e) => setFormData({...formData, hair: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="BRO, BLK, BLD"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eyes" className="text-gray-300">Eyes</Label>
                    <Input
                      id="eyes"
                      value={formData.eyes}
                      onChange={(e) => setFormData({...formData, eyes: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="BRO, BLU, GRN"
                    />
                  </div>
                  <div>
                    <Label htmlFor="caseNumber" className="text-gray-300">Case Number</Label>
                    <Input
                      id="caseNumber"
                      value={formData.caseNumber}
                      onChange={(e) => setFormData({...formData, caseNumber: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="2024-XXXX-WNT"
                    />
                  </div>

                  <div className="col-span-full flex gap-4">
                    <Button type="submit" className="bg-red-700 hover:bg-red-800">
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
                      className="border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Current Database ({people.length} records)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Charges</TableHead>
                    <TableHead className="text-gray-300">Reward</TableHead>
                    <TableHead className="text-gray-300">Danger Level</TableHead>
                    <TableHead className="text-gray-300">Case Number</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {people.map((person) => (
                    <TableRow key={person.id} className="border-gray-700">
                      <TableCell className="text-white">
                        <div>
                          <div className="font-semibold">{person.name}</div>
                          <div className="text-sm text-gray-400">{person.alias}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{person.charges}</TableCell>
                      <TableCell className="text-yellow-400 font-bold">{person.reward}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={person.dangerLevel === "HIGH" ? "destructive" : "secondary"}
                          className={person.dangerLevel === "HIGH" ? "bg-red-600" : ""}
                        >
                          {person.dangerLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white font-mono">{person.caseNumber}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(person)}
                            className="border-gray-600 text-gray-300"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDeletePerson(person.id)}
                            className="bg-red-700 hover:bg-red-800"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
