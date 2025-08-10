import React, { useState, useEffect } from 'react';
import { functions } from '../../appwriteClient'; // Aangepaste import

function TeamView({ showNotification }) {
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTeamMembers = async () => {
        setIsLoading(true);
        try {
            // BELANGRIJK: Vervang 'listUsers' door de daadwerkelijke ID van je Appwrite functie
            const response = await functions.createExecution('listUsers', '{}', false);
            const data = JSON.parse(response.response);
            if (data.users) {
                const ctfUsers = data.users.filter(user => user.email.endsWith('@cafetheaterfestival.nl'));
                setTeamMembers(ctfUsers);
            } else {
                throw new Error(data.message || 'Kon teamleden niet ophalen.');
            }
        } catch (error) {
            console.error('Fout bij ophalen teamleden:', error);
            showNotification(`Fout: ${error.message}. Zorg dat de Appwrite functie 'listUsers' correct is ingesteld.`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            // BELANGRIJK: Vervang 'updateUserRole' door de daadwerkelijke ID van je Appwrite functie
            await functions.createExecution(
                'updateUserRole',
                JSON.stringify({ userId, role: newRole }),
                false
            );
            showNotification('Rol succesvol bijgewerkt!');
            fetchTeamMembers();
        } catch (error) {
            console.error('Fout bij bijwerken rol:', error);
            showNotification(`Fout bij bijwerken rol: ${error.message}. Zorg dat de Appwrite functie 'updateUserRole' correct is ingesteld.`, 'error');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Team Beheer</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8.257 3.099c.636-1.214 2.862-1.214 3.5 0l6.876 13.124c.636 1.214-.465 2.777-1.75 2.777H3.13c-1.285 0-2.386-1.563-1.75-2.777L8.257 3.099zM10 12a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Let op: Deze pagina vereist twee Appwrite Cloud Functions: één om gebruikers op te halen ('listUsers') en één om hun rol bij te werken ('updateUserRole'). Zorg ervoor dat deze correct zijn geconfigureerd in je Appwrite project.
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan="3" className="text-center py-4">Teamleden laden...</td></tr>
                        ) : teamMembers.length > 0 ? teamMembers.map(member => (
                            <tr key={member.$id}>
                                <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {member.prefs.role === 'super_admin' ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Super Admin</span>
                                    ) : (
                                        <select
                                            value={member.prefs.role || 'viewer'}
                                            onChange={(e) => handleRoleChange(member.$id, e.target.value)}
                                            className="p-1 border rounded-md"
                                        >
                                            <option value="viewer">Viewer</option>
                                            <option value="editor">Editor</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="3" className="text-center py-4">Geen teamleden gevonden.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TeamView;
