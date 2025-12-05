import PropTypes from "prop-types";
import OfficeSidebar from "@/components/OfficeSidebar";
import WhiteContainer from "@/components/WhiteContainer";
import { useAuth } from "@/context/AuthContext";

/**
 * Office Help Component
 * Reusable help page for all office dashboards
 * @param {Object} props - Component props
 * @param {string} props.basePath - Base route path for the office (e.g., '/office/acca')
 * @param {string} props.officeId - Office ID for sidebar
 * @param {string} props.officeName - Office name for display
 */
export default function OfficeHelp({ basePath, officeId, officeName }) {
  const { user } = useAuth();

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-[35px] overflow-hidden">
      <WhiteContainer>
        <OfficeSidebar
          basePath={basePath}
          officeId={officeId}
          officeAcronym={user?.office?.acronym}
          officeName={officeName}
        />

        <main className="flex-grow pt-6 pb-10 md:pb-6 p-2 flex flex-col overflow-hidden">
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Main Content Area */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-6 sm:p-8 xl:p-10 mx-4 flex-1 overflow-y-auto">
              {/* User Guide Content */}
              <div className="max-w-4xl">
                <h1
                  className="text-3xl sm:text-4xl font-bold text-[#040195] mb-6"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  User Guide
                </h1>

                <p
                  className="text-[#040195] mb-8 leading-relaxed"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Welcome to the SDU Project Monitoring System — your platform
                  for efficient project tracking, reporting, and communication
                  within the Social Development Unit (SDU).
                </p>

                {/* Purpose Section */}
                <section className="mb-8">
                  <h2
                    className="text-2xl font-bold text-[#040195] mb-4"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Purpose
                  </h2>
                  <p
                    className="text-[#040195] leading-relaxed"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    The system enables {officeName} to track, manage, and report
                    on projects and activities. It centralizes project
                    information and facilitates communication with the Unit
                    Director.
                  </p>
                </section>

                {/* Roles and Access Section */}
                <section className="mb-8">
                  <h2
                    className="text-2xl font-bold text-[#040195] mb-4"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Office User Access
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Create and manage your office&apos;s projects and
                        activities
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        View project analytics and performance metrics
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Track SDG alignment and impact of your projects
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Communicate with the Unit Director through messaging
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Generate and export project reports
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Pages and Functions Section */}
                <section className="mb-8">
                  <h2
                    className="text-2xl font-bold text-[#040195] mb-4"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Pages and Functions
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <strong>Overview Page:</strong> View dashboard with
                        project summaries, SDG coverage, upcoming activities,
                        and key metrics.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <strong>Projects Page:</strong> Manage all your projects
                        - add new activities, edit existing ones, and view
                        detailed reports.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <strong>Add Activity:</strong> Create new project
                        entries with details including dates, SDG alignment,
                        target participants, and budget.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <strong>Edit Activity:</strong> Modify project
                        information and track changes to your activities.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <strong>Settings:</strong> Manage your account
                        information and preferences.
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Navigation Section */}
                <section className="mb-8">
                  <h2
                    className="text-2xl font-bold text-[#040195] mb-4"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Navigation
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <strong>Search</strong> – Quickly find specific projects
                        or activities
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <strong>Inbox</strong> – Communicate with the Unit
                        Director and receive messages
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <strong>Notifications</strong> – Stay updated on project
                        changes and important announcements
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <strong>Account</strong> – Access your profile and
                        account settings
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Tips Section */}
                <section className="mb-8">
                  <h2
                    className="text-2xl font-bold text-[#040195] mb-4"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Tips for Success
                  </h2>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Keep project information up-to-date for accurate
                        reporting
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Regularly check your inbox for messages from the Unit
                        Director
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Use the dashboard to monitor your office&apos;s project
                        performance
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#040195] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span
                        className="text-[#040195]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Align projects with relevant SDGs for better impact
                        tracking
                      </span>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </main>
      </WhiteContainer>
    </div>
  );
}

OfficeHelp.propTypes = {
  basePath: PropTypes.string.isRequired,
  officeId: PropTypes.string.isRequired,
  officeName: PropTypes.string.isRequired,
};
