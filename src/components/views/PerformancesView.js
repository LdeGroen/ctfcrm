import React, { useState, useMemo } from 'react';
import { useSortAndFilter } from '../../hooks/useSortAndFilter';
import ViewHeader from '../ui/ViewHeader';
import { ColumnSelector } from '../ui/FilterComponents';
import PerformanceForm from '../forms/PerformanceForm';
import GenericImportModal from '../ui/GenericImportModal';
import { SortableTh, CopyToClipboardButton } from '../ui/TableComponents';
import { icons } from '../../utils/icons';

function PerformancesView({ performances, companies, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions, onQuickView }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingPerformance, setEditingPerformance] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());

    const performancesWithCompanyNames = useMemo(() => {
        return performances.map(p => {
            const company = companies.find(c => c.id === p.companyId);
            return { ...p, companyName: company ? company.companyName : 'Onbekend' };
        });
    }, [performances, companies]);

    const {
        filteredAndSortedItems: filteredPerformances,
        searchTerm,
        setSearchTerm,
        sortConfig,
        requestSort
    } = useSortAndFilter(performancesWithCompanyNames, 'title', ['title', 'companyName', 'genre']);

    const ALL_COLUMNS = useMemo(() => [
        { key: 'title', header: 'Titel', sortable: true },
        { key: 'companyName', header: 'Gezelschap', sortable: true },
        { key: 'genre', header: 'Genre', sortable: true },
        { key: 'duration', header: 'Duur (min)', sortable: true },
        { key: 'language', header: 'Taal', sortable: true },
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

    const handleEdit = (performance) => {
        setEditingPerformance(performance);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingPerformance(null);
        setIsModalOpen(true);
    };
    
    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedIds(new Set(filteredPerformances.map(p => p.id)));
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

    const isAllSelected = filteredPerformances.length > 0 && selectedIds.size === filteredPerformances.length;
    const countText = `Toont ${filteredPerformances.length} van ${performances.length} voorstellingen`;

    return (
        <div>
            <ViewHeader
                title="Voorstellingen"
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
                            <th className="px-4 py-3"><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={filteredPerformances.length === 0} /></th>
                            {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && <SortableTh key={col.key} column={col} sortConfig={sortConfig} requestSort={requestSort} />)}
                            <th className="px-6 py-3 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPerformances.map(p => (
                            <tr key={p.id} className={selectedIds.has(p.id) ? 'bg-indigo-50' : ''}>
                                <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.has(p.id)} onChange={(e) => handleSelectOne(e, p.id)} /></td>
                                {visibleColumns.has('title') && <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center justify-between group"><span>{p.title}</span><CopyToClipboardButton textToCopy={p.title} /></div></td>}
                                {visibleColumns.has('companyName') && <td className="px-6 py-4 whitespace-nowrap">{p.companyName}</td>}
                                {visibleColumns.has('genre') && <td className="px-6 py-4 whitespace-nowrap">{p.genre}</td>}
                                {visibleColumns.has('duration') && <td className="px-6 py-4 whitespace-nowrap">{p.duration}</td>}
                                {visibleColumns.has('language') && <td className="px-6 py-4 whitespace-nowrap">{p.language}</td>}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onQuickView({ item: p, type: 'performance' })} className="text-gray-500 hover:text-gray-800 mr-4">{icons.eye}</button>
                                    {hasEditPermissions && <>
                                        <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                                        <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                                    </>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <PerformanceForm performance={editingPerformance} companies={companies} onClose={() => setIsModalOpen(false)} onSave={(data) => {
                if (editingPerformance) onUpdate(editingPerformance.id, data);
                else onAdd(data);
                setIsModalOpen(false);
            }} />}
            {isImportModalOpen && <GenericImportModal title="Voorstellingen" requiredColumns={['title', 'companyId']} onClose={() => setIsImportModalOpen(false)} onImport={onBulkAdd} />}
        </div>
    );
}

export default PerformancesView;
