import React, { useState } from 'react';
import { icons } from '../../utils/icons';

function GenericImportModal({ title, requiredColumns, onClose, onImport }) {
    const [csvData, setCsvData] = useState('');
    const [error, setError] = useState('');

    const handleImport = () => {
        if (!csvData) {
            setError('Plak CSV-data in het tekstveld.');
            return;
        }

        const lines = csvData.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        const missingColumns = requiredColumns.filter(rc => !headers.includes(rc));
        if (missingColumns.length > 0) {
            setError(`De volgende kolommen zijn verplicht maar ontbreken: ${missingColumns.join(', ')}`);
            return;
        }

        const data = lines.slice(1).map(line => {
            const values = line.split(',');
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index]?.trim() || '';
            });
            return obj;
        });

        onImport(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Importeer {title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <div className="text-sm text-gray-600 space-y-2 mb-4">
                    <p>Plak hier je data in CSV-formaat. Zorg ervoor dat de eerste rij de kolomkoppen bevat.</p>
                    <p>Verplichte kolommen: <strong className="font-semibold">{requiredColumns.join(', ')}</strong></p>
                </div>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                <textarea
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    placeholder="companyName,primaryContactId,email,phone..."
                    className="w-full h-64 p-2 border rounded font-mono text-sm"
                ></textarea>
                <div className="flex justify-end space-x-4 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                    <button type="button" onClick={handleImport} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Importeren</button>
                </div>
            </div>
        </div>
    );
}

export default GenericImportModal;
