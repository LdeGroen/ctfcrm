import React, { useState } from 'react';
import { icons } from '../../utils/icons';

function ContactForm({ contact, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: contact?.Name || '',
    role: contact?.Role || '',
    email: contact?.Email || '',
    phone: contact?.Phone || '',
    address: contact?.Adress || '',
    notes: contact?.Notes || '',
    isCurrentlyEmployed: contact?.isCurrentlyEmployed || false,
    yearsActive: new Set(contact?.yearsActive || []),
    functie: (contact?.functie || []).join(', '),
    pronouns: contact?.pronouns || '',
    shirtSize: contact?.shirtSize || '',
  });
  const [showMoreYears, setShowMoreYears] = useState(false);

  const recentYears = [2025, 2024, 2023, 2022];
  const olderYears = [2021, 2020, 2019, 2018, 2017, 2016];

  const handleYearChange = (year) => {
    setFormData(prev => {
        const newYears = new Set(prev.yearsActive);
        if (newYears.has(String(year))) newYears.delete(String(year));
        else newYears.add(String(year));
        return { ...prev, yearsActive: newYears };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const standardizedRole = formData.role.trim().toLowerCase();
    const functieForAppwrite = formData.functie.split(',').map(f => f.trim()).filter(Boolean);

    const dataForAppwrite = {
        Name: formData.name,
        Role: standardizedRole,
        Email: formData.email,
        Phone: formData.phone,
        Adress: formData.address,
        Notes: formData.notes,
        isCurrentlyEmployed: standardizedRole === 'teamlid' ? formData.isCurrentlyEmployed : false,
        yearsActive: Array.from(formData.yearsActive),
        functie: functieForAppwrite,
        pronouns: standardizedRole === 'vrijwilliger' ? formData.pronouns : null,
        shirtSize: standardizedRole === 'vrijwilliger' ? formData.shirtSize : null,
    };
    onSave(dataForAppwrite);
  };
  
  const standardizedRole = formData.role.trim().toLowerCase();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{contact?.id ? 'Contact Bewerken' : 'Nieuw Contact'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Volledige naam" className="w-full p-2 border rounded" required />
          <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Rol (bv. artiest, vrijwilliger)" className="w-full p-2 border rounded" required />
          
          {['teamlid', 'artiest', 'vrijwilliger'].includes(standardizedRole) && (
             <input type="text" name="functie" value={formData.functie} onChange={handleChange} placeholder="Functie(s), gescheiden door komma's" className="w-full p-2 border rounded" />
          )}

          {standardizedRole === 'vrijwilliger' && (
            <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50 space-y-4">
                <h4 className="font-semibold text-indigo-800">Vrijwilliger Details</h4>
                <input type="text" name="pronouns" value={formData.pronouns} onChange={handleChange} placeholder="Gewenste voornaamwoorden" className="w-full p-2 border rounded" />
                <select name="shirtSize" value={formData.shirtSize} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Kies shirtmaat...</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                </select>
            </div>
          )}

          {standardizedRole === 'teamlid' && (
            <label className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <input type="checkbox" name="isCurrentlyEmployed" checked={formData.isCurrentlyEmployed} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                <span>Momenteel werkzaam voor het festival?</span>
            </label>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Actieve Jaren</label>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {recentYears.map(year => (
                    <label key={year} className="flex items-center space-x-2">
                        <input type="checkbox" checked={formData.yearsActive.has(String(year))} onChange={() => handleYearChange(year)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        <span>{year}</span>
                    </label>
                ))}
            </div>
            {showMoreYears && (
                 <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                    {olderYears.map(year => (
                        <label key={year} className="flex items-center space-x-2">
                            <input type="checkbox" checked={formData.yearsActive.has(String(year))} onChange={() => handleYearChange(year)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                            <span>{year}</span>
                        </label>
                    ))}
                </div>
            )}
            <button type="button" onClick={() => setShowMoreYears(!showMoreYears)} className="text-sm text-indigo-600 hover:underline mt-2">
                {showMoreYears ? 'Minder jaren tonen' : 'Meer jaren tonen'}
            </button>
          </div>

          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mailadres" className="w-full p-2 border rounded" />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefoonnummer" className="w-full p-2 border rounded" />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Adres" className="w-full p-2 border rounded" />
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

export function BulkEditContactForm({ onClose, onSave, roles }) {
    const [fieldsToUpdate, setFieldsToUpdate] = useState({});
    const [formData, setFormData] = useState({
        Role: '',
        functie: '',
        isCurrentlyEmployed: false,
        Notes: '',
        Adress: '',
    });

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFieldsToUpdate(prev => ({ ...prev, [name]: checked }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToUpdate = {};
        for (const key in fieldsToUpdate) {
            if (fieldsToUpdate[key]) {
                 if (key === 'functie') {
                    dataToUpdate[key] = formData[key] ? [formData[key]] : [];
                } else {
                    dataToUpdate[key] = formData[key];
                }
            }
        }
        if (Object.keys(dataToUpdate).length > 0) {
            onSave(dataToUpdate);
        }
    };

    const renderField = (name, label, type = 'text', options = {}) => (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <input
                type="checkbox"
                name={name}
                checked={!!fieldsToUpdate[name]}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
            />
            <label className="w-32 font-medium text-gray-700">{label}</label>
            {type === 'select' ? (
                <select name={name} value={formData[name]} onChange={handleInputChange} disabled={!fieldsToUpdate[name]} className="w-full p-2 border rounded disabled:bg-gray-200">
                    <option value="">Kies een {label.toLowerCase()}</option>
                    {options.items.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
            ) : type === 'checkbox_input' ? (
                 <input type="checkbox" name={name} checked={formData[name]} onChange={handleInputChange} disabled={!fieldsToUpdate[name]} className="h-5 w-5 text-indigo-600 border-gray-300 rounded" />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={label}
                    disabled={!fieldsToUpdate[name]}
                    className="w-full p-2 border rounded disabled:bg-gray-200"
                />
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Contacten Bulk Bewerken</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">{icons.x}</button>
                </div>
                <p className="text-sm text-gray-600 mb-4">Vink de kenmerken aan die je wilt bijwerken voor de geselecteerde contacten. Alleen de aangevinkte velden worden gewijzigd.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {renderField('Role', 'Rol', 'select', { items: roles })}
                    {renderField('functie', 'Functie')}
                    {renderField('isCurrentlyEmployed', 'Actief?', 'checkbox_input')}
                    {renderField('Adress', 'Adres')}
                    {renderField('Notes', 'Notities')}
                    
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Wijzigingen Toepassen</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ContactForm;
