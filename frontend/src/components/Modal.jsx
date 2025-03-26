import React from 'react';

const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    const closeModal = (e) => {
        if (e.target.classList.contains("bg-gray-600")) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-full m-4 sm:w-1/2 md:w-1/3">
                <button className="absolute top-2 right-2 text-4xl cursor-pointer" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;