import React from 'react';
import { icons } from '../utils/icons';

function Sidebar({ activeView, setActiveView, user, onLogout, isMobile = false, onClose }) {
  const navItems = [
    { id: 'contacts', label: 'Contacten', icon: icons.users, visible: true },
    { id: 'volunteers', label: 'Vrijwilligers', icon: icons.star, visible: true }, 
    { id: 'companies', label: 'Gezelschappen', icon: icons.briefcase, visible: true },
    { id: 'performances', label: 'Voorstellingen', icon: icons.film, visible: true },
    { id: 'executions', label: 'Uitvoeringen', icon: icons.calendar, visible: true },
    { id: 'locations', label: 'Locaties', icon: icons.mapPin, visible: true },
    { id: 'events', label: 'Events', icon: icons.star, visible: true },
    { id: 'info', label: 'Info', icon: icons.info, visible: true },
    { id: 'news', label: 'Nieuws', icon: icons.news, visible: true },
    { id: 'accessibility', label: 'Toegankelijkheid', icon: icons.accessibility, visible: true },
    { id: 'schedule', label: 'Blokkenschema', icon: icons.grid, visible: true },
    { id: 'contract', label: 'Contract Generator', icon: icons.fileText, visible: true },
    { id: 'team', label: 'Team', icon: icons.settings, visible: user.role === 'super_admin' },
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
                <img src="https://cafetheaterfestival.nl/wp-content/uploads/2025/06/fav.png" alt="CTF Logo" className="w-8 h-8" />
                <h1 className="text-xl font-bold text-gray-800">CTF CRM</h1>
            </div>
            {isMobile && (
              <button onClick={onClose} className="text-gray-500 p-2">{icons.x}</button>
            )}
        </div>
        <ul>
          {navItems.filter(item => item.visible).map(item => (
            <li key={item.id}>
              <button onClick={() => setActiveView(item.id)} className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${activeView === item.id ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''}`}>
                <div className="w-6 h-6">{item.icon}</div><span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-sm text-gray-500 mb-4">
          <p>Ingelogd als:</p>
          <p className="font-semibold break-all">{user.name}</p>
          <p className="text-xs break-all">{user.email}</p>
          <p className="text-xs capitalize mt-1">Rol: <span className="font-bold">{user.role.replace('_', ' ')}</span></p>
        </div>
        <button onClick={onLogout} className="w-full flex items-center space-x-3 p-3 rounded-lg text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
          {icons.logout}<span>Uitloggen</span>
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
