import React, { useState, useEffect, useCallback } from 'react';
import { Client, Account, Databases, ID, Query, AppwriteException } from 'https://esm.sh/appwrite@14.0.1';

// --- Appwrite Configuratie ---
// VERVANG DEZE WAARDEN met je eigen Appwrite project details.
// Je vindt deze in je Appwrite Console > Settings.
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'; // Of je eigen self-hosted endpoint
const APPWRITE_PROJECT_ID = '6874f0b40015fc341b14'; // Vervang dit
const APPWRITE_DATABASE_ID = '68873afd0015cc5075e5'; // Vervang dit
const APPWRITE_COLLECTION_CONTACTS_ID = '68873b53001cd7a02043'; // Vervang dit
const APPWRITE_COLLECTION_COMPANIES_ID = '68873b5f0032519e7321'; // Vervang dit
const APPWRITE_COLLECTION_PERFORMANCES_ID = '68873b6500074288e73d'; // Vervang dit

// --- Initialiseer Appwrite Client ---
const client = new Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
const account = new Account(client);
const databases = new Databases(client);

// --- Helper: Iconen ---
const icons = {
  users: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  briefcase: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  fileText: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
  plus: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>,
  trash: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  edit: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
  x: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>,
  theater: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
};

// --- Hoofd Applicatie Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for existing session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get();
        if (currentUser.email.endsWith('@cafetheaterfestival.nl')) {
          setUser(currentUser);
        } else {
          await account.deleteSession('current');
          setError('Toegang geweigerd. Alleen accounts van @cafetheaterfestival.nl zijn toegestaan.');
        }
      } catch (e) {
        // Not logged in
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleGoogleLogin = async () => {
    try {
        // De 'success' en 'failure' URL's moeten overeenkomen met de URL waar je app draait.
        const successUrl = window.location.origin;
        const failureUrl = window.location.origin;
        account.createOAuth2Session('google', successUrl, failureUrl);
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
    return <div className="flex items-center justify-center h-screen bg-gray-100"><div className="text-xl font-semibold">Laden...</div></div>;
  }

  if (!user) {
    return <LoginScreen onLogin={handleGoogleLogin} error={error} />;
  }

  return <CrmApp user={user} onLogout={handleLogout} />;
}

// --- Login Scherm ---
function LoginScreen({ onLogin, error }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="bg-indigo-600 text-white p-3 rounded-lg">{icons.theater}</span>
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

// --- De eigenlijke CRM Applicatie ---
function CrmApp({ user, onLogout }) {
  const [activeView, setActiveView] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: () => {} });

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

  // --- Data ophalen en realtime updates ---
  useEffect(() => {
    setLoadingData(true);
    const collections = {
      contacts: { id: APPWRITE_COLLECTION_CONTACTS_ID, setter: setContacts },
      companies: { id: APPWRITE_COLLECTION_COMPANIES_ID, setter: setCompanies },
      performances: { id: APPWRITE_COLLECTION_PERFORMANCES_ID, setter: setPerformances },
    };

    const fetchInitialData = async () => {
        try {
            for (const key in collections) {
                const { id, setter } = collections[key];
                const response = await databases.listDocuments(APPWRITE_DATABASE_ID, id);
                setter(response.documents.map(doc => ({ ...doc, id: doc.$id })));
            }
        } catch (e) {
            console.error("Fout bij ophalen data:", e);
            showNotification("Kon data niet laden.", "error");
        }
    };
    
    fetchInitialData().finally(() => setLoadingData(false));

    // Realtime subscriptions
    const unsubscribers = Object.values(collections).map(({ id, setter }) => {
        const channel = `databases.${APPWRITE_DATABASE_ID}.collections.${id}.documents`;
        return client.subscribe(channel, response => {
            const changedDoc = { ...response.payload, id: response.payload.$id };
            setter(prevItems => {
                const eventTypes = response.events[0];
                if (eventTypes.includes('.create')) {
                    return [...prevItems, changedDoc];
                }
                if (eventTypes.includes('.update')) {
                    return prevItems.map(item => item.id === changedDoc.id ? changedDoc : item);
                }
                if (eventTypes.includes('.delete')) {
                    return prevItems.filter(item => item.id !== changedDoc.id);
                }
                return prevItems;
            });
        });
    });

    return () => {
        unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  // --- CRUD Operaties ---
  const handleAddItem = async (collectionId, data) => {
    try {
      await databases.createDocument(APPWRITE_DATABASE_ID, collectionId, ID.unique(), data);
      showNotification('Item succesvol toegevoegd!');
    } catch (e) {
      console.error("Fout bij toevoegen item:", e);
      showNotification('Toevoegen mislukt.', 'error');
    }
  };

  const handleUpdateItem = async (collectionId, id, data) => {
    try {
      await databases.updateDocument(APPWRITE_DATABASE_ID, collectionId, id, data);
      showNotification('Item succesvol bijgewerkt!');
    } catch (e) {
      console.error("Fout bij bijwerken item:", e);
      showNotification('Bijwerken mislukt.', 'error');
    }
  };

  const handleDeleteItem = async (collectionId, id) => {
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

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} user={user} onLogout={onLogout} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
        {notification.show && <Notification message={notification.message} type={notification.type} />}
        {confirmModal.show && <ConfirmModal message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={hideConfirm} />}
        
        {loadingData && <div className="text-center">Data laden...</div>}
        {!loadingData && activeView === 'contacts' && 
          <ContactsView 
            contacts={contacts} 
            companies={companies}
            onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_CONTACTS_ID, data)}
            onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_CONTACTS_ID, id, data)}
            onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_CONTACTS_ID, id)}
            showNotification={showNotification}
          />}
        {!loadingData && activeView === 'companies' && 
          <CompaniesView 
            companies={companies} 
            artists={contacts.filter(c => c.role === 'artiest')}
            performances={performances}
            onAdd={(data) => handleAddItem(APPWRITE_COLLECTION_COMPANIES_ID, data)}
            onUpdate={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_COMPANIES_ID, id, data)}
            onDelete={(id) => handleDeleteItem(APPWRITE_COLLECTION_COMPANIES_ID, id)}
            onAddPerformance={(data) => handleAddItem(APPWRITE_COLLECTION_PERFORMANCES_ID, data)}
            onUpdatePerformance={(id, data) => handleUpdateItem(APPWRITE_COLLECTION_PERFORMANCES_ID, id, data)}
            onDeletePerformance={(id) => handleDeleteItem(APPWRITE_COLLECTION_PERFORMANCES_ID, id)}
          />}
        {!loadingData && activeView === 'contract' && 
          <ContractGenerator 
            contacts={contacts} 
            companies={companies} 
            performances={performances}
            showNotification={showNotification}
          />}
      </main>
    </div>
  );
}

// --- UI Componenten (Sidebar, Modals, etc) ---

function Sidebar({ activeView, setActiveView, user, onLogout }) {
  const navItems = [
    { id: 'contacts', label: 'Contacten', icon: icons.users },
    { id: 'companies', label: 'Gezelschappen & Voorstellingen', icon: icons.briefcase },
    { id: 'contract', label: 'Contract Generator', icon: icons.fileText },
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-3 mb-10">
          <span className="bg-indigo-600 text-white p-2 rounded-lg">{icons.theater}</span>
          <h1 className="text-xl font-bold text-gray-800">CTF CRM</h1>
        </div>
        <ul>
          {navItems.map(item => (
            <li key={item.id}>
              <button onClick={() => setActiveView(item.id)} className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${activeView === item.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`}>
                {item.icon}<span>{item.label}</span>
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

// --- View Componenten (ContactsView, etc.) ---
// De inhoud van deze componenten is grotendeels hetzelfde, met kleine aanpassingen
// om de nieuwe notificatie- en bevestigingsfuncties te gebruiken.

function ContactsView({ contacts, companies, onAdd, onUpdate, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const roles = ['artiest', 'vrijwilliger', 'café-eigenaar', 'teamlid'];
  const filteredContacts = contacts.filter(c => filter === 'all' || c.role === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Contacten</h2>
        <button onClick={handleAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 flex items-center space-x-2">
          {icons.plus}
          <span>Nieuw Contact</span>
        </button>
      </div>
      
      <div className="mb-4 flex space-x-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Alles</button>
        {roles.map(role => (
          <button key={role} onClick={() => setFilter(role)} className={`px-3 py-1 rounded-full text-sm capitalize ${filter === role ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>{role}</button>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefoon</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredContacts.length > 0 ? filteredContacts.map(contact => (
              <tr key={contact.id}>
                <td className="px-6 py-4 whitespace-nowrap">{contact.name}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{contact.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{contact.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{contact.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(contact)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                  <button onClick={() => onDelete(contact.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center py-4">Geen contacten gevonden.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ContactForm 
          contact={editingContact} 
          companies={companies}
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
    </div>
  );
}

function ContactForm({ contact, companies, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    role: contact?.role || 'artiest',
    email: contact?.email || '',
    phone: contact?.phone || '',
    address: contact?.address || '',
    notes: contact?.notes || '',
    companyId: contact?.companyId || ''
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{contact ? 'Contact Bewerken' : 'Nieuw Contact'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Volledige naam" className="w-full p-2 border rounded" required />
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="artiest">Artiest</option>
            <option value="vrijwilliger">Vrijwilliger</option>
            <option value="café-eigenaar">Café-eigenaar</option>
            <option value="teamlid">Teamlid</option>
          </select>
          {formData.role === 'artiest' && (
            <select name="companyId" value={formData.companyId} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Geen gezelschap</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
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

function CompaniesView({ companies, artists, performances, onAdd, onUpdate, onDelete, onAddPerformance, onUpdatePerformance, onDeletePerformance }) {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isPerfModalOpen, setIsPerfModalOpen] = useState(false);
  const [editingPerformance, setEditingPerformance] = useState(null);
  const [currentCompanyForPerf, setCurrentCompanyForPerf] = useState(null);

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleAddNewCompany = () => {
    setEditingCompany(null);
    setIsCompanyModalOpen(true);
  };

  const handleAddNewPerformance = (company) => {
    setCurrentCompanyForPerf(company);
    setEditingPerformance(null);
    setIsPerfModalOpen(true);
  };
  
  const handleEditPerformance = (performance, company) => {
    setCurrentCompanyForPerf(company);
    setEditingPerformance(performance);
    setIsPerfModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gezelschappen & Voorstellingen</h2>
        <button onClick={handleAddNewCompany} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 flex items-center space-x-2">
          {icons.plus}
          <span>Nieuw Gezelschap</span>
        </button>
      </div>

      <div className="space-y-8">
        {companies.length > 0 ? companies.map(company => {
          const companyArtists = artists.filter(a => a.companyId === company.id);
          const companyPerformances = performances.filter(p => p.companyId === company.id);
          return (
            <div key={company.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700">{company.name}</h3>
                  <p className="text-gray-600 mt-1">{company.description}</p>
                </div>
                <div>
                  <button onClick={() => handleEditCompany(company)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                  <button onClick={() => onDelete(company.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Artiesten</h4>
                  <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md">
                    {companyArtists.length > 0 ? companyArtists.map(artist => (
                      <li key={artist.id} className="text-gray-700">{artist.name}</li>
                    )) : <li className="text-gray-500">Nog geen artiesten gekoppeld.</li>}
                  </ul>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg">Voorstellingen</h4>
                     <button onClick={() => handleAddNewPerformance(company)} className="bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600 flex items-center space-x-1">
                      {icons.plus}
                      <span>Nieuw</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {companyPerformances.length > 0 ? companyPerformances.map(perf => (
                      <div key={perf.id} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{perf.title}</p>
                          <p className="text-sm text-gray-500">{new Date(perf.date).toLocaleDateString('nl-NL')}</p>
                        </div>
                        <div>
                           <button onClick={() => handleEditPerformance(perf, company)} className="text-indigo-600 hover:text-indigo-900 mr-2 text-sm">{icons.edit}</button>
                           <button onClick={() => onDeletePerformance(perf.id)} className="text-red-600 hover:text-red-900 text-sm">{icons.trash}</button>
                        </div>
                      </div>
                    )) : <p className="text-gray-500 bg-gray-50 p-3 rounded-md">Geen voorstellingen.</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        }) : <p className="text-center py-4 bg-white rounded-lg shadow-md">Geen gezelschappen gevonden.</p>}
      </div>
      
      {isCompanyModalOpen && <CompanyForm company={editingCompany} onClose={() => setIsCompanyModalOpen(false)} onSave={(data) => { if (editingCompany) { onUpdate(editingCompany.id, data); } else { onAdd(data); } setIsCompanyModalOpen(false); }} />}
      {isPerfModalOpen && <PerformanceForm performance={editingPerformance} company={currentCompanyForPerf} onClose={() => setIsPerfModalOpen(false)} onSave={(data) => { if (editingPerformance) { onUpdatePerformance(editingPerformance.id, data); } else { onAddPerformance(data); } setIsPerfModalOpen(false); }} />}
    </div>
  );
}

function CompanyForm({ company, onClose, onSave }) {
  const [formData, setFormData] = useState({ name: company?.name || '', description: company?.description || '' });
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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

function PerformanceForm({ performance, company, onClose, onSave }) {
  const [formData, setFormData] = useState({ title: performance?.title || '', date: performance?.date ? new Date(performance.date).toISOString().split('T')[0] : '', companyId: company.id });
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...formData, date: new Date(formData.date).getTime() }); };
  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
        <h3 className="text-2xl font-bold mb-6">{performance ? 'Voorstelling Bewerken' : 'Nieuwe Voorstelling'} voor {company.name}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Titel van de voorstelling" className="w-full p-2 border rounded" required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" required />
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Opslaan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContractGenerator({ contacts, companies, performances, showNotification }) {
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [selectedPerformanceId, setSelectedPerformanceId] = useState('');
  const [contractText, setContractText] = useState('');

  const generateContract = () => {
    const artist = contacts.find(c => c.id === selectedArtistId);
    const performance = performances.find(p => p.id === selectedPerformanceId);
    if (!artist || !performance) {
      showNotification("Selecteer een artiest en een voorstelling.", "error");
      return;
    }
    const company = companies.find(c => c.id === performance?.companyId);
    if (!company) {
        showNotification("Kon het gezelschap voor deze voorstelling niet vinden.", "error");
        return;
    }

    const template = `CONTRACT VOOR VOORSTELLING...`; // Contract template is hetzelfde
    setContractText(template.trim());
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractText).then(() => {
        showNotification('Contract gekopieerd naar klembord!');
    }, () => {
        showNotification('Kon contract niet kopiëren.', 'error');
    });
  };

  const artists = contacts.filter(c => c.role === 'artiest');

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Contract Generator</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kies Artiest</label>
            <select value={selectedArtistId} onChange={e => setSelectedArtistId(e.target.value)} className="w-full p-2 border rounded">
              <option value="">Selecteer een artiest...</option>
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kies Voorstelling</label>
            <select value={selectedPerformanceId} onChange={e => setSelectedPerformanceId(e.target.value)} className="w-full p-2 border rounded">
              <option value="">Selecteer een voorstelling...</option>
              {performances.map(p => {
                const company = companies.find(c => c.id === p.companyId);
                return <option key={p.id} value={p.id}>{p.title} ({company?.name})</option>
              })}
            </select>
          </div>
        </div>
        <button onClick={generateContract} className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 mb-6">
          Genereer Contract
        </button>

        {contractText && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Conceptcontract</h3>
            <textarea readOnly value={contractText} className="w-full h-96 p-4 border rounded bg-gray-50 font-mono text-sm"></textarea>
            <button onClick={copyToClipboard} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Kopieer naar Klembord
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
