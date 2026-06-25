import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, Shield, AlertTriangle, FileText, Download, Printer } from "lucide-react";
import AdminPanel from "@/components/AdminPanel";

interface WantedPerson {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  sex: string;
  race: string;
  age: string;
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
  lastKnownVehicle?: string;
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
  knownAssailants?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehiclePlate?: string;
}

const Index = () => {
  const [people, setPeople] = useState<WantedPerson[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<WantedPerson[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<WantedPerson | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [systemName, setSystemName] = useState("Active Orders of Protection");
  const [disclaimerText, setDisclaimerText] = useState("This system contains sensitive law enforcement information. Access is restricted to authorized personnel only. All activities are logged and monitored. Unauthorized access is prohibited and subject to prosecution.");
  const [logoUrl, setLogoUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedPeople = localStorage.getItem('wantedPeople');
    const savedSystemName = localStorage.getItem('systemName');
    const savedDisclaimer = localStorage.getItem('disclaimerText');
    const savedLogo = localStorage.getItem('logoUrl');
    
    if (savedPeople) {
      setPeople(JSON.parse(savedPeople));
    } else {
      // Add mock data if no saved data exists
      const mockData: WantedPerson[] = [
        {
          id: "1",
          lastName: "Johnson",
          firstName: "Michael",
          middleName: "David",
          name: "Michael David Johnson",
          alias: "Mike, MDJ",
          sex: "Male",
          race: "White",
          age: "34",
          dob: "1989-03-15",
          deceased: "No",
          height: "6'2\"",
          weight: "185 lbs",
          hair: "Brown",
          eyes: "Blue",
          tattoos: "Eagle on right shoulder, 'MOM' on left forearm",
          piercings: "None",
          scars: "2-inch scar above left eyebrow",
          driversLicenseNumber: "D123456789",
          driversLicenseState: "IL",
          address: "1234 Oak Street, Chicago, IL 60601",
          addressOfResidence: "1234 Oak Street, Chicago, IL 60601",
          district: "Central",
          majorityDistrict: "District 1",
          idocNumber: "R12345",
          idocAddressOfResidence: "Last known: 1234 Oak Street",
          idocDistrict: "Central",
          latestArrestCB: "2023-08-15",
          latestFelonyArrestCB: "2022-12-10",
          onParole: "Yes",
          latestContact: "2023-09-01",
          latestContactDistrict: "Central",
          latestWarrant: "2023-08-20",
          latestInvestigativeAlert: "2023-09-05",
          domesticViolenceArrestCount: "2",
          latestDomesticViolenceArrestDate: "2023-06-12",
          weaponsPossession: "Yes",
          weaponsArrestCount: "1",
          latestWeaponsArrestDate: "2022-12-10",
          narcoticsPossession: "No",
          narcoticsArrestCount: "0",
          latestNarcoticsArrestDate: "",
          charges: "Aggravated Battery, Violation of Order of Protection, Resisting Arrest",
          dangerLevel: "HIGH",
          lastSeen: "September 1, 2023 - Near downtown Chicago",
          lastKnownVehicle: "2018 Black Ford F-150, License: ABC-1234",
          orderOfProtection: true,
          orderOfProtectionType: "plenary",
          protectionExpirationDate: "2024-12-31",
          protectionNotes: "Subject has violated order multiple times",
          protectionDescription: "No contact with Jane Johnson, stay 500 feet away from residence and workplace",
          protectionPetitioner: "Jane Johnson",
          protectionRespondent: "Michael Johnson",
          protectionDocuments: [
            {
              name: "Order of Protection - Case #2023-CV-12345",
              url: "#",
              type: "pdf"
            },
            {
              name: "Violation Report - 08/20/2023",
              url: "#",
              type: "pdf"
            }
          ],
          photos: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face&angle=45"
          ]
        },
        {
          id: "2",
          lastName: "Rodriguez",
          firstName: "Maria",
          middleName: "Elena",
          name: "Maria Elena Rodriguez",
          alias: "Mari, Elena",
          sex: "Female",
          race: "Hispanic",
          age: "28",
          dob: "1995-07-22",
          deceased: "No",
          height: "5'4\"",
          weight: "130 lbs",
          hair: "Black",
          eyes: "Brown",
          tattoos: "Rose on left wrist, butterfly on right ankle",
          piercings: "Ears pierced",
          scars: "Small scar on chin",
          driversLicenseNumber: "D987654321",
          driversLicenseState: "IL",
          address: "567 Maple Ave, Apartment 3B, Chicago, IL 60610",
          addressOfResidence: "567 Maple Ave, Apartment 3B, Chicago, IL 60610",
          district: "North",
          majorityDistrict: "District 2",
          idocNumber: "R67890",
          idocAddressOfResidence: "567 Maple Ave, Apartment 3B",
          idocDistrict: "North",
          latestArrestCB: "2023-07-28",
          latestFelonyArrestCB: "2023-07-28",
          onParole: "No",
          latestContact: "2023-08-15",
          latestContactDistrict: "North",
          latestWarrant: "2023-08-01",
          latestInvestigativeAlert: "2023-08-20",
          domesticViolenceArrestCount: "0",
          latestDomesticViolenceArrestDate: "",
          weaponsPossession: "No",
          weaponsArrestCount: "0",
          latestWeaponsArrestDate: "",
          narcoticsPossession: "Yes",
          narcoticsArrestCount: "3",
          latestNarcoticsArrestDate: "2023-07-28",
          charges: "Possession of Controlled Substance, Intent to Distribute, Failure to Appear",
          dangerLevel: "LOW",
          lastSeen: "August 15, 2023 - North Side neighborhood",
          lastKnownVehicle: "2020 White Honda Civic, License: XYZ-9876",
          orderOfProtection: false,
          photos: [
            "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=300&h=400&fit=crop&crop=face"
          ]
        },
        {
          id: "3",
          lastName: "Thompson",
          firstName: "Robert",
          middleName: "James",
          name: "Robert James Thompson",
          alias: "Bobby, RJ, Tank",
          sex: "Male",
          race: "Black",
          age: "42",
          dob: "1981-11-08",
          deceased: "No",
          height: "6'0\"",
          weight: "220 lbs",
          hair: "Black",
          eyes: "Brown",
          tattoos: "Skull on neck, 'RESPECT' across knuckles, tribal sleeve on right arm",
          piercings: "Left ear pierced",
          scars: "Bullet wound scar on left shoulder, knife scar on right hand",
          driversLicenseNumber: "D555666777",
          driversLicenseState: "IL",
          address: "890 Pine Street, Chicago, IL 60615",
          addressOfResidence: "890 Pine Street, Chicago, IL 60615",
          district: "South",
          majorityDistrict: "District 3",
          idocNumber: "R11111",
          idocAddressOfResidence: "890 Pine Street",
          idocDistrict: "South",
          latestArrestCB: "2023-09-10",
          latestFelonyArrestCB: "2023-09-10",
          onParole: "Yes",
          latestContact: "2023-09-15",
          latestContactDistrict: "South",
          latestWarrant: "2023-09-12",
          latestInvestigativeAlert: "2023-09-18",
          domesticViolenceArrestCount: "1",
          latestDomesticViolenceArrestDate: "2022-05-15",
          weaponsPossession: "Yes",
          weaponsArrestCount: "4",
          latestWeaponsArrestDate: "2023-09-10",
          narcoticsPossession: "Yes",
          narcoticsArrestCount: "2",
          latestNarcoticsArrestDate: "2023-01-20",
          charges: "Armed Robbery, Unlawful Use of Weapon, Aggravated Assault, Parole Violation",
          dangerLevel: "EXTREME",
          lastSeen: "September 15, 2023 - South Side, armed and dangerous",
          lastKnownVehicle: "2015 Blue Chevrolet Impala, License: DEF-4567",
          orderOfProtection: true,
          orderOfProtectionType: "emergency",
          protectionExpirationDate: "2024-06-30",
          protectionNotes: "Subject is considered armed and extremely dangerous. Do not approach alone.",
          protectionDescription: "Emergency protective order - stay away from Lisa Thompson and children",
          protectionPetitioner: "Lisa Thompson",
          protectionRespondent: "Robert Thompson",
          protectionDocuments: [
            {
              name: "Emergency Order of Protection - Case #2023-OP-5678",
              url: "#",
              type: "pdf"
            }
          ],
          photos: [
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face&sat=-50"
          ]
        }
      ];
      setPeople(mockData);
      localStorage.setItem('wantedPeople', JSON.stringify(mockData));
    }
    if (savedSystemName) {
      setSystemName(savedSystemName);
    }
    if (savedDisclaimer) {
      setDisclaimerText(savedDisclaimer);
    }
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = people;
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(person => 
        (person.firstName?.toLowerCase().includes(term)) ||
        (person.lastName?.toLowerCase().includes(term)) ||
        (person.name?.toLowerCase().includes(term)) ||
        (person.alias?.toLowerCase().includes(term))
      );
    }
    
    setFilteredPeople(filtered);
  }, [people, searchTerm]);

  const handleSearch = () => {
    // Search is handled by useEffect
  };

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

  const handleUpdateLogo = (logo: string) => {
    setLogoUrl(logo);
    localStorage.setItem('logoUrl', logo);
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

  const printPerson = (person: WantedPerson) => {
    const esc = (s: unknown) =>
      String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    const fullName =
      person.lastName || person.firstName
        ? `${person.lastName ?? ""} ${person.firstName ?? ""} ${person.middleName ?? ""}`.trim()
        : person.name || "Unknown";

    const photos = (person.photos || [])
      .map(
        (p) =>
          `<img src="${esc(p)}" style="max-width:220px;max-height:260px;margin:4px;border:1px solid #999;object-fit:cover;" />`
      )
      .join("");

    const docsList = (person.protectionDocuments || [])
      .map((d) => {
        const absUrl = d.url.startsWith("http") ? d.url : window.location.origin + d.url;
        return `<li><strong>${esc(d.name)}</strong> &mdash; <a href="${esc(absUrl)}" style="color:#1a4a8a">${esc(absUrl)}</a></li>`;
      })
      .join("");

    const embeddedDocs = (person.protectionDocuments || [])
      .map((d) => {
        const absUrl = d.url.startsWith("http") ? d.url : window.location.origin + d.url;
        const isImage = (d.type || "").startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp)$/i.test(d.url);
        const isPdf = (d.type || "").includes("pdf") || /\.pdf$/i.test(d.url);
        if (isImage) {
          return `<div class="doc-page"><div class="doc-title">${esc(d.name)}</div>
            <img src="${esc(absUrl)}" style="max-width:100%;max-height:9in;border:1px solid #999;" /></div>`;
        }
        if (isPdf) {
          return `<div class="doc-page"><div class="doc-title">${esc(d.name)}</div>
            <embed src="${esc(absUrl)}" type="application/pdf" style="width:100%;height:9.5in;border:1px solid #999;" />
            <div style="font-size:11px;color:#555;margin-top:4px;">${esc(absUrl)}</div></div>`;
        }
        return `<div class="doc-page"><div class="doc-title">${esc(d.name)}</div>
          <div style="font-size:12px;color:#555;">Attached file: <a href="${esc(absUrl)}">${esc(absUrl)}</a></div></div>`;
      })
      .join("");

    const row = (label: string, value: unknown) =>
      `<tr><td style="padding:4px 10px 4px 0;color:#555;white-space:nowrap;">${esc(
        label
      )}</td><td style="padding:4px 0;font-weight:600;">${esc(value || "N/A")}</td></tr>`;

    const html = `<!doctype html>
<html><head><meta charset="utf-8"/><title>${esc(fullName)} – Order of Protection</title>
<style>
  body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111;margin:24px;}
  h1{margin:0 0 4px 0;font-size:22px;}
  h2{margin:18px 0 6px;font-size:15px;border-bottom:1px solid #ccc;padding-bottom:4px;}
  table{border-collapse:collapse;font-size:13px;width:100%;}
  .meta{color:#555;font-size:12px;margin-bottom:10px;}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;
         background:#eee;color:#111;margin-left:6px;}
  .charges{background:#fff5f5;border:1px solid #f3c2c2;padding:8px;border-radius:4px;color:#7a1313;}
  ul{padding-left:20px;}
  @media print { .noprint{display:none;} body{margin:12mm;} }
</style></head>
<body>
  <div class="noprint" style="text-align:right;margin-bottom:10px;">
    <button onclick="window.print()">Print</button>
  </div>
  <h1>${esc(fullName)} <span class="badge">${esc(person.dangerLevel)} RISK</span></h1>
  <div class="meta">Active Orders of Protection &mdash; printed ${new Date().toLocaleString()}</div>

  ${photos ? `<h2>Photos</h2><div>${photos}</div>` : ""}

  <h2>Subject Demographics</h2>
  <table>
    ${row("Last Name", person.lastName)}
    ${row("First Name", person.firstName)}
    ${row("Middle Name", person.middleName)}
    ${row("AKA", person.alias)}
    ${row("Sex", person.sex)}
    ${row("Race", person.race)}
    ${row("Age", person.age)}
    ${row("DOB", person.dob)}
    ${row("Height", person.height)}
    ${row("Weight", person.weight)}
    ${row("Hair", person.hair)}
    ${row("Eyes", person.eyes)}
  </table>

  <h2>Charges</h2>
  <div class="charges">${esc(person.charges || "No charges listed")}</div>

  <h2>Last Seen</h2>
  <div>${esc(person.lastSeen || "Unknown")}</div>

  ${
    person.orderOfProtection
      ? `<h2>Order of Protection</h2>
         <table>
           ${row("Status", "ACTIVE")}
           ${row("Expiration", person.protectionExpirationDate)}
           ${row("Type", person.orderOfProtectionType)}
           ${row("Petitioner", person.protectionPetitioner)}
           ${row("Respondent", person.protectionRespondent)}
           ${row("Description", person.protectionDescription)}
           ${row("Notes", person.protectionNotes)}
         </table>`
      : ""
  }

  ${docs ? `<h2>Court Documents</h2><ul>${docs}</ul>` : ""}

  <script>window.addEventListener('load', function(){ setTimeout(function(){ window.print(); }, 300); });</script>
</body></html>`;

    const w = window.open("", "_blank", "width=900,height=1000");
    if (!w) {
      alert("Please allow pop-ups to print this record.");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  };


  const getOrderOfProtectionTypeLabel = (type: string) => {
    switch (type) {
      case 'plenary':
        return 'Plenary Order of Protection';
      case 'stalking':
        return 'Stalking No Contact Order';
      case 'civil':
        return 'Civil No-Contact Order';
      case 'order':
        return 'Order of Protection';
      case 'emergency':
        return 'Emergency Order of Protection';
      default:
        return 'Order of Protection';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Header */}
      <header className="relative overflow-hidden text-primary-foreground shadow-lg" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, hsl(var(--primary-glow)) 0%, transparent 50%)" }} />
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4 p-5 relative">
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <img src={logoUrl} alt="System Logo" className="h-12 w-auto object-contain drop-shadow" />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-primary-foreground/10 backdrop-blur flex items-center justify-center ring-1 ring-primary-foreground/20">
                <Shield className="h-6 w-6" />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{systemName}</h1>
              <p className="text-xs sm:text-sm opacity-75">Law Enforcement Information System</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-2 shadow-md"
          >
            <Settings className="h-4 w-4" />
            Admin Panel
          </Button>
        </div>
      </header>

      {/* Disclaimer */}
      <div className="border-y border-warning/30 bg-warning/10">
        <div className="container mx-auto p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-xs uppercase tracking-wider text-warning-foreground/80 mb-1">Disclaimer</div>
              <p className="text-sm text-foreground/80 leading-relaxed">{disclaimerText}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="border-b bg-card">
        <div className="container mx-auto p-5">
          <label className="block text-sm font-semibold text-foreground mb-2">Search Database</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
              <input
                type="text"
                placeholder="Enter name or alias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
              />
            </div>
            <Button onClick={handleSearch} className="px-6">Search</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Try searching: WILLIAM, MARIA, JAMES</p>
        </div>
      </div>


      {/* Main Content */}
      <main className="container mx-auto p-6">
        {filteredPeople.length === 0 && people.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No Records Listed</h2>
            <p className="text-gray-500 mb-6">Use the Admin Panel to add records to the database.</p>
            <Button onClick={() => setIsAdminOpen(true)}>
              Add First Person
            </Button>
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No Results Found</h2>
            <p className="text-gray-500 mb-6">No records match your current search criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Orders Header */}
            <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
              <h2 className="text-2xl font-bold">Active Orders of Protection</h2>
              <p className="text-sm opacity-90">
                Showing {filteredPeople.length} of {people.length} records
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPeople.map((person) => (
                <Card 
                  key={person.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow relative bg-white border border-gray-300"
                  onClick={() => setSelectedPerson(person)}
                >
                  {/* Risk Level Badge - Top Left */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className={`${getDangerLevelColor(person.dangerLevel)} text-xs font-bold px-2 py-1 rounded`}>
                      {person.dangerLevel} RISK
                    </Badge>
                  </div>
                  
                  {/* Order Type Badge - Top Right */}
                  {person.orderOfProtection && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-purple-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
                        <Shield className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  <CardContent className="p-4">
                    {/* Photo Section - Centered */}
                    <div className="flex justify-center mb-6 mt-6">
                      {person.photos && person.photos.length > 0 ? (
                        <img 
                          src={person.photos[0]} 
                          alt={person.name || `${person.firstName} ${person.lastName}`}
                          className="w-full h-64 object-cover cursor-pointer hover:opacity-80 transition-all duration-300 border-2 border-gray-400 shadow-lg hover:shadow-xl hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPhoto(person.photos![0]);
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-300 flex items-center justify-center border border-gray-400">
                          <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="mb-3 text-center">
                      <h3 className="text-lg font-bold text-black">
                        {(person.lastName && person.firstName) 
                          ? `${person.lastName.toUpperCase()} ${person.firstName.toUpperCase()} ${person.middleName?.charAt(0) || ''}`.trim()
                          : (person.name || 'Unknown Name').toUpperCase()
                        }
                      </h3>
                    </div>

                    {/* AKA */}
                    {person.alias && (
                      <div className="mb-4 text-center">
                        <p className="text-sm text-red-600 font-medium">AKA: {person.alias.toUpperCase()}</p>
                      </div>
                    )}

                    {/* Active Order of Protection */}
                    {person.orderOfProtection && (
                      <div className="mb-4 bg-purple-100 border border-purple-300 rounded p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-bold text-purple-800">ACTIVE ORDER OF PROTECTION</span>
                        </div>
                        {person.protectionExpirationDate && (
                          <p className="text-sm text-purple-700">
                            Expires {new Date(person.protectionExpirationDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Charges Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-bold text-black">CHARGES</span>
                      </div>
                      <p className="text-sm text-black">
                        {person.charges || 'No charges listed'}
                      </p>
                    </div>

                    {/* Last Seen Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="h-4 w-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold text-black">LAST SEEN</span>
                      </div>
                      <p className="text-sm text-black">
                        {person.lastSeen || 'Unknown'}
                      </p>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-sm font-bold text-black mb-2">DESCRIPTION</h4>
                      <p className="text-sm text-gray-700">
                        {person.sex}, {person.age} years old, {person.height}, {person.weight}, {person.hair} hair, {person.eyes} eyes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Photo Dialog */}
        {selectedPhoto && (
          <Dialog open={true} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="max-w-2xl" aria-describedby="photo-description">
              <DialogHeader>
                <DialogTitle>Photo View</DialogTitle>
              </DialogHeader>
              <div id="photo-description" className="flex justify-center">
                <img 
                  src={selectedPhoto} 
                  alt="Enlarged photo"
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Person Detail Dialog */}
        {selectedPerson && (
          <Dialog open={true} onOpenChange={() => setSelectedPerson(null)}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" aria-describedby="person-details-description">
              <DialogHeader>
                <DialogTitle className="sr-only">Person Details</DialogTitle>
                <div id="person-details-description" className="bg-red-500 text-white p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">SUBJECT INFORMATION</h3>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white text-red-600 hover:bg-gray-100"
                        onClick={() => printPerson(selectedPerson)}
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm">DANGER LEVEL</div>
                        <Badge className={`${getDangerLevelColor(selectedPerson.dangerLevel)} font-bold`}>
                          {selectedPerson.dangerLevel}
                        </Badge>
                      </div>
                      {selectedPerson.orderOfProtection && (
                        <div className="text-center">
                          <div className="text-sm">ORDER OF PROTECTION</div>
                          <div className="text-white font-bold">
                            Active - Expires: {selectedPerson.protectionExpirationDate ? new Date(selectedPerson.protectionExpirationDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Subject Demographics */}
                <div>
                  <div className="bg-blue-500 text-white p-3 rounded-t-lg">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      SUBJECT DEMOGRAPHICS
                    </h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 text-xs">Last Name</div>
                        <div className="font-bold">{selectedPerson.lastName}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">First Name</div>
                        <div className="font-bold">{selectedPerson.firstName}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Middle Name</div>
                        <div className="font-bold">{selectedPerson.middleName || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Sex</div>
                        <div className="font-bold">{selectedPerson.sex}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Race</div>
                        <div className="font-bold">{selectedPerson.race}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Age</div>
                        <div className="font-bold">{selectedPerson.age}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">DOB</div>
                        <div className="font-bold">{selectedPerson.dob || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Deceased</div>
                        <div className="font-bold">{selectedPerson.deceased}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Height</div>
                        <div className="font-bold">{selectedPerson.height}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Weight</div>
                        <div className="font-bold">{selectedPerson.weight}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Hair</div>
                        <div className="font-bold">{selectedPerson.hair}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Eyes</div>
                        <div className="font-bold">{selectedPerson.eyes}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photos Section */}
                {selectedPerson.photos && selectedPerson.photos.length > 0 && (
                  <div>
                    <div className="bg-gray-500 text-white p-3 rounded-t-lg">
                      <h3 className="text-lg font-bold">PHOTOS</h3>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedPerson.photos.map((photo, index) => (
                          <img 
                            key={index}
                            src={photo} 
                            alt={`Photo ${index + 1}`}
                            className="w-full h-40 object-cover border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedPhoto(photo)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Identification */}
                <div>
                  <div className="bg-green-500 text-white p-3 rounded-t-lg">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                      </svg>
                      IDENTIFICATION
                    </h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 text-xs">Driver's License #</div>
                        <div className="font-bold">{selectedPerson.driversLicenseNumber || 'No Data'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Driver's License State</div>
                        <div className="font-bold">{selectedPerson.driversLicenseState || 'No Data'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address of Residence */}
                <div>
                  <div className="bg-purple-500 text-white p-3 rounded-t-lg">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      ADDRESS OF RESIDENCE
                    </h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 text-xs">Address of Residence</div>
                        <div className="font-bold">{selectedPerson.addressOfResidence || 'No Data'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">District</div>
                        <div className="font-bold">{selectedPerson.district || 'No Data'}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-gray-600 text-xs">Majority District</div>
                        <div className="font-bold">{selectedPerson.majorityDistrict || 'No Data'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IDOC Information */}
                <div>
                  <div className="bg-blue-600 text-white p-3 rounded-t-lg">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd"/>
                      </svg>
                      IDOC INFORMATION
                    </h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 text-xs">IDOC #</div>
                        <div className="font-bold">{selectedPerson.idocNumber || 'No Data'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">District</div>
                        <div className="font-bold">{selectedPerson.idocDistrict || 'No Data'}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-gray-600 text-xs">IDOC Address of Residence</div>
                        <div className="font-bold">{selectedPerson.idocAddressOfResidence || 'No Data'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Criminal Record Details */}
                <div>
                  <div className="bg-red-600 text-white p-3 rounded-t-lg">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      CRIMINAL RECORD DETAILS
                    </h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 text-xs">Latest Arrest CB #</div>
                        <div className="font-bold">{selectedPerson.latestArrestCB || 'No Data'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Latest Felony Arrest CB #</div>
                        <div className="font-bold">{selectedPerson.latestFelonyArrestCB || 'No Data'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">On Parole</div>
                        <div className="font-bold">{selectedPerson.onParole || 'No Data'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Latest Contact</div>
                        <div className="font-bold">{selectedPerson.latestContact || 'No Data'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Latest Contact District</div>
                        <div className="font-bold">{selectedPerson.latestContactDistrict || 'No Data'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Latest Warrant</div>
                        <div className="font-bold">{selectedPerson.latestWarrant || 'No Data'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Domestic Violence Arrest Record */}
                <div>
                  <div className="bg-pink-500 text-white p-3 rounded-t-lg">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      DOMESTIC VIOLENCE ARREST RECORD
                    </h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 text-xs">Arrest Count</div>
                        <div className="font-bold">{selectedPerson.domesticViolenceArrestCount || 'No Data'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Latest Arrest Date</div>
                        <div className="font-bold">{selectedPerson.latestDomesticViolenceArrestDate || 'No Data'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weapons Arrest Record */}
                <div>
                  <div className="bg-orange-500 text-white p-3 rounded-t-lg">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"/>
                      </svg>
                      WEAPONS ARREST RECORD
                    </h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 text-xs">Possession</div>
                        <div className="font-bold">{selectedPerson.weaponsPossession || 'N'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Arrest Count</div>
                        <div className="font-bold">{selectedPerson.weaponsArrestCount || 'No Data'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Latest Arrest Date</div>
                        <div className="font-bold">{selectedPerson.latestWeaponsArrestDate || 'No Data'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Narcotics Arrest Record */}
                <div>
                  <div className="bg-yellow-500 text-white p-3 rounded-t-lg">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                      </svg>
                      NARCOTICS ARREST RECORD
                    </h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 text-xs">Possession</div>
                        <div className="font-bold">{selectedPerson.narcoticsPossession || 'N'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Arrest Count</div>
                        <div className="font-bold">{selectedPerson.narcoticsArrestCount || 'No Data'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Latest Arrest Date</div>
                        <div className="font-bold">{selectedPerson.latestNarcoticsArrestDate || 'No Data'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <div className="bg-gray-700 text-white p-3 rounded-t-lg">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                      ADDITIONAL INFORMATION
                    </h3>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="text-gray-600 text-xs">Charges</div>
                        <div className="font-bold text-red-600 uppercase">{selectedPerson.charges}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Danger Level</div>
                        <Badge className={`${getDangerLevelColor(selectedPerson.dangerLevel)} font-bold`}>
                          {selectedPerson.dangerLevel}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-gray-600 text-xs">Last Seen</div>
                        <div className="font-bold">{selectedPerson.lastSeen}</div>
                      </div>
                      {selectedPerson.knownAssailants && (
                        <div>
                          <div className="text-gray-600 text-xs">Known Assailants</div>
                          <div className="font-bold">{selectedPerson.knownAssailants}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order of Protection */}
                {selectedPerson.orderOfProtection && (
                  <div>
                    <div className="bg-purple-600 text-white p-3 rounded-t-lg">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        ORDER OF PROTECTION
                      </h3>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-gray-600 text-xs">Status</div>
                          <div className="font-bold text-purple-600">ACTIVE</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-xs">Protection Expiration Date</div>
                          <div className="font-bold">{selectedPerson.protectionExpirationDate || 'N/A'}</div>
                        </div>
                        {selectedPerson.orderOfProtectionType && (
                          <div className="col-span-2">
                            <div className="text-gray-600 text-xs">Type</div>
                            <div className="font-bold">{getOrderOfProtectionTypeLabel(selectedPerson.orderOfProtectionType)}</div>
                          </div>
                        )}
                        {selectedPerson.protectionPetitioner && (
                          <div>
                            <div className="text-gray-600 text-xs">Petitioner</div>
                            <div className="font-bold">{selectedPerson.protectionPetitioner}</div>
                          </div>
                        )}
                        {selectedPerson.protectionRespondent && (
                          <div>
                            <div className="text-gray-600 text-xs">Respondent</div>
                            <div className="font-bold">{selectedPerson.protectionRespondent}</div>
                          </div>
                        )}
                        {selectedPerson.protectionDescription && (
                          <div className="col-span-2">
                            <div className="text-gray-600 text-xs">Description</div>
                            <div className="font-bold">{selectedPerson.protectionDescription}</div>
                          </div>
                        )}
                        {selectedPerson.protectionNotes && (
                          <div className="col-span-2">
                            <div className="text-gray-600 text-xs">Notes</div>
                            <div className="font-bold">{selectedPerson.protectionNotes}</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Protection Documents */}
                      {selectedPerson.protectionDocuments && selectedPerson.protectionDocuments.length > 0 && (
                        <div className="border-t pt-4">
                          <div className="text-gray-600 text-xs mb-2">Court Documents:</div>
                          <div className="space-y-2">
                            {selectedPerson.protectionDocuments.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-purple-600" />
                                  <span className="text-sm font-medium">{doc.name}</span>
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

                {/* Vehicle Information */}
                {(selectedPerson.vehicleMake || selectedPerson.vehicleModel || selectedPerson.vehicleColor || selectedPerson.vehiclePlate || selectedPerson.lastKnownVehicle) && (
                  <div>
                    <div className="bg-indigo-500 text-white p-3 rounded-t-lg">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2V8a2 2 0 012-2h8a2 2 0 00-2-2H4z" clipRule="evenodd"/>
                        </svg>
                        VEHICLE INFORMATION
                      </h3>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {selectedPerson.vehicleMake && (
                          <div>
                            <div className="text-gray-600 text-xs">Make</div>
                            <div className="font-bold">{selectedPerson.vehicleMake}</div>
                          </div>
                        )}
                        {selectedPerson.vehicleModel && (
                          <div>
                            <div className="text-gray-600 text-xs">Model</div>
                            <div className="font-bold">{selectedPerson.vehicleModel}</div>
                          </div>
                        )}
                        {selectedPerson.vehicleColor && (
                          <div>
                            <div className="text-gray-600 text-xs">Color</div>
                            <div className="font-bold">{selectedPerson.vehicleColor}</div>
                          </div>
                        )}
                        {selectedPerson.vehiclePlate && (
                          <div>
                            <div className="text-gray-600 text-xs">License Plate</div>
                            <div className="font-bold">{selectedPerson.vehiclePlate}</div>
                          </div>
                        )}
                        {selectedPerson.lastKnownVehicle && (
                          <div className="col-span-2">
                            <div className="text-gray-600 text-xs">Legacy Vehicle Info</div>
                            <div className="font-bold">{selectedPerson.lastKnownVehicle}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
        logoUrl={logoUrl}
        onUpdateLogo={handleUpdateLogo}
      />
    </div>
  );
};

export default Index;
