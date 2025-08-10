import React, { useState, useMemo } from 'react';
import { useSortAndFilter } from '../../hooks/useSortAndFilter';
import ViewHeader from '../ui/ViewHeader';
import EventForm from '../forms/EventForm';
import { SortableTh } from '../ui/TableComponents';
import { icons } from '../../utils/icons';

function EventsView({ events, executions, performances, locations, onAdd, onUpdate, onDelete, hasEditPermissions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const {
        filteredAndSortedItems: filteredEvents,
        searchTerm,
        setSearchTerm,
        sortConfig,
        requestSort
    } = useSortAndFilter(events, 'title', ['title', 'description']);

    const handleEdit = (event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const countText = `Toont ${filteredEvents.length} van ${events.length} events`;

    return (
        <div>
            <ViewHeader
                title="Events"
                countText={countText}
                onAddNew={handleAddNew}
                onSearch={setSearchTerm}
                searchTerm={searchTerm}
                hasEditPermissions={hasEditPermissions}
            />
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableTh column={{ key: 'title', header: 'Titel', sortable: true }} sortConfig={sortConfig} requestSort={requestSort} />
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gekoppelde Uitvoeringen</th>
                            {hasEditPermissions && <th className="px-6 py-3 text-right">Acties</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEvents.map(event => (
                            <tr key={event.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{event.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {(event.executionIds || []).length}
                                </td>
                                {hasEditPermissions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(event)} className="text-indigo-600 hover:text-indigo-900 mr-4">{icons.edit}</button>
                                        <button onClick={() => onDelete(event.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <EventForm event={editingEvent} executions={executions} onClose={() => setIsModalOpen(false)} onSave={(data) => {
                if (editingEvent) onUpdate(editingEvent.id, data);
                else onAdd(data);
                setIsModalOpen(false);
            }} />}
        </div>
    );
}

export default EventsView;
