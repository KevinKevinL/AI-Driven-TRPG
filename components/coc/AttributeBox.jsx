import React from 'react';

const AttributeBox = ({ label, value, englishLabel }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-sm text-gray-600">{englishLabel}</div>
            <div className="text-lg font-bold">{label}</div>
            <div className="text-2xl text-blue-600 mt-1">{value}</div>
        </div>
    );
};

export default AttributeBox;