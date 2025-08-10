import { useState, useMemo } from 'react';

export function useSortAndFilter(items, initialSortKey, searchKeys = [], initialFilters = {}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: initialSortKey, direction: 'ascending' });
    const [filters, setFilters] = useState(initialFilters);

    const filteredAndSortedItems = useMemo(() => {
        let filtered = [...items];

        if (searchTerm) {
             const lowercasedTerm = searchTerm.toLowerCase();
             filtered = filtered.filter(item => 
                searchKeys.some(key => {
                    const value = key.split('.').reduce((o, i) => (o ? o[i] : undefined), item);
                    return String(value).toLowerCase().includes(lowercasedTerm);
                })
            );
        }
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value === 'all' || value === '') return;
            
            filtered = filtered.filter(item => {
                const itemValue = item[key];
                if (typeof itemValue === 'boolean') {
                    return (value === 'yes' && itemValue === true) || (value === 'no' && itemValue === false);
                }
                if (Array.isArray(itemValue)) {
                    return itemValue.includes(value);
                }
                return String(itemValue || '').toLowerCase() === String(value).toLowerCase();
            });
        });
      
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                    aValue = aValue ? 1 : 0;
                    bValue = bValue ? 1 : 0;
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    // Direct number comparison
                }
                else {
                    aValue = String(aValue || '').toLowerCase();
                    bValue = String(bValue || '').toLowerCase();
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [items, searchTerm, sortConfig, filters, searchKeys]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    
    const resetFilters = () => {
        setFilters(initialFilters);
    };

    return { 
        filteredAndSortedItems, 
        searchTerm, 
        setSearchTerm, 
        sortConfig, 
        requestSort,
        filters,
        handleFilterChange,
        resetFilters
    };
}
