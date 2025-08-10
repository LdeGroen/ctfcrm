import React, { useState } from 'react';
import { icons } from '../../utils/icons';

function CompanyForm({ company, artists, onClose, onSave }) {
    const [formData, setFormData] = useState({
        companyName: company?.companyName || '',
        primaryContactId: company?.primaryContactId || '',
        email: company?.email || '',
        phone: company?.phone || '',
        website: company?.website || '',
        notes: company?.notes || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const primaryContact = artists.find(a => a.id === formData.primaryContactId);
        const dataToSave = {
            ...formData,
            primaryContactName: primaryContact ? primaryContact.Name : 'Onbekend',
        };
        onSave(dataToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl max-h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">{company?.id ? 'Gezelschap Bewerken' : 'Nieuw Gezelschap'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Naam van het gezelschap" className="w-full p-2 border rounded" required />
                    <select name="primaryContactId" value={formData.primaryContactId} onChange={handleChange} className="w-full p-2 border rounded" required>
                        <option value="">Kies een contactpersoon (artiest)</option>
                        {artists.map(artist => (
                            <option key={artist.id} value={artist.id}>{artist.Name}</option>
                        ))}
                    </select>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mailadres" className="w-full p-2 border rounded" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefoonnummer" className="w-full p-2 border rounded" />
                    <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="Website (https://...)" className="w-full p-2 border rounded" />
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

export default CompanyForm;
