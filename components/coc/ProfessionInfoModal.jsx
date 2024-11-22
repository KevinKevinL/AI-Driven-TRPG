export const ProfessionInfoModal = ({ profession, onClose, onSelect }) => {
  if (!profession) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800/95 border border-emerald-900/30 text-gray-100 
                   rounded-lg shadow-lg shadow-emerald-900/50 p-6 w-11/12 max-w-lg
                   backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold font-lovecraft tracking-wide text-emerald-400">
            {profession.title}
          </h3>
          <button
            className="text-emerald-400 hover:text-emerald-300 
                       bg-emerald-900/50 hover:bg-emerald-800/50 
                       rounded-full p-2 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <p className="text-gray-300 mb-4">{profession.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="font-semibold text-emerald-400 mb-2 font-lovecraft">技能:</h4>
            <ul className="list-disc list-inside text-gray-300 font-numbers">
              {profession.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-400 mb-2 font-lovecraft">信用评级:</h4>
            <p className="text-gray-300 font-numbers">{profession.creditRating}</p>
            <h4 className="font-semibold text-emerald-400 mt-4 mb-2 font-lovecraft">技能点数:</h4>
            <p className="text-gray-300 font-numbers">{profession.skillPoints}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              onSelect(profession);
              onClose();
            }}
            className="py-2 px-6 bg-emerald-900/50 text-emerald-400 
                     rounded border border-emerald-900/30
                     hover:bg-emerald-800/50 transition-colors
                     text-sm font-lovecraft tracking-wide"
          >
            选择此职业
          </button>
        </div>
      </div>
    </div>
  );
};