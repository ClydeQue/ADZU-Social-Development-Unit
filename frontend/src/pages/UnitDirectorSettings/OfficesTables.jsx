import PropTypes from "prop-types";

export default function OfficesTable({ offices, onEditOffice }) {
  return (
    <div
      className="h-full flex flex-col"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <style>{`
        .offices-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .offices-scroll::-webkit-scrollbar-thumb {
          background-color: #040195;
          border-radius: 42px;
        }
      `}</style>

      {/* Header Row */}
      <div className="bg-[#1E22AA] text-white rounded-xl px-3 py-2.5 mb-1 grid grid-cols-[35px_150px_1.5fr_1.2fr_1.5fr_120px] gap-3 items-center">
        <div className="text-xs font-semibold">No.</div>
        <div className="text-xs font-semibold">Acronym</div>
        <div className="text-xs font-semibold">Office Name</div>
        <div></div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto pr-2 offices-scroll">
        <div className="space-y-1.5">
          {offices.map((office, idx) => (
            <div
              key={office.id}
              className={`bg-white hover:bg-[#D4D1FF] transition-colors rounded-lg px-3 py-2 grid grid-cols-[35px_150px_1.5fr_1.2fr_1.5fr_120px] gap-3 items-center`}
            >
              <div className="text-[#4D49FC] text-[0.7rem] font-semibold">
                {idx + 1}
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={office.logo}
                  alt={office.acronym}
                  className="w-5 h-5"
                />
                <span className="text-[#4D49FC] text-[0.7rem] font-semibold">
                  {office.acronym}
                </span>
              </div>
              <div className="text-[#4D49FC] text-[0.7rem] truncate">
                {office.name}
              </div>
              <div className="text-[#4D49FC] text-[0.7rem] truncate">
                {office.director}
              </div>
              <div className="text-[#4D49FC] text-[0.7rem] truncate">
                {office.email}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => onEditOffice(office)}
                  className="px-3 py-1 bg-[#4D49FC] text-white rounded-md text-[0.65rem] font-semibold hover:bg-[#3D39EC] transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}

          {offices.length === 0 && (
            <div className="text-center text-[#4D49FC] text-sm font-medium py-8">
              No offices found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

OfficesTable.propTypes = {
  offices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      acronym: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      director: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEditOffice: PropTypes.func.isRequired,
};
