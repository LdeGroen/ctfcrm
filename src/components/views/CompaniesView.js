import React, { useState, useMemo } from 'react';
import { useSortAndFilter } from '../../hooks/useSortAndFilter';
import ViewHeader from '../ui/ViewHeader';
import { ColumnSelector } from '../ui/FilterComponents';
import CompanyForm from '../forms/CompanyForm';
import GenericImportModal from '../ui/GenericImportModal';
import { SortableTh, CopyToClipboardButton } from '../ui/TableComponents';
import { icons } from '../../utils/icons';

function CompaniesView({ companies, artists, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions, onQuickView }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());

    const {
        filteredAndSortedItems: filteredCompanies,
        searchTerm,
        setSearchTerm,
        sortConfig,
        requestSort
    } = useSortAndFilter(companies, 'companyName', ['companyName', 'primaryContactName', 'email']);

    const ALL_COLUMNS = useMemo(() => [
        { key: 'companyName', header: 'Naam Gezelschap', sortable: true },
        { key: 'primaryContactName', header: 'Contactpersoon', sortable: true },
        { key: 'email', header: 'Email', sortable: true },
        { key: 'phone', header: 'Telefoon', sortable: true },
        { key: 'website', header: 'Website', sortable: false },
    ], []);

    const [visibleColumns, setVisibleColumns] = useState(new Set(ALL_COLUMNS.map(c => c.key)));

    const toggleColumn = (key) => {
        setVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) newSet.delete(key);
            else newSet.add(key);
            return newSet;
        });
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCompany(null);
        setIsModalOpen(true);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedIds(new Set(filteredCompanies.map(c => c.id)));
        else setSelectedIds(new Set());
    };

    const handleSelectOne = (e, id) => {
        const newSelectedIds = new Set(selectedIds);
        if (e.target.checked) newSelectedIds.add(id);
        else newSelectedIds.delete(id);
        setSelectedIds(newSelectedIds);
    };

    const handleBulkDelete = () => {
        if (selectedIds.size > 0) {
            onBulkDelete(Array.from(selectedIds));
            setSelectedIds(new Set());
        }
    };

    const isAllSelected = filteredCompanies.length > 0 && selectedIds.size === filteredCompanies.length;
    const countText = `Toont ${filteredCompanies.length} van ${companies.length} gezelschappen`;

    return (
        <div>
            <ViewHeader
                title="Gezelschappen"
                countText={countText}
                onAddNew={handleAddNew}
                onImport={() => setIsImportModalOpen(true)}
                onSearch={setSearchTerm}
                searchTerm={searchTerm}
                hasEditPermissions={hasEditPermissions}
            >
                <ColumnSelector columns={ALL_COLUMNS} visibleColumns={visibleColumns} toggleColumn={toggleColumn} />
            </ViewHeader>

            {selectedIds.size > 0 && hasEditPermissions && (
                 <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg mb-4 flex items-center justify-between">
                    <span className="text-indigo-800 font-semibold">{selectedIds.size} geselecteerd</span>
                    <button onClick={handleBulkDelete} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 flex items-center space-x-1">
                        {icons.trash} <span>Verwijderen</span>
                    </button>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3"><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={filteredCompanies.length === 0} /></th>
                            {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && <SortableTh key={col.key} column={col} sortConfig={sortConfig} requestSort={requestSort} />)}
                            <th className="px-6 py-3 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCompanies.map(c => (
                            <tr key={c.id} className={selectedIds.has(c.id) ? 'bg-indigo-50' : ''}>
                                <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.has(c.id)} onChange={(e) => handleSelectOne(e, c.id)} /></td>
                                {visibleColumns.has('companyName') && <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center justify-between group"><span>{c.companyName}</span><CopyToClipboardButton textToCopy={c.companyName} /></div></td>}
                                {visibleColumns.has('primaryContactName') && <td className="px-6 py-4 whitespace-nowrap">{c.primaryContactName}</td>}
                                {visibleColumns.has('email') && <td className="px-6 py-4 whitespace-nowrap">{c.email}</td>}
                                {visibleColumns.has('phone') && <td className="px-6 py-4 whitespace-nowrap">{c.phone}</td>}
                                {visibleColumns.has('website') && <td className="px-6 py-4 whitespace-nowrap"><a href={c.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{c.website}</a></td>}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onQuickView({ item: c, type: 'company' })} className="text-gray-500 hover:text-gray-800 mr-4">{icons.eye}</button>
                                    {hasEditPermissions && <>
                                        <button onClick={() => handleEdit(c)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                                        <button onClick={() => onDelete(c.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                                    </>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <CompanyForm company={editingCompany} artists={artists} onClose={() => setIsModalOpen(false)} onSave={(data) => {
                if (editingCompany) onUpdate(editingCompany.id, data);
                else onAdd(data);
                setIsModalOpen(false);
            }} />}
            {isImportModalOpen && <GenericImportModal title="Gezelschappen" requiredColumns={['companyName', 'primaryContactId']} onClose={() => setIsImportModalOpen(false)} onImport={onBulkAdd} />}
        </div>
    );
}

export default CompaniesView;
