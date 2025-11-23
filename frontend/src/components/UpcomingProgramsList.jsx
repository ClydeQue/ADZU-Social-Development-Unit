import PropTypes from "prop-types";

/**
 * Upcoming Programs List Component
 * Displays a list of upcoming activities for an office
 */
export default function UpcomingProgramsList({ upcomingPrograms }) {
  console.log("UpcomingProgramsList received:", upcomingPrograms);

  return (
    <div className="flex-[2] min-w-0 w-full lg:w-auto">
      <div className="h-full min-h-[400px] rounded-[20px] flex flex-col shadow-lg relative bg-white overflow-hidden">
        {/* Upcoming Title Container with Shadow Effects */}
        <div className="relative mb-4">
          {/* Main Title Container */}
          <div className="w-full h-25 bg-[#040195] rounded-tl-2xl rounded-tr-2xl rounded-br-[43px] flex items-end pb-4 mb-5 px-6 relative z-30">
            <h2 className="text-white  text-4xl font-bold">Upcoming</h2>
          </div>

          {/* First Shadow Layer */}
          <div className="absolute top-7  w-full h-20 bg-[#6362ce] rounded-tl-2xl rounded-tr-2xl rounded-br-[43px] z-20"></div>

          {/* Second Shadow Layer */}
          <div className="absolute top-9  w-full h-20 bg-[#aaa8e5] rounded-tl-2xl rounded-tr-2xl rounded-br-[43px] z-10"></div>
        </div>

        {/* Upcoming Activities List */}
        <div className="flex-1 space-y-4 px-6 pb-6 custom-scrollbar-purple overflow-y-auto">
          {upcomingPrograms && upcomingPrograms.length > 0 ? (
            upcomingPrograms.map((program, index) => {
              const formatDate = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              };

              return (
                <div key={program.id || index} className="py-2">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-[10px] text-[#A09ED7] font-semibold uppercase tracking-wide">
                      {program.program || program.category}
                    </p>
                    <div className="text-left">
                      <p className="text-[11px] text-[#A09ED7] font-semibold">
                        Due
                      </p>
                      <p className="text-[11px] text-[#FF0022] font-semibold">
                        {formatDate(program.due || program.dueDate)}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-[#4D49FC] font-bold text-xl">
                    {program.activity || program.name}
                  </h3>
                </div>
              );
            })
          ) : (
            // No upcoming activities message
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="w-16 h-16 text-[#A09ED7] mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-[#A09ED7] text-sm font-semibold">
                No upcoming activities
              </p>
              <p className="text-[#A09ED7] text-xs mt-1">
                All activities are up to date
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

UpcomingProgramsList.propTypes = {
  upcomingPrograms: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
    })
  ),
};
