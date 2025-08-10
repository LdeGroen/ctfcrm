import React from 'react';
import { icons } from '../../utils/icons';

function ViewHeader({ title, countText, onAddNew, onImport, onSearch, searchTerm, children, hasEditPermissions }) {
    return (
        <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm pt-4 pb-4 mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
                  {countText && <p className="text-sm text-gray-500 mt-1">{countText}</p>}
                </div>
                {hasEditPermissions && (
                    <div className="flex space-x-2">
                        {onImport && <button onClick={onImport} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center space-x-2">
                            {icons.upload}
                            <span>Importeren</span>
                        </button>}
                        {onAddNew && <button onClick={onAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 flex items-center space-x-2">
                            {icons.plus}
                            <span>Nieuw</span>
                        </button>}
                    </div>
                )}
            </div>
            <div className="flex gap-4 items-center flex-wrap">
                <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icons.search}</span>
                    <input
                        type="text"
                        placeholder="Zoeken..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full p-2 pl-10 border rounded-lg shadow-sm"
                    />
                </div>
                {children}
            </div>
        </div>
    );
}

export default ViewHeader;
