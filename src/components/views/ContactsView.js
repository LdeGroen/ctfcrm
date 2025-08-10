import React, { useState, useMemo, useEffect } from 'react';
import { useSortAndFilter } from '../../hooks/useSortAndFilter';
import ViewHeader from '../ui/ViewHeader';
import { ColumnSelector, FilterBar, FilterDropdown } from '../ui/FilterComponents';
import ContactForm, { BulkEditContactForm } from '../forms/ContactForm';
import GenericImportModal from '../ui/GenericImportModal';
import { SortableTh, CopyToClipboardButton } from '../ui/TableComponents';
import { icons } from '../../utils/icons';

function ContactsView({ contacts, onAdd, onUpdate, onBulkUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  const nonVolunteers = useMemo(() => 
    contacts.filter(c => (c.Role || '').toLowerCase() !== 'vrijwilliger'),
    [contacts]
  );

  const initialFilters = { Role: 'all', functie: 'all', isCurrentlyEmployed: 'all' };

  const { 
    filteredAndSortedItems: filteredAndSortedContacts, 
    searchTerm, 
    setSearchTerm, 
    sortConfig, 
    requestSort,
    filters,
    handleFilterChange
  } = useSortAndFilter(nonVolunteers, 'Name', ['Name', 'Email', 'Phone', 'Role', 'functie'], initialFilters);

  const roles = useMemo(() => {
    const roleSet = new Set(nonVolunteers.map(c => (c.Role || '').trim().toLowerCase()).filter(Boolean));
    return Array.from(roleSet).sort();
  }, [nonVolunteers]);

  const functies = useMemo(() => {
    const functieSet = new Set(nonVolunteers.flatMap(c => c.functie || []).filter(Boolean));
    return Array.from(functieSet).sort();
  }, [nonVolunteers]);

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
  const countText = `Toont ${filteredAndSortedContacts.length} van ${nonVolunteers.length} contacten (excl. vrijwilligers)`;

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
                functie: item.functie ? item.functie.split(';').map(f => f.trim()) : [],
                pronouns: item.pronouns || '',
                shirtSize: item.shirtSize || '',
            })))}
        />
      )}
    </div>
  );
}

export default ContactsView;
