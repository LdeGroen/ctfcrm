import React, { useState } from 'react';
import { icons } from '../../utils/icons';

// A generic form for Info, News, and Accessibility items
function ContentForm({ item, itemTypeLabel, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: item?.title || '',
        content: item?.content || '',
        category: item?.category || '', // For Info items
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
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">{item?.id ? `${itemTypeLabel} Bewerken` : `Nieuwe ${itemTypeLabel}`}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Titel" className="w-full p-2 border rounded" required />
                    {itemTypeLabel === 'Info' && (
                         <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Categorie (bv. Algemeen, Artiesten)" className="w-full p-2 border rounded" />
                    )}
                    <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Inhoud" className="w-full p-2 border rounded h-48"></textarea>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ContentForm;
