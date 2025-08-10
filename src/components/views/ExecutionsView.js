import React, { useState, useMemo } from 'react';
import { useSortAndFilter } from '../../hooks/useSortAndFilter';
import ViewHeader from '../ui/ViewHeader';
import { ColumnSelector } from '../ui/FilterComponents';
import ExecutionForm from '../forms/ExecutionForm';
import GenericImportModal from '../ui/GenericImportModal';
import { SortableTh } from '../ui/TableComponents';
import { icons } from '../../utils/icons';

function ExecutionsView({ executions, performances, locations, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions, onQuickView }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingExecution, setEditingExecution] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());

    const {
        filteredAndSortedItems: filteredExecutions,
        searchTerm,
        setSearchTerm,
        sortConfig,
        requestSort
    } = useSortAndFilter(executions, 'date', ['performanceTitle', 'locationName']);

    const ALL_COLUMNS = useMemo(() => [
        { key: 'date', header: 'Datum', sortable: true },
        { key: 'startTime', header: 'Starttijd', sortable: true },
        { key: 'endTime', header: 'Eindtijd', sortable: true },
        { key: 'performanceTitle', header: 'Voorstelling', sortable: true },
        { key: 'locationName', header: 'Locatie', sortable: true },
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

    const handleEdit = (execution) => {
        setEditingExecution(execution);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingExecution(null);
        setIsModalOpen(true);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedIds(new Set(filteredExecutions.map(ex => ex.id)));
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

    const isAllSelected = filteredExecutions.length > 0 && selectedIds.size === filteredExecutions.length;
    const countText = `Toont ${filteredExecutions.length} van ${executions.length} uitvoeringen`;

    return (
        <div>
            <ViewHeader
                title="Uitvoeringen"
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
                            <th className="px-4 py-3"><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={filteredExecutions.length === 0} /></th>
                            {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && <SortableTh key={col.key} column={col} sortConfig={sortConfig} requestSort={requestSort} />)}
                            <th className="px-6 py-3 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredExecutions.map(ex => (
                            <tr key={ex.id} className={selectedIds.has(ex.id) ? 'bg-indigo-50' : ''}>
                                <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.has(ex.id)} onChange={(e) => handleSelectOne(e, ex.id)} /></td>
                                {visibleColumns.has('date') && <td className="px-6 py-4 whitespace-nowrap">{new Date(ex.date).toLocaleDateString('nl-NL')}</td>}
                                {visibleColumns.has('startTime') && <td className="px-6 py-4 whitespace-nowrap">{ex.startTime}</td>}
                                {visibleColumns.has('endTime') && <td className="px-6 py-4 whitespace-nowrap">{ex.endTime}</td>}
                                {visibleColumns.has('performanceTitle') && <td className="px-6 py-4 whitespace-nowrap">{ex.performanceTitle}</td>}
                                {visibleColumns.has('locationName') && <td className="px-6 py-4 whitespace-nowrap">{ex.locationName}</td>}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onQuickView({ item: ex, type: 'execution' })} className="text-gray-500 hover:text-gray-800 mr-4">{icons.eye}</button>
                                    {hasEditPermissions && <>
                                        <button onClick={() => handleEdit(ex)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                                        <button onClick={() => onDelete(ex.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                                    </>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <ExecutionForm execution={editingExecution} performances={performances} locations={locations} onClose={() => setIsModalOpen(false)} onSave={(data) => {
                if (editingExecution) onUpdate(editingExecution.id, data);
                else onAdd(data);
                setIsModalOpen(false);
            }} />}
            {isImportModalOpen && <GenericImportModal title="Uitvoeringen" requiredColumns={['performanceId', 'locationId', 'date', 'startTime']} onClose={() => setIsImportModalOpen(false)} onImport={onBulkAdd} />}
        </div>
    );
}

export default ExecutionsView;
