import React from 'react';

function Notification({ message, type }) {
    const baseClasses = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white z-50 animate-fade-in-down";
    const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type] || typeClasses.info}`}>
            {message}
        </div>
    );
}

export default Notification;
