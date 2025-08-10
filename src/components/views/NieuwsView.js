import React, { useState } from 'react';
import ViewHeader from '../ui/ViewHeader';
import ContentForm from '../forms/ContentForm';
import { icons } from '../../utils/icons';

function NieuwsView({ nieuwsItems, onAdd, onUpdate, onDelete, hasEditPermissions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = nieuwsItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };
    
    return (
        <div>
            <ViewHeader
                title="Nieuws"
                countText={`${filteredItems.length} items`}
                onAddNew={handleAddNew}
                onSearch={setSearchTerm}
                searchTerm={searchTerm}
                hasEditPermissions={hasEditPermissions}
            />
             <div className="space-y-4">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border">
                       <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-500 whitespace-pre-wrap">{item.content}</p>
                            </div>
                            {hasEditPermissions && (
                                <div className="flex-shrink-0 ml-4">
                                    <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-2">{icons.edit}</button>
                                    <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900">{icons.trash}</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && <ContentForm item={editingItem} itemTypeLabel="Nieuws" onClose={() => setIsModalOpen(false)} onSave={(data) => {
                if (editingItem) onUpdate(editingItem.id, data);
                else onAdd(data);
                setIsModalOpen(false);
            }} />}
        </div>
    );
}

export default NieuwsView;
