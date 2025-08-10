import React, { useState } from 'react';
import { icons } from '../../utils/icons';

function EventForm({ event, executions, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: event?.title || '',
        description: event?.description || '',
        executionIds: event?.executionIds || [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleExecutionChange = (executionId) => {
        setFormData(prev => {
            const newExecutionIds = new Set(prev.executionIds);
            if (newExecutionIds.has(executionId)) {
                newExecutionIds.delete(executionId);
            } else {
                newExecutionIds.add(executionId);
            }
            return { ...prev, executionIds: Array.from(newExecutionIds) };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">{event?.id ? 'Event Bewerken' : 'Nieuw Event'}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Titel van het event" className="w-full p-2 border rounded" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Beschrijving" className="w-full p-2 border rounded h-24"></textarea>
                    <div>
                        <h4 className="font-semibold mb-2">Koppel Uitvoeringen</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border p-2 rounded-md">
                            {executions.map(ex => (
                                <label key={ex.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                                    <input
                                        type="checkbox"
                                        checked={formData.executionIds.includes(ex.id)}
                                        onChange={() => handleExecutionChange(ex.id)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                    <span className="text-sm">{ex.performanceTitle} @ {ex.locationName} ({new Date(ex.date).toLocaleDateString('nl-NL')})</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Opslaan</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EventForm;
