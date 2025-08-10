import React, { useState } from 'react';
import { icons } from '../../utils/icons';

function PerformanceForm({ performance, companies, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: performance?.title || '',
        companyId: performance?.companyId || '',
        genre: performance?.genre || '',
        duration: performance?.duration || '',
        description: performance?.description || '',
        language: performance?.language || '',
        ageRating: performance?.ageRating || '',
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
                    <h3 className="text-2xl font-bold">{performance?.id ? 'Voorstelling Bewerken' : 'Nieuwe Voorstelling'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Titel van de voorstelling" className="w-full p-2 border rounded" required />
                    <select name="companyId" value={formData.companyId} onChange={handleChange} className="w-full p-2 border rounded" required>
                        <option value="">Kies een gezelschap</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>{company.companyName}</option>
                        ))}
                    </select>
                    <input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" className="w-full p-2 border rounded" />
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duur (in minuten)" className="w-full p-2 border rounded" />
                    <input type="text" name="language" value={formData.language} onChange={handleChange} placeholder="Taal" className="w-full p-2 border rounded" />
                    <input type="text" name="ageRating" value={formData.ageRating} onChange={handleChange} placeholder="Leeftijdsindicatie (bijv. 12+)" className="w-full p-2 border rounded" />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Korte beschrijving" className="w-full p-2 border rounded h-24"></textarea>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PerformanceForm;
