import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, Shield, AlertTriangle, FileText, Download, Printer, SlidersHorizontal, MapPin } from "lucide-react";
import AdminPanel from "@/components/AdminPanel";
import PhotoSlideshow from "@/components/PhotoSlideshow";
import CardPhotoSlider from "@/components/CardPhotoSlider";
import { toast } from "sonner";

interface VictimInfo { name: string; relationship: string; dob: string; address: string; phone: string; }
interface ChildInfo { name: string; dob: string; relationship: string; schoolName: string; schoolAddress: string; }
interface DescriptorPhoto { url: string; category: "scar" | "tattoo"; description: string; }
interface GeofenceResult { label: string; address: string; distanceFeet?: number; within: boolean; error?: string; }

interface WantedPerson {
  id: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdByName?: string;
  createdByStarNumber?: string;
  lastModifiedByName?: string;
  lastModifiedByStarNumber?: string;
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
  activeCases?: string;
  activeCaseNumber?: string;
  activeCaseNumbers?: string[];
  dangerLevel?: string;
  lastSeen: string;
  lastKnownVehicle?: string;
  orderOfProtection?: boolean;
  orderOfProtectionType?: 'order' | 'stalking' | 'civil' | 'firearms' | '';
  orderStatusFlags?: string[];
  protectionExpirationDate?: string;
  protectionForDurationOfCourtDate?: boolean;
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
  victims?: VictimInfo[];
  children?: ChildInfo[];
  descriptorPhotos?: DescriptorPhoto[];
  knownAssailants?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehiclePlate?: string;
  elopementRisk?: string;
  frequentLocations?: string;
  remedies?: {
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
  };
}

const Index = () => {
  const [people, setPeople] = useState<WantedPerson[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<WantedPerson[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<WantedPerson | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<{ photos: string[]; index: number } | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [systemName, setSystemName] = useState("Active Orders of Protection");
  const [disclaimerText, setDisclaimerText] = useState("This system contains sensitive law enforcement information. Access is restricted to authorized personnel only. All activities are logged and monitored. Unauthorized access is prohibited and subject to prosecution.");
  const [logoUrl, setLogoUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [districtFilter, setDistrictFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [orderFilter, setOrderFilter] = useState("all");
  const [sexFilter, setSexFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [healthStatus, setHealthStatus] = useState<"checking" | "online" | "offline">("checking");
  const [healthLastChecked, setHealthLastChecked] = useState<Date | null>(null);
  const [geofenceLoading, setGeofenceLoading] = useState(false);
  const [geofenceResults, setGeofenceResults] = useState<GeofenceResult[]>([]);
  const appVersion = "1.4.0";

  const [dataLoaded, setDataLoaded] = useState(false);

  const [loadError, setLoadError] = useState("");

  // Poll the server health endpoint so users can see live system status.
  useEffect(() => {
    let cancelled = false;

    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const health = await res.json();
        if (!cancelled) setHealthStatus(health.status === 'ok' ? 'online' : 'offline');
      } catch (error) {
        console.error('Health check failed.', error);
        if (!cancelled) setHealthStatus('offline');
      } finally {
        if (!cancelled) setHealthLastChecked(new Date());
      }
    };

    checkHealth();
    const interval = window.setInterval(checkHealth, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  // The server is the single source of truth for records and settings.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/data', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        setPeople(Array.isArray(data.people) ? data.people : []);
        if (data.settings) {
          if (data.settings.systemName) setSystemName(data.settings.systemName);
          if (data.settings.disclaimerText) setDisclaimerText(data.settings.disclaimerText);
          if (typeof data.settings.logoUrl === 'string') setLogoUrl(data.settings.logoUrl);
        }
        setLoadError("");
      } catch (err) {
        console.error('Unable to load server data.', err);
        if (!cancelled) {
          setLoadError('Unable to connect to the server database. No browser-stored fallback was loaded.');
        }
      } finally {
        if (!cancelled) setDataLoaded(true);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const geocodeAddress = async (address: string) => {
    const res = await fetch(`/api/address-search?q=${encodeURIComponent(address)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Address lookup unavailable');
    const data = await res.json();
    const first = data.matches?.[0];
    if (!first?.coordinates) throw new Error('Address could not be validated');
    return first.coordinates as { latitude: number; longitude: number };
  };

  const distanceFeet = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
    const toRad = (value: number) => value * Math.PI / 180;
    const earthFeet = 20902231;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return earthFeet * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  };

  const runGeofenceCheck = async (person: WantedPerson) => {
    const originAddress = person.addressOfResidence || person.address || '';
    if (!originAddress) {
      toast.error('Enter the subject address before running a geofence check.');
      return;
    }
    const targets = [
      ...(person.victims || []).filter(v => v.address).map(v => ({ label: `Protected residence: ${v.name || 'Victim'}`, address: v.address })),
      ...(person.children || []).filter(c => c.schoolAddress).map(c => ({ label: `School: ${c.schoolName || c.name || 'Protected child'}`, address: c.schoolAddress })),
    ];
    if (!targets.length) {
      toast.error('Add a protected person residence or school address first.');
      return;
    }
    setGeofenceLoading(true);
    setGeofenceResults([]);
    try {
      const origin = await geocodeAddress(originAddress);
      const results = await Promise.all(targets.map(async target => {
        try {
          const point = await geocodeAddress(target.address);
          const feet = Math.round(distanceFeet(origin, point));
          return { ...target, distanceFeet: feet, within: feet <= 1000 };
        } catch (error) {
          return { ...target, within: false, error: error instanceof Error ? error.message : 'Unable to check address' };
        }
      }));
      setGeofenceResults(results);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Geofence check failed.');
    } finally {
      setGeofenceLoading(false);
    }
  };

  const downloadBackup = async () => {
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const snapshot = { timestamp: new Date().toISOString(), ...(await res.json()) };
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aop-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Server backup downloaded.');
    } catch (err) {
      console.error('Backup failed.', err);
      toast.error('Backup failed because the server database could not be read.');
    }
  };

  const persistPeople = async (newPeople: WantedPerson[]) => {
    const res = await fetch('/api/people', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPeople),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  };

  const persistSettings = async (patch: Record<string, string>) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  };

  // Search, advanced filtering, and sorting.
  useEffect(() => {
    let filtered = [...people];

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((person) => {
        const caseNumbers = [person.activeCaseNumber, ...(person.activeCaseNumbers || [])].filter(Boolean);
        const values = [
          person.firstName, person.lastName, person.middleName, person.name, person.alias,
          person.driversLicenseNumber, person.vehiclePlate, person.addressOfResidence, person.address,
          person.dob, person.district, person.driversLicenseState, ...caseNumbers,
        ];
        return values.some((value) => String(value || "").toLowerCase().includes(term));
      });
    }

    if (districtFilter !== "all") filtered = filtered.filter((p) => p.district === districtFilter);
    if (stateFilter !== "all") filtered = filtered.filter((p) => p.driversLicenseState === stateFilter);
    if (sexFilter !== "all") filtered = filtered.filter((p) => p.sex === sexFilter);
    if (orderFilter !== "all") {
      filtered = filtered.filter((p) => {
        if (orderFilter === "active") {
          if (!p.orderOfProtection) return false;
          if (p.protectionForDurationOfCourtDate || !p.protectionExpirationDate) return true;
          return new Date(p.protectionExpirationDate).getTime() >= Date.now();
        }
        if (orderFilter === "expired") {
          return Boolean(p.orderOfProtection && p.protectionExpirationDate && new Date(p.protectionExpirationDate).getTime() < Date.now());
        }
        return p.orderOfProtectionType === orderFilter;
      });
    }

    const nameValue = (p: WantedPerson) => `${p.lastName || ""} ${p.firstName || ""} ${p.middleName || ""}`.trim().toLowerCase();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-desc": return nameValue(b).localeCompare(nameValue(a));
        case "created-new": return Date.parse(b.createdDate || "") - Date.parse(a.createdDate || "");
        case "created-old": return Date.parse(a.createdDate || "") - Date.parse(b.createdDate || "");
        case "modified-new": return Date.parse(b.lastModifiedDate || "") - Date.parse(a.lastModifiedDate || "");
        case "dob-new": return Date.parse(b.dob || "") - Date.parse(a.dob || "");
        case "expiration": return Date.parse(a.protectionExpirationDate || "9999-12-31") - Date.parse(b.protectionExpirationDate || "9999-12-31");
        default: return nameValue(a).localeCompare(nameValue(b));
      }
    });

    setFilteredPeople(filtered);
  }, [people, searchTerm, districtFilter, stateFilter, orderFilter, sexFilter, sortBy]);

  const requestStaffIdentity = (action: "add" | "modify") => {
    const name = window.prompt(`Enter your full name to ${action} this record:`)?.trim();
    if (!name) {
      toast.error("The change was cancelled. A staff name is required.");
      return null;
    }
    const starNumber = window.prompt("Enter your star number:")?.trim();
    if (!starNumber) {
      toast.error("The change was cancelled. A star number is required.");
      return null;
    }
    return { name, starNumber };
  };

  const normalize = (value?: string) => (value || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const findDuplicate = (candidate: Omit<WantedPerson, "id">, excludedId?: string) => people.find((person) => {
    if (person.id === excludedId) return false;
    const sameLicense = normalize(candidate.driversLicenseNumber) && normalize(candidate.driversLicenseNumber) === normalize(person.driversLicenseNumber);
    const sameIdentity = normalize(candidate.firstName) && normalize(candidate.lastName) && normalize(candidate.dob) &&
      normalize(candidate.firstName) === normalize(person.firstName) &&
      normalize(candidate.lastName) === normalize(person.lastName) &&
      normalize(candidate.dob) === normalize(person.dob);
    return Boolean(sameLicense || sameIdentity);
  });

  const handleSearch = () => {
    // Search is handled by useEffect
  };

  const savePeople = async (newPeople: WantedPerson[]) => {
    const previousPeople = people;
    setPeople(newPeople);
    try {
      await persistPeople(newPeople);
      toast.success('Records saved to the server.');
    } catch (err) {
      console.error('Failed to save records to the server.', err);
      setPeople(previousPeople);
      toast.error('Server save failed. Your change was not kept.');
    }
  };

  const handleAddPerson = (person: Omit<WantedPerson, 'id'>) => {
    const duplicate = findDuplicate(person);
    if (duplicate && !window.confirm(`Possible duplicate found: ${duplicate.firstName} ${duplicate.lastName}${duplicate.dob ? ` (DOB ${duplicate.dob})` : ""}. Add this record anyway?`)) return;
    const staff = requestStaffIdentity("add");
    if (!staff) return;
    const now = new Date().toISOString();
    const newPerson: WantedPerson = {
      ...person,
      id: crypto.randomUUID(),
      createdDate: now,
      lastModifiedDate: now,
      createdByName: staff.name,
      createdByStarNumber: staff.starNumber,
      lastModifiedByName: staff.name,
      lastModifiedByStarNumber: staff.starNumber,
    };
    void savePeople([...people, newPerson]);
  };

  const handleEditPerson = (id: string, updatedPerson: Omit<WantedPerson, 'id'>) => {
    const duplicate = findDuplicate(updatedPerson, id);
    if (duplicate && !window.confirm(`Possible duplicate found: ${duplicate.firstName} ${duplicate.lastName}${duplicate.dob ? ` (DOB ${duplicate.dob})` : ""}. Save this record anyway?`)) return;
    const staff = requestStaffIdentity("modify");
    if (!staff) return;
    void savePeople(people.map((p) => p.id === id ? {
      ...updatedPerson,
      id,
      createdDate: p.createdDate || new Date().toISOString(),
      createdByName: p.createdByName || "Legacy record",
      createdByStarNumber: p.createdByStarNumber || "N/A",
      lastModifiedDate: new Date().toISOString(),
      lastModifiedByName: staff.name,
      lastModifiedByStarNumber: staff.starNumber,
    } : p));
  };

  const handleDeletePerson = (id: string) => {
    const person = people.find((p) => p.id === id);
    const label = person ? `${person.firstName} ${person.lastName}`.trim() : "this record";
    if (!window.confirm(`Delete ${label}? This action cannot be undone.`)) return;
    void savePeople(people.filter((person) => person.id !== id));
  };

  const saveSetting = async (patch: Record<string, string>, rollback: () => void) => {
    try {
      await persistSettings(patch);
      toast.success('Settings saved to the server.');
    } catch (err) {
      console.error('Failed to save settings to the server.', err);
      rollback();
      toast.error('Server save failed. Your setting was not kept.');
    }
  };

  const handleUpdateSystemName = (name: string) => {
    const previous = systemName;
    setSystemName(name);
    void saveSetting({ systemName: name }, () => setSystemName(previous));
  };

  const handleUpdateDisclaimer = (disclaimer: string) => {
    const previous = disclaimerText;
    setDisclaimerText(disclaimer);
    void saveSetting({ disclaimerText: disclaimer }, () => setDisclaimerText(previous));
  };

  const handleUpdateLogo = (logo: string) => {
    const previous = logoUrl;
    setLogoUrl(logo);
    void saveSetting({ logoUrl: logo }, () => setLogoUrl(previous));
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

  const renderPdfToImages = async (url: string): Promise<string[]> => {
    const pdfjs: any = await import("pdfjs-dist");
    // Use bundled worker via URL
    // @ts-ignore
    const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    const resp = await fetch(url);
    const buf = await resp.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    const images: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      images.push(canvas.toDataURL("image/jpeg", 0.85));
    }
    return images;
  };

  const printPerson = async (person: WantedPerson) => {
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

    const embeddedParts: string[] = [];
    for (const d of person.protectionDocuments || []) {
      const absUrl = d.url.startsWith("http") ? d.url : window.location.origin + d.url;
      const isImage =
        (d.type || "").startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp)$/i.test(d.url);
      const isPdf = (d.type || "").includes("pdf") || /\.pdf$/i.test(d.url);
      if (isImage) {
        embeddedParts.push(
          `<div class="doc-page"><div class="doc-title">${esc(d.name)}</div>
            <img src="${esc(absUrl)}" style="max-width:100%;max-height:9.5in;border:1px solid #999;" /></div>`
        );
      } else if (isPdf) {
        try {
          const pages = await renderPdfToImages(d.url);
          const pagesHtml = pages
            .map(
              (src, i) =>
                `<div class="${i === 0 ? "doc-page" : "doc-subpage"}">
                   ${i === 0 ? `<div class="doc-title">${esc(d.name)}</div>` : ""}
                   <img src="${src}" style="max-width:100%;height:auto;border:1px solid #999;" />
                 </div>`
            )
            .join("");
          embeddedParts.push(pagesHtml);
        } catch (err) {
          console.error("Failed to render PDF for print", d.name, err);
          embeddedParts.push(
            `<div class="doc-page"><div class="doc-title">${esc(d.name)}</div>
              <div style="font-size:12px;color:#555;">Unable to embed PDF. <a href="${esc(absUrl)}">${esc(absUrl)}</a></div></div>`
          );
        }
      } else {
        embeddedParts.push(
          `<div class="doc-page"><div class="doc-title">${esc(d.name)}</div>
            <div style="font-size:12px;color:#555;">Attached file: <a href="${esc(absUrl)}">${esc(absUrl)}</a></div></div>`
        );
      }
    }
    const embeddedDocs = embeddedParts.join("");

    const row = (label: string, value: unknown) =>
      `<tr><td style="padding:4px 10px 4px 0;color:#555;white-space:nowrap;">${esc(
        label
      )}</td><td style="padding:4px 0;font-weight:600;">${esc(value || "N/A")}</td></tr>`;


    const rem = person.remedies || {};
    const nl2br = (s: string) => esc(s).replace(/\n/g, "<br/>");
    const remedyItem = (title: string, body: string) =>
      `<li style="margin-bottom:8px;"><div style="font-weight:700;color:#5a1a8a;">${esc(title)}</div>${body}</li>`;
    const remedyParts: string[] = [];
    if (rem.r01?.enabled) {
      const items = (rem.r01.abuseTypes || []).map((t) => `<li>${esc(t)}</li>`).join("");
      remedyParts.push(remedyItem("1. No Abuse (R01) — Police Enforced", items ? `<ul>${items}</ul>` : ""));
    }
    if (rem.r02?.enabled) remedyParts.push(remedyItem("2. Possession of Residence (R02) — Police Enforced", rem.r02.text ? `<div>${nl2br(rem.r02.text)}</div>` : ""));
    if (rem.r03?.enabled) {
      const parts: string[] = [];
      if (rem.r03.stayAwayGeneral) parts.push("<div>Respondent shall stay away from Petitioner and protected people at all times, including through third parties.</div>");
      if (rem.r03.employmentAddresses) parts.push(`<div><strong>Employment:</strong><br/>${nl2br(rem.r03.employmentAddresses)}</div>`);
      if (rem.r03.addressConfidential) parts.push("<div><em>Address is confidential and omitted.</em></div>");
      if (rem.r03.otherAddresses) parts.push(`<div><strong>Other places:</strong><br/>${nl2br(rem.r03.otherAddresses)}</div>`);
      remedyParts.push(remedyItem("3. Stay Away from Petitioner and Certain Places (R03) — Police Enforced", parts.join("")));
    }
    if (rem.r05?.enabled) remedyParts.push(remedyItem("5. Care and Possession of Children (R05) — Police/Court Enforced", rem.r05.text ? `<div>${nl2br(rem.r05.text)}</div>` : ""));
    if (rem.r08?.enabled) remedyParts.push(remedyItem("8. No Concealment or Removal of Children (R08) — Police Enforced", rem.r08.text ? `<div>${nl2br(rem.r08.text)}</div>` : ""));
    if (rem.r10?.enabled) remedyParts.push(remedyItem("10. Possession of Personal Property (R10) — Court Enforced", rem.r10.text ? `<div>${nl2br(rem.r10.text)}</div>` : ""));
    if (rem.r11?.enabled) remedyParts.push(remedyItem("11. Restrictions on Property (R11) — Court Enforced", rem.r11.text ? `<div>${nl2br(rem.r11.text)}</div>` : ""));
    if (rem.r11_5?.enabled) remedyParts.push(remedyItem("11.5 Possession of Animals (R11.5) — Court Enforced", rem.r11_5.text ? `<div>${nl2br(rem.r11_5.text)}</div>` : ""));
    if (rem.r14?.enabled) remedyParts.push(remedyItem("14. No Entry or Presence Under Influence (R14) — Police Enforced", rem.r14.text ? `<div>${nl2br(rem.r14.text)}</div>` : ""));
    if (rem.r14_5?.enabled) remedyParts.push(remedyItem("14.5 Firearms (R14.5) — Police Enforced", "<div>Respondent prohibited from possessing firearms; must surrender firearms, firearm parts, FOID card, and/or CCL to law enforcement.</div>"));
    if (rem.r17?.enabled) remedyParts.push(remedyItem("17. Miscellaneous Remedies (R17) — Court Enforced", rem.r17.text ? `<div>${nl2br(rem.r17.text)}</div>` : ""));
    const remediesHtml = remedyParts.length ? `<h2>Remedies Granted</h2><ul style="list-style:none;padding-left:0;font-size:13px;">${remedyParts.join("")}</ul>` : "";

    const html = `<!doctype html>
<html><head><meta charset="utf-8"/><title>${esc(fullName)} – Order of Protection</title>
<style>
  html,body{ -webkit-print-color-adjust:exact; print-color-adjust:exact; color-adjust:exact; }
  *{ -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
  body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111;margin:24px;}
  h1{margin:0 0 4px 0;font-size:22px;}
  .hdr{display:flex;align-items:center;justify-content:space-between;color:#fff;font-weight:800;
       padding:10px 14px;border-radius:6px;margin:14px 0 8px;font-size:14px;letter-spacing:.5px;text-transform:uppercase;}
  .hdr-red{background:#dc2626;}
  .hdr-blue{background:#2563eb;}
  .hdr-green{background:#16a34a;}
  .hdr-purple{background:#9333ea;}
  .hdr-orange{background:#ea580c;}
  .section{border:1px solid #e5e7eb;border-top:0;border-radius:0 0 6px 6px;padding:10px 14px;margin-top:-8px;background:#fff;}
  table{border-collapse:collapse;font-size:13px;width:100%;}
  .meta{color:#555;font-size:12px;margin-bottom:10px;}
  .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;
         background:#dc2626;color:#fff;margin-left:6px;}
  .charges{background:#fff5f5;border:1px solid #f3c2c2;padding:8px;border-radius:4px;color:#7a1313;}
  ul{padding-left:20px;}
  .doc-page{page-break-before:always;margin-top:12px;}
  .doc-subpage{page-break-before:always;margin-top:0;}
  .doc-title{font-weight:700;font-size:13px;margin-bottom:6px;color:#1a3a8a;}
  img{ -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
  @media print { .noprint{display:none;} body{margin:12mm;} }
</style></head>
<body>
  <div class="hdr hdr-red">
    <span>Subject Information</span>
    <button class="noprint" onclick="window.print()" style="background:#fff;color:#111;border:0;border-radius:4px;padding:4px 10px;font-weight:600;cursor:pointer;">Print</button>
  </div>
  <h1 style="margin:0 0 4px 0;">${esc(fullName)}</h1>
  <div class="meta">Active Orders of Protection &mdash; printed ${new Date().toLocaleString()}</div>

  ${photos ? `<div class="hdr hdr-blue">Photos</div><div class="section">${photos}</div>` : ""}

  <div class="hdr hdr-blue">Subject Demographics</div>
  <div class="section"><table>
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
  </table></div>

  <div class="hdr hdr-green">Identification</div>
  <div class="section"><table>
    ${row("Driver's License #", person.driversLicenseNumber)}
    ${row("Driver's License State", person.driversLicenseState)}
  </table></div>

  <div class="hdr hdr-purple">Address of Residence</div>
  <div class="section"><table>
    ${row("Address of Residence", person.addressOfResidence)}
    ${row("District", person.district)}
    ${row("Majority District", person.majorityDistrict)}
  </table></div>

  <div class="hdr hdr-blue">IDOC Information</div>
  <div class="section"><table>
    ${row("IDOC #", person.idocNumber)}
    ${row("IDOC Address of Residence", person.idocAddressOfResidence)}
    ${row("IDOC District", person.idocDistrict)}
  </table></div>

  <div class="hdr hdr-red">Charges</div>
  <div class="section"><div class="charges">${esc(person.charges || "No charges listed")}</div></div>

  <div class="hdr hdr-blue">Active Cases</div>
  <div class="section">${(person.activeCaseNumbers?.length ? person.activeCaseNumbers : person.activeCaseNumber ? [person.activeCaseNumber] : []).map((number, index) => row(`Active Case Number ${index + 1}`, number)).join("") || row("Active Case Number", "No active case numbers listed")}<div>${esc(person.activeCases || "No active case details listed")}</div></div>

  <div class="hdr hdr-orange">Last Seen</div>
  <div class="section">${esc(person.lastSeen || "Unknown")}</div>

  ${
    person.orderOfProtection
      ? `<div class="hdr hdr-blue">Order of Protection</div>
         <div class="section"><table>
           ${row("Status", "ACTIVE")}
           ${row("Expiration", person.protectionForDurationOfCourtDate ? 'For duration of the court date' : person.protectionExpirationDate)}
           ${row("Type", person.orderOfProtectionType ? getOrderOfProtectionTypeLabel(person.orderOfProtectionType) : "")}
           ${row("Status Flags", (person.orderStatusFlags || []).map(orderStatusFlagLabel).join(", "))}
           ${row("Petitioner", person.protectionPetitioner)}
           ${row("Respondent", person.protectionRespondent)}
           ${row("Description", person.protectionDescription)}
           ${row("Notes", person.protectionNotes)}
          </table></div>`
      : ""
  }

  ${remediesHtml ? `<div class="hdr hdr-purple">Remedies Granted</div><div class="section">${remediesHtml.replace(/^<h2>[^<]*<\/h2>/, "")}</div>` : ""}

  ${
    person.elopementRisk === "Y" || person.frequentLocations
      ? `<div class="hdr hdr-orange">Elopement Risk</div>
         <div class="section"><table>
           ${row("Person Wanders", person.elopementRisk === "Y" ? "YES" : person.elopementRisk === "UNK" ? "Unknown" : "No")}
         </table>
         ${person.frequentLocations ? `<div style="margin-top:6px;"><strong>Places Frequently Visited:</strong><br/>${esc(person.frequentLocations).replace(/\n/g, "<br/>")}</div>` : ""}</div>`
      : ""
  }

  ${docsList ? `<div class="hdr hdr-blue">Court Documents</div><div class="section"><ul style="margin:0;">${docsList}</ul></div>` : ""}
  ${embeddedDocs ? `<div class="hdr hdr-blue" style="page-break-before:always;">Attached Documents</div>${embeddedDocs}` : ""}

  <script>
    window.addEventListener('load', function(){
      var imgs = Array.from(document.images);
      Promise.all(imgs.map(function(img){
        if (img.complete) return Promise.resolve();
        return new Promise(function(res){ img.onload = img.onerror = res; });
      })).then(function(){ setTimeout(function(){ window.print(); }, 200); });
    });
  </script>
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
      case 'order':
        return 'Order of Protection';
      case 'stalking':
        return 'Stalking No Contact Order';
      case 'civil':
        return 'Civil No Contact Order';
      case 'firearms':
        return 'Firearms Restraining Order';
      default:
        return 'Order of Protection';
    }
  };

  const orderStatusFlagLabel = (flag: string) => {
    switch (flag) {
      case 'no-unlawful-contact': return 'No Unlawful Contact';
      case 'no-contact': return 'No Contact';
      case 'emergency': return 'Emergency';
      case 'durational': return 'Durational';
      case 'plenary': return 'Plenary';
      default: return flag;
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
          <div className="flex flex-wrap items-center justify-end gap-3">
            <div
              className="min-w-[190px] rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-right shadow-sm backdrop-blur"
              title="Status is checked automatically every 30 seconds using the server health endpoint."
              aria-live="polite"
            >
              <div className="flex items-center justify-end gap-2 text-sm font-semibold">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    healthStatus === "online"
                      ? "bg-green-400"
                      : healthStatus === "offline"
                        ? "bg-red-400"
                        : "bg-gray-300 animate-pulse"
                  }`}
                  aria-hidden="true"
                />
                <span>
                  {healthStatus === "online"
                    ? "System Online"
                    : healthStatus === "offline"
                      ? "System Offline"
                      : "Checking System"}
                </span>
              </div>
              <div className="mt-0.5 text-[11px] opacity-80">
                Last Checked: {healthLastChecked ? healthLastChecked.toLocaleTimeString() : "Checking..."}
              </div>
              <div className="text-[11px] opacity-80">Version {appVersion}</div>
            </div>
            <Button
              variant="secondary"
              onClick={downloadBackup}
              className="flex items-center gap-2 shadow-md"
              title="Download a JSON backup of all records and settings"
            >
              <Download className="h-4 w-4" />
              Backup
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-2 shadow-md"
            >
              <Settings className="h-4 w-4" />
              Admin Panel
            </Button>
          </div>
        </div>
      </header>

      {!dataLoaded && (
        <div className="container mx-auto p-6 text-center text-muted-foreground">Loading server records…</div>
      )}

      {loadError && (
        <div className="container mx-auto p-4">
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {loadError}
          </div>
        </div>
      )}

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
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[260px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
              <input
                type="text"
                placeholder="Search name, case #, driver's license, plate, address, or DOB..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
              />
            </div>
            <Button variant="outline" onClick={() => setShowAdvancedFilters((value) => !value)} className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
            <Button onClick={handleSearch} className="px-6">Search</Button>
          </div>
          {showAdvancedFilters && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 rounded-lg border bg-muted/30 p-4">
              <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="rounded-md border bg-background p-2 text-sm">
                <option value="all">All districts</option>
                {[...new Set(people.map((p) => p.district).filter(Boolean))].sort().map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="rounded-md border bg-background p-2 text-sm">
                <option value="all">All DL states</option>
                {[...new Set(people.map((p) => p.driversLicenseState).filter(Boolean))].sort().map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
              <select value={sexFilter} onChange={(e) => setSexFilter(e.target.value)} className="rounded-md border bg-background p-2 text-sm">
                <option value="all">All sexes</option><option value="M">Male</option><option value="F">Female</option><option value="U">Unknown</option>
              </select>
              <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)} className="rounded-md border bg-background p-2 text-sm">
                <option value="all">All order statuses</option><option value="active">Active orders</option><option value="expired">Expired orders</option><option value="order">Order of Protection</option><option value="stalking">Stalking No Contact</option><option value="civil">Civil No Contact</option><option value="firearms">Firearms Restraining</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-md border bg-background p-2 text-sm">
                <option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option><option value="modified-new">Recently modified</option><option value="created-new">Newest records</option><option value="created-old">Oldest records</option><option value="dob-new">DOB newest first</option><option value="expiration">Expiration date</option>
              </select>
              <Button variant="ghost" className="sm:col-span-2 lg:col-span-5" onClick={() => { setSearchTerm(""); setDistrictFilter("all"); setStateFilter("all"); setOrderFilter("all"); setSexFilter("all"); setSortBy("name-asc"); }}>Clear search and filters</Button>
            </div>
          )}
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
                        <CardPhotoSlider
                          photos={person.photos}
                          alt={person.name || `${person.firstName} ${person.lastName}`}
                          onClick={(e, i) => {
                            e.stopPropagation();
                            setSelectedPhoto({ photos: person.photos!, index: i });
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
                        {person.protectionForDurationOfCourtDate ? (
                          <p className="text-sm text-purple-700">For duration of the court date</p>
                        ) : person.protectionExpirationDate ? (
                          (() => {
                            const exp = new Date(person.protectionExpirationDate);
                            const expired = exp.getTime() < Date.now();
                            return (
                              <p className={`text-sm ${expired ? 'text-red-700 font-semibold' : 'text-purple-700'}`}>
                                {expired ? 'EXPIRED ' : 'Expires '}{exp.toLocaleDateString()}
                              </p>
                            );
                          })()
                        ) : null}
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

        {/* Photo Slideshow Dialog */}
        {selectedPhoto && selectedPhoto.photos.length > 0 && (
          <PhotoSlideshow
            photos={selectedPhoto.photos}
            startIndex={selectedPhoto.index}
            onClose={() => setSelectedPhoto(null)}
          />
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
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white text-red-600 hover:bg-gray-100"
                        disabled={geofenceLoading}
                        onClick={() => runGeofenceCheck(selectedPerson)}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        {geofenceLoading ? 'Checking…' : 'Check Geofence'}
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      {selectedPerson.orderOfProtection && (
                        <div className="text-center">
                          <div className="text-sm">ORDER OF PROTECTION</div>
                          <div className="text-white font-bold">
                            Active - {selectedPerson.protectionForDurationOfCourtDate ? 'For duration of the court date' : `Expires: ${selectedPerson.protectionExpirationDate ? new Date(selectedPerson.protectionExpirationDate).toLocaleDateString() : 'N/A'}`}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                {geofenceResults.length > 0 && (
                  <div className="rounded-lg border-2 border-blue-300 bg-blue-50 p-4">
                    <h3 className="font-bold text-blue-900">Geofence Results — 1,000 ft threshold</h3>
                    <p className="text-xs text-blue-700 mb-3">Straight-line estimate based on validated address coordinates. Confirm operational restrictions against the actual court order and agency mapping systems.</p>
                    <div className="space-y-2">{geofenceResults.map((result,index) => (
                      <div key={index} className="flex items-start justify-between gap-3 rounded bg-white p-3 border">
                        <div><div className="font-semibold">{result.label}</div><div className="text-xs text-gray-600">{result.address}</div>{result.error && <div className="text-xs text-red-600">{result.error}</div>}</div>
                        {!result.error && <Badge className={result.within ? 'bg-red-600' : 'bg-green-600'}>{result.within ? `WITHIN — ${result.distanceFeet?.toLocaleString()} ft` : `OUTSIDE — ${result.distanceFeet?.toLocaleString()} ft`}</Badge>}
                      </div>
                    ))}</div>
                  </div>
                )}

                {(selectedPerson.victims?.length || selectedPerson.children?.length) ? (
                  <div>
                    <div className="bg-purple-700 text-white p-3 rounded-t-lg"><h3 className="text-lg font-bold">VICTIMS & PROTECTED CHILDREN</h3></div>
                    <div className="bg-white border border-gray-200 rounded-b-lg p-4 space-y-4">
                      {(selectedPerson.victims || []).map((victim,index) => <div key={`v-${index}`} className="rounded border p-3"><div className="font-bold">{victim.name || `Victim ${index+1}`}</div><div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-1"><span>Relationship: {victim.relationship || 'N/A'}</span><span>DOB: {victim.dob || 'N/A'}</span><span>Phone: {victim.phone || 'N/A'}</span><span>Residence: {victim.address || 'N/A'}</span></div></div>)}
                      {(selectedPerson.children || []).map((child,index) => <div key={`c-${index}`} className="rounded border p-3"><div className="font-bold">{child.name || `Child ${index+1}`}</div><div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-1"><span>Relationship: {child.relationship || 'N/A'}</span><span>DOB: {child.dob || 'N/A'}</span><span>School: {child.schoolName || 'N/A'}</span><span>School Address: {child.schoolAddress || 'N/A'}</span></div></div>)}
                    </div>
                  </div>
                ) : null}

                {selectedPerson.descriptorPhotos && selectedPerson.descriptorPhotos.length > 0 && (
                  <div>
                    <div className="bg-slate-700 text-white p-3 rounded-t-lg"><h3 className="text-lg font-bold">SCAR & TATTOO PHOTOS</h3></div>
                    <div className="bg-white border border-gray-200 rounded-b-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedPerson.descriptorPhotos.map((photo,index) => <div key={index} className="space-y-1"><img src={photo.url} alt={`${photo.category} ${index+1}`} className="w-full h-40 object-cover border cursor-pointer" onClick={() => setSelectedPhoto({ photos: selectedPerson.descriptorPhotos!.map(p => p.url), index })} /><Badge variant="outline" className="uppercase">{photo.category}</Badge><div className="text-xs">{photo.description || 'No description'}</div></div>)}
                    </div>
                  </div>
                )}

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
                            onClick={() => setSelectedPhoto({ photos: selectedPerson.photos!, index })}
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
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd"/>
                        </svg>
                        IDOC INFORMATION
                      </h3>
                      <a
                        href="https://idoc.illinois.gov/offender/inmatesearch.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          const name = `${selectedPerson.firstName ?? ''} ${selectedPerson.lastName ?? ''}`.trim();
                          if (name) {
                            try { navigator.clipboard.writeText(name); } catch {}
                          }
                        }}
                        className="text-xs bg-white text-blue-700 hover:bg-blue-50 font-semibold px-3 py-1.5 rounded shadow-sm"
                        title="Opens IDOC Inmate Search in a new tab. Name copied to clipboard."
                      >
                        Search IDOC ↗
                      </a>
                    </div>
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
                        <div className="text-gray-600 text-xs">Active Case Numbers</div>
                        {(selectedPerson.activeCaseNumbers?.length
                          ? selectedPerson.activeCaseNumbers
                          : selectedPerson.activeCaseNumber
                            ? [selectedPerson.activeCaseNumber]
                            : []
                        ).length > 0 ? (
                          <div className="space-y-1">
                            {(selectedPerson.activeCaseNumbers?.length
                              ? selectedPerson.activeCaseNumbers
                              : [selectedPerson.activeCaseNumber!]
                            ).map((caseNumber, index) => (
                              <div key={`${caseNumber}-${index}`} className="font-bold">{caseNumber}</div>
                            ))}
                          </div>
                        ) : (
                          <div className="font-bold">No active case numbers listed</div>
                        )}
                        <div className="text-gray-600 text-xs mt-3">Active Case Details</div>
                        <div className="font-bold whitespace-pre-wrap">{selectedPerson.activeCases || 'No active case details listed'}</div>
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

                {/* Elopement Risk */}
                {(selectedPerson.elopementRisk === 'Y' || selectedPerson.elopementRisk === 'UNK' || selectedPerson.frequentLocations) && (
                  <div>
                    <div className="bg-amber-600 text-white p-3 rounded-t-lg">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        ELOPEMENT RISK
                      </h3>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-b-lg p-4">
                      <div className="grid grid-cols-1 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 text-xs">Person Wanders</div>
                          <div className="font-bold">
                            {selectedPerson.elopementRisk === 'Y'
                              ? 'YES'
                              : selectedPerson.elopementRisk === 'UNK'
                              ? 'Unknown'
                              : 'No'}
                          </div>
                        </div>
                        {selectedPerson.frequentLocations && (
                          <div>
                            <div className="text-gray-600 text-xs">Places Frequently Visited</div>
                            <div className="font-bold whitespace-pre-wrap">{selectedPerson.frequentLocations}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}



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
                          <div className="font-bold">{selectedPerson.protectionForDurationOfCourtDate ? 'For duration of the court date' : (selectedPerson.protectionExpirationDate || 'N/A')}</div>
                        </div>
                        {selectedPerson.orderOfProtectionType && (
                          <div className="col-span-2">
                            <div className="text-gray-600 text-xs">Type</div>
                            <div className="font-bold">{getOrderOfProtectionTypeLabel(selectedPerson.orderOfProtectionType)}</div>
                          </div>
                        )}
                        {selectedPerson.orderStatusFlags && selectedPerson.orderStatusFlags.length > 0 && (
                          <div className="col-span-2">
                            <div className="text-gray-600 text-xs">Status</div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedPerson.orderStatusFlags.map((f) => (
                                <span key={f} className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs font-semibold">
                                  {orderStatusFlagLabel(f)}
                                </span>
                              ))}
                            </div>
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

                      {/* Remedies */}
                      {selectedPerson.remedies && Object.values(selectedPerson.remedies).some((r) => r?.enabled) && (
                        <div className="border-t pt-4 mb-4">
                          <div className="text-gray-600 text-xs mb-2 font-semibold uppercase tracking-wide">Remedies Granted</div>
                          <ul className="space-y-3 text-sm">
                            {selectedPerson.remedies.r01?.enabled && (
                              <li>
                                <div className="font-bold text-purple-900">1. No Abuse (R01) — Police Enforced</div>
                                {selectedPerson.remedies.r01?.abuseTypes && selectedPerson.remedies.r01.abuseTypes.length > 0 && (
                                  <ul className="list-disc list-inside text-gray-700 ml-2">
                                    {selectedPerson.remedies.r01.abuseTypes.map((t) => <li key={t}>{t}</li>)}
                                  </ul>
                                )}
                              </li>
                            )}
                            {selectedPerson.remedies.r02?.enabled && (
                              <li>
                                <div className="font-bold text-purple-900">2. Possession of Residence (R02) — Police Enforced</div>
                                {selectedPerson.remedies.r02?.text && <div className="whitespace-pre-wrap text-gray-700">{selectedPerson.remedies.r02.text}</div>}
                              </li>
                            )}
                            {selectedPerson.remedies.r03?.enabled && (
                              <li>
                                <div className="font-bold text-purple-900">3. Stay Away from Petitioner and Certain Places (R03) — Police Enforced</div>
                                {selectedPerson.remedies.r03?.stayAwayGeneral && (
                                  <div className="text-gray-700">Respondent shall stay away from Petitioner and protected people at all times, including through third parties.</div>
                                )}
                                {selectedPerson.remedies.r03?.employmentAddresses && (
                                  <div className="text-gray-700 whitespace-pre-wrap"><span className="font-semibold">Employment: </span>{selectedPerson.remedies.r03.employmentAddresses}</div>
                                )}
                                {selectedPerson.remedies.r03?.addressConfidential && (
                                  <div className="text-gray-700 italic">Address is confidential and omitted.</div>
                                )}
                                {selectedPerson.remedies.r03?.otherAddresses && (
                                  <div className="text-gray-700 whitespace-pre-wrap"><span className="font-semibold">Other places: </span>{selectedPerson.remedies.r03.otherAddresses}</div>
                                )}
                              </li>
                            )}
                            {selectedPerson.remedies.r05?.enabled && (
                              <li>
                                <div className="font-bold text-purple-900">5. Care and Possession of Children (R05) — Police/Court Enforced</div>
                                {selectedPerson.remedies.r05?.text && <div className="whitespace-pre-wrap text-gray-700">{selectedPerson.remedies.r05.text}</div>}
                              </li>
                            )}
                            {selectedPerson.remedies.r08?.enabled && (
                              <li>
                                <div className="font-bold text-purple-900">8. No Concealment or Removal of Children (R08) — Police Enforced</div>
                                {selectedPerson.remedies.r08?.text && <div className="whitespace-pre-wrap text-gray-700">{selectedPerson.remedies.r08.text}</div>}
                              </li>
                            )}
                            {selectedPerson.remedies.r10?.enabled && (
                              <li>
                                <div className="font-bold text-purple-900">10. Possession of Personal Property (R10) — Court Enforced</div>
                                {selectedPerson.remedies.r10?.text && <div className="whitespace-pre-wrap text-gray-700">{selectedPerson.remedies.r10.text}</div>}
                              </li>
                            )}
                            {selectedPerson.remedies.r11?.enabled && (
                              <li>
                                <div className="font-bold text-purple-900">11. Restrictions on Property (R11) — Court Enforced</div>
                                {selectedPerson.remedies.r11?.text && <div className="whitespace-pre-wrap text-gray-700">{selectedPerson.remedies.r11.text}</div>}
                              </li>
                            )}
                            {selectedPerson.remedies.r11_5?.enabled && (
                              <li>
                                <div className="font-bold text-purple-900">11.5 Possession of Animals (R11.5) — Court Enforced</div>
                                {selectedPerson.remedies.r11_5?.text && <div className="whitespace-pre-wrap text-gray-700">{selectedPerson.remedies.r11_5.text}</div>}
                              </li>
                            )}
                            {selectedPerson.remedies.r14?.enabled && (
                              <li>
                                <div className="font-bold text-purple-900">14. No Entry or Presence Under Influence (R14) — Police Enforced</div>
                                {selectedPerson.remedies.r14?.text && <div className="whitespace-pre-wrap text-gray-700">{selectedPerson.remedies.r14.text}</div>}
                              </li>
                            )}
                            {selectedPerson.remedies.r14_5?.enabled && (
                              <li>
                                <div className="font-bold text-purple-900">14.5 Firearms (R14.5) — Police Enforced</div>
                                <div className="text-gray-700">Respondent prohibited from possessing firearms; must surrender firearms, firearm parts, FOID card, and/or CCL to law enforcement.</div>
                              </li>
                            )}
                            {selectedPerson.remedies.r17?.enabled && (
                              <li>
                                <div className="font-bold text-purple-900">17. Miscellaneous Remedies (R17) — Court Enforced</div>
                                {selectedPerson.remedies.r17?.text && <div className="whitespace-pre-wrap text-gray-700">{selectedPerson.remedies.r17.text}</div>}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

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
                        <div className="col-span-2 mt-3 border-t pt-3 grid gap-2 sm:grid-cols-2">
                          <div><div className="text-gray-600 text-xs">Record Created</div><div className="font-medium">{selectedPerson.createdDate ? new Date(selectedPerson.createdDate).toLocaleString() : "Legacy record"}</div></div>
                          <div><div className="text-gray-600 text-xs">Created By</div><div className="font-medium">{selectedPerson.createdByName || "Unknown"}{selectedPerson.createdByStarNumber ? ` — Star ${selectedPerson.createdByStarNumber}` : ""}</div></div>
                          <div><div className="text-gray-600 text-xs">Last Modified</div><div className="font-medium">{selectedPerson.lastModifiedDate ? new Date(selectedPerson.lastModifiedDate).toLocaleString() : "Not recorded"}</div></div>
                          <div><div className="text-gray-600 text-xs">Last Modified By</div><div className="font-medium">{selectedPerson.lastModifiedByName || "Unknown"}{selectedPerson.lastModifiedByStarNumber ? ` — Star ${selectedPerson.lastModifiedByStarNumber}` : ""}</div></div>
                        </div>
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
