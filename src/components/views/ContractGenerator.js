import React, { useState, useEffect } from 'react';
import { icons } from '../../utils/icons';

const contractTemplateNL = `Het Café Theater Festival (CTF), rechtsgeldig vertegenwoordigd door Christiaan Uytdehaage, en [company_name], hierna te noemen ‘gezelschap’, spreken het volgende met elkaar af:
... (rest van de template) ...`;

const contractTemplateEN = `The Café Theater Festival (CTF), legally represented by Christiaan Uytdehaage, and [company_name], hereinafter referred to as 'the company', agree to the following:
... (rest van de template) ...`;

function ContractGenerator({ contacts, companies, performances, events, executions, showNotification }) {
    const [selectedPerformanceId, setSelectedPerformanceId] = useState('');
    const [contractText, setContractText] = useState('');
    const [language, setLanguage] = useState('nl');

    useEffect(() => {
        if (!document.getElementById('jspdf-script')) {
            const script = document.createElement('script');
            script.id = 'jspdf-script';
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const generateContract = () => {
        // ... (Logica om het contract te genereren, zoals in de vorige response) ...
        const performance = performances.find(p => p.id === selectedPerformanceId);
        if (!performance) {
            showNotification("Selecteer een voorstelling.", "error");
            return;
        }
        // ... etc
        setContractText("Dit is een gegenereerd contract..."); // Placeholder
    };

    const copyToClipboard = () => {
        // ... (Logica om te kopiëren, zoals in de vorige response) ...
    };

    const handleExportPDF = () => {
        // ... (Logica om PDF te exporteren, zoals in de vorige response) ...
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Contract Generator</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kies Voorstelling</label>
                        <select value={selectedPerformanceId} onChange={e => setSelectedPerformanceId(e.target.value)} className="w-full p-2 border rounded-md shadow-sm">
                            <option value="">Selecteer een voorstelling...</option>
                            {performances.sort((a,b) => a.title.localeCompare(b.title)).map(p => {
                                const company = companies.find(c => c.id === p.companyId);
                                return <option key={p.id} value={p.id}>{p.title} ({company?.companyName || 'Onbekend'})</option>
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kies Taal</label>
                        <div className="flex space-x-2">
                            <button onClick={() => setLanguage('nl')} className={`w-full p-2 rounded-md ${language === 'nl' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Nederlands</button>
                            <button onClick={() => setLanguage('en')} className={`w-full p-2 rounded-md ${language === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>English</button>
                        </div>
                    </div>
                </div>
                <button onClick={generateContract} className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 mb-6 shadow-md">
                    Genereer Contract
                </button>

                {contractText && (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Conceptcontract</h3>
                        <textarea readOnly value={contractText} className="w-full h-96 p-4 border rounded bg-gray-50 font-mono text-sm leading-relaxed"></textarea>
                        <div className="mt-4 flex space-x-2">
                            <button onClick={copyToClipboard} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md flex items-center space-x-2">
                                {icons.copy}
                                <span>Kopieer naar Klembord</span>
                            </button>
                            <button onClick={handleExportPDF} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md flex items-center space-x-2">
                                {icons.fileText}
                                <span>Exporteer als PDF</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContractGenerator;
