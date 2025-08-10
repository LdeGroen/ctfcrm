import React, { useState } from 'react';
import { icons } from '../../utils/icons';

export function SortableTh({ column, sortConfig, requestSort }) {
    const isSorted = sortConfig.key === column.key;
    const directionIcon = isSorted ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '';

    return (
        <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => column.sortable && requestSort(column.key)}
        >
            <div className="flex items-center">
                <span>{column.header}</span>
                {column.sortable && <span className="ml-2">{directionIcon}</span>}
            </div>
        </th>
    );
}

export function CopyToClipboardButton({ textToCopy }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!textToCopy) return;
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Kopiëren naar klembord mislukt', err);
        }
        document.body.removeChild(textarea);
    };

    return (
        <button onClick={handleCopy} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-gray-200">
            {copied ? icons.check : icons.copy}
        </button>
    );
}
