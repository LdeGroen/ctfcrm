import React, { useState } from 'react';
import { icons } from '../../utils/icons';

function ExecutionForm({ execution, performances, locations, onClose, onSave }) {
    const [formData, setFormData] = useState({
        performanceId: execution?.performanceId || '',
        locationId: execution?.locationId || '',
        date: execution?.date ? new Date(execution.date).toISOString().substring(0, 10) : '',
        startTime: execution?.startTime || '',
        endTime: execution?.endTime || '',
        notes: execution?.notes || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const performance = performances.find(p => p.id === formData.performanceId);
        const location = locations.find(l => l.id === formData.locationId);
        
        const dataToSave = {
            ...formData,
            performanceTitle: performance ? performance.title : 'Onbekend',
            locationName: location ? location.name : 'Onbekend',
        };
        onSave(dataToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl max-h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">{execution?.id ? 'Uitvoering Bewerken' : 'Nieuwe Uitvoering'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select name="performanceId" value={formData.performanceId} onChange={handleChange} className="w-full p-2 border rounded" required>
                        <option value="">Kies een voorstelling</option>
                        {performances.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                    <select name="locationId" value={formData.locationId} onChange={handleChange} className="w-full p-2 border rounded" required>
                        <option value="">Kies een locatie</option>
                        {locations.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                    </select>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <div className="flex space-x-4">
                        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-2 border rounded" required />
                        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
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

export default ExecutionForm;
