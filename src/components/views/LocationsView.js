import React, { useState, useMemo } from 'react';
import { useSortAndFilter } from '../../hooks/useSortAndFilter';
import ViewHeader from '../ui/ViewHeader';
import { ColumnSelector } from '../ui/FilterComponents';
import LocationForm from '../forms/LocationForm';
import GenericImportModal from '../ui/GenericImportModal';
import { SortableTh, CopyToClipboardButton } from '../ui/TableComponents';
import { icons } from '../../utils/icons';

function LocationsView({ locations, cafeOwners, performances, onAdd, onUpdate, onDelete, onBulkAdd, onBulkDelete, hasEditPermissions, onQuickView }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());

    const locationsWithDetails = useMemo(() => {
        return locations.map(loc => {
            const owner = cafeOwners.find(o => o.id === loc.contactPersonId);
            return {
                ...loc,
                contactPersonName: owner ? owner.Name : 'Onbekend',
            };
        });
    }, [locations, cafeOwners]);

    const {
        filteredAndSortedItems: filteredLocations,
        searchTerm,
        setSearchTerm,
        sortConfig,
        requestSort
    } = useSortAndFilter(locationsWithDetails, 'name', ['name', 'address', 'contactPersonName']);

    const ALL_COLUMNS = useMemo(() => [
        { key: 'name', header: 'Naam Locatie', sortable: true },
        { key: 'address', header: 'Adres', sortable: true },
        { key: 'contactPersonName', header: 'Contactpersoon', sortable: true },
        { key: 'capacity', header: 'Capaciteit', sortable: true },
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

    const handleEdit = (location) => {
        setEditingLocation(location);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingLocation(null);
        setIsModalOpen(true);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedIds(new Set(filteredLocations.map(l => l.id)));
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

    const isAllSelected = filteredLocations.length > 0 && selectedIds.size === filteredLocations.length;
    const countText = `Toont ${filteredLocations.length} van ${locations.length} locaties`;

    return (
        <div>
            <ViewHeader
                title="Locaties"
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
                            <th className="px-4 py-3"><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={filteredLocations.length === 0} /></th>
                            {ALL_COLUMNS.map(col => visibleColumns.has(col.key) && <SortableTh key={col.key} column={col} sortConfig={sortConfig} requestSort={requestSort} />)}
                            <th className="px-6 py-3 text-right">Acties</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLocations.map(loc => (
                            <tr key={loc.id} className={selectedIds.has(loc.id) ? 'bg-indigo-50' : ''}>
                                <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.has(loc.id)} onChange={(e) => handleSelectOne(e, loc.id)} /></td>
                                {visibleColumns.has('name') && <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center justify-between group"><span>{loc.name}</span><CopyToClipboardButton textToCopy={loc.name} /></div></td>}
                                {visibleColumns.has('address') && <td className="px-6 py-4 whitespace-nowrap">{loc.address}</td>}
                                {visibleColumns.has('contactPersonName') && <td className="px-6 py-4 whitespace-nowrap">{loc.contactPersonName}</td>}
                                {visibleColumns.has('capacity') && <td className="px-6 py-4 whitespace-nowrap">{loc.capacity}</td>}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onQuickView({ item: loc, type: 'location' })} className="text-gray-500 hover:text-gray-800 mr-4">{icons.eye}</button>
                                    {hasEditPermissions && <>
                                        <button onClick={() => handleEdit(loc)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                                        <button onClick={() => onDelete(loc.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                                    </>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <LocationForm location={editingLocation} cafeOwners={cafeOwners} onClose={() => setIsModalOpen(false)} onSave={(data) => {
                if (editingLocation) onUpdate(editingLocation.id, data);
                else onAdd(data);
                setIsModalOpen(false);
            }} />}
            {isImportModalOpen && <GenericImportModal title="Locaties" requiredColumns={['name']} onClose={() => setIsImportModalOpen(false)} onImport={onBulkAdd} />}
        </div>
    );
}

export default LocationsView;
