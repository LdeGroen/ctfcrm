import React from 'react';

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-xl text-center">
                <h3 className="text-lg font-medium mb-4">{message}</h3>
                <div className="flex justify-center space-x-4">
                    <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Annuleren</button>
                    <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Bevestigen</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
