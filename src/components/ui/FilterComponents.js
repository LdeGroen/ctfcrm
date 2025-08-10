import React, { useState, useRef, useEffect } from 'react';
import { icons } from '../../utils/icons';

export function ColumnSelector({ columns, visibleColumns, toggleColumn }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 px-4 py-2 border rounded-lg shadow-sm bg-white">
                <span>Kolommen</span>
                {icons.chevronDown}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border">
                    <ul className="py-1">
                        {columns.map(col => (
                            <li key={col.key} className="px-3 py-2 hover:bg-gray-100">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns.has(col.key)}
                                        onChange={() => toggleColumn(col.key)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{col.header}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export function FilterBar({ children }) {
    return (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg flex flex-wrap items-center gap-4">
            {children}
        </div>
    );
}

export function FilterDropdown({ label, name, value, onChange, options }) {
    return (
        <div className="flex items-center space-x-2">
            <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}:</label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className="p-2 border rounded-lg shadow-sm text-sm"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
