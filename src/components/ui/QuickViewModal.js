import React from 'react';
import { icons } from '../../utils/icons';

function QuickViewModal({ initialItem, itemType, data, onClose }) {
    const renderContent = () => {
        if (!initialItem) return <p>Geen data gevonden.</p>;

        switch (itemType) {
            case 'company':
                const companyPerformances = data.performances.filter(p => p.companyId === initialItem.id);
                return (
                    <div>
                        <h4 className="font-bold text-lg mb-2">Voorstellingen van {initialItem.companyName}</h4>
                        <ul className="list-disc pl-5 text-gray-700">
                            {companyPerformances.length > 0 ? companyPerformances.map(p => <li key={p.id}>{p.title}</li>) : <li>Geen voorstellingen gevonden.</li>}
                        </ul>
                    </div>
                );
            case 'performance':
                 const performanceExecutions = data.executions.filter(e => e.performanceId === initialItem.id);
                 return (
                    <div>
                        <h4 className="font-bold text-lg mb-2">Uitvoeringen van {initialItem.title}</h4>
                         <ul className="list-disc pl-5 text-gray-700">
                            {performanceExecutions.length > 0 ? performanceExecutions.map(e => <li key={e.id}>{e.locationName} op {new Date(e.date).toLocaleDateString('nl-NL')}</li>) : <li>Geen uitvoeringen gevonden.</li>}
                        </ul>
                    </div>
                 );
            case 'location':
                 const locationExecutions = data.executions.filter(e => e.locationId === initialItem.id);
                 return (
                    <div>
                        <h4 className="font-bold text-lg mb-2">Voorstellingen op locatie {initialItem.name}</h4>
                         <ul className="list-disc pl-5 text-gray-700">
                            {locationExecutions.length > 0 ? locationExecutions.map(e => <li key={e.id}>{e.performanceTitle} op {new Date(e.date).toLocaleDateString('nl-NL')}</li>) : <li>Geen voorstellingen gevonden.</li>}
                        </ul>
                    </div>
                 );
            case 'execution':
                return <p>Detailweergave voor uitvoeringen is nog niet geïmplementeerd.</p>
            default:
                return <p>Onbekend item type.</p>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Snelle Weergave: {initialItem?.companyName || initialItem?.title || initialItem?.name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default QuickViewModal;
