import React, { useState, useMemo } from 'react';

function ScheduleView({ events, performances, executions, locations, companies, onQuickView }) {
    const [selectedEventId, setSelectedEventId] = useState(events.length > 0 ? events[0].id : '');
    
    const sortedEvents = useMemo(() => [...events].sort((a,b) => a.title.localeCompare(b.title)), [events]);

    const scheduleData = useMemo(() => {
        if (!selectedEventId) return [];
        
        const event = events.find(e => e.id === selectedEventId);
        if (!event || !event.executionIds) return [];

        const eventExecutions = (event.executionIds || [])
            .map(execId => executions.find(e => e.id === execId))
            .filter(Boolean)
            .map(e => {
                const performance = performances.find(p => p.id === e.performanceId);
                const company = performance ? companies.find(c => c.id === performance.companyId) : null;
                return {
                    ...e,
                    performance,
                    company,
                    location: locations.find(l => l.id === e.locationId),
                    dateTime: new Date(e.date + 'T' + e.startTime)
                }
            })
            .filter(e => e.performance && e.location && e.company);

        const executionsByDate = eventExecutions.reduce((acc, exec) => {
            const dateKey = exec.dateTime.toISOString().split('T')[0];
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(exec);
            return acc;
        }, {});

        const dailySchedules = Object.keys(executionsByDate).map(dateKey => {
            const dayExecutions = executionsByDate[dateKey];
            if (dayExecutions.length === 0) return null;

            const times = dayExecutions.map(e => e.dateTime.getTime());
            const minDateTime = new Date(Math.min(...times));
            const maxDateTime = new Date(Math.max(...times));

            const timeSlots = [];
            let currentTime = new Date(minDateTime);
            currentTime.setMinutes(Math.floor(currentTime.getMinutes() / 30) * 30, 0, 0);

            let endTime = new Date(maxDateTime);
            endTime.setMinutes(endTime.getMinutes() + 30);
            endTime.setMinutes(Math.ceil(endTime.getMinutes() / 30) * 30, 0, 0);

            while (currentTime < endTime) {
                timeSlots.push(new Date(currentTime));
                currentTime.setMinutes(currentTime.getMinutes() + 30);
            }

            const dayLocations = Array.from(new Set(dayExecutions.map(e => e.locationId)))
                .map(locationId => {
                    const location = locations.find(l => l.id === locationId);
                    const locationExecutions = dayExecutions.filter(e => e.locationId === locationId);
                    return { ...location, executions: locationExecutions };
                })
                .sort((a, b) => a.name.localeCompare(b.name));

            return {
                date: new Date(dateKey + 'T12:00:00'),
                timeSlots,
                locations: dayLocations
            };
        }).filter(Boolean);

        return dailySchedules.sort((a, b) => a.date - b.date);

    }, [selectedEventId, performances, executions, locations, events, companies]);

    const getExecutionPosition = (execution, timeSlots) => {
        const startTime = execution.dateTime;
        const performance = performances.find(p => p.id === execution.performanceId);
        const durationMinutes = performance?.duration || 30;
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        let startSlotIndex = -1;
        for (let i = 0; i < timeSlots.length; i++) {
            const slotStart = timeSlots[i];
            const slotEnd = new Date(slotStart.getTime() + 30 * 60000);
            if (startTime >= slotStart && startTime < slotEnd) {
                startSlotIndex = i;
                break;
            }
        }
        if (startSlotIndex === -1) return { startSlotIndex: 0, span: 1 };

        let endSlotIndex = startSlotIndex;
        for (let i = startSlotIndex; i < timeSlots.length; i++) {
            const slotEnd = new Date(timeSlots[i].getTime() + 30 * 60000);
            if (endTime > slotEnd) {
                endSlotIndex = i;
            } else {
                break;
            }
        }
        endSlotIndex = Math.min(endSlotIndex, timeSlots.length - 1);

        const span = Math.max(1, endSlotIndex - startSlotIndex + 1);
        return { startSlotIndex, span };
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Blokkenschema</h2>
                <div className="w-64">
                    <select 
                        value={selectedEventId} 
                        onChange={e => setSelectedEventId(e.target.value)} 
                        className="w-full p-2 border rounded-md shadow-sm"
                    >
                        <option value="">Selecteer een event</option>
                        {sortedEvents.map(event => (
                            <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedEventId && scheduleData.length > 0 ? (
                <div className="space-y-12">
                    {scheduleData.map(day => (
                        <div key={day.date.toISOString()}>
                            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                                {day.date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h3>
                            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                                <div className="grid" style={{ gridTemplateColumns: `150px 1fr` }}>
                                    <div className="sticky left-0 bg-gray-100 p-2 font-semibold z-20 border-b border-r border-gray-300">Locatie</div>
                                    <div className="grid" style={{ gridTemplateColumns: `repeat(${day.timeSlots.length}, minmax(100px, 1fr))` }}>
                                        {day.timeSlots.map(time => (
                                            <div key={time.toISOString()} className="bg-gray-50 p-2 text-center text-sm font-semibold border-b border-l border-gray-200">
                                                {time.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        ))}
                                    </div>

                                    {day.locations.map(location => (
                                        <React.Fragment key={location.id}>
                                            <div className="sticky left-0 bg-white p-2 font-semibold z-10 border-t border-r border-gray-300 flex items-center">{location.name}</div>
                                            <div className="relative grid border-t border-gray-200" style={{ gridTemplateColumns: `repeat(${day.timeSlots.length}, minmax(100px, 1fr))` }}>
                                                {day.timeSlots.map((_, index) => (
                                                    <div key={index} className="border-l border-gray-200 h-20"></div>
                                                ))}
                                                {location.executions.map(exec => {
                                                    const { startSlotIndex, span } = getExecutionPosition(exec, day.timeSlots);
                                                    return (
                                                        <button
                                                            key={exec.id}
                                                            onClick={() => onQuickView({ item: exec.performance, type: 'performance' })}
                                                            className="absolute bg-indigo-100 text-indigo-800 p-2 rounded-md text-xs m-1 flex flex-col justify-center cursor-pointer hover:bg-indigo-200 border border-indigo-300 shadow-sm text-left"
                                                            style={{
                                                                left: `calc(${(100 / day.timeSlots.length) * startSlotIndex}%)`,
                                                                width: `calc(${(100 / day.timeSlots.length) * span}%)`,
                                                                top: '0.25rem',
                                                                bottom: '0.25rem'
                                                            }}
                                                        >
                                                            <p className="font-bold truncate">{exec.performance.title}</p>
                                                            <p className="truncate italic text-indigo-600">{exec.company.companyName}</p>
                                                            <p className="mt-1">{exec.dateTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</p>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
            {selectedEventId && scheduleData.length === 0 && <p className="text-center p-8 bg-white rounded-lg shadow-md">Geen uitvoeringen gevonden voor dit event.</p>}
            {!selectedEventId && <p className="text-center p-8 bg-white rounded-lg shadow-md">Selecteer een event om het schema te zien.</p>}
        </div>
    );
}

export default ScheduleView;
