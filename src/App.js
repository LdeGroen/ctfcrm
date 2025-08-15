import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Client, Account, Databases, ID, Query, Functions } from 'https://esm.sh/appwrite@14.0.1';


// --- Appwrite Configuratie ---
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '6874f0b40015fc341b14'; // Vervang dit
const APPWRITE_DATABASE_ID = '68873afd0015cc5075e5'; // Vervang dit
const APPWRITE_COLLECTION_CONTACTS_ID = '68873b53001cd7a02043'; // Vervang dit
const APPWRITE_COLLECTION_COMPANIES_ID = '68873b5f0032519e7321'; // Vervang dit
const APPWRITE_COLLECTION_PERFORMANCES_ID = '68873b6500074288e73d'; // Vervang dit
const APPWRITE_COLLECTION_LOCATIONS_ID = '68878ee7000cb07ef9e7'; // Vervang dit
const APPWRITE_COLLECTION_EXECUTIONS_ID = '68878f2d0020be3a7efd'; // Vervang dit
const APPWRITE_COLLECTION_EVENTS_ID = '688798900022cbda4ec0'; // Vervang dit
// Nieuwe Collectie IDs
const APPWRITE_COLLECTION_INFO_ID = '68945b4f000e7c3880cb';
const APPWRITE_COLLECTION_NEWS_ID = '68948a4b002d7cda6919';
const APPWRITE_COLLECTION_ACCESSIBILITY_ID = '6894d367002bf2645148';
const APPWRITE_COLLECTION_VEILIGHEID_ID = '6899f3390009b108e10f';
const APPWRITE_COLLECTION_MARKETING_ID = '689ded8900383f2d618b'; // NIEUWE MARKETING COLLECTIE


// --- Initialiseer Appwrite Client ---
const client = new Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);

// --- Super Admin Configuratie ---
const SUPER_ADMIN_EMAIL = 'luc@cafetheaterfestival.nl';

// --- Helper: Iconen (als JSX) ---
const icons = {
  users: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  briefcase: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  fileText: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
  plus: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>,
  trash: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  edit: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
  x: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  mapPin: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  calendar: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  film: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="6" rx="2"/><path d="M3 12h18"/><path d="M7 12v4"/><path d="M17 12v4"/></svg>,
  star: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  grid: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 3v18"/></svg>,
  upload: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
  download: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
  search: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>,
  save: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>,
  menu: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
  pdf: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  copy: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
  check: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  chevronDown: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  sortAsc: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/></svg>,
  sortDesc: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/></svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  info: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  news: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16v18H4Z"/><path d="M15 8h-5"/><path d="M15 12h-5"/><path d="M15 16h-5"/><path d="M10 8v.01"/><path d="M10 12v.01"/><path d="M10 16v.01"/></svg>,
  accessibility: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 6a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm0 0V4m0 16v-6a2 2 0 0 0-2-2h-2m6 0a2 2 0 0 1 2 2v2m-4-6h.01"/></svg>,
  phone: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  mail: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  clock: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  shield: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
  filter: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
  list: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
  card: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>,
  // Nieuw icoon voor marketing
  megaphone: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
};


// --- Helper: Functie om speciale tekens te escapen voor RegExp ---
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- Helper: Functie om alle documenten uit een collectie op te halen ---
const fetchAllDocuments = async (collectionId) => {
    const documents = [];
    let fetchedDocuments = [];
    let offset = 0;
    const limit = 100;

    try {
        do {
            const response = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                collectionId,
                [Query.limit(limit), Query.offset(offset)]
            );
            fetchedDocuments = response.documents;
            documents.push(...fetchedDocuments);
            offset += limit;
        } while (fetchedDocuments.length > 0);
        
        return documents;
    } catch (e) {
        console.error(`Fout bij ophalen van alle documenten voor ${collectionId}:`, e);
        try {
            const response = await databases.listDocuments(APPWRITE_DATABASE_ID, collectionId, [Query.limit(500)]);
            return response.documents;
        } catch (fallbackError) {
            console.error(`Fallback voor ${collectionId} ook mislukt:`, fallbackError);
            return [];
        }
    }
};

// --- Helper: Functie om data te exporteren (CSV & PDF) ---
const exportTo = (format, filename, rows, columns) => {
    if (!rows || rows.length === 0) {
        console.warn("Geen data om te exporteren.");
        return;
    }

    const headers = columns.map(c => c.header);
    const keys = columns.map(c => c.key);

    const processRowForCsv = (rowValues) => {
        return rowValues.map(val => {
            let innerValue = val === null || val === undefined ? '' : String(val);
            if (typeof innerValue === 'string' && innerValue.includes(',')) {
                innerValue = `"${innerValue.replace(/"/g, '""')}"`;
            }
            return innerValue;
        }).join(',') + '\n';
    };

    if (format === 'csv') {
        let csvFile = processRowForCsv(headers);
        rows.forEach(row => {
            const values = keys.map(key => {
                const value = row[key];
                if (Array.isArray(value)) return value.join('; ');
                if (typeof value === 'boolean') return value ? 'Ja' : 'Nee';
                return value;
            });
            csvFile += processRowForCsv(values);
        });

        const blob = new Blob([`\uFEFF${csvFile}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else if (format === 'pdf') {
        if (!window.jspdf || !window.jspdf.jsPDF.autoTable) {
            alert('PDF bibliotheek is nog aan het laden. Probeer het over enkele seconden opnieuw.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape' });
        
        const body = rows.map(row => {
            return keys.map(key => {
                const value = row[key];
                if (Array.isArray(value)) return value.join('; ');
                if (typeof value === 'boolean') return value ? 'Ja' : 'Nee';
                return String(value || '');
            });
        });

        doc.autoTable({
            head: [headers],
            body: body,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [74, 85, 104] }, // gray-700
        });
        doc.save(`${filename}.pdf`);
    }
};


// --- Custom Hook voor Dropdown functionaliteit ---
function useDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggle = () => setIsOpen(!isOpen);
    const close = () => setIsOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                close();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return { isOpen, toggle, close, dropdownRef };
}

// --- Custom Hook voor Sorteren & Filteren (MET MULTI-SELECT) ---
function useSortAndFilter(items, initialSortKey, searchKeys = [], initialFilters = {}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: initialSortKey, direction: 'ascending' });
    const [filters, setFilters] = useState(initialFilters);

    const filteredAndSortedItems = useMemo(() => {
        let filtered = [...items];

        // Apply search term
        if (searchTerm) {
             const lowercasedTerm = searchTerm.toLowerCase();
             filtered = filtered.filter(item => 
                searchKeys.some(key => {
                    const value = key.split('.').reduce((o, i) => (o ? o[i] : undefined), item);
                    return String(value).toLowerCase().includes(lowercasedTerm);
                })
            );
        }
        
        // Apply structured multi-select filters
        Object.entries(filters).forEach(([key, selectedValues]) => {
            if (!Array.isArray(selectedValues) || selectedValues.length === 0) return;
            
            filtered = filtered.filter(item => {
                const itemValue = item[key];
                if (typeof itemValue === 'boolean') {
                    return selectedValues.includes(itemValue ? 'Ja' : 'Nee');
                }
                if (Array.isArray(itemValue)) {
                    // Check if any of the item's array values are in the selected filter values
                    return itemValue.some(v => selectedValues.includes(v));
                }
                return selectedValues.includes(String(itemValue || ''));
            });
        });
      
        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                    aValue = aValue ? 1 : 0;
                    bValue = bValue ? 1 : 0;
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    // Direct number comparison
                }
                else {
                    aValue = String(aValue || '').toLowerCase();
                    bValue = String(bValue || '').toLowerCase();
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [items, searchTerm, sortConfig, filters, searchKeys]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    // Updated filter handler for multi-select
    const handleFilterChange = (key, value) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            const currentValues = prev[key] || [];

            if (value === 'all') {
                delete newFilters[key];
                return newFilters;
            }
            
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];

            if (newValues.length === 0) {
                delete newFilters[key];
            } else {
                newFilters[key] = newValues;
            }
            
            return newFilters;
        });
    };
    
    const resetFilters = () => {
        setFilters(initialFilters);
    };

    return { 
        filteredAndSortedItems, 
        searchTerm, 
        setSearchTerm, 
        sortConfig, 
        requestSort,
        filters,
        handleFilterChange,
        resetFilters
    };
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const currentUser = await account.get();
        if (currentUser.email.endsWith('@cafetheaterfestival.nl')) {
          const prefs = await account.getPrefs();
          const role = currentUser.email === SUPER_ADMIN_EMAIL ? 'super_admin' : (prefs.role || 'viewer');
          setUser({ ...currentUser, role: role });
        } else {
          await account.deleteSession('current');
          setError('Toegang geweigerd. Alleen accounts van @cafetheaterfestival.nl zijn toegestaan.');
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        window.history.replaceState(null, '', window.location.pathname);
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleGoogleLogin = async () => {
    try {
        const redirectUrl = window.location.origin + window.location.pathname;
        account.createOAuth2Session('google', redirectUrl, redirectUrl);
    } catch (e) {
        console.error("Google login error", e);
        setError("Inloggen met Google is mislukt.");
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100"><div className="text-xl font-semibold">Sessie controleren...</div></div>;
  }

  if (!user) {
    return <LoginScreen onLogin={handleGoogleLogin} error={error} />;
  }

  return <CrmApp user={user} onLogout={handleLogout} />;
}

function LoginScreen({ onLogin, error }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100" style={{fontFamily: 'Inter, sans-serif'}}>
      <div className="text-center p-8 bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <img src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/fav.png" alt="CTF Logo" className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-gray-800">CTF CRM</h1>
        </div>
        <p className="text-gray-600 mb-6">Log in om door te gaan.</p>
        <button
          onClick={onLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.012,35.846,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
          <span>Inloggen met Google</span>
        </button>
        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
}

function CrmApp({ user, onLogout }) {
  const [activeView, setActiveView] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [locations, setLocations] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [events, setEvents] = useState([]);
  const [infoItems, setInfoItems] = useState([]);
  const [nieuwsItems, setNieuwsItems] = useState([]);
  const [toegankelijkheidItems, settoegankelijkheidItems] = useState([]);
  const [veiligheidItems, setVeiligheidItems] = useState([]);
  const [marketingItems, setMarketingItems] = useState([]); // NIEUW

  const [loadingData, setLoadingData] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: () => {} });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  const [quickViewItem, setQuickViewItem] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };
  
  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ show: true, message, onConfirm });
  };
  
  const hideConfirm = () => {
    setConfirmModal({ show: false, message: '', onConfirm: () => {} });
  };

  useEffect(() => {
    // Dynamically load jspdf and autotable scripts
    if (!document.getElementById('jspdf-script')) {
        const script = document.createElement('script');
        script.id = 'jspdf-script';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.async = true;
        document.body.appendChild(script);
    }
    if (!document.getElementById('jspdf-autotable-script')) {
        const script = document.createElement('script');
        script.id = 'jspdf-autotable-script';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js';
        script.async = true;
        document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    setLoadingData(true);
    const collections = {
      contacts: { id: APPWRITE_COLLECTION_CONTACTS_ID, setter: setContacts },
      companies: { id: APPWRITE_COLLECTION_COMPANIES_ID, setter: setCompanies },
      performances: { id: APPWRITE_COLLECTION_PERFORMANCES_ID, setter: setPerformances },
      locations: { id: APPWRITE_COLLECTION_LOCATIONS_ID, setter: setLocations },
      executions: { id: APPWRITE_COLLECTION_EXECUTIONS_ID, setter: setExecutions },
      events: { id: APPWRITE_COLLECTION_EVENTS_ID, setter: setEvents },
      info: { id: APPWRITE_COLLECTION_INFO_ID, setter: setInfoItems },
      news: { id: APPWRITE_COLLECTION_NEWS_ID, setter: setNieuwsItems },
      accessibility: { id: APPWRITE_COLLECTION_ACCESSIBILITY_ID, setter: settoegankelijkheidItems },
      veiligheid: { id: APPWRITE_COLLECTION_VEILIGHEID_ID, setter: setVeiligheidItems },
      marketing: { id: APPWRITE_COLLECTION_MARKETING_ID, setter: setMarketingItems }, // NIEUW
    };

    const fetchInitialData = async () => {
        try {
            const promises = Object.values(collections).map(c => fetchAllDocuments(c.id));
            const results = await Promise.all(promises);
            const mapDocs = (docs) => docs.map(doc => ({ ...doc, id: doc.$id }));
            
            Object.keys(collections).forEach((key, index) => {
                collections[key].setter(mapDocs(results[index]));
            });

        } catch (e) {
            console.error("Fout bij ophalen data:", e);
            showNotification("Kon data niet laden. Controleer of alle collectie-ID's correct zijn.", "error");
        }
    };
    
    fetchInitialData().finally(() => setLoadingData(false));

    const unsubscribers = Object.values(collections).map(({ id, setter }) => {
        const channel = `databases.${APPWRITE_DATABASE_ID}.collections.${id}.documents`;
        return client.subscribe(channel, response => {
            const changedDoc = { ...response.payload, id: response.payload.$id };
            setter(prevItems => {
                const eventTypes = response.events[0];
                if (eventTypes.includes('.create')) return [...prevItems, changedDoc];
                if (eventTypes.includes('.update')) return prevItems.map(item => item.id === changedDoc.id ? changedDoc : item);
                if (eventTypes.includes('.delete')) return prevItems.filter(item => item.id !== changedDoc.id);
                return prevItems;
            });
        });
    });

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  const handleAddItem = async (collectionId, data) => {
    try {
      await databases.createDocument(APPWRITE_DATABASE_ID, collectionId, ID.unique(), data);
      showNotification('Item succesvol toegevoegd!');
    } catch (e) {
      console.error("Fout bij toevoegen item:", e);
      showNotification(`Toevoegen mislukt: ${e.message}`, 'error');
    }
  };

  const handleBulkAddItems = async (collectionId, itemsData) => {
    try {
        await Promise.all(itemsData.map(data => 
            databases.createDocument(APPWRITE_DATABASE_ID, collectionId, ID.unique(), data)
        ));
        showNotification(`${itemsData.length} items succesvol toegevoegd!`, 'success');
    } catch (e) {
        console.error("Bulk toevoegen mislukt:", e);
        showNotification(`Bulk toevoegen mislukt: ${e.message}`, 'error');
    }
  };

  const handleUpdateItem = async (collectionId, id, data) => {
    try {
      const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== null));
      await databases.updateDocument(APPWRITE_DATABASE_ID, collectionId, id, cleanData);
      showNotification('Item succesvol bijgewerkt!');
    } catch (e) {
      console.error("Fout bij bijwerken item:", e);
      showNotification(`Bijwerken mislukt: ${e.message}`, 'error');
    }
  };
  
  const handleBulkUpdateItems = async (collectionId, updates) => {
    showConfirm(`Weet je zeker dat je ${updates.length} items wilt bijwerken?`, async () => {
        let successCount = 0;
        let errorCount = 0;
        
        const promises = updates.map(async ({ id, data }) => {
            try {
                const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== null));
                await databases.updateDocument(APPWRITE_DATABASE_ID, collectionId, id, cleanData);
                successCount++;
            } catch (e) {
                console.error(`Fout bij bijwerken item ${id}:`, e);
                errorCount++;
            }
        });

        await Promise.all(promises);

        if (errorCount > 0) {
            showNotification(`${successCount} items bijgewerkt, ${errorCount} mislukt.`, 'error');
        } else {
            showNotification(`${successCount} items succesvol bijgewerkt!`, 'success');
        }
        hideConfirm();
    });
  };

  const handleDeleteItem = (collectionId, id) => {
     showConfirm("Weet je zeker dat je dit item wilt verwijderen?", async () => {
        try {
            await databases.deleteDocument(APPWRITE_DATABASE_ID, collectionId, id);
            showNotification('Item succesvol verwijderd!');
        } catch (e) {
            console.error("Fout bij verwijderen item:", e);
            showNotification('Verwijderen mislukt.', 'error');
        }
        hideConfirm();
     });
  };

  const handleBulkDeleteItems = (collectionId, ids) => {
    showConfirm(`Weet je zeker dat je ${ids.length} geselecteerde items wilt verwijderen?`, async () => {
        try {
            await Promise.all(ids.map(id => databases.deleteDocument(APPWRITE_DATABASE_ID, collectionId, id)));
            showNotification(`${ids.length} items succesvol verwijderd!`);
        } catch (e) {
            console.error("Fout bij bulk verwijderen:", e);
            showNotification('Bulk verwijderen mislukt.', 'error');
        }
        hideConfirm();
    });
  };
  
  const standardizeRole = (role) => (role || '').trim().toLowerCase();
  const artists = contacts.filter(c => standardizeRole(c.Role) === 'artiest');
  const cafeOwners = contacts.filter(c => standardizeRole(c.Role) === 'café-eigenaar');
  
  const hasEditPermissions = user.role === 'editor' || user.role === 'super_admin';

  const allData = { contacts, companies, performances, locations };

  return (
    <div className="flex h-screen bg-gray-50" style={{fontFamily: 'Inter, sans-serif'}}>
      <div className="hidden md:flex md:flex-shrink-0">
          <Sidebar activeView={activeView} setActiveView={setActiveView} user={user} onLogout={onLogout} />
      </div>

      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-fade-in">
           <Sidebar 
              activeView={activeView} 
              setActiveView={(view) => {
                  setActiveView(view);
                  setIsMobileNavOpen(false);
              }} 
              user={user} 
              onLogout={onLogout} 
              isMobile={true}
              onClose={() => setIsMobileNavOpen(false)}
            />
        </div>
      )}
      
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <header className="md:hidden flex justify-between items-center p-4 bg-white border-b border-gray-200">
           <div className="flex items-center space-x-3">
             <img src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/fav.png" alt="CTF Logo" className="w-8 h-8" />
             <h1 className="text-xl font-bold text-gray-800">CTF CRM</h1>
           </div>
           <button onClick={() => setIsMobileNavOpen(true)} className="text-gray-600 p-2">
             {icons.menu}
           </button>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
          {notification.show && <Notification message={notification.message} type={notification.type} />}
          {confirmModal.show && <ConfirmModal message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={hideConfirm} />}
          
          {quickViewItem && (
            <QuickViewModal
                initialItem={quickViewItem.item}
                itemType={quickViewItem.type}
                data={allData}
                onClose={() => setQuickViewItem(null)}
            />
          )}

          {loadingData && <div className="text-center p-10">Data laden...</div>}
          
          {!loadingData && activeView === 'festivalkantoor' && 
            <FestivalkantoorView
              executions={executions}
              performances={performances}
              locations={locations}
              companies={companies}
              onUpdateExecution={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_EXECUTIONS_ID, id, data)}
              hasEditPermissions={hasEditPermissions}
            />
          }

          {!loadingData && activeView === 'volunteers' && 
            <VolunteersView 
              contacts={contacts} 
              onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_CONTACTS_ID, data)}
              onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_CONTACTS_ID, id, data)}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_CONTACTS_ID, id)}
              hasEditPermissions={hasEditPermissions}
            />}
            
          {!loadingData && activeView === 'contacts' && 
            <ContactsView 
              contacts={contacts} 
              onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_CONTACTS_ID, data)}
              onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_CONTACTS_ID, id, data)}
              onBulkUpdate={(updates) => handleBulkUpdateItems(APPWRITE_COLLECTION_CONTACTS_ID, updates)}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_CONTACTS_ID, id)}
              onBulkAdd={(data) => handleBulkAddItems(APPWRITE_COLLECTION_CONTACTS_ID, data)}
              onBulkDelete={(ids) => handleBulkDeleteItems(APPWRITE_COLLECTION_CONTACTS_ID, ids)}
              hasEditPermissions={hasEditPermissions}
            />}
          {!loadingData && activeView === 'companies' && 
            <CompaniesView 
              companies={companies} 
              artists={artists}
              performances={performances}
              executions={executions}
              events={events}
              onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_COMPANIES_ID, data)}
              onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_COMPANIES_ID, id, data)}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_COMPANIES_ID, id)}
              onBulkAdd={(data) => handleBulkAddItems(APPWRITE_COLLECTION_COMPANIES_ID, data)}
              onBulkDelete={(ids) => handleBulkDeleteItems(APPWRITE_COLLECTION_COMPANIES_ID, ids)}
              hasEditPermissions={hasEditPermissions}
              onQuickView={setQuickViewItem}
            />}
          {!loadingData && activeView === 'performances' && 
            <PerformancesView 
              performances={performances}
              companies={companies}
              executions={executions}
              events={events}
              onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_PERFORMANCES_ID, data)}
              onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_PERFORMANCES_ID, id, data)}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_PERFORMANCES_ID, id)}
              onBulkAdd={(data) => handleBulkAddItems(APPWRITE_COLLECTION_PERFORMANCES_ID, data)}
              onBulkDelete={(ids) => handleBulkDeleteItems(APPWRITE_COLLECTION_PERFORMANCES_ID, ids)}
              hasEditPermissions={hasEditPermissions}
              onQuickView={setQuickViewItem}
            />}
          {!loadingData && activeView === 'locations' && 
            <LocationsView 
              locations={locations}
              cafeOwners={cafeOwners}
              performances={performances}
              onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_LOCATIONS_ID, data)}
              onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_LOCATIONS_ID, id, data)}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_LOCATIONS_ID, id)}
              onBulkAdd={(data) => handleBulkAddItems(APPWRITE_COLLECTION_LOCATIONS_ID, data)}
              onBulkDelete={(ids) => handleBulkDeleteItems(APPWRITE_COLLECTION_LOCATIONS_ID, ids)}
              hasEditPermissions={hasEditPermissions}
              onQuickView={setQuickViewItem}
            />}
          {!loadingData && activeView === 'executions' && 
            <ExecutionsView 
              executions={executions}
              performances={performances}
              locations={locations}
              onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_EXECUTIONS_ID, data)}
              onBulkAdd={(data) => handleBulkAddItems(APPWRITE_COLLECTION_EXECUTIONS_ID, data)}
              onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_EXECUTIONS_ID, id, data)}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_EXECUTIONS_ID, id)}
              onBulkDelete={(ids) => handleBulkDeleteItems(APPWRITE_COLLECTION_EXECUTIONS_ID, ids)}
              hasEditPermissions={hasEditPermissions}
              onQuickView={setQuickViewItem}
            />}
          {!loadingData && activeView === 'events' && 
            <EventsView 
              events={events}
              executions={executions}
              performances={performances}
              locations={locations}
              onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_EVENTS_ID, data)}
              onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_EVENTS_ID, id, data)}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_EVENTS_ID, id)}
              onBulkAdd={(data) => handleBulkAddItems(APPWRITE_COLLECTION_EVENTS_ID, data)}
              onBulkDelete={(ids) => handleBulkDeleteItems(APPWRITE_COLLECTION_EVENTS_ID, ids)}
              hasEditPermissions={hasEditPermissions}
            />}
          
          {/* Nieuwe Views */}
          {!loadingData && activeView === 'info' && 
            <InfoView
              infoItems={infoItems}
              onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_INFO_ID, data)}
              onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_INFO_ID, id, data)}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_INFO_ID, id)}
              onBulkAdd={(data) => handleBulkAddItems(APPWRITE_COLLECTION_INFO_ID, data)}
              onBulkDelete={(ids) => handleBulkDeleteItems(APPWRITE_COLLECTION_INFO_ID, ids)}
              hasEditPermissions={hasEditPermissions}
            />}
          {!loadingData && activeView === 'news' && 
            <NieuwsView
              nieuwsItems={nieuwsItems}
              onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_NEWS_ID, data)}
              onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_NEWS_ID, id, data)}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_NEWS_ID, id)}
              hasEditPermissions={hasEditPermissions}
            />}
          {!loadingData && activeView === 'accessibility' && 
            <ToegankelijkheidView
              toegankelijkheidItems={toegankelijkheidItems}
              onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_ACCESSIBILITY_ID, data)}
              onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_ACCESSIBILITY_ID, id, data)}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_ACCESSIBILITY_ID, id)}
              hasEditPermissions={hasEditPermissions}
            />}
          {!loadingData && activeView === 'veiligheid' && hasEditPermissions &&
            <VeiligheidView
              veiligheidItems={veiligheidItems}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_VEILIGHEID_ID, id)}
              userRole={user.role}
            />}
            
          {/* NIEUWE MARKETING VIEW RENDER */}
          {!loadingData && activeView === 'marketing' && 
            <MarketingView
              marketingItems={marketingItems}
              performances={performances}
              companies={companies}
              executions={executions}
              onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_MARKETING_ID, data)}
              onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_MARKETING_ID, id, data)}
              onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_MARKETING_ID, id)}
              hasEditPermissions={hasEditPermissions}
            />}
            
          {!loadingData && activeView === 'schedule' && 
            <ScheduleView 
              events={events}
              performances={performances}
              executions={executions}
              locations={locations}
              companies={companies}
              onQuickView={setQuickViewItem}
            />}
          {!loadingData && activeView === 'contract' && 
            <ContractGenerator 
              contacts={contacts} 
              companies={companies} 
              performances={performances}
              events={events}
              executions={executions}
              showNotification={showNotification}
            />}
          {!loadingData && activeView === 'cafeContract' && 
            <CafeContractGenerator 
              contacts={contacts} 
              companies={companies} 
              performances={performances}
              events={events}
              executions={executions}
              locations={locations}
              showNotification={showNotification}
            />}
        </main>
      </div>
    </div>
  );
}

function Sidebar({ activeView, setActiveView, user, onLogout, isMobile = false, onClose }) {
  const hasEditPermissions = user.role === 'editor' || user.role === 'super_admin';
  
  const navItems = [
    { id: 'festivalkantoor', label: 'Festivalkantoor', icon: icons.briefcase, visible: true },
    { id: 'contacts', label: 'Contacten', icon: icons.users, visible: true },
    { id: 'volunteers', label: 'Vrijwilligers', icon: icons.star, visible: true }, 
    { id: 'companies', label: 'Gezelschappen', icon: icons.briefcase, visible: true },
    { id: 'performances', label: 'Voorstellingen', icon: icons.film, visible: true },
    { id: 'executions', label: 'Uitvoeringen', icon: icons.calendar, visible: true },
    { id: 'locations', label: 'Locaties', icon: icons.mapPin, visible: true },
    { id: 'events', label: 'Events', icon: icons.star, visible: true },
    { id: 'marketing', label: 'Marketing', icon: icons.megaphone, visible: true }, // NIEUW
    { id: 'info', label: 'Info', icon: icons.info, visible: true },
    { id: 'news', label: 'Nieuws', icon: icons.news, visible: true },
    { id: 'accessibility', label: 'Toegankelijkheid', icon: icons.accessibility, visible: true },
    { id: 'schedule', label: 'Blokkenschema', icon: icons.grid, visible: true },
    { id: 'contract', label: 'Contract Generator (Gezelschappen)', icon: icons.fileText, visible: true },
    { id: 'cafeContract', label: 'Contract Generator (Cafés)', icon: icons.fileText, visible: true },
    { id: 'veiligheid', label: 'Veiligheid', icon: icons.shield, visible: hasEditPermissions },
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
                <img src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/fav.png" alt="CTF Logo" className="w-8 h-8" />
                <h1 className="text-xl font-bold text-gray-800">CTF CRM</h1>
            </div>
            {isMobile && (
              <button onClick={onClose} className="text-gray-500 p-2">{icons.x}</button>
            )}
        </div>
        <ul>
          {navItems.filter(item => item.visible).map(item => (
            <li key={item.id}>
              <button onClick={() => setActiveView(item.id)} className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${activeView === item.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`}>
                <div className="w-6 h-6">{item.icon}</div><span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-sm text-gray-500 mb-4">
          <p>Ingelogd als:</p>
          <p className="font-semibold break-all">{user.name}</p>
          <p className="text-xs break-all">{user.email}</p>
          <p className="text-xs capitalize mt-1">Rol: <span className="font-bold">{user.role.replace('_', ' ')}</span></p>
        </div>
        <button onClick={onLogout} className="w-full flex items-center space-x-3 p-3 rounded-lg text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
          {icons.logout}<span>Uitloggen</span>
        </button>
      </div>
    </nav>
  );
}

function Notification({ message, type }) {
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    return (
        <div className={`fixed top-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg z-50 ${bgColor}`}>
            {message}
        </div>
    );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-xl text-center">
                <p className="text-lg mb-6">{message}</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Annuleren</button>
                    <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Bevestigen</button>
                </div>
            </div>
        </div>
    );
}

// --- Helper Component: ToggleSwitch ---
function ToggleSwitch({ checked, onChange, disabled = false }) {
    const handleToggle = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    return (
        <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <input type="checkbox" checked={checked} onChange={handleToggle} className="sr-only peer" disabled={disabled} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
    );
}

function DetailCard({ title, items, related, onRelatedClick }) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fade-in-fast">
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">{title}</h3>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index}>
                        <p className="text-sm font-semibold text-gray-500">{item.label}</p>
                        <p className="text-gray-800">{item.value || 'N.v.t.'}</p>
                    </div>
                ))}
            </div>
            {related && related.items.length > 0 && (
                 <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-bold text-gray-500 mb-2">{related.title}</h4>
                    <div className="space-y-1">
                        {related.items.map((item, index) => (
                             <button 
                                key={index} 
                                onClick={() => onRelatedClick(item.data)}
                                className="text-indigo-600 hover:underline text-left w-full"
                             >
                                {item.label}
                             </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function QuickViewModal({ initialItem, itemType, data, onClose }) {
    const [history, setHistory] = useState([{ item: initialItem, type: itemType }]);
    const current = history[history.length - 1];

    const handleRelatedClick = (newItem, newType) => {
        setHistory(prev => [...prev, { item: newItem, type: newType }]);
    };
    
    const handleBack = () => {
        if (history.length > 1) {
            setHistory(prev => prev.slice(0, -1));
        }
    };

    const getCardProps = (item, type) => {
        switch (type) {
            case 'contact':
                return {
                    title: item.Name,
                    items: [
                        { label: 'Rol', value: item.Role },
                        { label: 'Functie', value: (item.functie || []).join(', ') },
                        { label: 'Email', value: item.Email },
                        { label: 'Telefoon', value: item.Phone },
                    ]
                };
            case 'company':
                 const companyArtists = (item.playerIds || []).map(id => data.contacts.find(c => c.id === id)).filter(Boolean);
                return {
                    title: item.Name,
                    items: [{ label: 'Beschrijving', value: item.Description }],
                    related: {
                        title: 'Artiesten',
                        items: companyArtists.map(a => ({ label: a.Name, data: { item: a, type: 'contact' } }))
                    }
                };
            case 'performance':
                const company = data.companies.find(c => c.id === item.companyId);
                return {
                    title: item.Title,
                    items: [
                        { label: 'Genre', value: item.genre },
                        { label: 'Taal', value: [item.isDutchLanguage && 'NL', item.isEnglishLanguage && 'EN', item.isDialogueFree && 'Taalloos'].filter(Boolean).join(', ') },
                    ],
                    related: company ? {
                        title: 'Gezelschap',
                        items: [{ label: company.Name, data: { item: company, type: 'company' } }]
                    } : null
                };
            case 'location':
                const contactPerson = data.contacts.find(c => c.id === item.contactPersonId);
                return {
                    title: item.Name,
                    items: [
                        { label: 'Adres', value: item.Address },
                        { label: 'Capaciteit', value: item.capaciteit },
                    ],
                    related: contactPerson ? {
                        title: 'Contactpersoon',
                        items: [{ label: contactPerson.Name, data: { item: contactPerson, type: 'contact' } }]
                    } : null
                };
            default:
                return { title: 'Details', items: [] };
        }
    };

    const cardProps = getCardProps(current.item, current.type);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="relative" onClick={e => e.stopPropagation()}>
                {history.length > 1 && (
                    <button onClick={handleBack} className="absolute -top-10 left-0 text-white hover:underline">‹ Terug</button>
                )}
                <DetailCard 
                    {...cardProps}
                    onRelatedClick={({ item, type }) => handleRelatedClick(item, type)}
                />
            </div>
        </div>
    );
}

// --- Generieke Componenten voor Views ---

function ViewSwitcher({ viewMode, setViewMode }) {
    const baseClasses = "p-2 rounded-lg flex items-center space-x-2 transition-colors";
    const activeClasses = "bg-indigo-600 text-white shadow";
    const inactiveClasses = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    return (
        <div className="flex bg-gray-200 rounded-lg p-1">
            <button
                onClick={() => setViewMode('list')}
                className={`${baseClasses} ${viewMode === 'list' ? activeClasses : inactiveClasses}`}
            >
                {icons.list}
                <span>Lijst</span>
            </button>
            <button
                onClick={() => setViewMode('card')}
                className={`${baseClasses} ${viewMode === 'card' ? activeClasses : inactiveClasses}`}
            >
                {icons.card}
                <span>Kaartjes</span>
            </button>
        </div>
    );
}

function CopyToClipboardButton({ textToCopy }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <button onClick={handleCopy} className="text-gray-400 hover:text-indigo-600 p-1 rounded-full transition-colors">
            {isCopied ? <span className="text-green-500">{icons.check}</span> : <span className="w-4 h-4 block">{icons.copy}</span>}
        </button>
    );
}

function ColumnSelector({ columns, visibleColumns, toggleColumn }) {
    const { isOpen, toggle, close, dropdownRef } = useDropdown();

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggle} className="flex items-center space-x-2 p-2 border rounded-lg shadow-sm bg-white">
                <span>Kolommen</span>
                {icons.chevronDown}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-xl z-20">
                    <div className="p-2 text-sm font-semibold text-gray-700 border-b">Toon kolommen</div>
                    <div className="p-2 space-y-1">
                        {columns.map(col => (
                            <label key={col.key} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    checked={visibleColumns.has(col.key)}
                                    onChange={() => toggleColumn(col.key)}
                                />
                                <span>{col.header}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterBar({ children }) {
    return (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {children}
            </div>
        </div>
    );
}

function FilterDropdown({ label, name, value, onChange, options }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
                name={name}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className="w-full p-2 border rounded-lg shadow-sm bg-white"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

function ExportButton({ onExport, data, columns, filename }) {
    const { isOpen, toggle, close, dropdownRef } = useDropdown();

    const handleExport = (format) => {
        onExport(format, filename, data, columns);
        close();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggle} className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 flex items-center space-x-2">
                {icons.download}
                <span>Exporteren</span>
                <span className="w-4 h-4">{icons.chevronDown}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl z-20">
                    <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Als CSV</button>
                    <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Als PDF</button>
                </div>
            )}
        </div>
    );
}


function ViewHeader({ title, countText, onAddNew, onImport, onExport, exportData, exportColumns, exportFilename, onSearch, searchTerm, children, hasEditPermissions, viewMode, setViewMode }) {
    return (
        <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm pt-4 pb-4 mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
                  {countText && <p className="text-sm text-gray-500 mt-1">{countText}</p>}
                </div>
                {hasEditPermissions && (
                    <div className="flex space-x-2">
                        {onExport && <ExportButton onExport={onExport} data={exportData} columns={exportColumns} filename={exportFilename} />}
                        {onImport && <button onClick={onImport} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center space-x-2">
                            {icons.upload}
                            <span>Importeren</span>
                        </button>}
                        {onAddNew && <button onClick={onAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 flex items-center space-x-2">
                            {icons.plus}
                            <span>Nieuw</span>
                        </button>}
                    </div>
                )}
            </div>
            <div className="flex gap-4 items-center flex-wrap">
                <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icons.search}</span>
                    <input
                        type="text"
                        placeholder="Zoeken..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full p-2 pl-10 border rounded-lg shadow-sm"
                    />
                </div>
                {setViewMode && <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />}
                {children}
            </div>
        </div>
    );
}

function GenericImportModal({ onClose, onImport, requiredColumns, title, complexFields = {} }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
        }
    };

    const parseCSV = (text) => {
        const rows = text.split(/[\r\n]+/).map(row => row.trim()).filter(row => row);
        if (rows.length < 2) return [];
        const headers = rows.shift().split(',').map(h => h.trim());
        const data = rows.map(row => {
            const values = row.split(',');
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index] ? values[index].trim() : '';
                return obj;
            }, {});
        });
        return data;
    };

    const handleImport = () => {
        if (!file) {
            setError('Selecteer een bestand om te importeren.');
            return;
        }
        setLoading(true);
        setError('');

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target.result;
                let parsedData;

                if (file.name.endsWith('.csv')) {
                    parsedData = parseCSV(text);
                } else if (file.name.endsWith('.json')) {
                    parsedData = JSON.parse(text);
                    if (!Array.isArray(parsedData)) {
                        throw new Error('JSON moet een array van objecten zijn.');
                    }
                } else {
                    throw new Error('Bestandstype niet ondersteund. Gebruik .csv of .json.');
                }

                if (parsedData.length > 0) {
                    const firstRow = parsedData[0];
                    const missingColumns = requiredColumns.filter(col => !(col in firstRow));
                    if (missingColumns.length > 0) {
                        throw new Error(`De volgende kolommen ontbreken: ${missingColumns.join(', ')}`);
                    }
                }

                onImport(parsedData);
                onClose();

            } catch (err) {
                setError(`Importeren mislukt: ${err.message}`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        reader.onerror = () => {
            setError('Fout bij het lezen van het bestand.');
            setLoading(false);
        };

        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">{title} Importeren</h3>
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md text-sm mb-6">
                    <h4 className="font-bold mb-2">Instructies</h4>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Selecteer een lokaal bestand in <strong>.csv</strong> of <strong>.json</strong> formaat.</li>
                        <li>Voor <strong>CSV</strong>: Zorg dat de eerste rij de kolomkoppen bevat en waarden gescheiden zijn door komma's.</li>
                        <li>Voor <strong>JSON</strong>: Zorg dat het bestand een array van objecten bevat, waarbij elk object een item representeert.</li>
                        <li>Zorg dat de data de volgende verplichte velden/kolomkoppen bevat: <strong>{requiredColumns.join(', ')}</strong>.</li>
                        <li>Voor velden met meerdere waarden (zoals `playerIds` of `ownerIds`), scheid de ID's met een puntkomma (`;`).</li>
                        {Object.keys(complexFields).length > 0 && (
                           <li>Voor complexe velden, gebruik een geldige JSON-string:
                               <ul className="list-disc list-inside ml-4 mt-1">
                                  {Object.entries(complexFields).map(([key, example]) => (
                                     <li key={key}><strong>{key}</strong>: <code>{example}</code></li>
                                  ))}
                               </ul>
                           </li>
                        )}
                    </ol>
                </div>
                <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept=".csv,.json"
                    className="w-full p-2 border rounded mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Annuleren</button>
                    <button onClick={handleImport} disabled={loading || !file} className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400">
                        {loading ? 'Importeren...' : 'Importeer'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function SortableTh({ column, sortConfig, requestSort, filters, handleFilterChange, allItems }) {
    const { isOpen, toggle, close, dropdownRef } = useDropdown();
    const isSorted = sortConfig.key === column.key;
    const filterValues = filters && filters[column.key] ? filters[column.key] : [];

    const uniqueValues = useMemo(() => {
        if (!column.filterable) return [];
        const values = new Set();
        const isBooleanColumn = allItems.some(item => typeof item[column.key] === 'boolean');

        if (isBooleanColumn) {
            return ['Ja', 'Nee'];
        }

        allItems.forEach(item => {
            const value = item[column.key];
            if (Array.isArray(value)) {
                value.forEach(v => v && values.add(v));
            } else if (value !== null && value !== undefined && value !== '') {
                values.add(String(value));
            }
        });
        return Array.from(values).sort((a,b) => a.localeCompare(b, undefined, {numeric: true}));
    }, [allItems, column.key, column.filterable]);

    const handleFilterSelect = (value) => {
        if (handleFilterChange) {
            handleFilterChange(column.key, value);
        }
    };

    return (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center justify-between">
                <div 
                    className="flex items-center space-x-1 cursor-pointer group"
                    onClick={() => column.sortable && requestSort(column.key)}
                >
                    <span className="group-hover:text-gray-900">{column.header}</span>
                    {column.sortable && (
                        isSorted ? (
                            <span>{sortConfig.direction === 'ascending' ? icons.sortAsc : icons.sortDesc}</span>
                        ) : (
                           <span className="text-gray-300 group-hover:text-gray-500">{icons.sortAsc}</span>
                        )
                    )}
                </div>
                {column.filterable && uniqueValues.length > 0 && handleFilterChange && (
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={toggle} className={`ml-2 p-1 rounded-full ${filterValues.length > 0 ? 'bg-indigo-200 text-indigo-800' : 'text-gray-400 hover:bg-gray-200'}`}>
                           <div className="w-4 h-4">{icons.filter}</div>
                        </button>
                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-20">
                                <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                                    <label className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                        <input type="checkbox" checked={filterValues.length === 0} onChange={() => handleFilterSelect('all')} className="h-4 w-4 text-indigo-600 border-gray-300"/>
                                        <span className="font-semibold">Alles</span>
                                    </label>
                                    {uniqueValues.map(value => (
                                        <label key={value} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                            <input type="checkbox" checked={filterValues.includes(value)} onChange={() => handleFilterSelect(value)} className="h-4 w-4 text-indigo-600 border-gray-300"/>
                                            <span>{value}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </th>
    );
};

// --- NIEUWE VIEW: Festivalkantoor ---
function FestivalkantoorView({ executions, performances, locations, companies, onUpdateExecution, hasEditPermissions }) {
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const [showPast, setShowPast] = useState(false);
    const [modalInfo, setModalInfo] = useState({ isOpen: false, execution: null, type: '' });

    const allExecutionDates = useMemo(() => {
        const dates = new Set(executions.map(e => e.DateTime.split('T')[0]));
        return Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
    }, [executions]);

    const firstUpcomingDate = useMemo(() => {
        const todayDate = new Date(today);
        todayDate.setHours(0, 0, 0, 0);
        return allExecutionDates.find(date => new Date(date) >= todayDate) || allExecutionDates[0] || '';
    }, [allExecutionDates, today]);

    const [selectedDate, setSelectedDate] = useState(firstUpcomingDate);
    
    useEffect(() => {
        if (firstUpcomingDate && !selectedDate) {
            setSelectedDate(firstUpcomingDate);
        }
    }, [firstUpcomingDate, selectedDate]);

    const displayableDates = useMemo(() => {
        if (showPast) return allExecutionDates;
        const todayDate = new Date(today);
        todayDate.setHours(0, 0, 0, 0);
        return allExecutionDates.filter(date => new Date(date) >= todayDate);
    }, [allExecutionDates, showPast, today]);

    const todaysExecutions = useMemo(() => {
        if (!selectedDate) return [];
        return executions
            .filter(e => e.DateTime.startsWith(selectedDate))
            .map(e => {
                const performance = performances.find(p => p.id === e.performanceId);
                const company = performance ? companies.find(c => c.id === performance.companyId) : null;
                return {
                    ...e,
                    performance: {
                        ...performance,
                        companyName: company ? company.Name : 'Onbekend'
                    },
                    location: locations.find(l => l.id === e.locationId)
                };
            })
            .filter(e => e.performance && e.location)
            .sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));
    }, [selectedDate, executions, performances, locations, companies]);

    const handleOpenModal = (execution, type) => {
        setModalInfo({ isOpen: true, execution, type });
    };

    const handleCloseModal = () => {
        setModalInfo({ isOpen: false, execution: null, type: '' });
    };

    const handleSave = (executionId, data) => {
        onUpdateExecution(executionId, data);
        handleCloseModal();
    };

    const handleExport = () => {
        if (todaysExecutions.length === 0) {
            return;
        }
        const dataToExport = todaysExecutions.map(exec => ({
            'Locatie': exec.location.Name,
            'Maker': exec.performance.companyName,
            'Dag': new Date(exec.DateTime).toLocaleDateString('nl-NL'),
            'Tijd': new Date(exec.DateTime).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
            'PWYC': exec.PWYC || 0,
            'Bezoekersaantallen': exec.BezoekersAantallen || 0,
        }));

        const headers = ['Locatie', 'Maker', 'Dag', 'Tijd', 'PWYC', 'Bezoekersaantallen'];
        const dateString = selectedDate.replace(/-/g, '');
        exportTo('csv', `festivalkantoor_${dateString}`, dataToExport, headers.map(h => ({header: h, key: h})));
    };
    
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return "Geen datum geselecteerd";
        const date = new Date(dateString + 'T12:00:00');
        return date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    return (
        <div>
            <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm pt-4 pb-4 mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Festivalkantoor</h2>
                <div className="flex items-center gap-4 flex-wrap">
                    <select
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="p-2 border rounded-lg shadow-sm bg-white"
                    >
                        {displayableDates.map(date => (
                            <option key={date} value={date}>{formatDateForDisplay(date)}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowPast(!showPast)}
                        className="p-2 border rounded-lg shadow-sm bg-white hover:bg-gray-100"
                    >
                        {showPast ? 'Verleden verbergen' : 'Verleden tonen'}
                    </button>
                    {hasEditPermissions && (
                       <button onClick={handleExport} className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 flex items-center space-x-2">
                           {icons.download}
                           <span>Exporteer Dag</span>
                       </button>
                    )}
                </div>
            </div>

            {todaysExecutions.length > 0 ? (
                <div className="space-y-4">
                    {todaysExecutions.map(exec => (
                        <div key={exec.id} className="bg-white p-4 rounded-lg shadow-md border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-grow">
                                <p className="text-sm text-gray-500">{new Date(exec.DateTime).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })} @ {exec.location.Name}</p>
                                <h3 className="text-xl font-bold text-gray-800">{exec.performance.Title}</h3>
                                <p className="text-md text-indigo-600">{exec.performance.companyName}</p>
                            </div>
                            {hasEditPermissions && (
                                <div className="flex flex-shrink-0 gap-2 flex-wrap">
                                    <button onClick={() => handleOpenModal(exec, 'crowd')} className="bg-yellow-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-yellow-600">Druktemeter</button>
                                    <button onClick={() => handleOpenModal(exec, 'visitors')} className="bg-blue-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-600">Bezoekersaantallen</button>
                                    <button onClick={() => handleOpenModal(exec, 'pwyc')} className="bg-green-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-600">PWYC</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-8">Geen uitvoeringen gevonden voor {formatDateForDisplay(selectedDate)}.</p>
            )}

            {modalInfo.isOpen && (
                <FestivalkantoorEditModal
                    execution={modalInfo.execution}
                    type={modalInfo.type}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}


// --- NIEUW: Modal voor Festivalkantoor ---
function FestivalkantoorEditModal({ execution, type, onClose, onSave }) {
    const config = {
        crowd: { title: 'Druktemeter Aanpassen', label: 'Nieuwe drukte-indicatie (bv. rustig, druk)', inputType: 'text', attribute: 'expectedCrowd' },
        visitors: { title: 'Bezoekersaantallen Invoeren', label: 'Aantal bezoekers', inputType: 'number', attribute: 'BezoekersAantallen' },
        pwyc: { title: 'PWYC Opbrengst Invoeren', label: 'PWYC Bedrag (€)', inputType: 'number', attribute: 'PWYC' }
    };

    const currentConfig = config[type];
    const [value, setValue] = useState(execution[currentConfig.attribute] || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            [currentConfig.attribute]: currentConfig.inputType === 'number' ? Number(value) : value
        };
        onSave(execution.id, dataToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
                <h3 className="text-2xl font-bold mb-4">{currentConfig.title}</h3>
                <p className="text-sm text-gray-600 mb-6">{execution.performance.Title} om {new Date(execution.DateTime).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{currentConfig.label}</label>
                        <input
                            type={currentConfig.inputType}
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className="w-full p-2 border rounded"
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// --- NIEUWE VIEW ---
function VeiligheidView({ veiligheidItems, onDelete, userRole }) {
  const { 
    filteredAndSortedItems, 
    searchTerm, 
    setSearchTerm, 
    sortConfig, 
    requestSort,
    filters,
    handleFilterChange
  } = useSortAndFilter(
      veiligheidItems,
      'Naam',
      ['Naam', 'Telefoonnummer', 'Email', 'Event']
  );

  const columns = [
    { key: 'Naam', header: 'Naam', sortable: true, filterable: true },
    { key: 'Telefoonnummer', header: 'Telefoonnummer', sortable: false, filterable: false },
    { key: 'Email', header: 'Email', sortable: true, filterable: true },
    { key: 'Event', header: 'Wat is er gebeurd?', sortable: false, filterable: false },
    { key: 'Contact', header: 'Mogen we contact opnemen?', sortable: true, filterable: true },
  ];

  const countText = `Toont ${filteredAndSortedItems.length} van ${veiligheidItems.length} meldingen`;

  return (
    <div>
      <ViewHeader
        title="Veiligheidsmeldingen"
        countText={countText}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={userRole === 'editor' || userRole === 'super_admin'}
      />
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => 
                <SortableTh 
                    key={col.key} 
                    column={col} 
                    sortConfig={sortConfig} 
                    requestSort={requestSort}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    allItems={veiligheidItems}
                />
              )}
              {userRole === 'super_admin' && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedItems.length > 0 ? filteredAndSortedItems.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.Naam}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.Telefoonnummer}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.Email}</td>
                <td className="px-6 py-4 whitespace-normal max-w-md">{item.Event}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.Contact ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.Contact ? 'Ja' : 'Nee'}
                  </span>
                </td>
                {userRole === 'super_admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                    </td>
                )}
              </tr>
            )) : (
              <tr><td colSpan={columns.length + (userRole === 'super_admin' ? 1 : 0)} className="text-center py-4">Geen veiligheidsmeldingen gevonden.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContactsView({ contacts, onAdd, onUpdate, onBulkUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [viewMode, setViewMode] = useState('list');
  const [detailContact, setDetailContact] = useState(null);
  
  const nonVolunteers = useMemo(() => 
    contacts.filter(c => (c.Role || '').toLowerCase() !== 'vrijwilliger'),
    [contacts]
  );

  const { 
    filteredAndSortedItems: filteredAndSortedContacts, 
    searchTerm, 
    setSearchTerm, 
    sortConfig, 
    requestSort,
    filters,
    handleFilterChange
  } = useSortAndFilter(nonVolunteers, 'Name', ['Name', 'Email', 'Phone', 'Role', 'functie']);

  const ALL_COLUMNS = useMemo(() => [
    { key: 'Name', header: 'Naam', sortable: true, filterable: true },
    { key: 'Role', header: 'Rol', sortable: true, filterable: true },
    { key: 'functie', header: 'Functie', sortable: true, filterable: true },
    { key: 'yearsActive', header: 'Actieve Jaren', sortable: false, filterable: false },
    { key: 'isCurrentlyEmployed', header: 'Actief?', sortable: true, filterable: true },
    { key: 'Email', header: 'Email', sortable: true, filterable: true },
    { key: 'Phone', header: 'Telefoon', sortable: true, filterable: false },
  ], []);

  const [visibleColumns, setVisibleColumns] = useState(new Set(ALL_COLUMNS.map(c => c.key).filter(k => k !== 'yearsActive')));
  
  const toggleColumn = (key) => {
    setVisibleColumns(prev => {
        const newSet = new Set(prev);
        if (newSet.has(key)) newSet.delete(key);
        else newSet.add(key);
        return newSet;
    });
  };
  
  useEffect(() => {
    setSelectedIds(new Set());
  }, [searchTerm, sortConfig, filters, viewMode]);

  const handleEdit = (contact) => {
    setDetailContact(null);
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
        const allIds = new Set(filteredAndSortedContacts.map(c => c.id));
        setSelectedIds(allIds);
    } else {
        setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (e, id) => {
    const newSelectedIds = new Set(selectedIds);
    if (e.target.checked) newSelectedIds.add(id);
    else newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size > 0) {
      onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleBulkUpdate = (data) => {
    const updates = Array.from(selectedIds).map(id => ({ id, data }));
    onBulkUpdate(updates);
    setIsBulkEditModalOpen(false);
    setSelectedIds(new Set());
  };
  
  const isAllSelected = filteredAndSortedContacts.length > 0 && selectedIds.size === filteredAndSortedContacts.length;
  const countText = `Toont ${filteredAndSortedContacts.length} van ${nonVolunteers.length} contacten (excl. vrijwilligers)`;

  return (
    <div>
      <ViewHeader 
        title="Contacten"
        countText={countText}
        onAddNew={handleAddNew}
        onImport={() => setIsImportModalOpen(true)}
        onExport={exportTo}
        exportData={filteredAndSortedContacts}
        exportColumns={ALL_COLUMNS.filter(c => visibleColumns.has(c.key))}
        exportFilename="contacten"
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <ColumnSelector columns={ALL_COLUMNS} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
      </ViewHeader>

      {selectedIds.size > 0 && hasEditPermissions && (
        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg mb-4 flex items-center justify-between">
            <span className="text-indigo-800 font-semibold">{selectedIds.size} geselecteerd</span>
            <div className="flex space-x-2">
                <button onClick={() => setIsBulkEditModalOpen(true)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 flex items-center space-x-1">
                    {icons.edit} <span>Bulk Bewerken</span>
                </button>
                <button onClick={handleBulkDelete} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center space-x-1">
                    {icons.trash} <span>Verwijderen</span>
                </button>
            </div>
        </div>
      )}

      {viewMode === 'list' && (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      disabled={filteredAndSortedContacts.length === 0}
                    />
                  </th>
                  {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && 
                    <SortableTh 
                        key={col.key} 
                        column={col} 
                        sortConfig={sortConfig} 
                        requestSort={requestSort}
                        filters={filters}
                        handleFilterChange={handleFilterChange}
                        allItems={nonVolunteers}
                    />
                  )}
                  {hasEditPermissions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedContacts.length > 0 ? filteredAndSortedContacts.map(contact => (
                  <tr key={contact.id} className={selectedIds.has(contact.id) ? 'bg-indigo-50' : ''}>
                    <td className="px-4 py-4">
                       <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={selectedIds.has(contact.id)}
                        onChange={(e) => handleSelectOne(e, contact.id)}
                      />
                    </td>
                    {visibleColumns.has('Name') && <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center justify-between group"><span>{contact.Name}</span><CopyToClipboardButton textToCopy={contact.Name} /></div></td>}
                    {visibleColumns.has('Role') && <td className="px-6 py-4 whitespace-nowrap capitalize">{contact.Role}</td>}
                    {visibleColumns.has('functie') && <td className="px-6 py-4 whitespace-nowrap capitalize">{(contact.functie || []).join(', ')}</td>}
                    {visibleColumns.has('yearsActive') && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(contact.yearsActive || []).join(', ')}</td>}
                    {visibleColumns.has('isCurrentlyEmployed') && <td className="px-6 py-4 whitespace-nowrap">{contact.isCurrentlyEmployed ? 'Ja' : 'Nee'}</td>}
                    {visibleColumns.has('Email') && <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center justify-between group"><span>{contact.Email}</span>{contact.Email && <CopyToClipboardButton textToCopy={contact.Email} />}</div></td>}
                    {visibleColumns.has('Phone') && <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center justify-between group"><span>{contact.Phone}</span>{contact.Phone && <CopyToClipboardButton textToCopy={contact.Phone} />}</div></td>}
                    {hasEditPermissions && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleEdit(contact)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                          <button onClick={() => onDelete(contact.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                        </td>
                    )}
                  </tr>
                )) : (
                  <tr><td colSpan={visibleColumns.size + 2 + (hasEditPermissions ? 1 : 0)} className="text-center py-4">Geen contacten gevonden.</td></tr>
                )}
              </tbody>
            </table>
          </div>
      )}
      
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedContacts.map(contact => (
                <div key={contact.id} onClick={() => setDetailContact(contact)} className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 truncate">{contact.Name}</h3>
                        <p className="text-indigo-600 text-sm capitalize">{contact.Role}</p>
                        <p className="text-gray-500 text-sm truncate mt-1">{(contact.functie || []).join(', ')}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 truncate">{contact.Email}</p>
                    </div>
                </div>
            ))}
        </div>
      )}

      {isModalOpen && (
        <ContactForm 
          key={editingContact ? editingContact.id : 'new-contact'}
          contact={editingContact} 
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingContact) {
              onUpdate(editingContact.id, data);
            } else {
              onAdd(data);
            }
            setIsModalOpen(false);
          }}
        />
      )}
      {detailContact && (
        <ContactDetailModal 
            contact={detailContact}
            onClose={() => setDetailContact(null)}
            onEdit={hasEditPermissions ? handleEdit : null}
            onDelete={hasEditPermissions ? () => onDelete(detailContact.id) : null}
        />
      )}
      {isBulkEditModalOpen && (
        <BulkEditContactForm
            onClose={() => setIsBulkEditModalOpen(false)}
            onSave={handleBulkUpdate}
            roles={Array.from(new Set(nonVolunteers.map(c => c.Role).filter(Boolean)))}
        />
      )}
      {isImportModalOpen && (
        <GenericImportModal
            title="Contacten"
            requiredColumns={['Name', 'Role']}
            onClose={() => setIsImportModalOpen(false)}
            onImport={(data) => onBulkAdd(data.map(item => ({
                Name: item.Name || '',
                Role: item.Role || 'artiest',
                Email: item.Email || '',
                Phone: item.Phone || '',
                Adress: item.Adress || '',
                Notes: item.Notes || '',
                isCurrentlyEmployed: item.isCurrentlyEmployed === 'true',
                yearsActive: item.yearsActive ? item.yearsActive.split(';').map(s => s.trim()) : [],
                functie: item.functie ? item.functie.split(';').map(f => f.trim()) : [],
                pronouns: item.pronouns || '',
                shirtSize: item.shirtSize || '',
            })))}
        />
      )}
    </div>
  );
}

function ContactDetailModal({ contact, onClose, onEdit, onDelete }) {
    const DetailItem = ({ label, value }) => (
        <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
            <p className="text-gray-800">{value || <span className="text-gray-400">N.v.t.</span>}</p>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <header className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{contact.Name}</h2>
                        <p className="text-gray-500 capitalize mt-1">{contact.Role}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 -mr-2 -mt-2">{icons.x}</button>
                </header>

                <main className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem label="Email" value={contact.Email} />
                        <DetailItem label="Telefoon" value={contact.Phone} />
                        <DetailItem label="Adres" value={contact.Adress} />
                        <DetailItem label="Functie(s)" value={(contact.functie || []).join(', ')} />
                        {(contact.Role || '').toLowerCase() === 'vrijwilliger' && (
                            <>
                                <DetailItem label="Voornaamwoorden" value={contact.pronouns} />
                                <DetailItem label="Shirtmaat" value={contact.shirtSize} />
                                <DetailItem label="Aangemeld Voor" value={(contact.AangemeldVoor || []).join(', ')} />
                                <DetailItem label="Aanmelding via formulier" value={contact.viaFormulier ? 'Ja' : 'Nee'} />
                            </>
                        )}
                        {(contact.Role || '').toLowerCase() === 'teamlid' && (
                            <DetailItem label="Momenteel Actief" value={contact.isCurrentlyEmployed ? 'Ja' : 'Nee'} />
                        )}
                    </div>
                    <DetailItem label="Actieve Jaren" value={(contact.yearsActive || []).join(', ')} />
                    <DetailItem label="Notities" value={contact.Notes} />
                </main>

                <footer className="p-4 bg-gray-50 border-t flex justify-end items-center">
                    <div className="flex space-x-2">
                        {onDelete && <button onClick={() => onDelete(contact.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2">{icons.trash}<span>Verwijderen</span></button>}
                        {onEdit && <button onClick={() => onEdit(contact)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2">{icons.edit}<span>Bewerken</span></button>}
                    </div>
                </footer>
            </div>
        </div>
    );
}

// --- ContactForm (AANGEPAST) ---
function ContactForm({ contact, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: contact?.Name || '',
    role: contact?.Role || '',
    email: contact?.Email || '',
    phone: contact?.Phone || '',
    address: contact?.Adress || '',
    notes: contact?.Notes || '',
    isCurrentlyEmployed: contact?.isCurrentlyEmployed || false,
    yearsActive: new Set(contact?.yearsActive || []),
    functie: (contact?.functie || []).join(', '),
    pronouns: contact?.pronouns || '',
    shirtSize: contact?.shirtSize || '',
    // Nieuwe velden voor vrijwilligers
    AangemeldVoor: (contact?.AangemeldVoor || []).join(', '),
    viaFormulier: contact?.viaFormulier || false,
  });
  const [showMoreYears, setShowMoreYears] = useState(false);

  const recentYears = [2025, 2024, 2023, 2022];
  const olderYears = [2021, 2020, 2019, 2018, 2017, 2016];

  const handleYearChange = (year) => {
    setFormData(prev => {
        const newYears = new Set(prev.yearsActive);
        if (newYears.has(String(year))) {
            newYears.delete(String(year));
        } else {
            newYears.add(String(year));
        }
        return { ...prev, yearsActive: newYears };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const standardizedRole = formData.role.trim().toLowerCase();
    
    const functieForAppwrite = formData.functie.split(',').map(f => f.trim()).filter(Boolean);
    const aangemeldVoorForAppwrite = formData.AangemeldVoor.split(',').map(a => a.trim()).filter(Boolean);

    const dataForAppwrite = {
        Name: formData.name,
        Role: standardizedRole,
        Email: formData.email,
        Phone: formData.phone,
        Adress: formData.address,
        Notes: formData.notes,
        isCurrentlyEmployed: standardizedRole === 'teamlid' ? formData.isCurrentlyEmployed : false,
        yearsActive: Array.from(formData.yearsActive),
        functie: functieForAppwrite,
        // Velden specifiek voor vrijwilligers
        pronouns: standardizedRole === 'vrijwilliger' ? formData.pronouns : null,
        shirtSize: standardizedRole === 'vrijwilliger' ? formData.shirtSize : null,
        AangemeldVoor: standardizedRole === 'vrijwilliger' ? aangemeldVoorForAppwrite : [],
        viaFormulier: standardizedRole === 'vrijwilliger' ? formData.viaFormulier : false,
    };
    onSave(dataForAppwrite);
  };
  
  const standardizedRole = formData.role.trim().toLowerCase();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{contact?.id ? 'Contact Bewerken' : 'Nieuw Contact'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Volledige naam" className="w-full p-2 border rounded" required />
          <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Rol (bv. artiest, vrijwilliger)" className="w-full p-2 border rounded" required />
          
          {['teamlid', 'artiest', 'vrijwilliger'].includes(standardizedRole) && (
             <input type="text" name="functie" value={formData.functie} onChange={handleChange} placeholder="Functie(s), gescheiden door komma's" className="w-full p-2 border rounded" />
          )}

          {standardizedRole === 'vrijwilliger' && (
            <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50 space-y-4">
                <h4 className="font-semibold text-indigo-800">Vrijwilliger Details</h4>
                <input type="text" name="pronouns" value={formData.pronouns} onChange={handleChange} placeholder="Gewenste voornaamwoorden" className="w-full p-2 border rounded" />
                <select name="shirtSize" value={formData.shirtSize} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Kies shirtmaat...</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                </select>
                <input type="text" name="AangemeldVoor" value={formData.AangemeldVoor} onChange={handleChange} placeholder="Aangemeld voor (taken, gescheiden door komma's)" className="w-full p-2 border rounded" />
                <label className="flex items-center space-x-2">
                    <input type="checkbox" name="viaFormulier" checked={formData.viaFormulier} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                    <span>Aangemeld via formulier?</span>
                </label>
            </div>
          )}

          {standardizedRole === 'teamlid' && (
            <label className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <input type="checkbox" name="isCurrentlyEmployed" checked={formData.isCurrentlyEmployed} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                <span>Momenteel werkzaam voor het festival?</span>
            </label>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actieve Jaren</label>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {recentYears.map(year => (
                    <label key={year} className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.yearsActive.has(String(year))} onChange={() => handleYearChange(year)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        <span>{year}</span>
                    </label>
                ))}
            </div>
            {showMoreYears && (
                 <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                    {olderYears.map(year => (
                        <label key={year} className="flex items-center space-x-2">
                            <input type="checkbox" checked={formData.yearsActive.has(String(year))} onChange={() => handleYearChange(year)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            <span>{year}</span>
                        </label>
                    ))}
                </div>
            )}
            <button type="button" onClick={() => setShowMoreYears(!showMoreYears)} className="text-sm text-indigo-600 hover:underline mt-2">
                {showMoreYears ? 'Minder jaren tonen' : 'Meer jaren tonen'}
            </button>
          </div>

          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mailadres" className="w-full p-2 border rounded" />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefoonnummer" className="w-full p-2 border rounded" />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Adres" className="w-full p-2 border rounded" />
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notities" className="w-full p-2 border rounded h-24"></textarea>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  );
}


function BulkEditContactForm({ onClose, onSave, roles }) {
    const [fieldsToUpdate, setFieldsToUpdate] = useState({});
    const [formData, setFormData] = useState({
        Role: '',
        functie: '',
        isCurrentlyEmployed: false,
        Notes: '',
        Adress: '',
    });

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFieldsToUpdate(prev => ({ ...prev, [name]: checked }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToUpdate = {};
        for (const key in fieldsToUpdate) {
            if (fieldsToUpdate[key]) {
                 if (key === 'functie') {
                    dataToUpdate[key] = formData[key] ? [formData[key]] : [];
                } else {
                    dataToUpdate[key] = formData[key];
                }
            }
        }
        if (Object.keys(dataToUpdate).length > 0) {
            onSave(dataToUpdate);
        }
    };

    const renderField = (name, label, type = 'text', options = {}) => (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <input
                type="checkbox"
                name={name}
                checked={!!fieldsToUpdate[name]}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
            />
            <label className="w-32 font-medium text-gray-700">{label}</label>
            {type === 'select' ? (
                <select name={name} value={formData[name]} onChange={handleInputChange} disabled={!fieldsToUpdate[name]} className="w-full p-2 border rounded disabled:bg-gray-200">
                    <option value="">Kies een {label.toLowerCase()}</option>
                    {options.items.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
            ) : type === 'checkbox_input' ? (
                 <input type="checkbox" name={name} checked={formData[name]} onChange={handleInputChange} disabled={!fieldsToUpdate[name]} className="h-5 w-5 text-indigo-600 border-gray-300 rounded" />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={label}
                    disabled={!fieldsToUpdate[name]}
                    className="w-full p-2 border rounded disabled:bg-gray-200"
                />
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Contacten Bulk Bewerken</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <p className="text-sm text-gray-600 mb-4">Vink de kenmerken aan die je wilt bijwerken voor de geselecteerde contacten. Alleen de aangevinkte velden worden gewijzigd.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {renderField('Role', 'Rol', 'select', { items: roles })}
                    {renderField('functie', 'Functie')}
                    {renderField('isCurrentlyEmployed', 'Actief?', 'checkbox_input')}
                    {renderField('Adress', 'Adres')}
                    {renderField('Notes', 'Notities')}
                    
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Wijzigingen Toepassen</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EventForm({ event, onClose, onSave }) {
  const [formData, setFormData] = useState({
      name: event?.Name || '',
      gage: event?.gage || 0,
      sponsorLogoUrl: event?.sponsorLogoUrl || '',
      mapUrl: event?.mapUrl || '',
      InApp: event?.InApp || false,
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    onSave({ 
        Name: formData.name, 
        gage: String(formData.gage || '0'),
        sponsorLogoUrl: formData.sponsorLogoUrl,
        mapUrl: formData.mapUrl,
        executionIds: event?.executionIds || [],
        InApp: formData.InApp,
    }); 
  };
  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
        <h3 className="text-2xl font-bold mb-6">{event ? 'Event Bewerken' : 'Nieuw Event'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Naam van het event" className="w-full p-2 border rounded" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gage</label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">€</span>
                <input type="text" name="gage" value={formData.gage} onChange={handleChange} placeholder="0.00" className="w-full p-2 pl-7 border rounded" required />
            </div>
          </div>
          <input type="url" name="sponsorLogoUrl" value={formData.sponsorLogoUrl} onChange={handleChange} placeholder="URL Logo Hoofdsponsor" className="w-full p-2 border rounded" />
          <input type="url" name="mapUrl" value={formData.mapUrl} onChange={handleChange} placeholder="URL Kaart" className="w-full p-2 border rounded" />
          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <input type="checkbox" name="InApp" checked={formData.InApp} onChange={handleChange} className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
            <span className="font-medium text-gray-700">Zichtbaar in de app?</span>
          </label>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EventsView({ events, executions, performances, locations, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [manageExecutionsModalInfo, setManageExecutionsModalInfo] = useState({ isOpen: false, event: null });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [viewMode, setViewMode] = useState('list');
  const [detailEvent, setDetailEvent] = useState(null);
  
  const ALL_COLUMNS = useMemo(() => [
    { key: 'Name', header: 'Naam', sortable: true, filterable: true },
    { key: 'gage', header: 'Gage', sortable: true, filterable: true },
    { key: 'executionCount', header: 'Aantal Uitvoeringen', sortable: false, filterable: false },
    { key: 'InApp', header: 'In App', sortable: true, filterable: true },
    { key: 'sponsorLogoUrl', header: 'Sponsor Logo', sortable: false, filterable: false },
    { key: 'mapUrl', header: 'Kaart URL', sortable: false, filterable: false },
  ], []);

  const [visibleColumns, setVisibleColumns] = useState(new Set(['Name', 'gage', 'executionCount', 'InApp']));

  const toggleColumn = (key) => {
    setVisibleColumns(prev => {
        const newSet = new Set(prev);
        if (newSet.has(key)) newSet.delete(key);
        else newSet.add(key);
        return newSet;
    });
  };

  const enrichedEvents = useMemo(() => events.map(e => ({
      ...e,
      executionCount: e.executionIds?.length || 0
  })), [events]);
  
  const { 
    filteredAndSortedItems: filteredEvents, 
    searchTerm, 
    setSearchTerm, 
    sortConfig, 
    requestSort,
    filters,
    handleFilterChange
  } = useSortAndFilter(
      enrichedEvents,
      'Name',
      ['Name', 'gage']
  );

  useEffect(() => {
    setSelectedIds(new Set());
  }, [searchTerm, sortConfig, filters, viewMode]);

  const handleEdit = (event) => {
    setDetailEvent(null);
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(new Set(filteredEvents.map(ev => ev.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectOne = (e, id) => {
    const newSelectedIds = new Set(selectedIds);
    if (e.target.checked) newSelectedIds.add(id);
    else newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size > 0) {
      onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };
  
  const isAllSelected = filteredEvents.length > 0 && selectedIds.size === filteredEvents.length;
  const countText = `Toont ${filteredEvents.length} van ${events.length} events`;

  return (
    <div>
      <ViewHeader
        title="Events"
        countText={countText}
        onAddNew={handleAddNew}
        onImport={() => setIsImportModalOpen(true)}
        onExport={exportTo}
        exportData={filteredEvents}
        exportColumns={ALL_COLUMNS}
        exportFilename="events"
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <ColumnSelector columns={ALL_COLUMNS} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
      </ViewHeader>
      
      {selectedIds.size > 0 && hasEditPermissions && (
        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg mb-4 flex items-center justify-between">
            <span className="text-indigo-800 font-semibold">{selectedIds.size} geselecteerd</span>
            <button onClick={handleBulkDelete} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center space-x-1">
                {icons.trash} <span>Verwijderen</span>
            </button>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={filteredEvents.length === 0}
                  />
                </th>
                {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && 
                  <SortableTh 
                      key={col.key} 
                      column={col} 
                      sortConfig={sortConfig} 
                      requestSort={requestSort}
                      filters={filters}
                      handleFilterChange={handleFilterChange}
                      allItems={enrichedEvents}
                  />
                )}
                {hasEditPermissions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.length > 0 ? filteredEvents.map(event => (
                <tr key={event.id} className={selectedIds.has(event.id) ? 'bg-indigo-50' : ''}>
                  <td className="px-4 py-4">
                     <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={selectedIds.has(event.id)}
                      onChange={(e) => handleSelectOne(e, event.id)}
                    />
                  </td>
                  {visibleColumns.has('Name') && <td className="px-6 py-4 whitespace-nowrap font-medium">{event.Name}</td>}
                  {visibleColumns.has('gage') && <td className="px-6 py-4 whitespace-nowrap">€{event.gage || 0}</td>}
                  {visibleColumns.has('executionCount') && <td className="px-6 py-4 whitespace-nowrap">{event.executionCount}</td>}
                  {visibleColumns.has('InApp') && <td className="px-6 py-4 whitespace-nowrap">
                      <ToggleSwitch
                          checked={event.InApp || false}
                          onChange={(isChecked) => onUpdate(event.id, { InApp: isChecked })}
                          disabled={!hasEditPermissions}
                      />
                  </td>}
                  {visibleColumns.has('sponsorLogoUrl') && <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs">{event.sponsorLogoUrl}</td>}
                  {visibleColumns.has('mapUrl') && <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs">{event.mapUrl}</td>}
                  {hasEditPermissions && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => setManageExecutionsModalInfo({isOpen: true, event: event})} className="text-gray-600 hover:text-indigo-900 mr-4">{icons.calendar}</button>
                        <button onClick={() => handleEdit(event)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                        <button onClick={() => onDelete(event.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                      </td>
                  )}
                </tr>
              )) : (
                <tr><td colSpan={visibleColumns.size + 2 + (hasEditPermissions ? 1 : 0)} className="text-center py-4">Geen events gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
                <div key={event.id} onClick={() => setDetailEvent(event)} className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 truncate">{event.Name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{event.executionCount} uitvoeringen</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-700">Gage: €{event.gage || '0'}</p>
                    </div>
                </div>
            ))}
        </div>
      )}

      {isModalOpen && (
        <EventForm 
          event={editingEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingEvent) {
              onUpdate(editingEvent.id, data);
            } else {
              onAdd(data);
            }
            setIsModalOpen(false);
          }}
        />
      )}
      {detailEvent && (
        <EventDetailModal 
            event={detailEvent}
            executions={executions}
            performances={performances}
            locations={locations}
            onClose={() => setDetailEvent(null)}
            onEdit={hasEditPermissions ? handleEdit : null}
            onDelete={hasEditPermissions ? () => onDelete(detailEvent.id) : null}
        />
      )}
      {isImportModalOpen && (
        <GenericImportModal
            title="Events"
            requiredColumns={['Name', 'gage']}
            onClose={() => setIsImportModalOpen(false)}
            onImport={(data) => onBulkAdd(data.map(item => ({
                Name: item.Name || '',
                executionIds: item.executionIds ? item.executionIds.split(';').map(s => s.trim()) : [],
                gage: String(item.gage || '0'),
                sponsorLogoUrl: item.sponsorLogoUrl || '',
                mapUrl: item.mapUrl || '',
                InApp: item.InApp === 'true',
            })))}
        />
      )}
      {manageExecutionsModalInfo.isOpen && (
        <ManageExecutionsForEventModal
            event={manageExecutionsModalInfo.event}
            allExecutions={executions}
            allPerformances={performances}
            allLocations={locations}
            onClose={() => setManageExecutionsModalInfo({ isOpen: false, event: null })}
            onUpdateEvent={onUpdate}
        />
      )}
    </div>
  );
}

function EventDetailModal({ event, executions, performances, locations, onClose, onEdit, onDelete }) {
    const DetailItem = ({ label, value, children }) => (
        <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
            {children ? <div className="text-gray-800 mt-1">{children}</div> : <p className="text-gray-800">{value || <span className="text-gray-400">N.v.t.</span>}</p>}
        </div>
    );
    
    const eventExecutions = useMemo(() => {
        return (event.executionIds || [])
            .map(id => executions.find(e => e.id === id))
            .filter(Boolean)
            .map(exec => ({
                ...exec,
                performanceTitle: performances.find(p => p.id === exec.performanceId)?.Title || 'Onbekend',
                locationName: locations.find(l => l.id === exec.locationId)?.Name || 'Onbekend',
            }))
            .sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));
    }, [event, executions, performances, locations]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <header className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{event.Name}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 -mr-2 -mt-2">{icons.x}</button>
                </header>

                <main className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem label="Gage" value={`€${event.gage || 0}`} />
                        <DetailItem label="Sponsor Logo URL" value={event.sponsorLogoUrl} />
                        <DetailItem label="Kaart URL" value={event.mapUrl} />
                        <DetailItem label="In App Zichtbaar" value={event.InApp ? 'Ja' : 'Nee'} />
                    </div>
                    <DetailItem label="Gekoppelde Uitvoeringen">
                        {eventExecutions.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                                {eventExecutions.map(exec => (
                                    <li key={exec.id}>{exec.performanceTitle} @ {exec.locationName} ({new Date(exec.DateTime).toLocaleString('nl-NL')})</li>
                                ))}
                            </ul>
                        ) : <p className="text-gray-400">Geen uitvoeringen gekoppeld.</p>}
                    </DetailItem>
                </main>

                <footer className="p-4 bg-gray-50 border-t flex justify-end items-center">
                    <div className="flex space-x-2">
                        {onDelete && <button onClick={() => onDelete(event.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{icons.trash}<span>Verwijderen</span></button>}
                        {onEdit && <button onClick={() => onEdit(event)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{icons.edit}<span>Bewerken</span></button>}
                    </div>
                </footer>
            </div>
        </div>
    );
}

function ManageExecutionsForEventModal({ event, allExecutions, allPerformances, allLocations, onClose, onUpdateEvent }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExecutionIds, setSelectedExecutionIds] = useState(() => new Set(event.executionIds || []));
    const [isSaving, setIsSaving] = useState(false);

    const formatDateTime = (isoString) => {
      if (!isoString) return 'N.v.t.';
      const date = new Date(isoString);
      return date.toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' });
    };

    const enrichedExecutions = useMemo(() => {
        return allExecutions
            .map(exec => ({
                ...exec,
                performance: allPerformances.find(p => p.id === exec.performanceId),
                location: allLocations.find(l => l.id === exec.locationId)
            }))
            .filter(exec => exec.performance && exec.location)
            .filter(exec => 
                exec.performance.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exec.location.Name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a,b) => new Date(a.DateTime) - new Date(b.DateTime));
    }, [allExecutions, allPerformances, allLocations, searchTerm]);

    const handleToggleExecution = (executionId) => {
        const newSelectedIds = new Set(selectedExecutionIds);
        if (newSelectedIds.has(executionId)) {
            newSelectedIds.delete(executionId);
        } else {
            newSelectedIds.add(executionId);
        }
        setSelectedExecutionIds(newSelectedIds);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdateEvent(event.id, { executionIds: Array.from(selectedExecutionIds) });
        } catch (e) {
            console.error("Fout bij bijwerken uitvoeringen:", e);
        } finally {
            setIsSaving(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-3xl shadow-xl flex flex-col" style={{maxHeight: '90vh'}}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Uitvoeringen beheren voor "{event.Name}"</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                
                <div className="relative mb-4">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icons.search}</span>
                    <input
                        type="text"
                        placeholder="Zoek uitvoering op titel of locatie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border rounded-lg"
                    />
                </div>

                <div className="flex-grow overflow-y-auto border rounded-lg p-2 space-y-2">
                    {enrichedExecutions.length > 0 ? enrichedExecutions.map(exec => (
                        <label key={exec.id} className="flex items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={selectedExecutionIds.has(exec.id)}
                                onChange={() => handleToggleExecution(exec.id)}
                                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <div className="ml-3 flex-grow grid grid-cols-3 gap-2">
                                <span className="font-semibold text-gray-800">{exec.performance.Title}</span>
                                <span className="text-gray-600">{exec.location.Name}</span>
                                <span className="text-gray-500">{formatDateTime(exec.DateTime)}</span>
                            </div>
                        </label>
                    )) : <p className="text-center text-gray-500 p-4">Geen uitvoeringen gevonden.</p>}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Annuleren</button>
                    <button type="button" onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">
                        {isSaving ? 'Opslaan...' : 'Opslaan'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- NIEUWE MARKETING VIEW ---
function MarketingView({ marketingItems, performances, companies, executions, onAdd, onUpdate, onDelete, hasEditPermissions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [detailItem, setDetailItem] = useState(null);

    const enrichedMarketingItems = useMemo(() => {
        return marketingItems.map(item => {
            const performance = performances.find(p => p.id === item.PerformanceId);
            const company = performance ? companies.find(c => c.id === performance.companyId) : null;
            return {
                ...item,
                performanceName: performance?.Title || 'N.v.t.',
                companyName: company?.Name || 'N.v.t.',
            };
        });
    }, [marketingItems, performances, companies]);

    const { 
        filteredAndSortedItems, 
        searchTerm, 
        setSearchTerm, 
        sortConfig, 
        requestSort,
        filters,
        handleFilterChange
    } = useSortAndFilter(enrichedMarketingItems, 'performanceName', ['performanceName', 'companyName']);

    const columns = [
        { key: 'performanceName', header: 'Naam Voorstelling', sortable: true, filterable: true },
        { key: 'companyName', header: 'Gezelschap', sortable: true, filterable: true },
        { key: 'VoorstellingstekstNL', header: 'Tekst NL (kort)', sortable: false, filterable: false },
        { key: 'Keywords', header: 'Keywords', sortable: false, filterable: false },
    ];

    const handleEdit = (item) => {
        setDetailItem(null);
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const countText = `Toont ${filteredAndSortedItems.length} van ${marketingItems.length} marketing items.`;

    return (
        <div>
            <ViewHeader
                title="Marketing"
                countText={countText}
                onAddNew={hasEditPermissions ? handleAddNew : null}
                onSearch={setSearchTerm}
                searchTerm={searchTerm}
                hasEditPermissions={hasEditPermissions}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />
            
            {viewMode === 'list' && (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map(col => 
                                    <SortableTh 
                                        key={col.key} 
                                        column={col} 
                                        sortConfig={sortConfig} 
                                        requestSort={requestSort}
                                        filters={filters}
                                        handleFilterChange={handleFilterChange}
                                        allItems={enrichedMarketingItems}
                                    />
                                )}
                                {hasEditPermissions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedItems.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.performanceName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.companyName}</td>
                                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{item.VoorstellingstekstNL}</td>
                                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{(item.Keywords || []).join(', ')}</td>
                                    {hasEditPermissions && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => handleEdit(item)} title="Bewerken" className="text-indigo-600 hover:text-indigo-900 p-1">{icons.edit}</button>
                                            <button onClick={() => onDelete(item.id)} title="Verwijderen" className="text-red-600 hover:text-red-900 p-1">{icons.trash}</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {viewMode === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedItems.map(item => (
                        <div key={item.id} onClick={() => setDetailItem(item)} className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 truncate">{item.performanceName}</h3>
                                <p className="text-indigo-500 text-sm truncate">{item.companyName}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 truncate">Keywords: {(item.Keywords || []).join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && hasEditPermissions && (
                <MarketingForm
                    item={editingItem}
                    performances={performances}
                    companies={companies}
                    executions={executions}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(data) => {
                        if (editingItem) onUpdate(editingItem.id, data);
                        else onAdd(data);
                        setIsModalOpen(false);
                    }}
                />
            )}
            {detailItem && (
                <MarketingDetailModal 
                    item={detailItem}
                    onClose={() => setDetailItem(null)}
                    onEdit={hasEditPermissions ? handleEdit : null}
                    onDelete={hasEditPermissions ? () => onDelete(detailItem.id) : null}
                />
            )}
        </div>
    );
}

function MarketingDetailModal({ item, onClose, onEdit, onDelete }) {
    const DetailItem = ({ label, value, isText = false }) => (
        <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
            {isText ? (
                <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-2 rounded-md mt-1">{value || <span className="text-gray-400">N.v.t.</span>}</p>
            ) : (
                <p className="text-gray-800">{value || <span className="text-gray-400">N.v.t.</span>}</p>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                <header className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{item.performanceName}</h2>
                        <p className="text-gray-500 mt-1">{item.companyName}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 -mr-2 -mt-2">{icons.x}</button>
                </header>

                <main className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailItem label="Voorstellingstekst NL" value={item.VoorstellingstekstNL} isText={true} />
                        <DetailItem label="Voorstellingstekst EN" value={item.VoorstellingstekstENG} isText={true} />
                        <DetailItem label="Bio NL" value={item.BioNL} isText={true} />
                        <DetailItem label="Bio EN" value={item.BioENG} isText={true} />
                    </div>
                    <DetailItem label="Keywords" value={(item.Keywords || []).join(', ')} />
                    <DetailItem label="Credits" value={item.Credits} isText={true} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailItem label="Afbeelding 1 URL" value={item.Afbeelding1} />
                        <DetailItem label="Afbeelding 2 URL" value={item.Afbeelding2} />
                    </div>
                </main>

                <footer className="p-4 bg-gray-50 border-t flex justify-end items-center space-x-2">
                    {onDelete && <button onClick={() => onDelete(item.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{icons.trash}<span> Verwijderen</span></button>}
                    {onEdit && <button onClick={() => onEdit(item)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{icons.edit}<span> Bewerken</span></button>}
                </footer>
            </div>
        </div>
    );
}

function MarketingForm({ item, performances, companies, executions, onClose, onSave }) {
    const [formData, setFormData] = useState({
        PerformanceId: item?.PerformanceId || '',
        VoorstellingstekstNL: item?.VoorstellingstekstNL || '',
        VoorstellingstekstENG: item?.VoorstellingstekstENG || '',
        BioNL: item?.BioNL || '',
        BioENG: item?.BioENG || '',
        Keywords: item?.Keywords || [''],
        Credits: item?.Credits || '',
        Afbeelding1: item?.Afbeelding1 || '',
        Afbeelding2: item?.Afbeelding2 || '',
    });
    const [companyName, setCompanyName] = useState('');

    const futurePerformances = useMemo(() => {
        const now = new Date();
        const futureExecutionPerfIds = new Set(
            executions
                .filter(e => new Date(e.DateTime) > now)
                .map(e => e.performanceId)
        );
        return performances
            .filter(p => futureExecutionPerfIds.has(p.id))
            .sort((a,b) => a.Title.localeCompare(b.Title));
    }, [executions, performances]);

    useEffect(() => {
        if (formData.PerformanceId) {
            const performance = performances.find(p => p.id === formData.PerformanceId);
            const company = performance ? companies.find(c => c.id === performance.companyId) : null;
            setCompanyName(company?.Name || 'Gezelschap niet gevonden');
        } else {
            setCompanyName('');
        }
    }, [formData.PerformanceId, performances, companies]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleKeywordChange = (index, value) => {
        const newKeywords = [...formData.Keywords];
        newKeywords[index] = value;
        setFormData(prev => ({ ...prev, Keywords: newKeywords }));
    };

    const addKeyword = () => {
        setFormData(prev => ({ ...prev, Keywords: [...prev.Keywords, ''] }));
    };

    const removeKeyword = (index) => {
        setFormData(prev => ({ ...prev, Keywords: prev.Keywords.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            Keywords: formData.Keywords.filter(k => k.trim() !== ''), // Verwijder lege keywords
        };
        onSave(dataToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-3xl shadow-xl max-h-full overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6">{item ? 'Marketing Info Bewerken' : 'Nieuwe Marketing Info'}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Naam voorstelling</label>
                        <select name="PerformanceId" value={formData.PerformanceId} onChange={handleChange} className="w-full p-2 border rounded" required>
                            <option value="">Selecteer een voorstelling</option>
                            {futurePerformances.map(p => <option key={p.id} value={p.id}>{p.Title}</option>)}
                        </select>
                    </div>
                    {companyName && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gezelschap</label>
                            <p className="mt-1 p-2 bg-gray-100 rounded-md">{companyName}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Voorstellingstekst Nederlands</label>
                            <textarea name="VoorstellingstekstNL" value={formData.VoorstellingstekstNL} onChange={handleChange} maxLength="1000" placeholder="Max 1000 tekens" className="w-full p-2 border rounded h-32"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Voorstellingstekst Engels</label>
                            <textarea name="VoorstellingstekstENG" value={formData.VoorstellingstekstENG} onChange={handleChange} maxLength="1000" placeholder="Max 1000 characters" className="w-full p-2 border rounded h-32"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio Nederlands</label>
                            <textarea name="BioNL" value={formData.BioNL} onChange={handleChange} maxLength="1000" placeholder="Max 1000 tekens" className="w-full p-2 border rounded h-32"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio Engels</label>
                            <textarea name="BioENG" value={formData.BioENG} onChange={handleChange} maxLength="1000" placeholder="Max 1000 characters" className="w-full p-2 border rounded h-32"></textarea>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                        <div className="space-y-2">
                            {formData.Keywords.map((keyword, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input type="text" value={keyword} onChange={(e) => handleKeywordChange(index, e.target.value)} placeholder={`Keyword ${index + 1}`} className="w-full p-2 border rounded" />
                                    <button type="button" onClick={() => removeKeyword(index)} className="text-red-500 p-2">{icons.trash}</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addKeyword} className="mt-2 text-sm text-indigo-600 hover:underline">{icons.plus} Keyword toevoegen</button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                        <textarea name="Credits" value={formData.Credits} onChange={handleChange} maxLength="500" placeholder="Max 500 tekens" className="w-full p-2 border rounded h-24"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Afbeelding 1 URL</label>
                            <input type="url" name="Afbeelding1" value={formData.Afbeelding1} onChange={handleChange} placeholder="https://..." className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Afbeelding 2 URL</label>
                            <input type="url" name="Afbeelding2" value={formData.Afbeelding2} onChange={handleChange} placeholder="https://..." className="w-full p-2 border rounded" />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function HospitalityModal({ company, onClose }) {
    if (!company) return null;

    const renderList = (items) => {
        if (!items || items.length === 0) return <span className="text-gray-500">N.v.t.</span>;
        return (
            <ul className="list-disc list-inside">
                {items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        );
    };

    const details = [
        { label: "Aantal personen makersdag", value: company.AantalPersonenMakersdag || '0' },
        { label: "Namen personen makersdag", value: renderList(company.NamenMakersdag) },
        { label: "Aantal personen kick-off (ochtend)", value: company.AantalPersonenOchtendKickOff || '0' },
        { label: "Namen kick-off (ochtend)", value: renderList(company.NamenOchtendKickOff) },
        { label: "Aantal personen kick-off (middag)", value: company.AantalPersonenMiddagKickOff || '0' },
        { label: "Namen kick-off (middag)", value: renderList(company.NamenMiddagKickOff) },
        { label: "Aantal personen overnachting", value: company.OvernachtingPersonen || '0' },
        { label: "Namen overnachting", value: renderList(company.NamenOvernachting) },
        { label: "Namen catering", value: renderList(company.NamenCatering) },
        { label: "Dieetwensen", value: company.DieetWensen || <span className="text-gray-500">Geen</span> },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-full overflow-y-auto">
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold mb-6">Hospitality & Makersdagen: {company.Name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <dl className="space-y-4">
                    {details.map(({ label, value }) => (
                        <div key={label} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <dt className="font-semibold text-gray-600">{label}</dt>
                            <dd className="md:col-span-2 text-gray-800">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}

function TechniqueModal({ company, onClose }) {
    if (!company) return null;

    const wishes = company.Techniek || [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold mb-6">Techniekwensen: {company.Name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                {wishes.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {wishes.map((wish, index) => (
                            <span key={index} className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full">
                                {wish}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Geen specifieke techniekwensen opgegeven.</p>
                )}
            </div>
        </div>
    );
}


function CompaniesView({ companies, artists, performances, executions, events, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions, onQuickView }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [hospitalityModalCompany, setHospitalityModalCompany] = useState(null);
    const [techniqueModalCompany, setTechniqueModalCompany] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [detailCompany, setDetailCompany] = useState(null);

    const companiesWithDetails = useMemo(() => {
        return companies.map(comp => {
            const contactPerson = artists.find(a => a.id === comp.contactPersonId);
            const players = (comp.playerIds || []).map(id => artists.find(a => a.id === id)).filter(Boolean);
            
            const companyPerformances = performances.filter(p => p.companyId === comp.id);
            const companyPerformanceIds = new Set(companyPerformances.map(p => p.id));
            
            const companyExecutions = executions.filter(exec => companyPerformanceIds.has(exec.performanceId));
            const companyExecutionIds = new Set(companyExecutions.map(exec => exec.id));

            const companyEvents = events.filter(event => (event.executionIds || []).some(execId => companyExecutionIds.has(execId)));
            const eventNames = companyEvents.map(e => e.Name).join(', ');

            return { 
              ...comp, 
              contactPerson, 
              players, 
              contactPersonName: contactPerson?.Name || '',
              edities: eventNames || 'N.v.t.'
            };
        });
    }, [companies, artists, performances, executions, events]);

    const { 
        filteredAndSortedItems, 
        searchTerm, 
        setSearchTerm, 
        sortConfig, 
        requestSort,
        filters,
        handleFilterChange
    } = useSortAndFilter(
        companiesWithDetails,
        'Name',
        ['Name', 'contactPersonName', 'Description', 'edities']
    );

    const columns = [
        { key: 'Name', header: 'Naam', sortable: true, filterable: true },
        { key: 'contactPersonName', header: 'Contactpersoon', sortable: true, filterable: true },
        { key: 'players', header: 'Spelers', sortable: false, filterable: false },
        { key: 'edities', header: 'Edities', sortable: true, filterable: true },
        { key: 'Description', header: 'Beschrijving', sortable: false, filterable: false },
    ];

    const handleEdit = (company) => {
        setDetailCompany(null);
        setEditingCompany(company);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCompany(null);
        setIsModalOpen(true);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(filteredAndSortedItems.map(c => c.id)));
        } else {
            setSelectedIds(new Set());
        }
    };
    
    const handleSelectOne = (e, id) => {
        const newSelectedIds = new Set(selectedIds);
        if (e.target.checked) newSelectedIds.add(id);
        else newSelectedIds.delete(id);
        setSelectedIds(newSelectedIds);
    };

    const handleBulkDelete = () => {
        if (selectedIds.size > 0) {
          onBulkDelete(Array.from(selectedIds));
          setSelectedIds(new Set());
        }
    };
    
    const handleImport = (data) => {
        const formattedData = data.map(item => ({
            ...item,
            playerIds: item.playerIds ? item.playerIds.split(';').map(id => id.trim()) : [],
        }));
        onBulkAdd(formattedData);
    };

    const countText = `Toont ${filteredAndSortedItems.length} van ${companies.length} gezelschappen.`;
    const isAllSelected = filteredAndSortedItems.length > 0 && selectedIds.size === filteredAndSortedItems.length;

    return (
        <div>
            <ViewHeader
                title="Gezelschappen"
                countText={countText}
                onAddNew={handleAddNew}
                onImport={() => setIsImportModalOpen(true)}
                onExport={exportTo}
                exportData={filteredAndSortedItems}
                exportColumns={columns}
                exportFilename="gezelschappen"
                onSearch={setSearchTerm}
                searchTerm={searchTerm}
                hasEditPermissions={hasEditPermissions}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />
            {selectedIds.size > 0 && hasEditPermissions && (
                <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg mb-4 flex items-center justify-between">
                    <span className="text-indigo-800 font-semibold">{selectedIds.size} geselecteerd</span>
                    <button onClick={handleBulkDelete} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center space-x-1">
                        {icons.trash} <span>Verwijderen</span>
                    </button>
                </div>
            )}
            
            {viewMode === 'list' && (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">
                                    <input type="checkbox" 
                                        onChange={handleSelectAll} 
                                        checked={isAllSelected}
                                        disabled={filteredAndSortedItems.length === 0}
                                    />
                                </th>
                                {columns.map(col => 
                                    <SortableTh 
                                        key={col.key} 
                                        column={col} 
                                        sortConfig={sortConfig} 
                                        requestSort={requestSort}
                                        filters={filters}
                                        handleFilterChange={handleFilterChange}
                                        allItems={companiesWithDetails}
                                    />
                                )}
                                {hasEditPermissions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedItems.map(company => (
                                <tr key={company.id} className={selectedIds.has(company.id) ? 'bg-indigo-50' : ''}>
                                    <td className="px-6 py-4">
                                        <input type="checkbox" 
                                            checked={selectedIds.has(company.id)} 
                                            onChange={(e) => handleSelectOne(e, company.id)} 
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{company.Name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {company.contactPerson ? (
                                            <button onClick={() => onQuickView({ item: company.contactPerson, type: 'contact' })} className="text-indigo-600 hover:underline">{company.contactPerson.Name}</button>
                                        ) : 'N.v.t.'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{company.players.length}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{company.edities}</td>
                                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{company.Description}</td>
                                    {hasEditPermissions && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => setHospitalityModalCompany(company)} title="Hospitality" className="text-green-600 hover:text-green-900 p-1">{icons.users}</button>
                                            <button onClick={() => setTechniqueModalCompany(company)} title="Techniek" className="text-blue-600 hover:text-blue-900 p-1">{icons.settings}</button>
                                            <button onClick={() => handleEdit(company)} title="Bewerken" className="text-indigo-600 hover:text-indigo-900 p-1">{icons.edit}</button>
                                            <button onClick={() => onDelete(company.id)} title="Verwijderen" className="text-red-600 hover:text-red-900 p-1">{icons.trash}</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {viewMode === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedItems.map(company => (
                        <div key={company.id} onClick={() => setDetailCompany(company)} className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 truncate">{company.Name}</h3>
                                <p className="text-gray-500 text-sm truncate mt-1">{company.Description}</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500">Contact: {company.contactPersonName || 'N.v.t.'}</p>
                                <p className="text-xs text-gray-500">{company.players.length} spelers</p>
                                <p className="text-xs text-gray-500 truncate">Edities: {company.edities}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <CompanyForm
                    company={editingCompany}
                    artists={artists}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(data) => {
                        if (editingCompany) onUpdate(editingCompany.id, data);
                        else onAdd(data);
                        setIsModalOpen(false);
                    }}
                />
            )}
            {detailCompany && (
                <CompanyDetailModal 
                    company={detailCompany}
                    artists={artists}
                    onClose={() => setDetailCompany(null)}
                    onEdit={hasEditPermissions ? handleEdit : null}
                    onDelete={hasEditPermissions ? () => onDelete(detailCompany.id) : null}
                />
            )}
            {isImportModalOpen && (
                <GenericImportModal 
                    onClose={() => setIsImportModalOpen(false)}
                    onImport={handleImport}
                    requiredColumns={['Name']}
                    title="Gezelschappen"
                />
            )}
            {hospitalityModalCompany && <HospitalityModal company={hospitalityModalCompany} onClose={() => setHospitalityModalCompany(null)} />}
            {techniqueModalCompany && <TechniqueModal company={techniqueModalCompany} onClose={() => setTechniqueModalCompany(null)} />}
        </div>
    );
}

function CompanyDetailModal({ company, artists, onClose, onEdit, onDelete }) {
    const DetailItem = ({ label, value, children }) => (
        <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
            {children ? <div className="text-gray-800 mt-1">{children}</div> : <p className="text-gray-800">{value || <span className="text-gray-400">N.v.t.</span>}</p>}
        </div>
    );

    const contactPerson = artists.find(a => a.id === company.contactPersonId);
    const players = (company.playerIds || []).map(id => artists.find(a => a.id === id)).filter(Boolean);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <header className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{company.Name}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 -mr-2 -mt-2">{icons.x}</button>
                </header>

                <main className="p-6 overflow-y-auto space-y-6">
                    <DetailItem label="Beschrijving" value={company.Description} />
                    <DetailItem label="Contactpersoon" value={contactPerson?.Name} />
                    <DetailItem label="Edities" value={company.edities} />
                    <DetailItem label="Spelers">
                        {players.length > 0 ? (
                            <ul className="list-disc list-inside">
                                {players.map(p => <li key={p.id}>{p.Name}</li>)}
                            </ul>
                        ) : <p className="text-gray-400">Geen spelers gekoppeld.</p>}
                    </DetailItem>
                </main>

                <footer className="p-4 bg-gray-50 border-t flex justify-end items-center">
                    <div className="flex space-x-2">
                        {onDelete && <button onClick={() => onDelete(company.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{icons.trash}<span>Verwijderen</span></button>}
                        {onEdit && <button onClick={() => onEdit(company)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{icons.edit}<span>Bewerken</span></button>}
                    </div>
                </footer>
            </div>
        </div>
    );
}

function CompanyForm({ company, artists, onClose, onSave }) {
    const [formData, setFormData] = useState({
        Name: company?.Name || '',
        Description: company?.Description || '',
        contactPersonId: company?.contactPersonId || '',
        playerIds: company?.playerIds || [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlayerChange = (playerId) => {
        setFormData(prev => {
            const newPlayerIds = prev.playerIds.includes(playerId)
                ? prev.playerIds.filter(id => id !== playerId)
                : [...prev.playerIds, playerId];
            return { ...prev, playerIds: newPlayerIds };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const sortedArtists = useMemo(() => [...artists].sort((a,b) => a.Name.localeCompare(b.Name)), [artists]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-full overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6">{company ? 'Gezelschap Bewerken' : 'Nieuw Gezelschap'}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="text" name="Name" value={formData.Name} onChange={handleChange} placeholder="Naam van het gezelschap" className="w-full p-2 border rounded" required />
                    <textarea name="Description" value={formData.Description} onChange={handleChange} placeholder="Korte beschrijving" className="w-full p-2 border rounded h-24"></textarea>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contactpersoon</label>
                        <select name="contactPersonId" value={formData.contactPersonId} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Selecteer een contactpersoon</option>
                            {sortedArtists.map(artist => <option key={artist.id} value={artist.id}>{artist.Name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selecteer Spelers</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border rounded-lg p-4 max-h-60 overflow-y-auto">
                            {sortedArtists.map(artist => (
                                <label key={artist.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                                    <input type="checkbox" checked={formData.playerIds.includes(artist.id)} onChange={() => handlePlayerChange(artist.id)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                    <span>{artist.Name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function PerformancesView({ performances, companies, executions, events, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions, onQuickView }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingPerformance, setEditingPerformance] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [viewMode, setViewMode] = useState('list');
  const [detailPerformance, setDetailPerformance] = useState(null);
  
  const enrichedPerformances = useMemo(() => performances.map(p => {
      const performanceExecutions = executions.filter(exec => exec.performanceId === p.id);
      const executionIds = new Set(performanceExecutions.map(exec => exec.id));
      const performanceEvents = events.filter(event => (event.executionIds || []).some(execId => executionIds.has(execId)));
      const eventNames = performanceEvents.map(e => e.Name).join(', ');

      return {
          ...p,
          companyName: (companies.find(c => c.id === p.companyId) || {}).Name || '',
          company: companies.find(c => c.id === p.companyId) || null,
          edities: eventNames || 'N.v.t.'
      };
  }), [performances, companies, executions, events]);
  
  const { 
    filteredAndSortedItems: filteredPerformances, 
    searchTerm, 
    setSearchTerm, 
    sortConfig, 
    requestSort,
    filters,
    handleFilterChange
  } = useSortAndFilter(enrichedPerformances, 'Title', ['Title', 'companyName', 'genre', 'edities']);

  const ALL_COLUMNS = useMemo(() => [
    { key: 'Title', header: 'Titel', sortable: true, filterable: true },
    { key: 'companyName', header: 'Gezelschap', sortable: true, filterable: true },
    { key: 'edities', header: 'Edities', sortable: true, filterable: true },
    { key: 'genre', header: 'Genre', sortable: true, filterable: true },
    { key: 'isDutchLanguage', header: 'NL', sortable: true, filterable: true },
    { key: 'isEnglishLanguage', header: 'EN', sortable: true, filterable: true },
    { key: 'isDialogueFree', header: 'Taalloos', sortable: true, filterable: true },
    { key: 'isChildFriendly', header: 'Kindvriendelijk', sortable: true, filterable: true },
  ], []);

  const [visibleColumns, setVisibleColumns] = useState(new Set(['Title', 'companyName', 'edities', 'genre']));

  const toggleColumn = (key) => {
    setVisibleColumns(prev => {
        const newSet = new Set(prev);
        if (newSet.has(key)) newSet.delete(key);
        else newSet.add(key);
        return newSet;
    });
  };

  useEffect(() => {
    setSelectedIds(new Set());
  }, [searchTerm, sortConfig, filters, viewMode]);

  const handleEdit = (performance) => {
    setDetailPerformance(null);
    setEditingPerformance(performance);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingPerformance(null);
    setIsModalOpen(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(new Set(filteredPerformances.map(p => p.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectOne = (e, id) => {
    const newSelectedIds = new Set(selectedIds);
    if (e.target.checked) newSelectedIds.add(id);
    else newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size > 0) {
      onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };
  
  const isAllSelected = filteredPerformances.length > 0 && selectedIds.size === filteredPerformances.length;
  const countText = `Toont ${filteredPerformances.length} van ${performances.length} voorstellingen`;
  
  return (
    <div>
      <ViewHeader
        title="Voorstellingen"
        countText={countText}
        onAddNew={handleAddNew}
        onImport={() => setIsImportModalOpen(true)}
        onExport={exportTo}
        exportData={filteredPerformances}
        exportColumns={ALL_COLUMNS.filter(c => visibleColumns.has(c.key))}
        exportFilename="voorstellingen"
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <ColumnSelector columns={ALL_COLUMNS} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
      </ViewHeader>
      
      {selectedIds.size > 0 && hasEditPermissions && (
        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg mb-4 flex items-center justify-between">
            <span className="text-indigo-800 font-semibold">{selectedIds.size} geselecteerd</span>
            <button onClick={handleBulkDelete} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center space-x-1">
                {icons.trash} <span>Verwijderen</span>
            </button>
        </div>
      )}

      {viewMode === 'list' && (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      disabled={filteredPerformances.length === 0}
                    />
                  </th>
                  {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && 
                    <SortableTh 
                        key={col.key} 
                        column={col} 
                        sortConfig={sortConfig} 
                        requestSort={requestSort}
                        filters={filters}
                        handleFilterChange={handleFilterChange}
                        allItems={enrichedPerformances}
                    />
                  )}
                  {hasEditPermissions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPerformances.length > 0 ? filteredPerformances.map(p => (
                      <tr key={p.id} className={selectedIds.has(p.id) ? 'bg-indigo-50' : ''}>
                        <td className="px-4 py-4">
                           <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            checked={selectedIds.has(p.id)}
                            onChange={(e) => handleSelectOne(e, p.id)}
                          />
                        </td>
                        {visibleColumns.has('Title') && <td className="px-6 py-4 whitespace-nowrap font-medium">{p.Title}</td>}
                        {visibleColumns.has('companyName') && <td className="px-6 py-4 whitespace-nowrap">
                            {p.company ? (
                                <button onClick={() => onQuickView({ item: p.company, type: 'company' })} className="text-indigo-600 hover:underline">
                                    {p.company.Name}
                                </button>
                            ) : 'N.v.t.'}
                        </td>}
                        {visibleColumns.has('edities') && <td className="px-6 py-4 whitespace-nowrap">{p.edities}</td>}
                        {visibleColumns.has('genre') && <td className="px-6 py-4 whitespace-nowrap">{p.genre}</td>}
                        {visibleColumns.has('isDutchLanguage') && <td className="px-6 py-4 whitespace-nowrap">{p.isDutchLanguage ? 'Ja' : 'Nee'}</td>}
                        {visibleColumns.has('isEnglishLanguage') && <td className="px-6 py-4 whitespace-nowrap">{p.isEnglishLanguage ? 'Ja' : 'Nee'}</td>}
                        {visibleColumns.has('isDialogueFree') && <td className="px-6 py-4 whitespace-nowrap">{p.isDialogueFree ? 'Ja' : 'Nee'}</td>}
                        {visibleColumns.has('isChildFriendly') && <td className="px-6 py-4 whitespace-nowrap">{p.isChildFriendly ? 'Ja' : 'Nee'}</td>}
                        {hasEditPermissions && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                              <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                            </td>
                        )}
                      </tr>
                    )) : (
                  <tr><td colSpan={visibleColumns.size + 2 + (hasEditPermissions ? 1 : 0)} className="text-center py-4">Geen voorstellingen gevonden.</td></tr>
                )}
              </tbody>
            </table>
          </div>
      )}

      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPerformances.map(p => (
                <div key={p.id} onClick={() => setDetailPerformance(p)} className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 truncate">{p.Title}</h3>
                        <p className="text-indigo-600 text-sm">{p.companyName}</p>
                        <p className="text-gray-500 text-sm truncate mt-1">{p.genre}</p>
                        <p className="text-gray-500 text-xs truncate mt-1">Edities: {p.edities}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                        {p.isDutchLanguage && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">NL</span>}
                        {p.isEnglishLanguage && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">EN</span>}
                        {p.isDialogueFree && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Taalloos</span>}
                        {p.isChildFriendly && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Kindvriendelijk</span>}
                    </div>
                </div>
            ))}
        </div>
      )}

      {isModalOpen && (
        <PerformanceForm 
          performance={editingPerformance} 
          companies={companies}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingPerformance) {
              onUpdate(editingPerformance.id, data);
            } else {
              onAdd(data);
            }
            setIsModalOpen(false);
          }}
        />
      )}
      {detailPerformance && (
        <PerformanceDetailModal 
            performance={detailPerformance}
            onClose={() => setDetailPerformance(null)}
            onEdit={hasEditPermissions ? handleEdit : null}
            onDelete={hasEditPermissions ? () => onDelete(detailPerformance.id) : null}
        />
      )}
      {isImportModalOpen && (
        <GenericImportModal
            title="Voorstellingen"
            requiredColumns={['Title', 'companyId']}
            onClose={() => setIsImportModalOpen(false)}
            onImport={(data) => onBulkAdd(data.map(item => ({
                Title: item.Title || '',
                companyId: item.companyId || null,
                genre: item.genre || '',
                meerInfoUrl: item.meerInfoUrl || '',
                imageUrl: item.imageUrl || '',
                pwycLink: item.pwycLink || '',
                isDutchLanguage: item.isDutchLanguage === 'true',
                isEnglishLanguage: item.isEnglishLanguage === 'true',
                isDialogueFree: item.isDialogueFree === 'true',
                isChildFriendly: item.isChildFriendly === 'true',
            })))}
        />
      )}
    </div>
  );
}

function PerformanceDetailModal({ performance, onClose, onEdit, onDelete }) {
    const DetailItem = ({ label, value }) => (
        <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
            <p className="text-gray-800">{value || <span className="text-gray-400">N.v.t.</span>}</p>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <header className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{performance.Title}</h2>
                        <p className="text-gray-500 mt-1">{performance.companyName}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 -mr-2 -mt-2">{icons.x}</button>
                </header>

                <main className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem label="Genre" value={performance.genre} />
                        <DetailItem label="Edities" value={performance.edities} />
                        <DetailItem label="Meer Info URL" value={performance.meerInfoUrl} />
                        <DetailItem label="Afbeelding URL" value={performance.imageUrl} />
                        <DetailItem label="PWYC Link" value={performance.pwycLink} />
                    </div>
                    <DetailItem label="Kenmerken">
                       <div className="flex flex-wrap gap-2 text-sm">
                           {performance.isDutchLanguage && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Nederlandstalig</span>}
                           {performance.isEnglishLanguage && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Engelstalig</span>}
                           {performance.isDialogueFree && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Taalloos</span>}
                           {performance.isChildFriendly && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Kindvriendelijk</span>}
                       </div>
                    </DetailItem>
                </main>

                <footer className="p-4 bg-gray-50 border-t flex justify-end items-center">
                    <div className="flex space-x-2">
                        {onDelete && <button onClick={() => onDelete(performance.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{icons.trash}<span>Verwijderen</span></button>}
                        {onEdit && <button onClick={() => onEdit(performance)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{icons.edit}<span>Bewerken</span></button>}
                    </div>
                </footer>
            </div>
        </div>
    );
}

function PerformanceForm({ performance, companies, onClose, onSave }) {
  const [formData, setFormData] = useState({ 
      title: performance?.Title || '', 
      companyId: performance?.companyId || '',
      genre: performance?.genre || '',
      meerInfoUrl: performance?.meerInfoUrl || '',
      imageUrl: performance?.imageUrl || '',
      pwycLink: performance?.pwycLink || '',
      isDutchLanguage: performance?.isDutchLanguage || false,
      isEnglishLanguage: performance?.isEnglishLanguage || false,
      isDialogueFree: performance?.isDialogueFree || false,
      isChildFriendly: performance?.isChildFriendly || false,
  });
  
  const sortedCompanies = useMemo(() => [...companies].sort((a,b) => a.Name.localeCompare(b.Name)), [companies]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => { 
      e.preventDefault(); 
      onSave({ 
          Title: formData.title, 
          companyId: formData.companyId,
          genre: formData.genre,
          meerInfoUrl: formData.meerInfoUrl,
          imageUrl: formData.imageUrl,
          pwycLink: formData.pwycLink,
          isDutchLanguage: formData.isDutchLanguage,
          isEnglishLanguage: formData.isEnglishLanguage,
          isDialogueFree: formData.isDialogueFree,
          isChildFriendly: formData.isChildFriendly,
      }); 
  };
  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl max-h-full overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6">{performance ? 'Voorstelling Bewerken' : 'Nieuwe Voorstelling'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Titel van de voorstelling" className="w-full p-2 border rounded" required />
          <select name="companyId" value={formData.companyId} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">Kies een gezelschap</option>
            {sortedCompanies.map(c => <option key={c.id} value={c.id}>{c.Name}</option>)}
          </select>
          <input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" className="w-full p-2 border rounded" />
          <input type="url" name="meerInfoUrl" value={formData.meerInfoUrl} onChange={handleChange} placeholder="Meer Info URL" className="w-full p-2 border rounded" />
          <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Afbeelding URL" className="w-full p-2 border rounded" />
          <input type="url" name="pwycLink" value={formData.pwycLink} onChange={handleChange} placeholder="PWYC Link" className="w-full p-2 border rounded" />
          
          <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2"><input type="checkbox" name="isDutchLanguage" checked={formData.isDutchLanguage} onChange={handleChange} /><span>Nederlandstalig</span></label>
              <label className="flex items-center space-x-2"><input type="checkbox" name="isEnglishLanguage" checked={formData.isEnglishLanguage} onChange={handleChange} /><span>Engelstalig</span></label>
              <label className="flex items-center space-x-2"><input type="checkbox" name="isDialogueFree" checked={formData.isDialogueFree} onChange={handleChange} /><span>Taalloos</span></label>
              <label className="flex items-center space-x-2"><input type="checkbox" name="isChildFriendly" checked={formData.isChildFriendly} onChange={handleChange} /><span>Kindvriendelijk</span></label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LocationsView({ locations, cafeOwners, performances, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions, onQuickView }) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [viewMode, setViewMode] = useState('list');
  const [detailLocation, setDetailLocation] = useState(null);

  const enrichedLocations = useMemo(() => locations.map(loc => {
      const contactPerson = cafeOwners.find(c => c.id === loc.contactPersonId);
      return {
        ...loc,
        ownerNames: (loc.ownerIds || []).map(id => cafeOwners.find(c => c.id === id)?.Name).filter(Boolean).join(', '),
        contactPerson: contactPerson || null,
        contactPersonName: contactPerson?.Name || ''
      }
  }), [locations, cafeOwners]);
  
  const { 
    filteredAndSortedItems: filteredLocations, 
    searchTerm, 
    setSearchTerm, 
    sortConfig, 
    requestSort,
    filters,
    handleFilterChange
  } = useSortAndFilter(
      enrichedLocations,
      'Name',
      ['Name', 'Address', 'locationNumber', 'ownerNames', 'contactPersonName']
  );
  
  const ALL_COLUMNS = useMemo(() => [
    { key: 'Name', header: 'Naam', sortable: true, filterable: true },
    { key: 'Address', header: 'Adres', sortable: true, filterable: true },
    { key: 'contactPersonName', header: 'Contactpersoon', sortable: true, filterable: true },
    { key: 'Bijdrage', header: 'Cafébijdrage (€)', sortable: true, filterable: false },
    { key: 'terras', header: 'Terras', sortable: true, filterable: true },
    { key: 'kleedruimte', header: 'Kleedruimte', sortable: true, filterable: true },
    { key: 'isWheelchairAccessible', header: 'Rolstoel', sortable: true, filterable: true },
  ], []);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [searchTerm, sortConfig, filters, viewMode]);
  
  const handleEdit = (location) => {
    setDetailLocation(null);
    setEditingLocation(location);
    setIsFormModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingLocation(null);
    setIsFormModalOpen(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(new Set(filteredLocations.map(l => l.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectOne = (e, id) => {
    const newSelectedIds = new Set(selectedIds);
    if (e.target.checked) newSelectedIds.add(id);
    else newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size > 0) {
      onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const isAllSelected = filteredLocations.length > 0 && selectedIds.size === filteredLocations.length;
  const countText = `Toont ${filteredLocations.length} van ${locations.length} locaties`;

  return (
    <div>
      <ViewHeader
        title="Locaties"
        countText={countText}
        onAddNew={handleAddNew}
        onImport={() => setIsImportModalOpen(true)}
        onExport={exportTo}
        exportData={filteredLocations}
        exportColumns={ALL_COLUMNS}
        exportFilename="locaties"
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      
      {selectedIds.size > 0 && hasEditPermissions && (
        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg mb-4 flex items-center justify-between">
            <span className="text-indigo-800 font-semibold">{selectedIds.size} geselecteerd</span>
            <button onClick={handleBulkDelete} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center space-x-1">
                {icons.trash} <span>Verwijderen</span>
            </button>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={filteredLocations.length === 0}
                  />
                </th>
                {ALL_COLUMNS.map(col => 
                  <SortableTh 
                      key={col.key} 
                      column={col} 
                      sortConfig={sortConfig} 
                      requestSort={requestSort}
                      filters={filters}
                      handleFilterChange={handleFilterChange}
                      allItems={enrichedLocations}
                  />
                )}
                {hasEditPermissions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLocations.map(loc => (
                <tr key={loc.id} className={selectedIds.has(loc.id) ? 'bg-indigo-50' : ''}>
                  <td className="px-4 py-4">
                    <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      checked={selectedIds.has(loc.id)}
                      onChange={(e) => handleSelectOne(e, loc.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{loc.Name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{loc.Address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{loc.contactPersonName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">€{loc.Bijdrage || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{loc.terras ? 'Ja' : 'Nee'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{loc.kleedruimte ? 'Ja' : 'Nee'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{loc.isWheelchairAccessible ? 'Ja' : 'Nee'}</td>
                  {hasEditPermissions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => setDetailLocation(loc)} className="text-gray-600 hover:text-indigo-900 mr-4">Details</button>
                      <button onClick={() => handleEdit(loc)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                      <button onClick={() => onDelete(loc.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredLocations.map(loc => (
                <div key={loc.id} onClick={() => setDetailLocation(loc)} className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 truncate">{loc.Name}</h3>
                        <p className="text-gray-500 text-sm truncate mt-1">{loc.Address}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Contact: {loc.contactPersonName || 'N.v.t.'}</p>
                    </div>
                </div>
            ))}
        </div>
      )}

      {detailLocation && (
        <LocationDetailModal
          location={detailLocation}
          performances={performances}
          onClose={() => setDetailLocation(null)}
          onEdit={hasEditPermissions ? handleEdit : null}
          onDelete={hasEditPermissions ? () => onDelete(detailLocation.id) : null}
        />
      )}

      {isFormModalOpen && (
        <LocationForm 
          key={editingLocation ? editingLocation.id : 'new-location'}
          location={editingLocation}
          performances={performances}
          cafeOwners={cafeOwners}
          onClose={() => setIsFormModalOpen(false)}
          onSave={(data) => {
            if (editingLocation) {
              onUpdate(editingLocation.id, data);
            } else {
              onAdd(data);
            }
            setIsFormModalOpen(false);
          }}
        />
      )}
      {isImportModalOpen && (
        <GenericImportModal
            title="Locaties"
            requiredColumns={['Name', 'Address']}
            complexFields={{
                'openingstijden': '[{"day":"Maandag","open":"10:00","close":"22:00","isClosed":false}]',
                'geprogrammeerde_voorstellingen': '[{"year":2024,"performanceId":"..."}]'
            }}
            onClose={() => setIsImportModalOpen(false)}
            onImport={(data) => onBulkAdd(data.map(item => ({
                ...item,
                ownerIds: item.ownerIds ? item.ownerIds.split(';').map(s => s.trim()) : [],
                contactPersonId: item.contactPersonId || null,
                hasDining: item.hasDining === 'true',
                isWheelchairAccessible: item.isWheelchairAccessible === 'true',
                terras: item.terras === 'true',
                kleedruimte: item.kleedruimte === 'true',
                kan_groep_mee_eten: item.kan_groep_mee_eten === 'true',
                mag_contact_opnemen_advertentie: item.mag_contact_opnemen_advertentie === 'true',
                capaciteit: item.capaciteit ? parseInt(item.capaciteit, 10) : 0,
                maximale_gezelschapsgrootte: item.maximale_gezelschapsgrootte ? parseInt(item.maximale_gezelschapsgrootte, 10) : 0,
                Bijdrage: item.Bijdrage ? parseInt(item.Bijdrage, 10) : 0,
            })))}
        />
      )}
    </div>
  );
}

function LocationDetailModal({ location, performances, onClose, onEdit, onDelete }) {
    const openingstijden = useMemo(() => {
        try {
            return JSON.parse(location.openingstijden || '[]');
        } catch {
            return [];
        }
    }, [location.openingstijden]);

    const geprogrammeerdeVoorstellingen = useMemo(() => {
        try {
            const items = JSON.parse(location.geprogrammeerde_voorstellingen || '[]');
            return items.map(item => ({
                ...item,
                performanceName: performances.find(p => p.id === item.performanceId)?.Title || 'Onbekende voorstelling'
            }));
        } catch {
            return [];
        }
    }, [location.geprogrammeerde_voorstellingen, performances]);
    
    const DetailItem = ({ label, value, children }) => (
        <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
            {children ? <div className="text-gray-800 mt-1">{children}</div> : <p className="text-gray-800">{value || <span className="text-gray-400">N.v.t.</span>}</p>}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                <header className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{location.Name}</h2>
                        <p className="text-gray-500 flex items-center mt-1">
                            <span className="w-4 h-4 mr-2">{icons.mapPin}</span>
                            {location.Address}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 -mr-2 -mt-2">{icons.x}</button>
                </header>

                <main className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem label="Algemeen Contact">
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center"><span className="mr-2">{icons.phone}</span> {location.telefoonnummer_algemeen || 'N.v.t.'}</span>
                                <span className="flex items-center"><span className="mr-2">{icons.mail}</span> {location.mailadres_algemeen || 'N.v.t.'}</span>
                            </div>
                        </DetailItem>
                        
                        <DetailItem label="Contactpersoon">
                            {location.contactPerson ? (
                                <div className="space-y-1">
                                    <p className="font-semibold">{location.contactPerson.Name}</p>
                                    <p className="flex items-center text-sm"><span className="w-4 h-4 mr-2">{icons.mail}</span> {location.contactPerson.Email || 'N.v.t.'}</p>
                                    <p className="flex items-center text-sm"><span className="w-4 h-4 mr-2">{icons.phone}</span> {location.contactPerson.Phone || 'N.v.t.'}</p>
                                </div>
                            ) : (
                                <p className="text-gray-400">Geen contactpersoon geselecteerd.</p>
                            )}
                        </DetailItem>

                        <DetailItem label="Capaciteit" value={location.capaciteit} />
                        <DetailItem label="Maximale Gezelschapsgrootte" value={location.maximale_gezelschapsgrootte} />
                        <DetailItem label="Deelnamegeld" value={location.deelnamegeld} />
                        <DetailItem label="Cafébijdrage" value={location.Bijdrage ? `€${location.Bijdrage}` : 'N.v.t.'} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                       <DetailItem label="Faciliteiten">
                           <div className="flex flex-wrap gap-2 text-sm">
                               {location.terras && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Terras</span>}
                               {location.kleedruimte && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Kleedruimte</span>}
                               {location.isWheelchairAccessible && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Rolstoeltoegankelijk</span>}
                               {location.kan_groep_mee_eten && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Groep kan mee-eten</span>}
                           </div>
                       </DetailItem>
                       <DetailItem label="Voorkeur Genre/Thema" value={location.voorkeur_genre_thema} />
                       <DetailItem label="Techniek" value={location.techniek} />
                       <DetailItem label="Opmerkingen" value={location.opmerkingen} />
                    </div>

                    <DetailItem label="Openingstijden">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                            {openingstijden.length > 0 ? openingstijden.map(t => (
                                <div key={t.day} className="flex justify-between p-2 bg-gray-50 rounded-md">
                                    <span className="font-medium">{t.day}</span>
                                    <span className={t.isClosed ? 'text-red-500' : 'text-gray-700'}>
                                        {t.isClosed ? 'Gesloten' : `${t.open} - ${t.close}`}
                                    </span>
                                </div>
                            )) : <p className="text-gray-400 col-span-full">Geen tijden opgegeven.</p>}
                        </div>
                    </DetailItem>

                    <DetailItem label="Geprogrammeerde Voorstellingen">
                        <ul className="space-y-1 list-disc list-inside">
                            {geprogrammeerdeVoorstellingen.length > 0 ? geprogrammeerdeVoorstellingen.map((item, index) => (
                                <li key={index}><strong>{item.year}:</strong> {item.performanceName}</li>
                            )) : <p className="text-gray-400">Geen voorstellingen geprogrammeerd.</p>}
                        </ul>
                    </DetailItem>
                </main>

                <footer className="p-4 bg-gray-50 border-t flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                        Advertenties toegestaan: {location.mag_contact_opnemen_advertentie ? 'Ja' : 'Nee'}
                    </p>
                    <div className="flex space-x-2">
                        {onDelete && <button onClick={() => onDelete(location.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2">{icons.trash}<span>Verwijderen</span></button>}
                        {onEdit && <button onClick={() => onEdit(location)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2">{icons.edit}<span>Bewerken</span></button>}
                    </div>
                </footer>
            </div>
        </div>
    );
}

function LocationForm({ location, performances, cafeOwners, onClose, onSave }) {
    const initialOpeningstijden = useMemo(() => {
        const days = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
        try {
            const storedTimes = JSON.parse(location?.openingstijden || '[]');
            if (Array.isArray(storedTimes) && storedTimes.length === 7) {
                return storedTimes;
            }
        } catch {}
        return days.map(day => ({ day, open: '', close: '', isClosed: false }));
    }, [location]);

    const initialProgrammed = useMemo(() => {
        try {
            const items = JSON.parse(location?.geprogrammeerde_voorstellingen || '[]');
            return Array.isArray(items) ? items : [];
        } catch {
            return [];
        }
    }, [location]);

    const [formData, setFormData] = useState({
        Name: location?.Name || '',
        Address: location?.Address || '',
        googleMapsUrl: location?.googleMapsUrl || '',
        locationNumber: location?.locationNumber || '',
        telefoonnummer_algemeen: location?.telefoonnummer_algemeen || '',
        mailadres_algemeen: location?.mailadres_algemeen || '',
        terras: location?.terras || false,
        kleedruimte: location?.kleedruimte || false,
        techniek: location?.techniek || '',
        capaciteit: location?.capaciteit || 0,
        voorkeur_genre_thema: location?.voorkeur_genre_thema || '',
        maximale_gezelschapsgrootte: location?.maximale_gezelschapsgrootte || 0,
        deelnamegeld: location?.deelnamegeld || '',
        kan_groep_mee_eten: location?.kan_groep_mee_eten || false,
        mag_contact_opnemen_advertentie: location?.mag_contact_opnemen_advertentie || false,
        opmerkingen: location?.opmerkingen || '',
        hasDining: location?.hasDining || false,
        isWheelchairAccessible: location?.isWheelchairAccessible || false,
        contactPersonId: location?.contactPersonId || '',
        Bijdrage: location?.Bijdrage || 0,
    });
    const [openingstijden, setOpeningstijden] = useState(initialOpeningstijden);
    const [programmed, setProgrammed] = useState(initialProgrammed);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    
    const handleOpeningstijdenChange = (index, field, value) => {
        const newTimes = [...openingstijden];
        newTimes[index][field] = typeof value === 'boolean' ? value : value;
        setOpeningstijden(newTimes);
    };

    const handleProgrammedChange = (index, field, value) => {
        const newProgrammed = [...programmed];
        newProgrammed[index][field] = value;
        setProgrammed(newProgrammed);
    };

    const addProgrammed = () => {
        setProgrammed([...programmed, { year: new Date().getFullYear(), performanceId: '' }]);
    };

    const removeProgrammed = (index) => {
        setProgrammed(programmed.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            capaciteit: Number(formData.capaciteit) || 0,
            maximale_gezelschapsgrootte: Number(formData.maximale_gezelschapsgrootte) || 0,
            Bijdrage: Number(formData.Bijdrage) || 0,
            openingstijden: JSON.stringify(openingstijden),
            geprogrammeerde_voorstellingen: JSON.stringify(programmed),
            ownerIds: location?.ownerIds || [],
        };
        onSave(dataToSave);
    };
    
    const sortedPerformances = useMemo(() => [...performances].sort((a,b) => a.Title.localeCompare(b.Title)), [performances]);
    const sortedCafeOwners = useMemo(() => [...cafeOwners].sort((a,b) => a.Name.localeCompare(b.Name)), [cafeOwners]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg w-full max-w-4xl shadow-xl flex flex-col max-h-[90vh]">
                <header className="p-6 border-b">
                    <h3 className="text-2xl font-bold">{location ? 'Locatie Bewerken' : 'Nieuwe Locatie'}</h3>
                </header>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="Name" value={formData.Name} onChange={handleChange} placeholder="Naam van de locatie" className="w-full p-2 border rounded" required />
                        <input type="text" name="Address" value={formData.Address} onChange={handleChange} placeholder="Adres" className="w-full p-2 border rounded" />
                        <input type="text" name="locationNumber" value={formData.locationNumber} onChange={handleChange} placeholder="Locatienummer" className="w-full p-2 border rounded" />
                        <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} placeholder="Google Maps URL" className="w-full p-2 border rounded" />
                        <input type="tel" name="telefoonnummer_algemeen" value={formData.telefoonnummer_algemeen} onChange={handleChange} placeholder="Telefoonnummer" className="w-full p-2 border rounded" />
                        <input type="email" name="mailadres_algemeen" value={formData.mailadres_algemeen} onChange={handleChange} placeholder="E-mailadres" className="w-full p-2 border rounded" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contactpersoon (Café-eigenaar)</label>
                        <select name="contactPersonId" value={formData.contactPersonId} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Kies een contactpersoon</option>
                            {sortedCafeOwners.map(owner => (
                                <option key={owner.id} value={owner.id}>{owner.Name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input type="number" name="capaciteit" value={formData.capaciteit} onChange={handleChange} placeholder="Capaciteit" className="w-full p-2 border rounded" />
                        <input type="number" name="maximale_gezelschapsgrootte" value={formData.maximale_gezelschapsgrootte} onChange={handleChange} placeholder="Max. gezelschapsgrootte" className="w-full p-2 border rounded" />
                        <input type="text" name="deelnamegeld" value={formData.deelnamegeld} onChange={handleChange} placeholder="Deelnamegeld" className="w-full p-2 border rounded" />
                        <input type="number" name="Bijdrage" value={formData.Bijdrage} onChange={handleChange} placeholder="Cafébijdrage (€)" className="w-full p-2 border rounded" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <textarea name="voorkeur_genre_thema" value={formData.voorkeur_genre_thema} onChange={handleChange} placeholder="Voorkeur genre/thema" className="w-full p-2 border rounded h-24"></textarea>
                       <textarea name="techniek" value={formData.techniek} onChange={handleChange} placeholder="Notities over techniek" className="w-full p-2 border rounded h-24"></textarea>
                       <textarea name="opmerkingen" value={formData.opmerkingen} onChange={handleChange} placeholder="Algemene opmerkingen" className="w-full p-2 border rounded h-24"></textarea>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <label className="flex items-center space-x-2"><input type="checkbox" name="terras" checked={formData.terras} onChange={handleChange} /><span>Terras</span></label>
                        <label className="flex items-center space-x-2"><input type="checkbox" name="kleedruimte" checked={formData.kleedruimte} onChange={handleChange} /><span>Kleedruimte</span></label>
                        <label className="flex items-center space-x-2"><input type="checkbox" name="kan_groep_mee_eten" checked={formData.kan_groep_mee_eten} onChange={handleChange} /><span>Groep kan mee-eten</span></label>
                        <label className="flex items-center space-x-2"><input type="checkbox" name="mag_contact_opnemen_advertentie" checked={formData.mag_contact_opnemen_advertentie} onChange={handleChange} /><span>OK voor advertenties</span></label>
                        <label className="flex items-center space-x-2"><input type="checkbox" name="hasDining" checked={formData.hasDining} onChange={handleChange} /><span>Eetgelegenheid</span></label>
                        <label className="flex items-center space-x-2"><input type="checkbox" name="isWheelchairAccessible" checked={formData.isWheelchairAccessible} onChange={handleChange} /><span>Rolstoeltoegankelijk</span></label>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Openingstijden</h4>
                        <div className="space-y-2">
                            {openingstijden.map((day, index) => (
                                <div key={index} className="grid grid-cols-4 gap-2 items-center">
                                    <span className="font-medium">{day.day}</span>
                                    <input type="time" value={day.open} onChange={(e) => handleOpeningstijdenChange(index, 'open', e.target.value)} disabled={day.isClosed} className="w-full p-1 border rounded disabled:bg-gray-200" />
                                    <input type="time" value={day.close} onChange={(e) => handleOpeningstijdenChange(index, 'close', e.target.value)} disabled={day.isClosed} className="w-full p-1 border rounded disabled:bg-gray-200" />
                                    <label className="flex items-center space-x-2"><input type="checkbox" checked={day.isClosed} onChange={(e) => handleOpeningstijdenChange(index, 'isClosed', e.target.checked)} /><span>Gesloten</span></label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Geprogrammeerde Voorstellingen</h4>
                        <div className="space-y-2">
                            {programmed.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input type="number" value={item.year} onChange={e => handleProgrammedChange(index, 'year', e.target.value)} placeholder="Jaar" className="p-2 border rounded w-24" />
                                    <select value={item.performanceId} onChange={e => handleProgrammedChange(index, 'performanceId', e.target.value)} className="w-full p-2 border rounded">
                                        <option value="">Kies een voorstelling</option>
                                        {sortedPerformances.map(p => <option key={p.id} value={p.id}>{p.Title}</option>)}
                                    </select>
                                    <button type="button" onClick={() => removeProgrammed(index)} className="text-red-500 p-2">{icons.trash}</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addProgrammed} className="mt-2 text-sm text-indigo-600 hover:underline">{icons.plus} Voorstelling toevoegen</button>
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ExecutionsView({ executions, performances, locations, onAdd, onBulkAdd, onUpdate, onDelete, onBulkDelete, hasEditPermissions, onQuickView }) {
  const [showPast, setShowPast] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingExecution, setEditingExecution] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [viewMode, setViewMode] = useState('list');
  const [detailExecution, setDetailExecution] = useState(null);
  
  const enrichedExecutionsBase = useMemo(() => {
    const now = new Date();
    return executions
        .map(exec => ({
            ...exec,
            performance: performances.find(p => p.id === exec.performanceId),
            location: locations.find(l => l.id === exec.locationId),
        }))
        .filter(exec => exec.performance && exec.location)
        .map(exec => ({
            ...exec,
            performanceTitle: exec.performance.Title,
            locationName: exec.location.Name,
        }))
        .filter(exec => showPast || new Date(exec.DateTime) >= now);
  }, [executions, performances, locations, showPast]);
  
  const { 
    filteredAndSortedItems: filteredExecutions, 
    searchTerm, 
    setSearchTerm, 
    sortConfig, 
    requestSort,
    filters,
    handleFilterChange
  } = useSortAndFilter(
      enrichedExecutionsBase,
      'DateTime',
      ['performanceTitle', 'locationName']
  );

  const ALL_COLUMNS = useMemo(() => [
    { key: 'performanceTitle', header: 'Voorstelling', sortable: true, filterable: true },
    { key: 'locationName', header: 'Locatie', sortable: true, filterable: true },
    { key: 'DateTime', header: 'Datum & Tijd', sortable: true, filterable: false },
    { key: 'BezoekersAantallen', header: 'Bezoekers', sortable: true, filterable: false },
    { key: 'PWYC', header: 'PWYC (€)', sortable: true, filterable: false },
    { key: 'expectedCrowd', header: 'Verwachte Drukte', sortable: true, filterable: true },
    { key: 'quietRoute', header: 'Rustige Route', sortable: true, filterable: true },
    { key: 'hasNgt', header: 'NGT', sortable: true, filterable: true },
  ], []);

  const [visibleColumns, setVisibleColumns] = useState(new Set(['performanceTitle', 'locationName', 'DateTime', 'BezoekersAantallen', 'PWYC']));

  const toggleColumn = (key) => {
    setVisibleColumns(prev => {
        const newSet = new Set(prev);
        if (newSet.has(key)) newSet.delete(key);
        else newSet.add(key);
        return newSet;
    });
  };

  useEffect(() => {
    setSelectedIds(new Set());
  }, [searchTerm, sortConfig, filters, showPast, viewMode]);

  const handleEdit = (execution) => {
    setDetailExecution(null);
    setEditingExecution(execution);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingExecution(null);
    setIsModalOpen(true);
  };
  
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N.v.t.';
    const date = new Date(isoString);
    return date.toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(new Set(filteredExecutions.map(ex => ex.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectOne = (e, id) => {
    const newSelectedIds = new Set(selectedIds);
    if (e.target.checked) newSelectedIds.add(id);
    else newSelectedIds.delete(id);
    setSelectedIds(newSelectedIds);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size > 0) {
      onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };
  
  const isAllSelected = filteredExecutions.length > 0 && selectedIds.size === filteredExecutions.length;
  const countText = `Toont ${filteredExecutions.length} van ${executions.length} uitvoeringen`;
  
  return (
    <div>
      <ViewHeader
        title="Uitvoeringen"
        countText={countText}
        onAddNew={handleAddNew}
        onImport={() => setIsImportModalOpen(true)}
        onExport={exportTo}
        exportData={filteredExecutions}
        exportColumns={ALL_COLUMNS}
        exportFilename="uitvoeringen"
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <button 
            onClick={() => setShowPast(!showPast)} 
            className="p-2 border rounded-lg shadow-sm bg-white hover:bg-gray-100"
          >
            {showPast ? 'Verleden verbergen' : 'Verleden tonen'}
        </button>
        <ColumnSelector columns={ALL_COLUMNS} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
      </ViewHeader>

      {selectedIds.size > 0 && hasEditPermissions && (
        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg mb-4 flex items-center justify-between">
            <span className="text-indigo-800 font-semibold">{selectedIds.size} geselecteerd</span>
            <button onClick={handleBulkDelete} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center space-x-1">
                {icons.trash} <span>Verwijderen</span>
            </button>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={filteredExecutions.length === 0}
                  />
                </th>
                {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && 
                  <SortableTh 
                      key={col.key} 
                      column={col} 
                      sortConfig={sortConfig} 
                      requestSort={requestSort}
                      filters={filters}
                      handleFilterChange={handleFilterChange}
                      allItems={enrichedExecutionsBase}
                  />
                )}
                {hasEditPermissions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExecutions.length > 0 ? filteredExecutions.map(exec => (
                    <tr key={exec.id} className={selectedIds.has(exec.id) ? 'bg-indigo-50' : ''}>
                      <td className="px-4 py-4">
                         <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          checked={selectedIds.has(exec.id)}
                          onChange={(e) => handleSelectOne(e, exec.id)}
                        />
                      </td>
                      {visibleColumns.has('performanceTitle') && <td className="px-6 py-4 whitespace-nowrap font-medium">
                          <button onClick={() => onQuickView({ item: exec.performance, type: 'performance' })} className="text-indigo-600 hover:underline">
                              {exec.performance.Title}
                          </button>
                      </td>}
                      {visibleColumns.has('locationName') && <td className="px-6 py-4 whitespace-nowrap">
                          <button onClick={() => onQuickView({ item: exec.location, type: 'location' })} className="text-indigo-600 hover:underline">
                              {exec.location.Name}
                          </button>
                      </td>}
                      {visibleColumns.has('DateTime') && <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(exec.DateTime)}</td>}
                      {visibleColumns.has('BezoekersAantallen') && <td className="px-6 py-4 whitespace-nowrap">{exec.BezoekersAantallen || 0}</td>}
                      {visibleColumns.has('PWYC') && <td className="px-6 py-4 whitespace-nowrap">€{exec.PWYC || 0}</td>}
                      {visibleColumns.has('expectedCrowd') && <td className="px-6 py-4 whitespace-nowrap">{exec.expectedCrowd}</td>}
                      {visibleColumns.has('quietRoute') && <td className="px-6 py-4 whitespace-nowrap">{exec.quietRoute ? 'Ja' : 'Nee'}</td>}
                      {visibleColumns.has('hasNgt') && <td className="px-6 py-4 whitespace-nowrap">{exec.hasNgt ? 'Ja' : 'Nee'}</td>}
                      {hasEditPermissions && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEdit(exec)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                            <button onClick={() => onDelete(exec.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                          </td>
                      )}
                    </tr>
                  )) : (
                <tr><td colSpan={visibleColumns.size + 2 + (hasEditPermissions ? 1 : 0)} className="text-center py-4">Geen uitvoeringen gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredExecutions.map(exec => (
                <div key={exec.id} onClick={() => setDetailExecution(exec)} className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 truncate">{exec.performanceTitle}</h3>
                        <p className="text-indigo-600 text-sm truncate">{exec.locationName}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-700">{formatDateTime(exec.DateTime)}</p>
                    </div>
                </div>
            ))}
        </div>
      )}

      {isModalOpen && (
        <ExecutionForm 
          execution={editingExecution} 
          performances={performances}
          locations={locations}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingExecution) {
              onUpdate(editingExecution.id, data);
            } else {
              onAdd(data);
            }
            setIsModalOpen(false);
          }}
          onSaveBulk={(data) => {
            onBulkAdd(data);
            setIsModalOpen(false);
          }}
        />
      )}
      {detailExecution && (
        <ExecutionDetailModal 
            execution={detailExecution}
            onClose={() => setDetailExecution(null)}
            onEdit={hasEditPermissions ? handleEdit : null}
            onDelete={hasEditPermissions ? () => onDelete(detailExecution.id) : null}
        />
      )}
       {isImportModalOpen && (
        <GenericImportModal
            title="Uitvoeringen"
            requiredColumns={['performanceId', 'locationId', 'DateTime']}
            onClose={() => setIsImportModalOpen(false)}
            onImport={(data) => onBulkAdd(data.map(item => ({
                performanceId: item.performanceId || null,
                locationId: item.locationId || null,
                DateTime: item.DateTime ? new Date(item.DateTime).toISOString() : null,
                expectedCrowd: item.expectedCrowd || '',
                quietRoute: item.quietRoute === 'true',
                hasNgt: item.hasNgt === 'true',
                BezoekersAantallen: item.BezoekersAantallen ? parseInt(item.BezoekersAantallen, 10) : 0,
                PWYC: item.PWYC ? parseInt(item.PWYC, 10) : 0,
            })))}
        />
      )}
    </div>
  );
}

function ExecutionDetailModal({ execution, onClose, onEdit, onDelete }) {
    const DetailItem = ({ label, value }) => (
        <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
            <p className="text-gray-800">{value || <span className="text-gray-400">N.v.t.</span>}</p>
        </div>
    );
    
    const formatDateTime = (isoString) => {
        if (!isoString) return 'N.v.t.';
        const date = new Date(isoString);
        return date.toLocaleString('nl-NL', { dateStyle: 'full', timeStyle: 'short' });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <header className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{execution.performanceTitle}</h2>
                        <p className="text-gray-500 mt-1">{execution.locationName}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 -mr-2 -mt-2">{icons.x}</button>
                </header>

                <main className="p-6 overflow-y-auto space-y-6">
                    <DetailItem label="Datum en Tijd" value={formatDateTime(execution.DateTime)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem label="Bezoekersaantallen" value={execution.BezoekersAantallen} />
                        <DetailItem label="PWYC Opbrengst" value={execution.PWYC ? `€${execution.PWYC}` : '€0'} />
                    </div>
                    <DetailItem label="Verwachte Drukte" value={execution.expectedCrowd} />
                    <DetailItem label="Kenmerken">
                       <div className="flex flex-wrap gap-2 text-sm">
                           {execution.quietRoute && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Rustige Route</span>}
                           {execution.hasNgt && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">NGT Tolk</span>}
                       </div>
                    </DetailItem>
                </main>

                <footer className="p-4 bg-gray-50 border-t flex justify-end items-center">
                    <div className="flex space-x-2">
                        {onDelete && <button onClick={() => onDelete(execution.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{icons.trash}<span>Verwijderen</span></button>}
                        {onEdit && <button onClick={() => onEdit(execution)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">{icons.edit}<span>Bewerken</span></button>}
                    </div>
                </footer>
            </div>
        </div>
    );
}

function ExecutionForm({ execution, performances, locations, onClose, onSave, onSaveBulk }) {
  const [performanceId, setPerformanceId] = useState(execution?.performanceId || '');
  const [locationId, setLocationId] = useState(execution?.locationId || '');
  const [datetimes, setDatetimes] = useState(
    execution 
      ? [{ date: new Date(execution.DateTime).toISOString().split('T')[0], time: new Date(execution.DateTime).toTimeString().slice(0, 5) }]
      : [{ date: '', time: '' }]
  );
  const [extraData, setExtraData] = useState({
      expectedCrowd: execution?.expectedCrowd || '',
      quietRoute: execution?.quietRoute || false,
      hasNgt: execution?.hasNgt || false,
      BezoekersAantallen: execution?.BezoekersAantallen || 0,
      PWYC: execution?.PWYC || 0,
  });
  
  const sortedPerformances = useMemo(() => [...performances].sort((a,b) => a.Title.localeCompare(b.Title)), [performances]);
  const sortedLocations = useMemo(() => [...locations].sort((a,b) => a.Name.localeCompare(b.Name)), [locations]);

  const handleExtraDataChange = (e) => {
      const { name, value, type, checked } = e.target;
      setExtraData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDatetimeChange = (index, field, value) => {
    const newDatetimes = [...datetimes];
    newDatetimes[index][field] = value;
    setDatetimes(newDatetimes);
  };

  const addDatetime = () => {
    setDatetimes([...datetimes, { date: '', time: '' }]);
  };

  const removeDatetime = (index) => {
    const newDatetimes = datetimes.filter((_, i) => i !== index);
    setDatetimes(newDatetimes);
  };

  const handleSubmit = (e) => { 
      e.preventDefault();
      
      const baseData = {
          performanceId,
          locationId,
          ...extraData,
          BezoekersAantallen: Number(extraData.BezoekersAantallen) || 0,
          PWYC: Number(extraData.PWYC) || 0,
      };

      if (execution) {
        const dateTime = new Date(`${datetimes[0].date}T${datetimes[0].time}`);
        onSave({ 
            ...baseData,
            DateTime: dateTime.toISOString()
        });
      } else {
        const executionsToCreate = datetimes
            .filter(dt => dt.date && dt.time)
            .map(dt => {
                const dateTime = new Date(`${dt.date}T${dt.time}`);
                return {
                    ...baseData,
                    DateTime: dateTime.toISOString()
                };
            });
        
        if (executionsToCreate.length > 0) {
            onSaveBulk(executionsToCreate);
        }
      }
  };

  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl max-h-full overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6">{execution ? 'Uitvoering Bewerken' : 'Nieuwe Uitvoeringen'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select name="performanceId" value={performanceId} onChange={(e) => setPerformanceId(e.target.value)} className="w-full p-2 border rounded" required>
            <option value="">Kies een voorstelling</option>
            {sortedPerformances.map(p => <option key={p.id} value={p.id}>{p.Title}</option>)}
          </select>
          <select name="locationId" value={locationId} onChange={(e) => setLocationId(e.target.value)} className="w-full p-2 border rounded" required>
            <option value="">Kies een locatie</option>
            {sortedLocations.map(l => <option key={l.id} value={l.id}>{l.Name}</option>)}
          </select>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Datum & Tijd</label>
            {datetimes.map((dt, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <input type="date" value={dt.date} onChange={(e) => handleDatetimeChange(index, 'date', e.target.value)} className="w-full p-2 border rounded" required />
                    <input type="time" value={dt.time} onChange={(e) => handleDatetimeChange(index, 'time', e.target.value)} className="w-full p-2 border rounded" required />
                    <button type="button" onClick={() => removeDatetime(index)} disabled={datetimes.length <= 1} className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2">
                        {icons.trash}
                    </button>
                </div>
            ))}
          </div>
          
          {!execution && (
            <button type="button" onClick={addDatetime} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
                {icons.plus}
                <span>Datum en tijd toevoegen</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bezoekersaantallen</label>
                <input type="number" name="BezoekersAantallen" value={extraData.BezoekersAantallen} onChange={handleExtraDataChange} placeholder="0" className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PWYC Opbrengst (€)</label>
                <input type="number" name="PWYC" value={extraData.PWYC} onChange={handleExtraDataChange} placeholder="0" className="w-full p-2 border rounded" />
            </div>
          </div>

          <input type="text" name="expectedCrowd" value={extraData.expectedCrowd} onChange={handleExtraDataChange} placeholder="Verwachte drukte" className="w-full p-2 border rounded" />
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2"><input type="checkbox" name="quietRoute" checked={extraData.quietRoute} onChange={handleExtraDataChange} /><span>Rustige Route</span></label>
            <label className="flex items-center space-x-2"><input type="checkbox" name="hasNgt" checked={extraData.hasNgt} onChange={handleExtraDataChange} /><span>NGT</span></label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  );
}


// --- Vrijwilligers View (AANGEPAST) ---
function VolunteersView({ contacts, onAdd, onUpdate, onDelete, hasEditPermissions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [detailContact, setDetailContact] = useState(null);

  const volunteers = useMemo(() => 
    contacts.filter(c => (c.Role || '').toLowerCase() === 'vrijwilliger'),
    [contacts]
  );

  const { 
    filteredAndSortedItems: filteredVolunteers, 
    searchTerm, 
    setSearchTerm, 
    sortConfig, 
    requestSort,
    filters,
    handleFilterChange
  } = useSortAndFilter(volunteers, 'Name', ['Name', 'Email', 'Phone', 'functie', 'AangemeldVoor']);

  const ALL_COLUMNS = useMemo(() => [
    { key: 'Name', header: 'Naam', sortable: true, filterable: true },
    { key: 'functie', header: 'Functie', sortable: true, filterable: true },
    { key: 'AangemeldVoor', header: 'Aangemeld Voor', sortable: false, filterable: true },
    { key: 'Email', header: 'Email', sortable: true, filterable: true },
    { key: 'Phone', header: 'Telefoon', sortable: false, filterable: false },
    { key: 'viaFormulier', header: 'Via Formulier', sortable: true, filterable: true },
    { key: 'shirtSize', header: 'Shirtmaat', sortable: true, filterable: true },
  ], []);
  
  const [visibleColumns, setVisibleColumns] = useState(new Set(ALL_COLUMNS.map(c => c.key)));

  const toggleColumn = (key) => {
    setVisibleColumns(prev => {
        const newSet = new Set(prev);
        if (newSet.has(key)) newSet.delete(key);
        else newSet.add(key);
        return newSet;
    });
  };

  const handleEdit = (contact) => {
    setDetailContact(null);
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const countText = `Toont ${filteredVolunteers.length} van ${volunteers.length} vrijwilligers`;

  return (
    <div>
      <ViewHeader 
        title="Vrijwilligers"
        countText={countText}
        onAddNew={handleAddNew}
        onExport={exportTo}
        exportData={filteredVolunteers}
        exportColumns={ALL_COLUMNS}
        exportFilename="vrijwilligers"
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <ColumnSelector columns={ALL_COLUMNS} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
      </ViewHeader>
      
      {viewMode === 'list' ? (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && 
                  <SortableTh 
                      key={col.key} 
                      column={col} 
                      sortConfig={sortConfig} 
                      requestSort={requestSort}
                      filters={filters}
                      handleFilterChange={handleFilterChange}
                      allItems={volunteers}
                  />
                )}
                {hasEditPermissions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVolunteers.length > 0 ? filteredVolunteers.map(contact => (
                <tr key={contact.id}>
                  {visibleColumns.has('Name') && <td className="px-6 py-4 whitespace-nowrap">{contact.Name}</td>}
                  {visibleColumns.has('functie') && <td className="px-6 py-4 whitespace-nowrap">{(contact.functie || []).join(', ')}</td>}
                  {visibleColumns.has('AangemeldVoor') && <td className="px-6 py-4 whitespace-nowrap">{(contact.AangemeldVoor || []).join(', ')}</td>}
                  {visibleColumns.has('Email') && <td className="px-6 py-4 whitespace-nowrap">{contact.Email}</td>}
                  {visibleColumns.has('Phone') && <td className="px-6 py-4 whitespace-nowrap">{contact.Phone}</td>}
                  {visibleColumns.has('viaFormulier') && <td className="px-6 py-4 whitespace-nowrap">{contact.viaFormulier ? 'Ja' : 'Nee'}</td>}
                  {visibleColumns.has('shirtSize') && <td className="px-6 py-4 whitespace-nowrap">{contact.shirtSize}</td>}
                  {hasEditPermissions && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(contact)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                        <button onClick={() => onDelete(contact.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                      </td>
                  )}
                </tr>
              )) : (
                <tr><td colSpan={visibleColumns.size + (hasEditPermissions ? 1 : 0)} className="text-center py-4">Geen vrijwilligers gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredVolunteers.map(contact => (
            <div key={contact.id} onClick={() => setDetailContact(contact)} className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 truncate">{contact.Name}</h3>
                    <p className="text-indigo-600 text-sm capitalize truncate">{(contact.functie || []).join(', ')}</p>
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-semibold">Aangemeld voor:</p>
                      <p className="truncate">{(contact.AangemeldVoor || []).join(', ') || 'N.v.t.'}</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                    <p className="truncate flex items-center"><span className="w-4 h-4 mr-1.5">{icons.mail}</span>{contact.Email || 'Geen email'}</p>
                    <p className="truncate flex items-center"><span className="w-4 h-4 mr-1.5">{icons.phone}</span>{contact.Phone || 'Geen tel.'}</p>
                    <p>Aanmelding via formulier: <span className="font-semibold">{contact.viaFormulier ? 'Ja' : 'Nee'}</span></p>
                </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ContactForm 
          key={editingContact ? editingContact.id : 'new-volunteer'}
          contact={editingContact || { Role: 'vrijwilliger' }} 
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            const dataToSave = { ...data, Role: 'vrijwilliger' };
            if (editingContact) {
              onUpdate(editingContact.id, dataToSave);
            } else {
              onAdd(dataToSave);
            }
            setIsModalOpen(false);
          }}
        />
      )}
      {detailContact && (
        <ContactDetailModal 
            contact={detailContact}
            onClose={() => setDetailContact(null)}
            onEdit={hasEditPermissions ? handleEdit : null}
            onDelete={hasEditPermissions ? () => onDelete(detailContact.id) : null}
        />
      )}
    </div>
  );
}

// --- Info View ---
function InfoView({ infoItems, onAdd, onUpdate, onDelete, hasEditPermissions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { filteredAndSortedItems, searchTerm, setSearchTerm } = useSortAndFilter(infoItems, 'NameNl', ['NameNl', 'NameEng']);
    const countText = `Toont ${filteredAndSortedItems.length} van ${infoItems.length} info items`;

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <ViewHeader title="Info Pagina" countText={countText} onAddNew={handleAddNew} onSearch={setSearchTerm} searchTerm={searchTerm} hasEditPermissions={hasEditPermissions} />
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {filteredAndSortedItems.map(item => (
                        <li key={item.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{item.NameNl}</h3>
                                <a href={item.MeerInfoNl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline truncate max-w-2xl block">{item.MeerInfoNl}</a>
                            </div>
                            {hasEditPermissions && (
                                <div className="flex space-x-2">
                                    <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 p-2">{icons.edit}</button>
                                    <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 p-2">{icons.trash}</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {isModalOpen && (
                <InfoForm item={editingItem} onClose={() => setIsModalOpen(false)} onSave={(data) => {
                    if (editingItem) onUpdate(editingItem.id, data);
                    else onAdd(data);
                    setIsModalOpen(false);
                }} />
            )}
        </div>
    );
}

function InfoForm({ item, onClose, onSave }) {
    const [formData, setFormData] = useState({
        NameNl: item?.NameNl || '',
        NameEng: item?.NameEng || '',
        MeerInfoNl: item?.MeerInfoNl || '',
        MeerInfoEng: item?.MeerInfoEng || '',
        MeerInfoAfbeelding: item?.MeerInfoAfbeelding || '',
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
                <h3 className="text-2xl font-bold mb-6">{item ? 'Info Item Bewerken' : 'Nieuw Info Item'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="NameNl" value={formData.NameNl} onChange={handleChange} placeholder="Titel (NL)" className="w-full p-2 border rounded" />
                    <input type="text" name="NameEng" value={formData.NameEng} onChange={handleChange} placeholder="Titel (EN)" className="w-full p-2 border rounded" />
                    <input type="url" name="MeerInfoNl" value={formData.MeerInfoNl} onChange={handleChange} placeholder="URL (NL)" className="w-full p-2 border rounded" />
                    <input type="url" name="MeerInfoEng" value={formData.MeerInfoEng} onChange={handleChange} placeholder="URL (EN)" className="w-full p-2 border rounded" />
                    <input type="url" name="MeerInfoAfbeelding" value={formData.MeerInfoAfbeelding} onChange={handleChange} placeholder="Afbeelding URL" className="w-full p-2 border rounded" />
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
function NieuwsView({ nieuwsItems, onAdd, onUpdate, onDelete, hasEditPermissions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { filteredAndSortedItems, searchTerm, setSearchTerm } = useSortAndFilter(nieuwsItems, 'NieuwsTitelNl', ['NieuwsTitelNl', 'NieuwsTitelEng']);
    const countText = `Toont ${filteredAndSortedItems.length} van ${nieuwsItems.length} nieuws items`;

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <ViewHeader title="Nieuws" countText={countText} onAddNew={handleAddNew} onSearch={setSearchTerm} searchTerm={searchTerm} hasEditPermissions={hasEditPermissions} />
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {filteredAndSortedItems.map(item => (
                        <li key={item.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{item.NieuwsTitelNl}</h3>
                                <a href={item.NieuwsUrlNl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline truncate max-w-2xl block">{item.NieuwsUrlNl}</a>
                            </div>
                            {hasEditPermissions && (
                                <div className="flex space-x-2">
                                    <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 p-2">{icons.edit}</button>
                                    <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 p-2">{icons.trash}</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {isModalOpen && (
                <NieuwsForm item={editingItem} onClose={() => setIsModalOpen(false)} onSave={(data) => {
                    if (editingItem) onUpdate(editingItem.id, data);
                    else onAdd(data);
                    setIsModalOpen(false);
                }} />
            )}
        </div>
    );
}

function NieuwsForm({ item, onClose, onSave }) {
    const [formData, setFormData] = useState({
        NieuwsTitelNl: item?.NieuwsTitelNl || '',
        NieuwsTitelEng: item?.NieuwsTitelEng || '',
        NieuwsUrlNl: item?.NieuwsUrlNl || '',
        NieuwsUrlEng: item?.NieuwsUrlEng || '',
        NieuwsAfbeelding: item?.NieuwsAfbeelding || '',
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
                <h3 className="text-2xl font-bold mb-6">{item ? 'Nieuws Item Bewerken' : 'Nieuw Nieuws Item'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="NieuwsTitelNl" value={formData.NieuwsTitelNl} onChange={handleChange} placeholder="Titel (NL)" className="w-full p-2 border rounded" />
                    <input type="text" name="NieuwsTitelEng" value={formData.NieuwsTitelEng} onChange={handleChange} placeholder="Titel (EN)" className="w-full p-2 border rounded" />
                    <input type="url" name="NieuwsUrlNl" value={formData.NieuwsUrlNl} onChange={handleChange} placeholder="URL (NL)" className="w-full p-2 border rounded" />
                    <input type="url" name="NieuwsUrlEng" value={formData.NieuwsUrlEng} onChange={handleChange} placeholder="URL (EN)" className="w-full p-2 border rounded" />
                    <input type="url" name="NieuwsAfbeelding" value={formData.NieuwsAfbeelding} onChange={handleChange} placeholder="Afbeelding URL" className="w-full p-2 border rounded" />
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ToegankelijkheidView({ toegankelijkheidItems, onAdd, onUpdate, onDelete, hasEditPermissions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { filteredAndSortedItems, searchTerm, setSearchTerm } = useSortAndFilter(toegankelijkheidItems, 'ToegankelijkheidTitleNl', ['ToegankelijkheidTitleNl', 'ToegankelijkheidTitleEng']);
    const countText = `Toont ${filteredAndSortedItems.length} van ${toegankelijkheidItems.length} items`;

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <ViewHeader title="Toegankelijkheid" countText={countText} onAddNew={handleAddNew} onSearch={setSearchTerm} searchTerm={searchTerm} hasEditPermissions={hasEditPermissions} />
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {filteredAndSortedItems.map(item => (
                        <li key={item.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{item.ToegankelijkheidTitleNl}</h3>
                                <a href={item.ToegankelijkheidUrlNl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline truncate max-w-2xl block">{item.ToegankelijkheidUrlNl}</a>
                            </div>
                            {hasEditPermissions && (
                                <div className="flex space-x-2">
                                    <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 p-2">{icons.edit}</button>
                                    <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 p-2">{icons.trash}</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            {isModalOpen && (
                <ToegankelijkheidForm item={editingItem} onClose={() => setIsModalOpen(false)} onSave={(data) => {
                    if (editingItem) onUpdate(editingItem.id, data);
                    else onAdd(data);
                    setIsModalOpen(false);
                }} />
            )}
        </div>
    );
}

function ToegankelijkheidForm({ item, onClose, onSave }) {
    const [formData, setFormData] = useState({
        ToegankelijkheidTitleNl: item?.ToegankelijkheidTitleNl || '',
        ToegankelijkheidTitleEng: item?.ToegankelijkheidTitleEng || '',
        ToegankelijkheidUrlNl: item?.ToegankelijkheidUrlNl || '',
        ToegankelijkheidUrlEng: item?.ToegankelijkheidUrlEng || '',
        ToegankelijkheidAfbeelding: item?.ToegankelijkheidAfbeelding || '',
    });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
                <h3 className="text-2xl font-bold mb-6">{item ? 'Toegankelijkheid Item Bewerken' : 'Nieuw Toegankelijkheid Item'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="ToegankelijkheidTitleNl" value={formData.ToegankelijkheidTitleNl} onChange={handleChange} placeholder="Titel (NL)" className="w-full p-2 border rounded" />
                    <input type="text" name="ToegankelijkheidTitleEng" value={formData.ToegankelijkheidTitleEng} onChange={handleChange} placeholder="Titel (EN)" className="w-full p-2 border rounded" />
                    <input type="url" name="ToegankelijkheidUrlNl" value={formData.ToegankelijkheidUrlNl} onChange={handleChange} placeholder="URL (NL)" className="w-full p-2 border rounded" />
                    <input type="url" name="ToegankelijkheidUrlEng" value={formData.ToegankelijkheidUrlEng} onChange={handleChange} placeholder="URL (EN)" className="w-full p-2 border rounded" />
                    <input type="url" name="ToegankelijkheidAfbeelding" value={formData.ToegankelijkheidAfbeelding} onChange={handleChange} placeholder="Afbeelding URL" className="w-full p-2 border rounded" />
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
function ScheduleView({ events, performances, executions, locations, companies, onQuickView }) {
    const [selectedEventId, setSelectedEventId] = useState(events.length > 0 ? events[0].id : '');
    
    const sortedEvents = useMemo(() => [...events].sort((a,b) => a.Name.localeCompare(b.Name)), [events]);

    const scheduleData = useMemo(() => {
        if (!selectedEventId) return [];
        
        const event = events.find(e => e.id === selectedEventId);
        if (!event || !event.executionIds) return [];

        const eventExecutions = (event.executionIds || [])
            .map(execId => executions.find(e => e.id === execId))
            .filter(Boolean)
            .map(e => {
                const performance = performances.find(p => p.id === e.performanceId);
                const company = performance ? companies.find(c => c.id === performance.companyId) : null;
                return {
                    ...e,
                    performance,
                    company,
                    location: locations.find(l => l.id === e.locationId),
                    dateTime: new Date(e.DateTime)
                }
            })
            .filter(e => e.performance && e.location && e.company);

        const executionsByDate = eventExecutions.reduce((acc, exec) => {
            const dateKey = exec.dateTime.toISOString().split('T')[0];
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(exec);
            return acc;
        }, {});

        const dailySchedules = Object.keys(executionsByDate).map(dateKey => {
            const dayExecutions = executionsByDate[dateKey];
            if (dayExecutions.length === 0) return null;

            const times = dayExecutions.map(e => e.dateTime.getTime());
            const minDateTime = new Date(Math.min(...times));
            const maxDateTime = new Date(Math.max(...times));

            const timeSlots = [];
            let currentTime = new Date(minDateTime);
            currentTime.setMinutes(Math.floor(currentTime.getMinutes() / 30) * 30, 0, 0);

            let endTime = new Date(maxDateTime);
            endTime.setMinutes(endTime.getMinutes() + 30);
            endTime.setMinutes(Math.ceil(endTime.getMinutes() / 30) * 30, 0, 0);

            while (currentTime < endTime) {
                timeSlots.push(new Date(currentTime));
                currentTime.setMinutes(currentTime.getMinutes() + 30);
            }

            const dayLocations = Array.from(new Set(dayExecutions.map(e => e.locationId)))
                .map(locationId => {
                    const location = locations.find(l => l.id === locationId);
                    const locationExecutions = dayExecutions.filter(e => e.locationId === locationId);
                    return { ...location, executions: locationExecutions };
                })
                .sort((a, b) => a.Name.localeCompare(b.Name));

            return {
                date: new Date(dateKey + 'T12:00:00'),
                timeSlots,
                locations: dayLocations
            };
        }).filter(Boolean);

        return dailySchedules.sort((a, b) => a.date - b.date);

    }, [selectedEventId, performances, executions, locations, events, companies]);

    const getExecutionPosition = (execution, timeSlots) => {
        const startTime = execution.dateTime;
        const durationMinutes = 30;
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        let startSlotIndex = -1;
        for (let i = 0; i < timeSlots.length; i++) {
            const slotStart = timeSlots[i];
            const slotEnd = new Date(slotStart.getTime() + 30 * 60000);
            if (startTime >= slotStart && startTime < slotEnd) {
                startSlotIndex = i;
                break;
            }
        }
        if (startSlotIndex === -1) return { startSlotIndex: 0, span: 1 };

        let endSlotIndex = startSlotIndex;
        for (let i = startSlotIndex; i < timeSlots.length; i++) {
            const slotEnd = new Date(timeSlots[i].getTime() + 30 * 60000);
            if (endTime > slotEnd) {
                endSlotIndex = i + 1;
            } else {
                break;
            }
        }
        endSlotIndex = Math.min(endSlotIndex, timeSlots.length - 1);

        const span = Math.max(1, endSlotIndex - startSlotIndex + 1);
        return { startSlotIndex, span };
    };
    
    const handleExport = () => {
        if (!selectedEventId || scheduleData.length === 0) {
            console.warn("Geen data om te exporteren.");
            return;
        }

        const event = events.find(e => e.id === selectedEventId);
        const eventName = event ? event.Name.replace(/\s/g, '_') : 'schema';

        const flattenedData = [];
        scheduleData.forEach(day => {
            const dateString = day.date.toLocaleDateString('nl-NL', { year: 'numeric', month: '2-digit', day: '2-digit' });
            day.locations.forEach(location => {
                location.executions.forEach(exec => {
                    flattenedData.push({
                        Datum: dateString,
                        Tijd: exec.dateTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
                        Locatie: location.Name,
                        Voorstelling: exec.performance.Title,
                        Gezelschap: exec.company.Name,
                    });
                });
            });
        });

        if (flattenedData.length > 0) {
            exportTo(`blokkenschema_${eventName}.csv`, flattenedData);
        }
    };

    return (
        <div>
            <ViewHeader
                title="Blokkenschema"
                onExport={handleExport}
            >
                <div className="w-64">
                    <select 
                        value={selectedEventId} 
                        onChange={e => setSelectedEventId(e.target.value)} 
                        className="w-full p-2 border rounded-md shadow-sm"
                    >
                        <option value="">Selecteer een event</option>
                        {sortedEvents.map(event => (
                            <option key={event.id} value={event.id}>{event.Name}</option>
                        ))}
                    </select>
                </div>
            </ViewHeader>

            {selectedEventId && scheduleData.length > 0 ? (
                <div className="space-y-12">
                    {scheduleData.map(day => (
                        <div key={day.date.toISOString()}>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                                {day.date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h3>
                            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                                <div className="grid" style={{ gridTemplateColumns: `150px 1fr` }}>
                                    <div className="sticky left-0 bg-gray-100 p-2 font-semibold z-20 border-b border-r border-gray-300">Locatie</div>
                                    <div className="grid" style={{ gridTemplateColumns: `repeat(${day.timeSlots.length}, minmax(100px, 1fr))` }}>
                                        {day.timeSlots.map(time => (
                                            <div key={time.toISOString()} className="bg-gray-50 p-2 text-center text-sm font-semibold border-b border-l border-gray-200">
                                                {time.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        ))}
                                    </div>

                                    {day.locations.map(location => (
                                        <React.Fragment key={location.id}>
                                            <div className="sticky left-0 bg-white p-2 font-semibold z-10 border-t border-r border-gray-300 flex items-center">{location.Name}</div>
                                            <div className="relative grid border-t border-gray-200" style={{ gridTemplateColumns: `repeat(${day.timeSlots.length}, minmax(100px, 1fr))` }}>
                                                {day.timeSlots.map((_, index) => (
                                                    <div key={index} className="border-l border-gray-200 h-full"></div>
                                                ))}
                                                {location.executions.map(exec => {
                                                    const { startSlotIndex, span } = getExecutionPosition(exec, day.timeSlots);
                                                    return (
                                                        <button
                                                            key={exec.id}
                                                            onClick={() => onQuickView({ item: exec.performance, type: 'performance' })}
                                                            className="absolute bg-indigo-100 text-indigo-800 p-2 rounded-md text-xs m-1 flex flex-col justify-center cursor-pointer hover:bg-indigo-200 border border-indigo-300 shadow-sm text-left"
                                                            style={{
                                                                left: `calc(${(100 / day.timeSlots.length) * startSlotIndex}%)`,
                                                                width: `calc(${(100 / day.timeSlots.length) * span}%)`,
                                                                top: '0.25rem',
                                                                bottom: '0.25rem'
                                                            }}
                                                        >
                                                            <p className="font-bold truncate">{exec.performance.Title}</p>
                                                            <p className="truncate italic text-indigo-600">{exec.company.Name}</p>
                                                            <p className="mt-1">{exec.dateTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</p>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
            {selectedEventId && scheduleData.length === 0 && <p className="text-center p-8 bg-white rounded-lg shadow-md">Geen uitvoeringen gevonden voor dit event.</p>}
            {!selectedEventId && <p className="text-center p-8 bg-white rounded-lg shadow-md">Selecteer een event om het schema te zien.</p>}
        </div>
    );
}

const contractTemplateNL = `Het Café Theater Festival (CTF), rechtsgeldig vertegenwoordigd door Christiaan Uytdehaage, en [company_name], hierna te noemen ‘gezelschap’, spreken het volgende met elkaar af:

1. Het gezelschap maakt een voorstelling die speelt op [event_names]. De voorstelling speelt in totaal [execution_count] keer verspreid over [execution_day_count] dagen.
2. Het gezelschap speelt een try-out voor ieder event is daarvoor beschikbaar op de daarvoor gecommuniceerde datum.
3. Het gezelschap repeteert minimaal drie keer in het café om de voorstelling goed af te stemmen op de ruimte. (Indien het gezelschap vaker op locatie wil repeteren, kan dat alleen bij toestemming van het café.)
4. Indien zich tijdens het maakproces belangrijke wijzigingen voordoen, bijvoorbeeld in de ontwikkeling van het artistieke concept, dient het gezelschap het CTF hiervan z.s.m. op de hoogte te brengen.
5. Het gezelschap houdt zich aan de door het CTF gestelde deadlines.
6. Het gezelschap zal tijdens werkzaamheden geen gebruik maken van alcohol, (soft)drugs of andere verdovende middelen.
7. Tijdens het festival worden foto’s gemaakt van de voorstellingen, die door het CTF vrij gebruikt worden voor publicitaire doeleinden als social media, pers, nieuwsbrieven en postercampagnes. Het gezelschap is vrij deze foto’s ook zelf te gebruiken onder vermelding van de fotograaf. Indien het CTF een voorstellingsbeeld in grote oplage wil verspreiden (zoals via een postercampagne), wordt de artiest hiervan op de hoogte gesteld.
8. Indien het gezelschap (technische) ondersteuning nodig heeft tijdens de voorstelling, dient het gezelschap hier zelf iemand voor mee te nemen. Deze persoon staat genoteerd op de namenlijst in deze overeenkomst.
9. Omdat het concept dit niet toelaat, maakt het CTF geen gebruik van ticketverkoop. In plaats hiervan werken we op het festival met het Pay What You Can-systeem, waarbij het aanwezige publiek achteraf gevraagd wordt om een donatie te doen. Deze donaties worden gebruikt om de uitkoopsommen van de makers te bekostigen. Hierbij gaat het CTF uit van uitkoopsommen van €250 (excl. btw) per speler per speeldag. Voor [company_name] komt de totale vergoeding uit op [total_gage].
10. Voor de spelers (en de eventuele technicus) die woonachtig zijn buiten de stad Rotterdam kunnen er op verzoek overnachtingen geregeld worden tijdens het festival (mogelijk op een gedeelde kamer).
11. Voor de spelers (en de eventuele technicus) faciliteert het CTF de mogelijkheid om zich aan te melden voor de catering van de avondmaaltijd tijdens de festivaldagen. Hiervoor wordt een bijdrage van €5,- per persoon, per avondmaaltijd gevraagd van het gezelschap. Het gezelschap geeft van tevoren door of en zo ja, met hoeveel personen ze hiervan gebruik willen maken. De totale maaltijd bijdrage wordt afgerekend op het locatie kantoor tijdens de eerste festivaldag.
12. Het gezelschap is zelf verantwoordelijk voor de afdracht van vergoedingen in verband met auteursrechten op muziek, tekst of beeldmateriaal indien gebruikt in de voorstelling.
13. Het gezelschap heeft kennisgenomen van het ‘Veiligheidsprotocol spelen op het CTF’ en ‘Veiligheidsprotocol algemeen Café Theater Festival’, beide te vinden via CTFartiest.nl. Het gezelschap stemt in met het naleven van beide protocollen.

Tijdens het Café Theater Festival zijn onderstaande leden van het gezelschap aanwezig bij de voorstellingen. Vergeet niet een eventuele technisch ondersteuner te vermelden. Indien je hier nog geen naam voor hebt, noteer je op het contract: ‘technicus, naam nog onbekend’. Het vermelde aantal personen wordt contractueel vastgelegd met onze cafés en kan zodoende niet gewijzigd worden na het tekenen van dit contract.

Onderdeel van het gezelschap zijn:
[artist_list]

Namens Café Theater Festival:                                       Namens [company_name]:

Christiaan Uytdehaage, Zakelijk directeur                           Naam:
Datum: [current_date]                                               Datum:
Handtekening:                                                       Handtekening:
`;

const contractTemplateEN = `The Café Theater Festival (CTF), legally represented by Christiaan Uytdehaage, and [company_name], hereinafter referred to as 'the company', agree to the following:

1. The company will create a performance that will be performed at [event_names]. The performance will be staged a total of [execution_count] times, spread over [execution_day_count] days.
2. The company will perform a try-out for each event and will be available on the communicated date.
3. The company will rehearse at least three times in the café to properly adapt the performance to the space. (If the company wishes to rehearse on location more often, this is only possible with the permission of the café.)
4. If significant changes occur during the creation process, for example in the development of the artistic concept, the company must inform the CTF as soon as possible.
5. The company will adhere to the deadlines set by the CTF.
6. The company will not use alcohol, (soft) drugs, or other narcotics during work activities.
7. During the festival, photographs will be taken of the performances, which may be used freely by the CTF for publicity purposes such as social media, press, newsletters, and poster campaigns. The company is also free to use these photos, provided the photographer is credited. If the CTF wishes to distribute a performance image in large quantities (such as through a poster campaign), the artist will be informed.
8. If the company requires (technical) support during the performance, the company must provide this person themselves. This person will be listed on the name list in this agreement.
9. Because the concept does not allow for it, the CTF does not use ticket sales. Instead, the festival operates on a Pay What You Can system, where the audience is asked to make a donation afterwards. These donations are used to cover the buyout fees for the creators. The CTF assumes buyout fees of €250 (excl. VAT) per performer per performance day. For [company_name], the total fee amounts to [total_gage].
10. For performers (and any technician) residing outside the city of Rotterdam, overnight stays can be arranged upon request during the festival (possibly in a shared room).
11. For the performers (and any technician), the CTF facilitates the option to sign up for evening meal catering during the festival days. A contribution of €5 per person, per evening meal is requested from the company for this. The company must indicate in advance whether they will use this service and, if so, for how many people. The total meal contribution will be settled at the location office on the first day of the festival.
12. The company is responsible for the payment of fees related to copyrights on music, text, or visual material used in the performance.
13. The company has taken note of the 'Safety Protocol for performing at the CTF' and 'General Safety Protocol Café Theater Festival', both available at CTFartiest.nl. The company agrees to comply with both protocols.

The following members of the company will be present at the performances during the Café Theater Festival. Do not forget to mention any technical support. If you do not have a name yet, note on the contract: 'technician, name unknown'. The number of people mentioned is contractually fixed with our cafés and therefore cannot be changed after signing this contract.

Part of the company are:
[artist_list]

On behalf of Café Theater Festival:                                 On behalf of [company_name]:

Christiaan Uytdehaage, Business Director                            Name:
Date: [current_date]                                                Date:
Signature:                                                          Signature:
`;

function ContractGenerator({ contacts, companies, performances, events, executions, showNotification }) {
  const [selectedPerformanceId, setSelectedPerformanceId] = useState('');
  const [contractText, setContractText] = useState('');
  const [language, setLanguage] = useState('nl');

  useEffect(() => {
    if (!document.getElementById('jspdf-script')) {
      const script = document.createElement('script');
      script.id = 'jspdf-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  
  const generateContract = () => {
    const performance = performances.find(p => p.id === selectedPerformanceId);
    if (!performance) {
      showNotification("Selecteer een voorstelling.", "error");
      return;
    }
    const company = companies.find(c => c.id === performance.companyId);
    if (!company) {
        showNotification("Kon het gezelschap voor deze voorstelling niet vinden.", "error");
        return;
    }

    const performanceExecutions = executions.filter(exec => exec.performanceId === performance.id);
    const executionIds = new Set(performanceExecutions.map(e => e.id));
    const uniqueExecutionDays = new Set(performanceExecutions.map(exec => new Date(exec.DateTime).toISOString().split('T')[0]));
    const executionDayCount = uniqueExecutionDays.size;
    const relevantEvents = events.filter(event => (event.executionIds || []).some(execId => executionIds.has(execId)));
    const eventNames = relevantEvents.map(e => e.Name);
    
    let eventNameString;
    if (language === 'nl') {
        eventNameString = eventNames.join(', ');
        if (eventNames.length > 1) {
            const last = eventNames.pop();
            eventNameString = eventNames.join(', ') + ' en ' + last;
        }
    } else {
        eventNameString = eventNames.join(', ');
        if (eventNames.length > 1) {
            const last = eventNames.pop();
            eventNameString = eventNames.join(', ') + ' and ' + last;
        }
    }

    const executionCount = performanceExecutions.length;
    const playerCount = (company.playerIds || []).length;
    const totalGageFromEvents = relevantEvents.reduce((sum, event) => sum + (parseFloat(event.gage) || 0), 0);
    const totalCalculatedGage = playerCount * totalGageFromEvents;

    const companyPlayerIds = new Set(company.playerIds || []);
    const allMemberIds = new Set([...companyPlayerIds, company.contactPersonId].filter(Boolean));
    const companyArtists = contacts.filter(c => allMemberIds.has(c.id));
    const artistListString = companyArtists
        .map(a => `${a.Name}${companyPlayerIds.has(a.id) ? (language === 'nl' ? ', speler' : ', performer') : ''}`)
        .join('\n');

    const formattedDate = new Date().toLocaleDateString('nl-NL');

    let template = language === 'nl' ? contractTemplateNL : contractTemplateEN;
    const replacements = {
        '[company_name]': company.Name,
        '[event_names]': eventNameString || (language === 'nl' ? 'N.v.t.' : 'N/A'),
        '[execution_count]': executionCount,
        '[execution_day_count]': executionDayCount,
        '[total_gage]': `€${totalCalculatedGage.toFixed(2)}`,
        '[artist_list]': artistListString || (language === 'nl' ? 'Geen artiesten.' : 'No artists.'),
        '[current_date]': formattedDate,
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
        template = template.replace(new RegExp(escapeRegExp(placeholder), 'g'), value);
    }

    setContractText(template.trim());
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractText).then(() => {
        showNotification('Contract gekopieerd naar klembord!');
    }, () => {
        showNotification('Kon contract niet kopiëren.', 'error');
    });
  };

  const handleExportPDF = async () => {
    if (!contractText || !selectedPerformanceId) {
        showNotification('Genereer eerst een contract om te exporteren.', 'error');
        return;
    }
    if (!window.jspdf) {
        showNotification('PDF bibliotheek is aan het laden, probeer het zo opnieuw.', 'warning');
        return;
    }

    const performance = performances.find(p => p.id === selectedPerformanceId);
    const company = companies.find(c => c.id === performance.companyId);
    const fileName = `Contract-${company.Name.replace(/\s/g, '_')}.pdf`;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt' });

    const addTextAndSave = (logoData = null) => {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 40;
        let yPos = margin;

        if (logoData) {
            const imgProps = doc.getImageProperties(logoData);
            const logoWidth = 100;
            const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
            doc.addImage(logoData, 'PNG', pageWidth - logoWidth - margin, margin, logoWidth, logoHeight);
            yPos += logoHeight + 20;
        }

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        
        const lines = doc.splitTextToSize(contractText, pageWidth - (margin * 2));
        doc.text(lines, margin, yPos);
        
        doc.save(fileName);
        showNotification('PDF succesvol geëxporteerd!');
    };
    
    try {
        const logoUrl = 'https://cafetheaterfestival.nl/wp-content/uploads/2025/06/Logo_Web_Trans_Zwart.png';
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${logoUrl}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Network response was not ok.');

        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => addTextAndSave(reader.result);
        reader.onerror = () => {
             console.error("FileReader error on logo.");
             addTextAndSave();
        }
    } catch (error) {
        console.error("Kon logo niet laden voor PDF, ga verder zonder.", error);
        showNotification('Logo kon niet geladen worden, PDF wordt zonder logo gemaakt.', 'warning');
        addTextAndSave();
    }
  };

  return (
    <div>
      <ViewHeader title="Contract Generator (Gezelschappen)" />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kies Voorstelling</label>
                <select value={selectedPerformanceId} onChange={e => setSelectedPerformanceId(e.target.value)} className="w-full p-2 border rounded-md shadow-sm">
                  <option value="">Selecteer een voorstelling...</option>
                  {performances.sort((a,b) => a.Title.localeCompare(b.Title)).map(p => {
                    const company = companies.find(c => c.id === p.companyId);
                    return <option key={p.id} value={p.id}>{p.Title} ({company?.Name || 'Onbekend'})</option>
                  })}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kies Taal</label>
                <div className="flex space-x-2">
                    <button onClick={() => setLanguage('nl')} className={`w-full p-2 rounded-md ${language === 'nl' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Nederlands</button>
                    <button onClick={() => setLanguage('en')} className={`w-full p-2 rounded-md ${language === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>English</button>
                </div>
            </div>
        </div>
        <button onClick={generateContract} className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 mb-6 shadow-md">
          Genereer Contract
        </button>

        {contractText && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Conceptcontract</h3>
            <textarea readOnly value={contractText} className="w-full h-96 p-4 border rounded bg-gray-50 font-mono text-sm leading-relaxed"></textarea>
            <div className="mt-4 flex space-x-2">
              <button onClick={copyToClipboard} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md flex items-center space-x-2">
                {icons.copy}
                <span>Kopieer naar Klembord</span>
              </button>
               <button onClick={handleExportPDF} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md flex items-center space-x-2">
                  {icons.pdf}
                  <span>Exporteer als PDF</span>
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const cafeContractTemplateNL = `OVEREENKOMST DEELNAME AAN HET CAFÉ THEATER FESTIVAL 2025
Stichting Cafétheaterfestival, hierna te noemen: “Café Theater Festival”
en
[location_name] hierna te noemen: “Café”
zijn het volgende overeengekomen:

-Het Café geeft hierbij aan zich open te stellen voor het [event_names], dit festival vindt plaats op [execution_dates].
-Het Café stelt zich open voor een try-out van de voorstelling. Na de voorstelling leidt de organisatie van het Café Theater Festival een kort nagesprek met het aanwezige publiek.
-De groep die tijdens het Café Theater Festival in uw Café zal spelen is [company_names]. De groep bestaat uit [player_count] personen. Contactpersoon [company_contact_person_names] is te bereiken via [company_contact_person_emails] of [company_contact_person_phones].
-De tijden van de voorstellingen in het Café zijn als volgt:
[execution_schedule]
-Mocht de groep door redenen van overmacht niet kunnen spelen dan doet de organisatie van het Café Theater Festival haar uiterste best voor passende vervanging te zorgen.
-Tijdens het festival zal er een vrijwilliger aanwezig zijn die de voorstelling en de spelers begeleidt en het publiek te woord staat.
-Conform de afspraak zal het Café de leden van het gezelschap en de vrijwilliger één consumptie per persoon per voorstelling aanbieden. Dit geldt ook voor de Try-Out.
-Indien het Café eten serveert vragen wij het Café, wanneer gewenst door de artiest(en), de artiest(en) en vrijwilliger van een avondmaaltijd te voorzien. Hiervoor kan het Café direct met de artiest(en) €5 incl. BTW per persoon per maaltijd afrekenen, met uitzondering van de vrijwilliger. Deze eigen bijdrage door de artiest(en) is gelijk aan de bijdrage welke wij vragenwanneer een café geen eten serveert.
-Andere programmering op de locatie zal ruim om de voorstellingstijden heen gepland worden, zodat de voorstelling hiervan geen hinder ondervindt.
-Medewerkers van het Café zullen gedurende de voorstellingen zo min mogelijk geluidsoverlast veroorzaken, bijvoorbeeld door tijdens de voorstelling geen melkschuim voor cappuccino’s te maken.
-Het Café is gedurende het festival verantwoordelijk voor de veiligheid van alle aanwezigen in het pand. Medewerkers van het Café controleren de drukte en houden zich aan de geldende veiligheidseisen die door de brandweer zijn opgelegd aan het Café.
-Voor deelname aan het festival brengt het Café Theater een bedrag van €[location_contribution],- exclusief btw in rekening bij het Café.
-Indien er schade ontstaat aan de opstal, de inrichting of het meubilair van de locatie, aantoonbaar veroorzaakt door het CTF, kan deze schade verhaald worden op het CTF, meteen maximum van €500. Hierbij dient het Café een bewijsstuk van de reparatie of vervangende aanschaf overlegd te worden aan het CTF.

Aldus (in tweevoud opgemaakt) overeengekomen en ondertekend te Utrecht,

Stichting Cafétheaterfestival
Vertegenwoordigd door: Christiaan Uytdehaage
Datum: [current_date]
Handtekening:

[location_name]
Vertegenwoordigd door: 
Datum:
Handtekening:
`;

const cafeContractTemplateEN = `AGREEMENT FOR PARTICIPATION IN THE CAFÉ THEATER FESTIVAL 2025
Stichting Cafétheaterfestival, hereinafter referred to as: “Café Theater Festival”
and
[location_name] hereinafter referred to as: “Café”
have agreed as follows:

-The Café hereby declares its willingness to host [event_names], this festival takes place on [execution_dates].
-The Café is open to a try-out of the performance. After the performance, the Café Theater Festival organization will lead a short post-show talk with the audience present.
-The group that will perform in your Café during the Café Theater Festival is [company_names]. The group consists of [player_count] people. Contact person [company_contact_person_names] can be reached via [company_contact_person_emails] or [company_contact_person_phones].
-The performance times in the Café are as follows:
[execution_schedule]
-Should the group be unable to perform due to force majeure, the Café Theater Festival organization will do its utmost to arrange for a suitable replacement.
-During the festival, a volunteer will be present to supervise the performance and the performers and to assist the audience.
-As agreed, the Café will offer the members of the company and the volunteer one consumption per person per performance. This also applies to the Try-Out.
-If the Café serves food, we ask the Café, if desired by the artist(s), to provide the artist(s) and volunteer with an evening meal. For this, the Café can charge the artist(s) directly €5 incl. VAT per person per meal, with the exception of the volunteer. This personal contribution by the artist(s) is equal to the contribution we ask when a café does not serve food.
-Other programming at the location will be scheduled well around the performance times, so that the performance is not hindered.
-Café staff will cause as little noise as possible during the performances, for example by not making milk foam for cappuccinos during the performance.
-During the festival, the Café is responsible for the safety of all persons present on the premises. Café staff will monitor the crowd and adhere to the applicable safety requirements imposed on the Café by the fire department.
-For participation in the festival, the Café Theater will charge the Café an amount of €[location_contribution],- excluding VAT.
-If damage occurs to the building, the interior, or the furniture of the location, demonstrably caused by the CTF, this damage can be recovered from the CTF, with a maximum of €500. The Café must provide proof of the repair or replacement purchase to the CTF.

Thus agreed and signed in duplicate in Utrecht,

Stichting Cafétheaterfestival
Represented by: Christiaan Uytdehaage
Date: [current_date]
Signature:

[location_name]
Represented by: 
Date:
Signature:
`;

function CafeContractGenerator({ contacts, companies, performances, events, executions, locations, showNotification }) {
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [contractText, setContractText] = useState('');
  const [language, setLanguage] = useState('nl');

  useEffect(() => {
    if (!document.getElementById('jspdf-script')) {
      const script = document.createElement('script');
      script.id = 'jspdf-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  
  const generateContract = () => {
    const location = locations.find(l => l.id === selectedLocationId);
    if (!location) {
      showNotification("Selecteer een locatie.", "error");
      return;
    }

    const locationExecutions = executions.filter(exec => exec.locationId === location.id);
    if (locationExecutions.length === 0) {
        showNotification("Deze locatie heeft geen gekoppelde uitvoeringen.", "warning");
        return;
    }
    
    const performanceIds = new Set(locationExecutions.map(e => e.performanceId));
    const relevantPerformances = performances.filter(p => performanceIds.has(p.id));
    
    const companyIds = new Set(relevantPerformances.map(p => p.companyId));
    const relevantCompanies = companies.filter(c => companyIds.has(c.id));
    
    const executionIds = new Set(locationExecutions.map(e => e.id));
    const relevantEvents = events.filter(event => (event.executionIds || []).some(execId => executionIds.has(execId)));
    
    const eventNames = relevantEvents.map(e => e.Name);
    let eventNameString;
    if (language === 'nl') {
        eventNameString = eventNames.length > 1 ? eventNames.slice(0, -1).join(', ') + ' en ' + eventNames.slice(-1) : eventNames[0];
    } else {
        eventNameString = eventNames.length > 1 ? eventNames.slice(0, -1).join(', ') + ' and ' + eventNames.slice(-1) : eventNames[0];
    }

    const uniqueExecutionDates = Array.from(new Set(locationExecutions.map(exec => exec.DateTime.split('T')[0])))
        .sort((a,b) => new Date(a) - new Date(b))
        .map(dateStr => new Date(dateStr).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' }));
    
    const companyNames = relevantCompanies.map(c => c.Name).join(', ');
    const playerCount = relevantCompanies.reduce((sum, c) => sum + (c.playerIds?.length || 0), 0);
    
    const contactPersons = relevantCompanies.map(c => contacts.find(p => p.id === c.contactPersonId)).filter(Boolean);
    const contactPersonNames = contactPersons.map(p => p.Name).join(', ');
    const contactPersonEmails = contactPersons.map(p => p.Email).join(', ');
    const contactPersonPhones = contactPersons.map(p => p.Phone).join(', ');

    const executionsByDate = locationExecutions.reduce((acc, exec) => {
        const dateKey = exec.DateTime.split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(new Date(exec.DateTime).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }));
        return acc;
    }, {});
    
    const executionSchedule = Object.entries(executionsByDate)
        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
        .map(([date, times]) => {
            const formattedDate = new Date(date).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
            return `${formattedDate}: ${times.sort().join(', ')}`;
        }).join('\n');

    const formattedDate = new Date().toLocaleDateString('nl-NL');

    let template = language === 'nl' ? cafeContractTemplateNL : cafeContractTemplateEN;
    const replacements = {
        '[location_name]': location.Name,
        '[event_names]': eventNameString || (language === 'nl' ? 'N.v.t.' : 'N/A'),
        '[execution_dates]': uniqueExecutionDates.join(', '),
        '[company_names]': companyNames || (language === 'nl' ? 'Nog niet bekend' : 'Not yet known'),
        '[player_count]': playerCount,
        '[company_contact_person_names]': contactPersonNames || (language === 'nl' ? 'N.v.t.' : 'N/A'),
        '[company_contact_person_emails]': contactPersonEmails || (language === 'nl' ? 'N.v.t.' : 'N/A'),
        '[company_contact_person_phones]': contactPersonPhones || (language === 'nl' ? 'N.v.t.' : 'N/A'),
        '[execution_schedule]': executionSchedule || (language === 'nl' ? 'Nog niet gepland' : 'Not yet scheduled'),
        '[location_contribution]': location.Bijdrage || 0,
        '[current_date]': formattedDate,
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
        template = template.replace(new RegExp(escapeRegExp(placeholder), 'g'), value);
    }

    setContractText(template.trim());
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractText).then(() => {
        showNotification('Contract gekopieerd naar klembord!');
    }, () => {
        showNotification('Kon contract niet kopiëren.', 'error');
    });
  };

  const handleExportPDF = async () => {
    if (!contractText || !selectedLocationId) {
        showNotification('Genereer eerst een contract om te exporteren.', 'error');
        return;
    }
    if (!window.jspdf) {
        showNotification('PDF bibliotheek is aan het laden, probeer het zo opnieuw.', 'warning');
        return;
    }

    const location = locations.find(l => l.id === selectedLocationId);
    const fileName = `Contract-Cafe-${location.Name.replace(/\s/g, '_')}.pdf`;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt' });

    const addTextAndSave = (logoData = null) => {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 40;
        let yPos = margin;

        if (logoData) {
            const imgProps = doc.getImageProperties(logoData);
            const logoWidth = 100;
            const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
            doc.addImage(logoData, 'PNG', pageWidth - logoWidth - margin, margin, logoWidth, logoHeight);
            yPos += logoHeight + 20;
        }

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        
        const lines = doc.splitTextToSize(contractText, pageWidth - (margin * 2));
        doc.text(lines, margin, yPos);
        
        doc.save(fileName);
        showNotification('PDF succesvol geëxporteerd!');
    };
    
    try {
        const logoUrl = 'https://cafetheaterfestival.nl/wp-content/uploads/2025/06/Logo_Web_Trans_Zwart.png';
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${logoUrl}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Network response was not ok.');

        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => addTextAndSave(reader.result);
        reader.onerror = () => {
             addTextAndSave();
        }
    } catch (error) {
        console.error("Kon logo niet laden voor PDF, ga verder zonder.", error);
        showNotification('Logo kon niet geladen worden, PDF wordt zonder logo gemaakt.', 'warning');
        addTextAndSave();
    }
  };

  return (
    <div>
      <ViewHeader title="Contract Generator (Cafés)" />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kies Locatie</label>
                <select value={selectedLocationId} onChange={e => setSelectedLocationId(e.target.value)} className="w-full p-2 border rounded-md shadow-sm">
                  <option value="">Selecteer een locatie...</option>
                  {locations.sort((a,b) => a.Name.localeCompare(b.Name)).map(l => (
                    <option key={l.id} value={l.id}>{l.Name}</option>
                  ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kies Taal</label>
                <div className="flex space-x-2">
                    <button onClick={() => setLanguage('nl')} className={`w-full p-2 rounded-md ${language === 'nl' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Nederlands</button>
                    <button onClick={() => setLanguage('en')} className={`w-full p-2 rounded-md ${language === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>English</button>
                </div>
            </div>
        </div>
        <button onClick={generateContract} className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 mb-6 shadow-md">
          Genereer Contract
        </button>

        {contractText && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Conceptcontract</h3>
            <textarea readOnly value={contractText} className="w-full h-96 p-4 border rounded bg-gray-50 font-mono text-sm leading-relaxed"></textarea>
            <div className="mt-4 flex space-x-2">
              <button onClick={copyToClipboard} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md flex items-center space-x-2">
                {icons.copy}
                <span>Kopieer naar Klembord</span>
              </button>
               <button onClick={handleExportPDF} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md flex items-center space-x-2">
                  {icons.pdf}
                  <span>Exporteer als PDF</span>
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
