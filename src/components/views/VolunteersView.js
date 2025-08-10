import React, { useState, useMemo } from 'react';
import { useSortAndFilter } from '../../hooks/useSortAndFilter';
import ViewHeader from '../ui/ViewHeader';
import ContactForm from '../forms/ContactForm';
import { icons } from '../../utils/icons';

function VolunteersView({ contacts, onAdd, onUpdate, onDelete, hasEditPermissions }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const volunteers = useMemo(() => 
    contacts.filter(c => (c.Role || '').toLowerCase() === 'vrijwilliger'), 
    [contacts]
  );
  
  const { 
    filteredAndSortedItems: filteredVolunteers, 
    searchTerm, 
    setSearchTerm 
  } = useSortAndFilter(volunteers, 'Name', ['Name', 'Email', 'functie']);

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingContact({ Role: 'vrijwilliger' });
    setIsModalOpen(true);
  };

  const countText = `Toont ${filteredVolunteers.length} van ${volunteers.length} vrijwilligers`;

  return (
    <div>
      <ViewHeader
        title="Vrijwilligers"
        countText={countText}
        onAddNew={handleAddNew}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        hasEditPermissions={hasEditPermissions}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVolunteers.length > 0 ? filteredVolunteers.map(volunteer => (
          <div key={volunteer.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-600">{volunteer.Name?.charAt(0) || '?'}</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-bold text-gray-900">{volunteer.Name}</h3>
                  <p className="text-sm text-gray-500">{volunteer.pronouns || ''}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Functie(s):</strong> {(volunteer.functie || []).join(', ') || 'N/A'}</p>
                <p><strong>Email:</strong> {volunteer.Email || 'N/A'}</p>
                <p><strong>Telefoon:</strong> {volunteer.Phone || 'N/A'}</p>
                <p><strong>Adres:</strong> {volunteer.Adress || 'N/A'}</p>
                <p><strong>Shirtmaat:</strong> {volunteer.shirtSize || 'N/A'}</p>
              </div>
            </div>
            {hasEditPermissions && (
              <div className="p-4 bg-gray-50 flex justify-end space-x-2">
                <button onClick={() => handleEdit(volunteer)} className="text-indigo-600 hover:text-indigo-900 p-2">{icons.edit}</button>
                <button onClick={() => onDelete(volunteer.id)} className="text-red-600 hover:text-red-900 p-2">{icons.trash}</button>
              </div>
            )}
          </div>
        )) : (
          <p className="col-span-full text-center py-10">Geen vrijwilligers gevonden.</p>
        )}
      </div>

      {isModalOpen && (
        <ContactForm 
          key={editingContact ? editingContact.id : 'new-volunteer'}
          contact={editingContact} 
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingContact && editingContact.id) {
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

export default VolunteersView;
