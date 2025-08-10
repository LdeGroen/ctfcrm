import React, { useState } from 'react';
import { icons } from '../../utils/icons';

function LocationForm({ location, cafeOwners, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: location?.name || '',
        address: location?.address || '',
        contactPersonId: location?.contactPersonId || '',
        capacity: location?.capacity || '',
        notes: location?.notes || '',
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
            <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl max-h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">{location?.id ? 'Locatie Bewerken' : 'Nieuwe Locatie'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Naam van de locatie" className="w-full p-2 border rounded" required />
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Adres" className="w-full p-2 border rounded" />
                    <select name="contactPersonId" value={formData.contactPersonId} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="">Kies een contactpersoon (café-eigenaar)</option>
                        {cafeOwners.map(owner => (
                            <option key={owner.id} value={owner.id}>{owner.Name}</option>
                        ))}
                    </select>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Capaciteit" className="w-full p-2 border rounded" />
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

export default LocationForm;
