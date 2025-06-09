
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
  dangerLevel: string;
  lastSeen: string;
  orderOfProtection?: boolean;
  protectionExpirationDate?: string;
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
    dangerLevel: "",
    lastSeen: "",
    orderOfProtection: false,
    protectionExpirationDate: ""
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
      dangerLevel: "",
      lastSeen: "",
      orderOfProtection: false,
      protectionExpirationDate: ""
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
    setFormData({
      name: person.name,
      alias: person.alias,
      address: person.address,
      sex: person.sex,
      dob: person.dob,
      height: person.height,
      weight: person.weight,
      hair: person.hair,
      eyes: person.eyes,
      charges: person.charges,
      dangerLevel: person.dangerLevel,
      lastSeen: person.lastSeen,
      orderOfProtection: person.orderOfProtection || false,
      protectionExpirationDate: person.protectionExpirationDate || ""
    });
    setEditingId(person.id);
    setIsAddingNew(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto border-2 border-blue-200">
        <div className="flex items-center justify-between p-6 border-b border-blue-200 bg-blue-600">
          <h2 className="text-2xl font-bold text-white">Admin Panel - Manage Records</h2>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-blue-700">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6 bg-white">
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
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="border-gray-300 text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="alias" className="text-gray-700">Alias</Label>
                    <Input
                      id="alias"
                      value={formData.alias}
                      onChange={(e) => setFormData({...formData, alias: e.target.value})}
                      className="border-gray-300 text-gray-800"
                    />
                  </div>
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
                  <div className="col-span-full">
                    <Label htmlFor="address" className="text-gray-700">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
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
                    <Label htmlFor="dob" className="text-gray-700">Date of Birth</Label>
                    <Input
                      id="dob"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                      className="border-gray-300 text-gray-800"
                      placeholder="MM/DD/YYYY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-gray-700">Height</Label>
                    <Input
                      id="height"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      className="border-gray-300 text-gray-800"
                      placeholder="5'10&quot;"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-gray-700">Weight</Label>
                    <Input
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="border-gray-300 text-gray-800"
                      placeholder="180"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hair" className="text-gray-700">Hair</Label>
                    <Input
                      id="hair"
                      value={formData.hair}
                      onChange={(e) => setFormData({...formData, hair: e.target.value})}
                      className="border-gray-300 text-gray-800"
                      placeholder="BRO, BLK, BLD"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eyes" className="text-gray-700">Eyes</Label>
                    <Input
                      id="eyes"
                      value={formData.eyes}
                      onChange={(e) => setFormData({...formData, eyes: e.target.value})}
                      className="border-gray-300 text-gray-800"
                      placeholder="BRO, BLU, GRN"
                    />
                  </div>

                  <div className="col-span-full flex gap-4">
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
                    <TableHead className="text-gray-700">Name</TableHead>
                    <TableHead className="text-gray-700">Charges</TableHead>
                    <TableHead className="text-gray-700">Danger Level</TableHead>
                    <TableHead className="text-gray-700">Order of Protection</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {people.map((person) => (
                    <TableRow key={person.id} className="border-gray-300">
                      <TableCell className="text-gray-800">
                        <div>
                          <div className="font-semibold">{person.name}</div>
                          <div className="text-sm text-gray-500">{person.alias}</div>
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
                            <Badge className="bg-purple-600 text-white">Active</Badge>
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
