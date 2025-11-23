import PropTypes from 'prop-types';

/**
 * Upcoming Programs List Component
 * Displays a list of upcoming programs for an office
 */
export default function UpcomingProgramsList({ upcomingPrograms }) {
  return (
    <div className="flex-[2] min-w-0 w-full lg:w-auto">
      <div 
        className="h-full min-h-[400px] rounded-[20px] flex flex-col shadow-lg relative bg-white overflow-hidden"
      >
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
        
        {/* Upcoming Programs List */}
        <div className="flex-1 space-y-4 px-6 pb-6 custom-scrollbar-purple overflow-y-auto">
          {upcomingPrograms && upcomingPrograms.length > 0 ? (
            upcomingPrograms.map((program, index) => (
              <div key={index} className="py-2">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-[10px] text-[#A09ED7] font-semibold uppercase tracking-wide">{program.category}</p>
                  <div className="text-left">
                    <p className="text-[11px] text-[#A09ED7] font-semibold">Due</p>
                    <p className="text-[11px] text-[#A09ED7] font-semibold">{program.dueDate}</p>
                  </div>
                </div>
                <h3 className="text-[#A09ED7] font-bold text-xl">{program.name}</h3>
              </div>
            ))
          ) : (
            // Placeholder upcoming programs
            <>
              <div className="py-2">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-[10px] text-[#A09ED7] font-semibold uppercase tracking-wide">ENGAGE CITIZENSHIP & DEMOCRACY BLG.</p>
                  <div className="text-left">
                    <p className="text-[11px] text-[#A09ED7] font-semibold">Due</p>
                    <p className="text-[11px] text-[#FF0022] font-semibold">Oct 5, 2025</p>
                  </div>
                </div>
                <h3 className="text-[#4D49FC] font-bold text-xl">#dAZurv</h3>
              </div>
              
              <div className="py-2">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-[10px] text-[#A09ED7] font-semibold uppercase tracking-wide">LEADERSHIP AND GOVERNANCE</p>
                  <div className="text-left">
                    <p className="text-[11px] text-[#A09ED7] font-semibold">Due</p>
                    <p className="text-[11px] text-[#FF0022] font-semibold">Sep 18, 2025</p>
                  </div>
                </div>
                <h3 className="text-[#4D49FC] font-bold text-xl">iLEAD</h3>
              </div>

              <div className="py-2">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-[10px] text-[#A09ED7] font-semibold uppercase tracking-wide">ENGAGE CITIZENSHIP & DEMOCRACY BLG.</p>
                  <div className="text-left">
                    <p className="text-[11px] text-[#A09ED7] font-semibold">Due</p>
                    <p className="text-[11px] text-[#FF0022] font-semibold">Aug 31, 2025</p>
                  </div>
                </div>
                <h3 className="text-[#4D49FC] font-bold text-xl">Pansitan Serye</h3>
              </div>

              <div className="py-2">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-[10px] text-[#A09ED7] font-semibold uppercase tracking-wide">LEADERSHIP AND GOVERNANCE</p>
                  <div className="text-left">
                    <p className="text-[11px] text-[#A09ED7] font-semibold">Due</p>
                    <p className="text-[11px] text-[#FF0022] font-semibold">Sep 18, 2025</p>
                  </div>
                </div>
                <h3 className="text-[#4D49FC] font-bold text-xl">Kwentuhang Bayan</h3>
              </div>

              <div className="py-2">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-[10px] text-[#A09ED7] font-semibold uppercase tracking-wide">LEADERSHIP AND GOVERNANCE</p>
                  <div className="text-left">
                    <p className="text-[11px] text-[#A09ED7] font-semibold">Due</p>
                    <p className="text-[11px] text-[#FF0022] font-semibold">Sep 18, 2025</p>
                  </div>
                </div>
                <h3 className="text-[#4D49FC] font-bold text-xl">SSSTT</h3>
              </div>
            </>
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
