const AttributeBox = ({ label, value, englishLabel, showDerived = true }) => {
    const derived = calculateDerivedValues(value);
    
    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-emerald-900/50 shadow-lg 
                        hover:shadow-emerald-700/50 hover:shadow-xl transition-shadow
                        border border-emerald-900/30 backdrop-blur-sm">
            <div className="text-emerald-500/80 text-sm font-lovecraft">{englishLabel}</div>
            <div className="text-gray-100 text-lg font-bold font-lovecraft">{label}</div>
            <div className="text-2xl text-emerald-400 mt-1 font-numbers">{derived.full}</div>
            {showDerived && typeof value === 'number' && value > 0 && (
                <div className="text-sm text-emerald-600/80 mt-2 font-numbers">
                    <div>半值: {derived.half}</div>
                    <div>五分之一: {derived.fifth}</div>
                </div>
            )}
        </div>
    );
};