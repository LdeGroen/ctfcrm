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

// --- Custom Hook voor Sorteren & Filteren ---
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
                    // Handle nested keys like 'contactPerson.Name'
                    const value = key.split('.').reduce((o, i) => (o ? o[i] : undefined), item);
                    return String(value).toLowerCase().includes(lowercasedTerm);
                })
            );
        }
        
        // Apply structured filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value === 'all' || value === '') return;
            
            filtered = filtered.filter(item => {
                const itemValue = item[key];
                if (typeof itemValue === 'boolean') {
                    return (value === 'yes' && itemValue === true) || (value === 'no' && itemValue === false);
                }
                // Handle array values (like 'functie')
                if (Array.isArray(itemValue)) {
                    return itemValue.includes(value);
                }
                return String(itemValue || '').toLowerCase() === String(value).toLowerCase();
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
    
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
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
          // Super admin heeft altijd de editor rol.
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
  // Nieuwe states
  const [infoItems, setInfoItems] = useState([]);
  const [nieuwsItems, setNieuwsItems] = useState([]);
  const [toegankelijkheidItems, settoegankelijkheidItems] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: () => {} });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // NIEUW: State voor de Quick View Modal
  const [quickViewItem, setQuickViewItem] = useState(null); // { item: {}, type: 'contact' }

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
      // Verwijder null waarden, Appwrite staat dit niet toe bij updates.
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
                // Verwijder null waarden, Appwrite staat dit niet toe bij updates.
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

  // NIEUW: Bundel alle data voor de Quick View
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
          
          {/* NIEUW: Render de Quick View Modal */}
          {quickViewItem && (
            <QuickViewModal
                initialItem={quickViewItem.item}
                itemType={quickViewItem.type}
                data={allData}
                onClose={() => setQuickViewItem(null)}
            />
          )}

          {loadingData && <div className="text-center p-10">Data laden...</div>}
          
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
          {!loadingData && activeView === 'team' && user.role === 'super_admin' &&
            <TeamView showNotification={showNotification} />
          }
        </main>
      </div>
    </div>
  );
}

function Sidebar({ activeView, setActiveView, user, onLogout, isMobile = false, onClose }) {
  const navItems = [
    { id: 'contacts', label: 'Contacten', icon: icons.users, visible: true },
    { id: 'companies', label: 'Gezelschappen', icon: icons.briefcase, visible: true },
    { id: 'performances', label: 'Voorstellingen', icon: icons.film, visible: true },
    { id: 'executions', label: 'Uitvoeringen', icon: icons.calendar, visible: true },
    { id: 'locations', label: 'Locaties', icon: icons.mapPin, visible: true },
    { id: 'events', label: 'Events', icon: icons.star, visible: true },
    // Nieuwe Navigatie Items
    { id: 'info', label: 'Info', icon: icons.info, visible: true },
    { id: 'news', label: 'Nieuws', icon: icons.news, visible: true },
    { id: 'accessibility', label: 'Toegankelijkheid', icon: icons.accessibility, visible: true },
    // Einde nieuwe items
    { id: 'schedule', label: 'Blokkenschema', icon: icons.grid, visible: true },
    { id: 'contract', label: 'Contract Generator', icon: icons.fileText, visible: true },
    { id: 'team', label: 'Team', icon: icons.settings, visible: user.role === 'super_admin' },
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

function ViewHeader({ title, countText, onAddNew, onImport, onSearch, searchTerm, children, hasEditPermissions }) {
    return (
        <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm pt-4 pb-4 mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
                  {countText && <p className="text-sm text-gray-500 mt-1">{countText}</p>}
                </div>
                {hasEditPermissions && (
                    <div className="flex space-x-2">
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

const SortableTh = ({ column, sortConfig, requestSort }) => {
    const isSorted = sortConfig.key === column.key;
    return (
        <th 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => column.sortable && requestSort(column.key)}
        >
            <div className="flex items-center space-x-1">
                <span>{column.header}</span>
                {column.sortable && isSorted && (
                    <span>{sortConfig.direction === 'ascending' ? icons.sortAsc : icons.sortDesc}</span>
                )}
            </div>
        </th>
    );
};

// --- Views ---

function ContactsView({ contacts, onAdd, onUpdate, onBulkUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  const initialFilters = { Role: 'all', functie: 'all', isCurrentlyEmployed: 'all' };

  const { 
    filteredAndSortedItems: filteredAndSortedContacts, 
    searchTerm, 
    setSearchTerm, 
    sortConfig, 
    requestSort,
    filters,
    handleFilterChange
  } = useSortAndFilter(contacts, 'Name', ['Name', 'Email', 'Phone', 'Role', 'functie'], initialFilters);

  const roles = useMemo(() => {
    const roleSet = new Set(contacts.map(c => (c.Role || '').trim().toLowerCase()).filter(Boolean));
    return Array.from(roleSet).sort();
  }, [contacts]);

  const functies = useMemo(() => {
    const functieSet = new Set(contacts.flatMap(c => c.functie || []).filter(Boolean));
    return Array.from(functieSet).sort();
  }, [contacts]);

  const ALL_COLUMNS = useMemo(() => [
    { key: 'Name', header: 'Naam', sortable: true },
    { key: 'Role', header: 'Rol', sortable: true },
    { key: 'functie', header: 'Functie', sortable: true },
    { key: 'yearsActive', header: 'Actieve Jaren', sortable: false },
    { key: 'isCurrentlyEmployed', header: 'Actief?', sortable: true },
    { key: 'Email', header: 'Email', sortable: true },
    { key: 'Phone', header: 'Telefoon', sortable: true },
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
  }, [searchTerm, sortConfig, filters]);

  const handleEdit = (contact) => {
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
  const countText = `Toont ${filteredAndSortedContacts.length} van ${contacts.length} contacten`;

  return (
    <div>
      <ViewHeader 
        title="Contacten"
        countText={countText}
        onAddNew={handleAddNew}
        onImport={() => setIsImportModalOpen(true)}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
      >
        <ColumnSelector columns={ALL_COLUMNS} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
      </ViewHeader>
      
      <FilterBar>
          <FilterDropdown label="Rol" name="Role" value={filters.Role} onChange={handleFilterChange} options={[
              { value: 'all', label: 'Alle Rollen' },
              ...roles.map(role => ({ value: role, label: role.charAt(0).toUpperCase() + role.slice(1) }))
          ]} />
          <FilterDropdown label="Functie" name="functie" value={filters.functie} onChange={handleFilterChange} options={[
              { value: 'all', label: 'Alle Functies' },
              ...functies.map(f => ({ value: f, label: f }))
          ]} />
          <FilterDropdown label="Actief?" name="isCurrentlyEmployed" value={filters.isCurrentlyEmployed} onChange={handleFilterChange} options={[
              { value: 'all', label: 'Beide' },
              { value: 'yes', label: 'Ja' },
              { value: 'no', label: 'Nee' },
          ]} />
      </FilterBar>

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
              {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && <SortableTh key={col.key} column={col} sortConfig={sortConfig} requestSort={requestSort} />)}
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
      {isBulkEditModalOpen && (
        <BulkEditContactForm
            onClose={() => setIsBulkEditModalOpen(false)}
            onSave={handleBulkUpdate}
            roles={roles}
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
                functie: item.functie ? [item.functie] : [],
            })))}
        />
      )}
    </div>
  );
}

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
    // Pak de eerste functie uit de array, aangezien we maar één functie-veld hebben.
    functie: (contact?.functie && Array.isArray(contact.functie) && contact.functie.length > 0) ? contact.functie[0] : '',
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
    
    // Bereid 'functie' voor: moet een array zijn als er een waarde is.
    let functieForAppwrite = [];
    if (['teamlid', 'artiest', 'vrijwilliger'].includes(standardizedRole) && formData.functie.trim()) {
        functieForAppwrite = [formData.functie.trim()];
    }

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
    };
    onSave(dataForAppwrite);
  };
  
  const standardizedRole = formData.role.trim().toLowerCase();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{contact ? 'Contact Bewerken' : 'Nieuw Contact'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Volledige naam" className="w-full p-2 border rounded" required />
          <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Rol (bv. artiest, vrijwilliger)" className="w-full p-2 border rounded" required />
          
          {['teamlid', 'artiest', 'vrijwilliger'].includes(standardizedRole) && (
             <input type="text" name="functie" value={formData.functie} onChange={handleChange} placeholder="Functie (bv. productieleider, acteur)" className="w-full p-2 border rounded" />
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
                    // Zorg ervoor dat functie een array is
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


// --- ANDERE VIEWS BLIJVEN HIER (onveranderd) ---
function CompaniesView({ companies, artists, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions, onQuickView }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [addArtistModalInfo, setAddArtistModalInfo] = useState({ isOpen: false, company: null });
  
  const filteredCompanies = useMemo(() => {
    return companies
      .filter(c => 
        c.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.Description && c.Description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a,b) => a.Name.localeCompare(b.Name));
  }, [companies, searchTerm]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [searchTerm]);

  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };
  
  const handleSelectOne = (e, id) => {
    const newSelectedIds = new Set(selectedIds);
    if (e.target.checked) {
        newSelectedIds.add(id);
    } else {
        newSelectedIds.delete(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size > 0) {
      onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };
  
  const countText = `Toont ${filteredCompanies.length} van ${companies.length} gezelschappen`;

  return (
    <div>
      <ViewHeader 
        title="Gezelschappen"
        countText={countText}
        onAddNew={handleAddNew}
        onImport={() => setIsImportModalOpen(true)}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
      />

      {selectedIds.size > 0 && hasEditPermissions && (
        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg mb-4 flex items-center justify-between">
            <span className="text-indigo-800 font-semibold">{selectedIds.size} geselecteerd</span>
            <button onClick={handleBulkDelete} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center space-x-1">
                {icons.trash} <span>Verwijderen</span>
            </button>
        </div>
      )}

      <div className="space-y-4">
        {filteredCompanies.length > 0 ? filteredCompanies.map(company => {
          const companyPlayerIds = new Set(company.playerIds || []);
          const companyArtists = artists.filter(a => companyPlayerIds.has(a.id) || a.id === company.contactPersonId);
          
          return (
            <div key={company.id} className={`bg-white p-4 rounded-lg shadow-md transition-colors ${selectedIds.has(company.id) ? 'border-2 border-indigo-500' : 'border border-transparent'}`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-4 flex-grow">
                    <input type="checkbox" className="h-5 w-5 text-indigo-600 border-gray-300 rounded mt-1"
                        checked={selectedIds.has(company.id)}
                        onChange={(e) => handleSelectOne(e, company.id)}
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-indigo-700">{company.Name}</h3>
                      <p className="text-gray-600 mt-1 text-sm">{company.Description}</p>
                    </div>
                </div>
                {hasEditPermissions && (
                    <div className="flex-shrink-0">
                      <button onClick={() => handleEdit(company)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                      <button onClick={() => onDelete(company.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                    </div>
                )}
              </div>
              <div className="mt-4 pl-9 flex justify-between items-center">
                  <div>
                      <h4 className="font-semibold text-base mb-2">Artiesten ({companyArtists.length})</h4>
                      <div className="bg-gray-50 p-3 rounded-md text-sm">
                          {companyArtists.length > 0 ? companyArtists.map((artist, index) => (
                              <React.Fragment key={artist.id}>
                                <button onClick={() => onQuickView({ item: artist, type: 'contact' })} className="text-indigo-600 hover:underline">
                                    {artist.Name}
                                </button>
                                {index < companyArtists.length - 1 && ', '}
                              </React.Fragment>
                          )) : <span className="text-gray-500">Nog geen artiesten gekoppeld.</span>}
                      </div>
                  </div>
                  {hasEditPermissions && (
                      <button
                          onClick={() => setAddArtistModalInfo({ isOpen: true, company: company })}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 self-end flex items-center space-x-2 shadow-sm"
                      >
                          {icons.users}
                          <span>Artiesten beheren</span>
                      </button>
                  )}
              </div>
            </div>
          );
        }) : <p className="text-center py-4 bg-white rounded-lg shadow-md">Geen gezelschappen gevonden.</p>}
      </div>
      
      {isModalOpen && <CompanyForm company={editingCompany} onClose={() => setIsModalOpen(false)} onSave={(data) => { if (editingCompany) { onUpdate(editingCompany.id, data); } else { onAdd(data); } setIsModalOpen(false); }} />}
      {isImportModalOpen && (
        <GenericImportModal
            title="Gezelschappen"
            requiredColumns={['Name', 'Description', 'playerIds', 'contactPersonId']}
            onClose={() => setIsImportModalOpen(false)}
            onImport={(data) => onBulkAdd(data.map(item => ({
                Name: item.Name || '',
                Description: item.Description || '',
                playerIds: item.playerIds ? item.playerIds.split(';').map(s => s.trim()) : [],
                contactPersonId: item.contactPersonId || null,
            })))}
        />
      )}
      {addArtistModalInfo.isOpen && (
        <AddArtistsToCompanyModal
          company={addArtistModalInfo.company}
          allArtists={artists}
          onClose={() => setAddArtistModalInfo({ isOpen: false, company: null })}
          onUpdateCompany={onUpdate}
        />
      )}
    </div>
  );
}

function CompanyForm({ company, onClose, onSave }) {
  const [formData, setFormData] = useState({ name: company?.Name || '', description: company?.Description || '' });
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    const dataToSave = { 
        Name: formData.name, 
        Description: formData.description,
        playerIds: company?.playerIds || [],
        contactPersonId: company?.contactPersonId || null,
    };
    onSave(dataToSave); 
  };
  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
        <h3 className="text-2xl font-bold mb-6">{company ? 'Gezelschap Bewerken' : 'Nieuw Gezelschap'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Naam van het gezelschap" className="w-full p-2 border rounded" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Beschrijving" className="w-full p-2 border rounded h-24"></textarea>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ViewCompanyArtistsModal({ artists, companyName, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl flex flex-col" style={{maxHeight: '90vh'}}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Artiesten van "{companyName}"</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <div className="flex-grow overflow-y-auto -mx-4 px-4 space-y-4">
                    {artists.length > 0 ? artists.map(artist => (
                        <div key={artist.id} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-lg">{artist.Name}</h4>
                                <CopyToClipboardButton textToCopy={artist.Name} />
                            </div>
                            <div className="text-sm space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">{artist.Email || 'Geen email'}</span>
                                    {artist.Email && <CopyToClipboardButton textToCopy={artist.Email} />}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">{artist.Phone || 'Geen telefoon'}</span>
                                    {artist.Phone && <CopyToClipboardButton textToCopy={artist.Phone} />}
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-center text-gray-500">Geen artiesten in dit gezelschap.</p>}
                </div>
                <div className="flex justify-end pt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Sluiten</button>
                </div>
            </div>
        </div>
    );
}

function AddArtistsToCompanyModal({ company, allArtists, onClose, onUpdateCompany }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [playerIds, setPlayerIds] = useState(() => new Set(company.playerIds || []));
  const [contactPersonId, setContactPersonId] = useState(company.contactPersonId || null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredArtists = useMemo(() => {
    return allArtists
      .filter(a => a.Name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a,b) => a.Name.localeCompare(b.Name));
  }, [allArtists, searchTerm]);

  const handleTogglePlayer = (artistId) => {
    const newPlayerIds = new Set(playerIds);
    if (newPlayerIds.has(artistId)) {
      newPlayerIds.delete(artistId);
    } else {
      newPlayerIds.add(artistId);
    }
    setPlayerIds(newPlayerIds);
  };

  const handleSetContactPerson = (artistId) => {
    setContactPersonId(artistId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        await onUpdateCompany(company.id, {
            playerIds: Array.from(playerIds),
            contactPersonId: contactPersonId,
        });
    } catch (e) {
        console.error("Fout bij bijwerken artiesten:", e);
    } finally {
        setIsSaving(false);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-3xl shadow-xl flex flex-col" style={{maxHeight: '90vh'}}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Artiesten beheren voor "{company.Name}"</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
        </div>
        
        <div className="relative mb-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icons.search}</span>
          <input
              type="text"
              placeholder="Zoek artiest..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg"
          />
        </div>

        <div className="flex-grow overflow-y-auto border rounded-lg p-2">
            <table className="w-full">
                <thead className="sticky top-0 bg-gray-50 z-10">
                    <tr>
                        <th className="p-3 text-left text-sm font-semibold text-gray-600">Artiest</th>
                        <th className="p-3 text-center text-sm font-semibold text-gray-600 w-28">Speler</th>
                        <th className="p-3 text-center text-sm font-semibold text-gray-600 w-32">Contactpersoon</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredArtists.length > 0 ? filteredArtists.map(artist => (
                        <tr key={artist.id} className="hover:bg-gray-50 border-b">
                            <td className="p-3 text-gray-800">{artist.Name}</td>
                            <td className="p-3 text-center">
                                <input 
                                    type="checkbox"
                                    checked={playerIds.has(artist.id)}
                                    onChange={() => handleTogglePlayer(artist.id)}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                            </td>
                            <td className="p-3 text-center">
                                <input 
                                    type="radio"
                                    name="contactPerson"
                                    checked={contactPersonId === artist.id}
                                    onChange={() => handleSetContactPerson(artist.id)}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="3" className="text-center text-gray-500 p-4">Geen artiesten gevonden.</td></tr>
                    )}
                </tbody>
            </table>
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


function PerformancesView({ performances, companies, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions, onQuickView }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingPerformance, setEditingPerformance] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  const initialFilters = {
    genre: 'all',
    isDutchLanguage: 'all',
    isEnglishLanguage: 'all',
    isDialogueFree: 'all',
    isChildFriendly: 'all',
  };
  
  const enrichedPerformances = useMemo(() => performances.map(p => ({
      ...p,
      company: companies.find(c => c.id === p.companyId) || null
  })), [performances, companies]);
  
  const { 
    filteredAndSortedItems: filteredPerformances, 
    searchTerm, 
    setSearchTerm, 
    sortConfig, 
    requestSort,
    filters,
    handleFilterChange
  } = useSortAndFilter(enrichedPerformances, 'Title', ['Title', 'company.Name', 'genre'], initialFilters);

  const genres = useMemo(() => {
    const genreSet = new Set(performances.map(p => p.genre).filter(Boolean));
    return Array.from(genreSet).sort();
  }, [performances]);

  const ALL_COLUMNS = useMemo(() => [
    { key: 'Title', header: 'Titel', sortable: true },
    { key: 'companyName', header: 'Gezelschap', sortable: true },
    { key: 'genre', header: 'Genre', sortable: true },
    { key: 'isDutchLanguage', header: 'NL', sortable: true },
    { key: 'isEnglishLanguage', header: 'EN', sortable: true },
    { key: 'isDialogueFree', header: 'Taalloos', sortable: true },
    { key: 'isChildFriendly', header: 'Kindvriendelijk', sortable: true },
  ], []);

  const [visibleColumns, setVisibleColumns] = useState(new Set(['Title', 'companyName']));

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
  }, [searchTerm, sortConfig, filters]);

  const handleEdit = (performance) => {
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
  
  const booleanFilterOptions = [
    { value: 'all', label: 'Alle' },
    { value: 'yes', label: 'Ja' },
    { value: 'no', label: 'Nee' },
  ];

  return (
    <div>
      <ViewHeader
        title="Voorstellingen"
        countText={countText}
        onAddNew={handleAddNew}
        onImport={() => setIsImportModalOpen(true)}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
      >
        <ColumnSelector columns={ALL_COLUMNS} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
      </ViewHeader>
      
      <FilterBar>
        <FilterDropdown label="Genre" name="genre" value={filters.genre} onChange={handleFilterChange} options={[
            { value: 'all', label: 'Alle Genres' },
            ...genres.map(g => ({ value: g, label: g }))
        ]} />
        <FilterDropdown label="Nederlandstalig" name="isDutchLanguage" value={filters.isDutchLanguage} onChange={handleFilterChange} options={booleanFilterOptions} />
        <FilterDropdown label="Engelstalig" name="isEnglishLanguage" value={filters.isEnglishLanguage} onChange={handleFilterChange} options={booleanFilterOptions} />
        <FilterDropdown label="Taalloos" name="isDialogueFree" value={filters.isDialogueFree} onChange={handleFilterChange} options={booleanFilterOptions} />
        <FilterDropdown label="Kindvriendelijk" name="isChildFriendly" value={filters.isChildFriendly} onChange={handleFilterChange} options={booleanFilterOptions} />
      </FilterBar>
      
      {selectedIds.size > 0 && hasEditPermissions && (
        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg mb-4 flex items-center justify-between">
            <span className="text-indigo-800 font-semibold">{selectedIds.size} geselecteerd</span>
            <button onClick={handleBulkDelete} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center space-x-1">
                {icons.trash} <span>Verwijderen</span>
            </button>
        </div>
      )}

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
              {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && <SortableTh key={col.key} column={col} sortConfig={sortConfig} requestSort={requestSort} />)}
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

function LocationsView({ locations, cafeOwners, performances, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions }) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [detailLocation, setDetailLocation] = useState(null);
  
  const initialFilters = {
    terras: 'all',
    kleedruimte: 'all',
    isWheelchairAccessible: 'all',
    kan_groep_mee_eten: 'all',
    hasDining: 'all',
  };

  const enrichedLocations = useMemo(() => locations.map(loc => {
      const contactPerson = cafeOwners.find(c => c.id === loc.contactPersonId);
      return {
        ...loc,
        ownerNames: (loc.ownerIds || []).map(id => cafeOwners.find(c => c.id === id)?.Name).filter(Boolean).join(', '),
        contactPerson: contactPerson || null
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
      ['Name', 'Address', 'locationNumber', 'ownerNames', 'contactPerson.Name'],
      initialFilters
  );

  const handleShowDetails = (location) => {
    setDetailLocation(location);
    setIsDetailModalOpen(true);
  };
  
  const handleEdit = (location) => {
    setEditingLocation(location);
    setIsDetailModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingLocation(null);
    setIsFormModalOpen(true);
  };

  const countText = `Toont ${filteredLocations.length} van ${locations.length} locaties`;
  
  const booleanFilterOptions = [
    { value: 'all', label: 'Alle' },
    { value: 'yes', label: 'Ja' },
    { value: 'no', label: 'Nee' },
  ];

  return (
    <div>
      <ViewHeader
        title="Locaties"
        countText={countText}
        onAddNew={handleAddNew}
        onImport={() => setIsImportModalOpen(true)}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
      />
      
      <FilterBar>
          <FilterDropdown label="Terras" name="terras" value={filters.terras} onChange={handleFilterChange} options={booleanFilterOptions} />
          <FilterDropdown label="Kleedruimte" name="kleedruimte" value={filters.kleedruimte} onChange={handleFilterChange} options={booleanFilterOptions} />
          <FilterDropdown label="Rolstoeltoegankelijk" name="isWheelchairAccessible" value={filters.isWheelchairAccessible} onChange={handleFilterChange} options={booleanFilterOptions} />
          <FilterDropdown label="Groep kan mee-eten" name="kan_groep_mee_eten" value={filters.kan_groep_mee_eten} onChange={handleFilterChange} options={booleanFilterOptions} />
          <FilterDropdown label="Eetgelegenheid" name="hasDining" value={filters.hasDining} onChange={handleFilterChange} options={booleanFilterOptions} />
      </FilterBar>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLocations.length > 0 ? filteredLocations.map(loc => (
          <LocationCard key={loc.id} location={loc} onClick={() => handleShowDetails(loc)} />
        )) : (
          <p className="col-span-full text-center py-10">Geen locaties gevonden.</p>
        )}
      </div>

      {isDetailModalOpen && (
        <LocationDetailModal
          location={detailLocation}
          performances={performances}
          onClose={() => setIsDetailModalOpen(false)}
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
            })))}
        />
      )}
    </div>
  );
}

function LocationCard({ location, onClick }) {
    return (
        <div onClick={onClick} className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-indigo-700 truncate">{location.Name}</h3>
                <p className="text-gray-500 text-sm flex items-center mt-1">
                    <span className="w-4 h-4 mr-2">{icons.mapPin}</span>
                    {location.Address}
                </p>
            </div>

            {/* NIEUW: Blok voor contactpersoon */}
            {location.contactPerson && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Contactpersoon</h4>
                    <p className="font-semibold text-gray-800">{location.contactPerson.Name}</p>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                        <p className="flex items-center">
                            <span className="w-4 h-4 mr-2">{icons.mail}</span>
                            {location.contactPerson.Email || 'N.v.t.'}
                        </p>
                        <p className="flex items-center">
                            <span className="w-4 h-4 mr-2">{icons.phone}</span>
                            {location.contactPerson.Phone || 'N.v.t.'}
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2 text-xs">
                {location.terras && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Terras</span>}
                {location.kleedruimte && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Kleedruimte</span>}
                {location.isWheelchairAccessible && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Rolstoeltoegankelijk</span>}
            </div>
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
                        
                        {/* AANGEPAST: Contactpersoon info toegevoegd */}
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
                    </div>
                    
                    {/* Rest van de modal is ongewijzigd */}
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


function LocationForm({ location, performances, cafeOwners, onClose, onSave }) { // AANGEPAST: cafeOwners toegevoegd
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
        contactPersonId: location?.contactPersonId || '', // NIEUW
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
            openingstijden: JSON.stringify(openingstijden),
            geprogrammeerde_voorstellingen: JSON.stringify(programmed),
            ownerIds: location?.ownerIds || [],
        };
        onSave(dataToSave);
    };
    
    const sortedPerformances = useMemo(() => [...performances].sort((a,b) => a.Title.localeCompare(b.Title)), [performances]);
    // NIEUW: Sorteer café-eigenaren voor de dropdown
    const sortedCafeOwners = useMemo(() => [...cafeOwners].sort((a,b) => a.Name.localeCompare(b.Name)), [cafeOwners]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg w-full max-w-4xl shadow-xl flex flex-col max-h-[90vh]">
                <header className="p-6 border-b">
                    <h3 className="text-2xl font-bold">{location ? 'Locatie Bewerken' : 'Nieuwe Locatie'}</h3>
                </header>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
                    {/* Basis Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="Name" value={formData.Name} onChange={handleChange} placeholder="Naam van de locatie" className="w-full p-2 border rounded" required />
                        <input type="text" name="Address" value={formData.Address} onChange={handleChange} placeholder="Adres" className="w-full p-2 border rounded" />
                        <input type="text" name="locationNumber" value={formData.locationNumber} onChange={handleChange} placeholder="Locatienummer" className="w-full p-2 border rounded" />
                        <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} placeholder="Google Maps URL" className="w-full p-2 border rounded" />
                        <input type="tel" name="telefoonnummer_algemeen" value={formData.telefoonnummer_algemeen} onChange={handleChange} placeholder="Telefoonnummer" className="w-full p-2 border rounded" />
                        <input type="email" name="mailadres_algemeen" value={formData.mailadres_algemeen} onChange={handleChange} placeholder="E-mailadres" className="w-full p-2 border rounded" />
                    </div>
                    
                    {/* NIEUW: Dropdown voor contactpersoon */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contactpersoon (Café-eigenaar)</label>
                        <select name="contactPersonId" value={formData.contactPersonId} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Kies een contactpersoon</option>
                            {sortedCafeOwners.map(owner => (
                                <option key={owner.id} value={owner.id}>{owner.Name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="number" name="capaciteit" value={formData.capaciteit} onChange={handleChange} placeholder="Capaciteit" className="w-full p-2 border rounded" />
                        <input type="number" name="maximale_gezelschapsgrootte" value={formData.maximale_gezelschapsgrootte} onChange={handleChange} placeholder="Max. gezelschapsgrootte" className="w-full p-2 border rounded" />
                        <input type="text" name="deelnamegeld" value={formData.deelnamegeld} onChange={handleChange} placeholder="Deelnamegeld" className="w-full p-2 border rounded" />
                    </div>
                    
                    {/* Textareas en Checkboxes... (rest van de form is ongewijzigd) */}
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


function AddOwnersToLocationModal({ location, allCafeOwners, onClose, onUpdateLocation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwnerIds, setSelectedOwnerIds] = useState(() => {
    return new Set(location.ownerIds || []);
  });
  const [isSaving, setIsSaving] = useState(false);

  const filteredOwners = useMemo(() => {
    return allCafeOwners
      .filter(owner => 
        owner.Name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a,b) => a.Name.localeCompare(b.Name));
  }, [allCafeOwners, searchTerm]);

  const handleToggleOwner = (ownerId) => {
    const newSelectedIds = new Set(selectedOwnerIds);
    if (newSelectedIds.has(ownerId)) {
      newSelectedIds.delete(ownerId);
    } else {
      newSelectedIds.add(ownerId);
    }
    setSelectedOwnerIds(newSelectedIds);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        await onUpdateLocation(location.id, { ownerIds: Array.from(selectedOwnerIds) });
    } catch (e) {
        console.error("Fout bij bijwerken eigenaren:", e);
    } finally {
        setIsSaving(false);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl flex flex-col" style={{maxHeight: '90vh'}}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Eigenaren beheren voor "{location.Name}"</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
        </div>
        
        <div className="relative mb-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icons.search}</span>
          <input
              type="text"
              placeholder="Zoek eigenaar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg"
          />
        </div>

        <div className="flex-grow overflow-y-auto border rounded-lg p-2 space-y-2">
            {filteredOwners.length > 0 ? filteredOwners.map(owner => (
                <label key={owner.id} className="flex items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer">
                    <input 
                        type="checkbox"
                        checked={selectedOwnerIds.has(owner.id)}
                        onChange={() => handleToggleOwner(owner.id)}
                        className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-gray-800">{owner.Name}</span>
                </label>
            )) : <p className="text-center text-gray-500 p-4">Geen café-eigenaren gevonden.</p>}
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

function ExecutionsView({ executions, performances, locations, onAdd, onBulkAdd, onUpdate, onDelete, onBulkDelete, hasEditPermissions, onQuickView }) {
  const [showPast, setShowPast] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingExecution, setEditingExecution] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  const initialFilters = {
    performanceId: 'all',
    locationId: 'all',
    expectedCrowd: 'all',
    quietRoute: 'all',
    hasNgt: 'all',
  };

  const enrichedExecutionsBase = useMemo(() => {
    const now = new Date();
    return executions
        .map(exec => ({
            ...exec,
            performance: performances.find(p => p.id === exec.performanceId),
            location: locations.find(l => l.id === exec.locationId)
        }))
        .filter(exec => exec.performance && exec.location)
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
      ['performance.Title', 'location.Name'],
      initialFilters
  );

  const ALL_COLUMNS = useMemo(() => [
    { key: 'performanceTitle', header: 'Voorstelling', sortable: true },
    { key: 'locationName', header: 'Locatie', sortable: true },
    { key: 'DateTime', header: 'Datum & Tijd', sortable: true },
    { key: 'expectedCrowd', header: 'Verwachte Drukte', sortable: true },
    { key: 'quietRoute', header: 'Rustige Route', sortable: true },
    { key: 'hasNgt', header: 'NGT', sortable: true },
  ], []);

  const [visibleColumns, setVisibleColumns] = useState(new Set(['performanceTitle', 'locationName', 'DateTime']));

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
  }, [searchTerm, sortConfig, filters]);

  const handleEdit = (execution) => {
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
  
  const sortedPerformances = useMemo(() => [...performances].sort((a,b) => a.Title.localeCompare(b.Title)), [performances]);
  const sortedLocations = useMemo(() => [...locations].sort((a,b) => a.Name.localeCompare(b.Name)), [locations]);
  const crowdOptions = useMemo(() => Array.from(new Set(executions.map(e => e.expectedCrowd).filter(Boolean))), [executions]);
  
  const booleanFilterOptions = [
    { value: 'all', label: 'Alle' },
    { value: 'yes', label: 'Ja' },
    { value: 'no', label: 'Nee' },
  ];

  return (
    <div>
      <ViewHeader
        title="Uitvoeringen"
        countText={countText}
        onAddNew={handleAddNew}
        onImport={() => setIsImportModalOpen(true)}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
      >
        <button 
            onClick={() => setShowPast(!showPast)} 
            className="p-2 border rounded-lg shadow-sm bg-white hover:bg-gray-100"
          >
            {showPast ? 'Verleden verbergen' : 'Verleden tonen'}
        </button>
        <ColumnSelector columns={ALL_COLUMNS} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
      </ViewHeader>

      <FilterBar>
          <FilterDropdown label="Voorstelling" name="performanceId" value={filters.performanceId} onChange={handleFilterChange} options={[
              { value: 'all', label: 'Alle Voorstellingen' },
              ...sortedPerformances.map(p => ({ value: p.id, label: p.Title }))
          ]} />
          <FilterDropdown label="Locatie" name="locationId" value={filters.locationId} onChange={handleFilterChange} options={[
              { value: 'all', label: 'Alle Locaties' },
              ...sortedLocations.map(l => ({ value: l.id, label: l.Name }))
          ]} />
          <FilterDropdown label="Verwachte Drukte" name="expectedCrowd" value={filters.expectedCrowd} onChange={handleFilterChange} options={[
              { value: 'all', label: 'Alle' },
              ...crowdOptions.map(c => ({ value: c, label: c }))
          ]} />
          <FilterDropdown label="Rustige Route" name="quietRoute" value={filters.quietRoute} onChange={handleFilterChange} options={booleanFilterOptions} />
          <FilterDropdown label="NGT" name="hasNgt" value={filters.hasNgt} onChange={handleFilterChange} options={booleanFilterOptions} />
      </FilterBar>

      {selectedIds.size > 0 && hasEditPermissions && (
        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg mb-4 flex items-center justify-between">
            <span className="text-indigo-800 font-semibold">{selectedIds.size} geselecteerd</span>
            <button onClick={handleBulkDelete} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center space-x-1">
                {icons.trash} <span>Verwijderen</span>
            </button>
        </div>
      )}

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
              {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && <SortableTh key={col.key} column={col} sortConfig={sortConfig} requestSort={requestSort} />)}
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
            })))}
        />
      )}
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
          ...extraData
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

function EventsView({ events, executions, performances, locations, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [manageExecutionsModalInfo, setManageExecutionsModalInfo] = useState({ isOpen: false, event: null });
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  const ALL_COLUMNS = useMemo(() => [
    { key: 'Name', header: 'Naam', sortable: true },
    { key: 'gage', header: 'Gage', sortable: true },
    { key: 'executionCount', header: 'Aantal Uitvoeringen', sortable: false },
    { key: 'sponsorLogoUrl', header: 'Sponsor Logo', sortable: false },
    { key: 'mapUrl', header: 'Kaart URL', sortable: false },
  ], []);

  const [visibleColumns, setVisibleColumns] = useState(new Set(['Name', 'gage', 'executionCount']));

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
  
  const { filteredAndSortedItems: filteredEvents, searchTerm, setSearchTerm, sortConfig, requestSort } = useSortAndFilter(
      enrichedEvents,
      'Name',
      ['Name']
  );

  useEffect(() => {
    setSelectedIds(new Set());
  }, [searchTerm, sortConfig]);

  const handleEdit = (event) => {
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
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
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
              {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && <SortableTh key={col.key} column={col} sortConfig={sortConfig} requestSort={requestSort} />)}
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

function EventForm({ event, onClose, onSave }) {
  const [formData, setFormData] = useState({
      name: event?.Name || '',
      gage: event?.gage || 0,
      sponsorLogoUrl: event?.sponsorLogoUrl || '',
      mapUrl: event?.mapUrl || '',
  });
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
  };
  
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    onSave({ 
        Name: formData.name, 
        gage: String(formData.gage || '0'),
        sponsorLogoUrl: formData.sponsorLogoUrl,
        mapUrl: formData.mapUrl,
        executionIds: event?.executionIds || [] 
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
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
          </div>
        </form>
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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Blokkenschema</h2>
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
            </div>

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
    
    const uniqueExecutionDays = new Set(
        performanceExecutions.map(exec => new Date(exec.DateTime).toISOString().split('T')[0])
    );
    const executionDayCount = uniqueExecutionDays.size;

    const relevantEvents = events.filter(event => 
        (event.executionIds || []).some(execId => executionIds.has(execId))
    );

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
        .map(a => {
            let role = '';
            if (companyPlayerIds.has(a.id)) role = language === 'nl' ? ', speler' : ', performer';
            return `${a.Name}${role}`;
        })
        .join('\n');

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

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
    const textArea = document.createElement("textarea");
    textArea.value = contractText;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showNotification('Contract gekopieerd naar klembord!');
    } catch (err) {
      showNotification('Kon contract niet kopiëren.', 'error');
    }
    document.body.removeChild(textArea);
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
        const lineHeight = 12;
        const topMargin = 5 * lineHeight;

        let yPos = margin + topMargin;

        if (logoData) {
            const imgProps = doc.getImageProperties(logoData);
            const logoWidth = 100;
            const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
            const x = pageWidth - logoWidth - margin;
            doc.addImage(logoData, 'PNG', x, margin, logoWidth, logoHeight);
            yPos = Math.max(yPos, margin + logoHeight + 20);
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
        reader.onloadend = () => {
            addTextAndSave(reader.result);
        };
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Contract Generator</h2>
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

function TeamView({ showNotification }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const response = await functions.createExecution('688f79e8003158b79b93', '{}', false); // Vervang 'listUsers' door je functie-ID
      const data = JSON.parse(response.response);
      if (data.users) {
        // Filter alleen gebruikers met een @cafetheaterfestival.nl e-mail
        const ctfUsers = data.users.filter(user => user.email.endsWith('@cafetheaterfestival.nl'));
        setTeamMembers(ctfUsers);
      } else {
        throw new Error(data.message || 'Kon teamleden niet ophalen.');
      }
    } catch (error) {
      console.error('Fout bij ophalen teamleden:', error);
      showNotification(`Fout: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await functions.createExecution(
        '688f7a01000843a8542d', // Vervang 'updateUserRole' door je functie-ID
        JSON.stringify({ userId, role: newRole }),
        false
      );
      showNotification('Rol succesvol bijgewerkt!');
      // Refresh de lijst om de wijziging te zien
      fetchTeamMembers();
    } catch (error) {
      console.error('Fout bij bijwerken rol:', error);
      showNotification(`Fout bij bijwerken rol: ${error.message}`, 'error');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Team Beheer</h2>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="3" className="text-center py-4">Teamleden laden...</td></tr>
            ) : teamMembers.length > 0 ? teamMembers.map(member => (
              <tr key={member.$id}>
                <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {member.email === SUPER_ADMIN_EMAIL ? (
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Super Admin</span>
                  ) : (
                    <select
                      value={member.prefs.role || 'viewer'}
                      onChange={(e) => handleRoleChange(member.$id, e.target.value)}
                      className="p-1 border rounded-md"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </select>
                  )}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="3" className="text-center py-4">Geen teamleden gevonden.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- NIEUWE COMPONENTEN HIERONDER ---

// --- InfoView Component ---
function InfoView({ infoItems, onAdd, onUpdate, onDelete, hasEditPermissions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const { filteredAndSortedItems, searchTerm, setSearchTerm, sortConfig, requestSort } = useSortAndFilter(
      infoItems,
      'NameNl',
      ['NameNl', 'NameEng']
  );

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const countText = `Toont ${filteredAndSortedItems.length} van ${infoItems.length} info items`;

  const columns = [
    { key: 'NameNl', header: 'Nederlandse Naam', sortable: true },
    { key: 'NameEng', header: 'Engelse Naam', sortable: true },
    { key: 'MeerInfoNl', header: 'NL URL', sortable: false },
    { key: 'MeerInfoEng', header: 'EN URL', sortable: false },
    { key: 'MeerInfoAfbeelding', header: 'Afbeelding URL', sortable: false },
  ];

  return (
    <div>
      <ViewHeader
        title="Meer Info"
        countText={countText}
        onAddNew={handleAddNew}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
      />
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => <SortableTh key={col.key} column={col} sortConfig={sortConfig} requestSort={requestSort} />)}
              {hasEditPermissions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedItems.length > 0 ? filteredAndSortedItems.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.NameNl}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.NameEng}</td>
                <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs"><a href={item.MeerInfoNl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{item.MeerInfoNl}</a></td>
                <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs"><a href={item.MeerInfoEng} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{item.MeerInfoEng}</a></td>
                <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs"><a href={item.MeerInfoAfbeelding} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{item.MeerInfoAfbeelding}</a></td>
                {hasEditPermissions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                      <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                    </td>
                )}
              </tr>
            )) : (
              <tr><td colSpan={columns.length + (hasEditPermissions ? 1 : 0)} className="text-center py-4">Geen info items gevonden.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <InfoForm
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingItem) {
              onUpdate(editingItem.id, data);
            } else {
              onAdd(data);
            }
            setIsModalOpen(false);
          }}
        />
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
        <h3 className="text-2xl font-bold mb-6">{item ? 'Info Item Bewerken' : 'Nieuw Info Item'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="NameNl" value={formData.NameNl} onChange={handleChange} placeholder="Nederlandse naam" className="w-full p-2 border rounded" required />
          <input type="text" name="NameEng" value={formData.NameEng} onChange={handleChange} placeholder="Engelse naam" className="w-full p-2 border rounded" />
          <input type="url" name="MeerInfoNl" value={formData.MeerInfoNl} onChange={handleChange} placeholder="Nederlandse URL" className="w-full p-2 border rounded" />
          <input type="url" name="MeerInfoEng" value={formData.MeerInfoEng} onChange={handleChange} placeholder="Engelse URL" className="w-full p-2 border rounded" />
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

// --- NieuwsView Component ---
function NieuwsView({ nieuwsItems, onAdd, onUpdate, onDelete, hasEditPermissions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const { filteredAndSortedItems, searchTerm, setSearchTerm, sortConfig, requestSort } = useSortAndFilter(
      nieuwsItems,
      'NieuwsTitelNl',
      ['NieuwsTitelNl', 'NieuwsTitelEng']
  );

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const countText = `Toont ${filteredAndSortedItems.length} van ${nieuwsItems.length} nieuws items`;

  const columns = [
    { key: 'NieuwsTitelNl', header: 'Nederlandse Titel', sortable: true },
    { key: 'NieuwsTitelEng', header: 'Engelse Titel', sortable: true },
    { key: 'NieuwsUrlNl', header: 'NL URL', sortable: false },
    { key: 'NieuwsUrlEng', header: 'EN URL', sortable: false },
    { key: 'NieuwsAfbeelding', header: 'Afbeelding URL', sortable: false },
  ];

  return (
    <div>
      <ViewHeader
        title="Nieuws"
        countText={countText}
        onAddNew={handleAddNew}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
      />
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => <SortableTh key={col.key} column={col} sortConfig={sortConfig} requestSort={requestSort} />)}
              {hasEditPermissions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedItems.length > 0 ? filteredAndSortedItems.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.NieuwsTitelNl}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.NieuwsTitelEng}</td>
                <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs"><a href={item.NieuwsUrlNl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{item.NieuwsUrlNl}</a></td>
                <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs"><a href={item.NieuwsUrlEng} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{item.NieuwsUrlEng}</a></td>
                <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs"><a href={item.NieuwsAfbeelding} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{item.NieuwsAfbeelding}</a></td>
                {hasEditPermissions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                      <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                    </td>
                )}
              </tr>
            )) : (
              <tr><td colSpan={columns.length + (hasEditPermissions ? 1 : 0)} className="text-center py-4">Geen nieuws items gevonden.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <NieuwsForm
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingItem) {
              onUpdate(editingItem.id, data);
            } else {
              onAdd(data);
            }
            setIsModalOpen(false);
          }}
        />
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
        <h3 className="text-2xl font-bold mb-6">{item ? 'Nieuws Item Bewerken' : 'Nieuw Nieuws Item'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="NieuwsTitelNl" value={formData.NieuwsTitelNl} onChange={handleChange} placeholder="Nederlandse titel" className="w-full p-2 border rounded" required />
          <input type="text" name="NieuwsTitelEng" value={formData.NieuwsTitelEng} onChange={handleChange} placeholder="Engelse titel" className="w-full p-2 border rounded" />
          <input type="url" name="NieuwsUrlNl" value={formData.NieuwsUrlNl} onChange={handleChange} placeholder="Nederlandse URL" className="w-full p-2 border rounded" />
          <input type="url" name="NieuwsUrlEng" value={formData.NieuwsUrlEng} onChange={handleChange} placeholder="Engelse URL" className="w-full p-2 border rounded" />
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

// --- ToegankelijkheidView Component ---
function ToegankelijkheidView({ toegankelijkheidItems, onAdd, onUpdate, onDelete, hasEditPermissions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const { filteredAndSortedItems, searchTerm, setSearchTerm, sortConfig, requestSort } = useSortAndFilter(
      toegankelijkheidItems,
      'ToegankelijkheidTitleNl',
      ['ToegankelijkheidTitleNl', 'ToegankelijkheidTitleEng']
  );

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const countText = `Toont ${filteredAndSortedItems.length} van ${toegankelijkheidItems.length} toegankelijkheid items`;

  const columns = [
    { key: 'ToegankelijkheidTitleNl', header: 'Nederlandse Titel', sortable: true },
    { key: 'ToegankelijkheidTitleEng', header: 'Engelse Titel', sortable: true },
    { key: 'ToegankelijkheidUrlNl', header: 'NL URL', sortable: false },
    { key: 'ToegankelijkheidUrlEng', header: 'EN URL', sortable: false },
    { key: 'ToegankelijkheidAfbeelding', header: 'Afbeelding URL', sortable: false },
  ];

  return (
    <div>
      <ViewHeader
        title="Toegankelijkheid"
        countText={countText}
        onAddNew={handleAddNew}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
      />
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => <SortableTh key={col.key} column={col} sortConfig={sortConfig} requestSort={requestSort} />)}
              {hasEditPermissions && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedItems.length > 0 ? filteredAndSortedItems.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.ToegankelijkheidTitleNl}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.ToegankelijkheidTitleEng}</td>
                <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs"><a href={item.ToegankelijkheidUrlNl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{item.ToegankelijkheidUrlNl}</a></td>
                <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs"><a href={item.ToegankelijkheidUrlEng} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{item.ToegankelijkheidUrlEng}</a></td>
                <td className="px-6 py-4 whitespace-nowrap truncate max-w-xs"><a href={item.ToegankelijkheidAfbeelding} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{item.ToegankelijkheidAfbeelding}</a></td>
                {hasEditPermissions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                      <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                    </td>
                )}
              </tr>
            )) : (
              <tr><td colSpan={columns.length + (hasEditPermissions ? 1 : 0)} className="text-center py-4">Geen toegankelijkheid items gevonden.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <ToegankelijkheidForm
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingItem) {
              onUpdate(editingItem.id, data);
            } else {
              onAdd(data);
            }
            setIsModalOpen(false);
          }}
        />
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
        <h3 className="text-2xl font-bold mb-6">{item ? 'Toegankelijkheid Item Bewerken' : 'Nieuw Toegankelijkheid Item'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="ToegankelijkheidTitleNl" value={formData.ToegankelijkheidTitleNl} onChange={handleChange} placeholder="Nederlandse titel" className="w-full p-2 border rounded" required />
          <input type="text" name="ToegankelijkheidTitleEng" value={formData.ToegankelijkheidTitleEng} onChange={handleChange} placeholder="Engelse titel" className="w-full p-2 border rounded" />
          <input type="url" name="ToegankelijkheidUrlNl" value={formData.ToegankelijkheidUrlNl} onChange={handleChange} placeholder="Nederlandse URL" className="w-full p-2 border rounded" />
          <input type="url" name="ToegankelijkheidUrlEng" value={formData.ToegankelijkheidUrlEng} onChange={handleChange} placeholder="Engelse URL" className="w-full p-2 border rounded" />
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


export default App;