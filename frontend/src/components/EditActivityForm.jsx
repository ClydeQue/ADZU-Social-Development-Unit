import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OfficeService from "@/services/officeService";
import PropTypes from "prop-types";
import { SDG_GOALS, getSDGIcon } from "@/utils/sdgData";
import { ADZU_STRATEGIC_GOALS } from "@/utils/strategicGoalsData";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import FormSkeleton from "@/components/FormSkeleton";
import DatePicker from "@/components/DatePicker";

// Office acronyms for Internal partner type
const OFFICE_ACRONYMS = ["ACCA", "ACES", "ACLG", "ALTEC", "APC", "CCES"];

/**
 * Edit Activity Form Component
 * Pre-fills form with existing activity data and allows updates
 */
export default function EditActivityForm({
  officeId,
  basePath,
  officeColor = "#4D49FC",
}) {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dropdownRef = useRef(null);

  // Fetch activity data
  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => OfficeService.getActivity(activityId),
    enabled: !!activityId,
  });

  // Fetch programs for this office
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ["office-programs", officeId],
    queryFn: () => OfficeService.getOfficePrograms(officeId),
    enabled: !!officeId,
    staleTime: 5 * 60 * 1000,
  });

  const [dropdownOpen, setDropdownOpen] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    projectName: "",
    programId: "",
    programComponent: "",
    initiation: "",
    implementation: "",
    participantsNo: "",
    male_participants: "",
    female_participants: "",
    classification: "",
    phase: "",
    status: "",
    venue: {
      street: "",
      barangay: "",
      city: "",
      province: "",
    },
    description: "",
    objectives: "",
    partners: [{ name: "", type: "", nature: "" }],
    budgets: [{ amount: "", type: "external" }],
    thumbnail: null,
    reportUrls: [""],
    sdgs: [],
    strategicGoals: [],
  });

  // Populate form when activity data loads
  useEffect(() => {
    if (activity) {
      // Parse partners from comma-separated strings
      const partners = [];
      const partnerNames = activity.partner_name
        ? activity.partner_name.split(", ")
        : [];
      const partnerTypes = activity.partner_type
        ? activity.partner_type.split(", ")
        : [];
      const partnerNatures = activity.partner_nature
        ? activity.partner_nature.split(", ")
        : [];

      const maxLength = Math.max(
        partnerNames.length,
        partnerTypes.length,
        partnerNatures.length
      );
      for (let i = 0; i < maxLength; i++) {
        partners.push({
          name: partnerNames[i] || "",
          type: partnerTypes[i] || "",
          nature: partnerNatures[i] || "",
        });
      }

      // Parse budgets
      const budgets = activity.budget_amount
        ? [
            {
              amount: activity.budget_amount,
              type: activity.budget_type || "external",
            },
          ]
        : [{ amount: "", type: "external" }];

      // Parse SDGs
      const sdgs = activity.sdg_number ? [activity.sdg_number] : [];

      // Parse Strategic Goals
      let strategicGoals = [];
      if (activity.strategic_goals) {
        try {
          strategicGoals = typeof activity.strategic_goals === 'string' 
            ? JSON.parse(activity.strategic_goals) 
            : Array.isArray(activity.strategic_goals) 
              ? activity.strategic_goals 
              : [activity.strategic_goals];
        } catch (e) {
          console.error('Error parsing strategic goals:', e);
        }
      }

      setFormData({
        projectName: activity.activity_name || "",
        programId: activity.program_id || "",
        initiation: activity.start_date || "",
        implementation: activity.end_date || "",
        participantsNo: activity.participants_count || "",
        male_participants: activity.male_participants || "",
        female_participants: activity.female_participants || "",
        classification: activity.classification || "",
        phase: activity.phase || "",
        status: activity.status || "pending",
        venue: (() => {
          // Parse venue from JSON string
          let venueData = { street: "", barangay: "", city: "", province: "" };
          if (activity.venue) {
            try {
              venueData = JSON.parse(activity.venue);
            } catch (e) {
              console.error("Error parsing venue:", e);
            }
          }
          return venueData;
        })(),
        description: activity.description || "",
        objectives: activity.objectives || "",
        partners:
          partners.length > 0 ? partners : [{ name: "", type: "", nature: "" }],
        budgets,
        reportUrls: (() => {
          // Parse report URLs from JSON string or single value
          if (activity.report_url) {
            try {
              const parsed = JSON.parse(activity.report_url);
              return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
            } catch {
              // If not valid JSON, treat as single URL
              return [activity.report_url];
            }
          }
          return [""];
        })(),
        sdgs,
        strategicGoals,
      });
    }
  }, [activity]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDropdown = (name) => {
    setDropdownOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const closeDropdown = (name) => {
    setDropdownOpen((prev) => ({ ...prev, [name]: false }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVenueChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      venue: { ...prev.venue, [field]: value },
    }));
  };

  const handlePartnerChange = (index, field, value) => {
    const newPartners = [...formData.partners];
    newPartners[index][field] = value;
    setFormData((prev) => ({ ...prev, partners: newPartners }));
  };

  const addPartner = () => {
    setFormData((prev) => ({
      ...prev,
      partners: [...prev.partners, { name: "", type: "", nature: "" }],
    }));
  };

  const removePartner = (index) => {
    if (formData.partners.length > 1) {
      const newPartners = formData.partners.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, partners: newPartners }));
    }
  };

  const handleBudgetChange = (index, field, value) => {
    const newBudgets = [...formData.budgets];
    newBudgets[index][field] = value;
    setFormData((prev) => ({ ...prev, budgets: newBudgets }));
  };

  const addBudget = () => {
    setFormData((prev) => ({
      ...prev,
      budgets: [...prev.budgets, { amount: "", type: "external" }],
    }));
  };

  const removeBudget = (index) => {
    if (formData.budgets.length > 1) {
      const newBudgets = formData.budgets.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, budgets: newBudgets }));
    }
  };

  // Report URL handlers
  const handleReportUrlChange = (index, value) => {
    const newReportUrls = [...formData.reportUrls];
    newReportUrls[index] = value;
    setFormData((prev) => ({ ...prev, reportUrls: newReportUrls }));
  };

  const addReportUrl = () => {
    setFormData((prev) => ({
      ...prev,
      reportUrls: [...prev.reportUrls, ""],
    }));
  };

  const removeReportUrl = (index) => {
    if (formData.reportUrls.length > 1) {
      const newReportUrls = formData.reportUrls.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, reportUrls: newReportUrls }));
    }
  };

  const handleSDGToggle = (sdgId) => {
    setFormData((prev) => ({
      ...prev,
      sdgs: prev.sdgs.includes(sdgId)
        ? prev.sdgs.filter((id) => id !== sdgId)
        : [...prev.sdgs, sdgId],
    }));
  };

  const handleStrategicGoalToggle = (goalId) => {
    setFormData((prev) => ({
      ...prev,
      strategicGoals: prev.strategicGoals.includes(goalId)
        ? prev.strategicGoals.filter((id) => id !== goalId)
        : [...prev.strategicGoals, goalId],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  // Mutation for updating activity
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await OfficeService.updateActivity(activityId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["activity", activityId]);
      queryClient.invalidateQueries(["office-activities", officeId]);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error("Update error:", error);
      setErrorMessage(error.message || "Failed to update activity");
      setShowErrorModal(true);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate description is provided
    if (!formData.description || formData.description.trim() === "") {
      setErrorMessage("Please provide a description for the activity.");
      setShowErrorModal(true);
      return;
    }

    // Validate SDG selection
    if (!formData.sdgs || formData.sdgs.length === 0) {
      setErrorMessage("Please select at least one Sustainable Development Goal (SDG).");
      setShowErrorModal(true);
      return;
    }

    // Validate Strategic Goals selection
    if (!formData.strategicGoals || formData.strategicGoals.length === 0) {
      setErrorMessage("Please select at least one AdZU Strategic Goal.");
      setShowErrorModal(true);
      return;
    }

    try {
      console.log("FormData before submit:", {
        description: formData.description,
        descriptionLength: formData.description?.length,
        descriptionType: typeof formData.description,
      });

      // Prepare activity data for backend
      const activityData = {
        activity_name: formData.projectName,
        program_id: formData.programId,
        start_date: formData.initiation || null,
        end_date: formData.implementation || null,
        participants_count: parseInt(formData.participantsNo) || 0,
        male_participants: parseInt(formData.male_participants) || 0,
        female_participants: parseInt(formData.female_participants) || 0,
        venue: JSON.stringify({
          street: formData.venue.street || "",
          barangay: formData.venue.barangay || "",
          city: formData.venue.city || "",
          province: formData.venue.province || "",
        }),
        description: formData.description ? formData.description : null,
        objectives: formData.objectives || null,
        // Map partners array to backend format
        partner_name:
          formData.partners
            .map((p) => p.name)
            .filter(Boolean)
            .join(", ") || null,
        partner_type:
          formData.partners
            .map((p) => p.type)
            .filter(Boolean)
            .join(", ") || null,
        partner_nature:
          formData.partners
            .map((p) => p.nature)
            .filter(Boolean)
            .join(", ") || null,
        // Map all budgets array to backend format (send as JSON string or separate amounts)
        budgets: JSON.stringify(
          formData.budgets
            .filter((b) => b.amount)
            .map((b) => ({
              amount: parseFloat(b.amount),
              type: b.type,
            }))
        ),
        // Also include first budget for backward compatibility if backend expects it
        budget_amount: formData.budgets[0]?.amount
          ? parseFloat(formData.budgets[0].amount)
          : null,
        budget_type: formData.budgets[0]?.type || null,
        // Submit SDG numbers as array of integers
        sdg_numbers: formData.sdgs.map((id) => parseInt(id)),
        // Submit AdZU Strategic Goals as array of integers
        strategic_goals: formData.strategicGoals.map((id) => parseInt(id)),
        phase: formData.phase || null,
        report_url: JSON.stringify(formData.reportUrls.filter(url => url.trim() !== '')),
        classification: formData.classification || null,
      };

      console.log("ActivityData being sent to backend:", activityData);
      console.log("Description in activityData:", activityData.description);
      updateMutation.mutate(activityData);
    } catch (error) {
      console.error("Error preparing update:", error);
      setErrorMessage(error.message);
      setShowErrorModal(true);
    }
  };

  if (activityLoading || programsLoading) {
    return <FormSkeleton />;
  }

  if (!activity) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-500 text-lg">Activity not found</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-2 sm:p-4 md:p-6 overflow-auto bg-gray-100">
      <style>{`
        /* Remove number input arrows */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        
        /* SDG focus effect animations */
        .scale-102 {
          transform: scale(1.02);
        }
        .scale-105 {
          transform: scale(1.05);
        }
        .ring-3 {
          --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
          --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
        }
      `}</style>
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
      >
        {/* Header with Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: officeColor }}>
            {formData.projectName || "Edit Activity"}
          </h1>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
           
            <button
              type="button"
              onClick={() => navigate(`${basePath}/projects`)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg border-2 border-[#4D49FC] text-[#4D49FC] text-xs sm:text-sm font-semibold hover:bg-gray-100 hover:cursor-pointer transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={updateMutation.isLoading}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg bg-[#4D49FC] text-white text-xs sm:text-sm font-semibold hover:opacity-80 hover:cursor-pointer transition-opacity disabled:opacity-50"
            >
              {updateMutation.isLoading ? "UPDATING..." : "UPDATE"}
            </button>
          </div>
        </div>

        {/* Form Grid Layout */}
        <div className="space-y-3">
          {/* Row 1: Project Name, Program/Component, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) =>
                  handleInputChange("projectName", e.target.value)
                }
                className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400 cursor-pointer"
                placeholder="Activity Name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Program / Component <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {programsLoading ? (
                  <div className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs text-gray-400">
                    Loading...
                  </div>
                ) : (
                  <div className="relative flex-1" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown("program")}
                      className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none bg-white text-left flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span
                        className={formData.programId ? "" : "text-gray-400"}
                      >
                        {formData.programId
                          ? programs.find((p) => p.id === formData.programId)
                              ?.title
                          : "Select program"}
                      </span>
                      <div className="w-5 h-5  hover:cursor-pointer active:opacity-85  focus:ring-1 rounded-sm bg-[#040195] flex items-center justify-center flex-shrink-0">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 9 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.8985 6.75C4.5136 7.41667 3.55135 7.41667 3.16645 6.75L0.135357 1.5C-0.249543 0.833334 0.231582 0 1.00138 0L7.06356 0C7.83336 0 8.31449 0.833333 7.92959 1.5L4.8985 6.75Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </button>
                    {dropdownOpen.program && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-[#8180C9] rounded-[11px] shadow-lg max-h-60 overflow-y-auto">
                        {programs.map((program) => (
                          <button
                            key={program.id}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleInputChange("programId", program.id);
                              setTimeout(() => closeDropdown("program"), 0);
                            }}
                            className="w-full px-3 py-2 text-xs text-left text-[#040195] hover:bg-[#F5F5FF] cursor-pointer transition-colors first:rounded-t-[11px] last:rounded-b-[11px]"
                          >
                            {program.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Status
              </label>
              <div className="px-2 py-1 bg-gray-200 border-2 border-[#040195] rounded-[11px] text-center lg:text-sm font-black font-inter text-[#040195] uppercase">
                {formData.status || "PENDING"}
              </div>
            </div>
          </div>

          {/* Row 2: Description (col-span-2), Phase */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => {
                  console.log("Description changed to:", e.target.value);
                  handleInputChange("description", e.target.value);
                }}
                onBlur={() => {
                  console.log(
                    "Description onBlur, formData.description is now:",
                    formData.description
                  );
                }}
                rows={2}
                className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none resize-none placeholder:text-gray-400 cursor-pointer"
                placeholder="Activity description..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Phase <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown("phase")}
                  className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none bg-white text-left flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className={formData.phase ? "" : "text-gray-400"}>
                    {formData.phase || "Select phase"}
                  </span>
                  <div className="w-5 h-5  hover:cursor-pointer active:opacity-85  focus:ring-1 rounded-sm bg-[#040195] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 9 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.8985 6.75C4.5136 7.41667 3.55135 7.41667 3.16645 6.75L0.135357 1.5C-0.249543 0.833334 0.231582 0 1.00138 0L7.06356 0C7.83336 0 8.31449 0.833333 7.92959 1.5L4.8985 6.75Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </button>
                {dropdownOpen.phase && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[#8180C9] rounded-[11px] shadow-lg">
                    {[
                      "Planning",
                      "Implementation",
                      "In Progress",
                      "Completed",
                      "Cancelled",
                    ].map((phase) => (
                      <button
                        key={phase}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleInputChange("phase", phase);
                          setTimeout(() => closeDropdown("phase"), 0);
                        }}
                        className="w-full px-3 py-2 text-xs text-left text-[#040195] hover:bg-[#F5F5FF] cursor-pointer transition-colors first:rounded-t-[11px] last:rounded-b-[11px]"
                      >
                        {phase}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Objectives, Participant Demographics, Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Objectives <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) =>
                  handleInputChange("objectives", e.target.value)
                }
                rows={2}
                className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none resize-none placeholder:text-gray-400"
                placeholder="Activity objectives..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Participant Demographics <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="grid grid-cols-[70px_1fr] gap-1.5">
                <div>
                  <div className="text-[9px] text-[#8180C9] mb-0.5">
                    Total Numbers
                  </div>
                  <input
                    type="number"
                    value={formData.participantsNo}
                    onChange={(e) =>
                      handleInputChange("participantsNo", e.target.value)
                    }
                    className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] text-center focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <div className="text-[9px] text-[#8180C9] mb-0.5">
                    Classification
                  </div>
                  <input
                    type="text"
                    value={formData.classification}
                    onChange={(e) =>
                      handleInputChange("classification", e.target.value)
                    }
                    className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="Type"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="block text-xs font-bold text-[#040195] mb-1">
                  Inception <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <DatePicker
                  value={formData.initiation}
                  onChange={(value) => handleInputChange("initiation", value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#040195] mb-1">
                  Implementation <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <DatePicker
                  value={formData.implementation}
                  onChange={(value) => handleInputChange("implementation", value)}
                />
              </div>
            </div>
          </div>

          {/* Rows 4-6: Venue/Partners/Budget + SDG */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Left side: 2 columns */}
            <div className="lg:col-span-2 space-y-2">
              {/* Venue rows */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#040195] mb-2">Venue <span className="text-red-500">*</span></label>
                  <label className="block text-[9px] text-[#8180C9] mb-0.5">Street / Room / Building</label>
                  <input
                    type="text"
                    value={formData.venue.street}
                    onChange={(e) => handleVenueChange("street", e.target.value)}
                    className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="Venue"
                  />
                </div>
                <div>
                  <div className="inline-block "></div>
                  <label className="block text-[9px] text-[#8180C9] mb-0.5 ">Zone</label>
                  <input
                    type="text"
                    value={formData.venue.barangay}
                    onChange={(e) => handleVenueChange("barangay", e.target.value)}
                    className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="Zone"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#040195] mb-2">Sex Count <span className="text-red-500">*</span></label>
                  <label className="block text-[9px] text-[#8180C9] mb-0.5">Male</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.male_participants}
                    onChange={(e) => handleInputChange("male_participants", e.target.value)}
                    className="w-16 px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] text-center focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#040195] mb-2">Municipality / City</label>
                  <label className="block text-[9px] text-[#8180C9] mb-0.5">City</label>
                  <input
                    type="text"
                    value={formData.venue.city}
                    onChange={(e) => handleVenueChange("city", e.target.value)}
                    className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="City"
                  />
                </div>
                <div>
                  <div className="inline-block text-xs font-semibold text-[#040195] mb-1"></div>
                  <label className="block text-[9px] text-[#8180C9] mb-0.5">Province</label>
                  <input
                    type="text"
                    value={formData.venue.province}
                    onChange={(e) => handleVenueChange("province", e.target.value)}
                    className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="Province"
                  />
                </div>
                <div>
                  <div className="inline-block text-xs font-semibold text-[#040195] mb-1"></div>
                  <label className="block text-[9px] text-[#8180C9] mb-0.5">Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.female_participants}
                    onChange={(e) => handleInputChange("female_participants", e.target.value)}
                    className="w-16 px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] text-center focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Partners section */}
              <div>
                <label className="block text-xs font-bold text-[#040195] mb-1">
                  Partners <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="border border-[#8180C9] rounded-[11px] p-2 space-y-2 sm:space-y-1.5">
                  {formData.partners.map((partner, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_auto] gap-1.5"
                    >
                      <div>
                        <div className="text-[9px] text-[#8180C9] mb-0.5">
                          Name
                        </div>
                        {partner.type === "Internal" ? (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                toggleDropdown(`partner-name-${index}`)
                              }
                              className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none bg-white text-left flex items-center justify-between"
                            >
                              <span
                                className={partner.name ? "" : "text-gray-400"}
                              >
                                {partner.name || "Select Office"}
                              </span>
                              <div className="w-5 h-5 rounded-sm bg-[#040195] flex items-center justify-center flex-shrink-0">
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 9 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4.8985 6.75C4.5136 7.41667 3.55135 7.41667 3.16645 6.75L0.135357 1.5C-0.249543 0.833334 0.231582 0 1.00138 0L7.06356 0C7.83336 0 8.31449 0.833333 7.92959 1.5L4.8985 6.75Z"
                                    fill="white"
                                  />
                                </svg>
                              </div>
                            </button>
                            {dropdownOpen[`partner-name-${index}`] && (
                              <div className="absolute z-50 w-full mt-1 hover:cursor-pointer bg-white border border-[#8180C9] rounded-[11px] shadow-lg max-h-40 overflow-y-auto">
                                {OFFICE_ACRONYMS.map((acronym) => (
                                  <button
                                    key={acronym}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handlePartnerChange(index, "name", acronym);
                                      setTimeout(
                                        () => closeDropdown(`partner-name-${index}`),
                                        0
                                      );
                                    }}
                                    className="w-full px-3 py-2 text-xs text-left text-[#040195] hover:bg-[#F5F5FF] cursor-pointer transition-colors first:rounded-t-[11px] last:rounded-b-[11px]"
                                  >
                                    {acronym}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={partner.name}
                            onChange={(e) =>
                              handlePartnerChange(index, "name", e.target.value)
                            }
                            className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-[9px] text-[#8180C9] mb-0.5">
                          Type
                        </div>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              toggleDropdown(`partner-type-${index}`)
                            }
                            className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none bg-white text-left flex items-center justify-between gap-2"
                          >
                            <span
                              className={partner.type ? "" : "text-gray-400"}
                            >
                              {partner.type || "Select"}
                            </span>
                            <div className="w-5 h-5  hover:cursor-pointer active:opacity-85  focus:ring-1 rounded-sm bg-[#040195] flex items-center justify-center flex-shrink-0">
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 9 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.8985 6.75C4.5136 7.41667 3.55135 7.41667 3.16645 6.75L0.135357 1.5C-0.249543 0.833334 0.231582 0 1.00138 0L7.06356 0C7.83336 0 8.31449 0.833333 7.92959 1.5L4.8985 6.75Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                          </button>
                          {dropdownOpen[`partner-type-${index}`] && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-[#8180C9] rounded-[11px] shadow-lg max-h-40 overflow-y-auto">
                              {[
                                "Internal",
                                "Government",
                                "Non-Government",
                                "Institutional",
                              ].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handlePartnerChange(index, "type", type);
                                    // Clear name when switching to/from Internal
                                    if (type === "Internal" || partner.type === "Internal") {
                                      handlePartnerChange(index, "name", "");
                                    }
                                    setTimeout(
                                      () =>
                                        closeDropdown(`partner-type-${index}`),
                                      0
                                    );
                                  }}
                                  className="w-full px-3 py-2 text-xs text-left text-[#040195] hover:bg-[#F5F5FF] cursor-pointer transition-colors first:rounded-t-[11px] last:rounded-b-[11px]"
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#8180C9] mb-0.5">
                          Nature
                        </div>
                        <input
                          type="text"
                          value={partner.nature}
                          onChange={(e) =>
                            handlePartnerChange(index, "nature", e.target.value)
                          }
                          className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                        />
                      </div>
                      <div className="flex items-end pb-1">
                        {index === formData.partners.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => addPartner()}
                            className="p-1.5 rounded-full bg-[#4D49FC] hover:bg-[#3d39cc] transition-colors group"
                            title="Add Partner"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 26 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.41477 25.1818V0.500017H16.2841V25.1818H9.41477ZM0.5 16.2841V9.41479H25.1818V16.2841H0.5Z"
                                fill="white"
                                className="group-hover:fill-gray-200 transition-colors"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removePartner(index)}
                            className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors group"
                            title="Remove Partner"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14.9997 8.66504C15.736 8.66504 16.3335 9.26182 16.3337 9.99805C16.3337 10.7344 15.7361 11.332 14.9997 11.332H4.99969C4.26347 11.3319 3.66669 10.7343 3.66669 9.99805C3.66686 9.26193 4.26357 8.66522 4.99969 8.66504H14.9997Z"
                                fill="white"
                                stroke="white"
                                className="group-hover:fill-gray-200 group-hover:stroke-gray-200 transition-colors"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Overview */}
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-1">
                  Budget Overview <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </label>
                <div className="border border-[#8180C9] rounded-[11px] p-2 space-y-1.5">
                  {formData.budgets.map((budget, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-2"
                    >
                      <div>
                        <div className="text-[9px] text-[#8180C9] mb-0.5">
                          Amount
                        </div>
                        <input
                          type="number"
                          value={budget.amount}
                          onChange={(e) =>
                            handleBudgetChange(index, "amount", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-[#8180C9] rounded-[11px] text-sm text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <div className="text-[9px] text-[#8180C9] mb-0.5">
                          Type
                        </div>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              toggleDropdown(`budget-type-${index}`)
                            }
                            className="w-full px-3 py-2 border border-[#8180C9] rounded-[11px] text-sm text-[#040195] focus:border-[#5B5A9E] focus:outline-none bg-white text-left flex items-center justify-between gap-2 cursor-pointer"
                          >
                            <span
                              className={budget.type ? "" : "text-gray-400"}
                            >
                              {budget.type === "external"
                                ? "External"
                                : budget.type === "internal"
                                ? "Internal"
                                : "Select"}
                            </span>
                            <div className="w-5 h-5  hover:cursor-pointer active:opacity-85  focus:ring-1 rounded-sm bg-[#040195] flex items-center justify-center flex-shrink-0">
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 9 8"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.8985 6.75C4.5136 7.41667 3.55135 7.41667 3.16645 6.75L0.135357 1.5C-0.249543 0.833334 0.231582 0 1.00138 0L7.06356 0C7.83336 0 8.31449 0.833333 7.92959 1.5L4.8985 6.75Z"
                                  fill="white"
                                />
                              </svg>
                            </div>
                          </button>
                          {dropdownOpen[`budget-type-${index}`] && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-[#8180C9] rounded-[11px] shadow-lg">
                              {[
                                { value: "external", label: "External" },
                                { value: "internal", label: "Internal" },
                              ].map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleBudgetChange(
                                      index,
                                      "type",
                                      type.value
                                    );
                                    setTimeout(
                                      () =>
                                        closeDropdown(`budget-type-${index}`),
                                      0
                                    );
                                  }}
                                  className="w-full px-3 py-2 text-sm text-left text-[#040195] hover:bg-[#F5F5FF] cursor-pointer transition-colors first:rounded-t-[11px] last:rounded-b-[11px]"
                                >
                                  {type.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-end pb-1">
                        {index === formData.budgets.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => addBudget()}
                            className="p-1.5 rounded-full bg-[#4D49FC] hover:bg-[#3d39cc] transition-colors group"
                            title="Add Budget"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 26 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.41477 25.1818V0.500017H16.2841V25.1818H9.41477ZM0.5 16.2841V9.41479H25.1818V16.2841H0.5Z"
                                fill="white"
                                className="group-hover:fill-gray-200 transition-colors"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeBudget(index)}
                            className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors group"
                            title="Remove Budget"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14.9997 8.66504C15.736 8.66504 16.3335 9.26182 16.3337 9.99805C16.3337 10.7344 15.7361 11.332 14.9997 11.332H4.99969C4.26347 11.3319 3.66669 10.7343 3.66669 9.99805C3.66686 9.26193 4.26357 8.66522 4.99969 8.66504H14.9997Z"
                                fill="white"
                                stroke="white"
                                className="group-hover:fill-gray-200 group-hover:stroke-gray-200 transition-colors"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AdZU Strategic Goals */}
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-1">
                  AdZU Strategic Goal(s) <span className="text-red-500">*</span>
                </label>
                <div className="border border-[#8180C9] rounded-[11px] p-3">
                  <div className="space-y-2">
                    {ADZU_STRATEGIC_GOALS.map((goal) => (
                      <div
                        key={goal.id}
                        onClick={() => handleStrategicGoalToggle(goal.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border ${
                          formData.strategicGoals?.includes(goal.id)
                            ? "border-[#4D49FC] bg-[#F5F5FF] ring-1 ring-[#4D49FC]"
                            : "border-transparent hover:bg-gray-50"
                        }`}
                      >
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                          style={{ backgroundColor: goal.color }}
                        >
                          {goal.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#040195] truncate">
                            {goal.title}
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          formData.strategicGoals?.includes(goal.id)
                            ? "border-[#4D49FC] bg-[#4D49FC]"
                            : "border-gray-300"
                        }`}>
                          {formData.strategicGoals?.includes(goal.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: SDG column */}
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-1">
                  Sustainable Development Goal(s) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-[260px] overflow-y-auto p-3 border border-[#8180C9] rounded-[11px]">
                  {SDG_GOALS.map((sdg) => (
                    <div
                      key={sdg.id}
                      onClick={() => handleSDGToggle(sdg.id)}
                      className={`relative cursor-pointer rounded-lg transition-all ${
                        formData.sdgs?.includes(sdg.id)
                          ? "ring-2 ring-[#4D49FC] ring-offset-2"
                          : "hover:opacity-80"
                      }`}
                    >
                      <img
                        src={getSDGIcon(sdg.id)}
                        alt={sdg.label}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports Section - Multiple URLs */}
              <div>
                <label className="block text-xs font-bold text-[#040195] mb-1">
                  FULL REPORT URL(S) <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="border border-[#8180C9] rounded-[11px] p-2 space-y-1.5">
                  {formData.reportUrls.map((url, index) => (
                    <div key={index} className="flex gap-1.5 items-center">
                      <div className="flex-1">
                        <div className="text-[9px] text-[#8180C9] mb-0.5">
                          Link {index + 1}
                        </div>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleReportUrlChange(index, e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                          placeholder="https://example.com/report.pdf"
                        />
                      </div>
                      <div className="flex items-end pb-0.5">
                        {index === formData.reportUrls.length - 1 ? (
                          <button
                            type="button"
                            onClick={addReportUrl}
                            className="p-1.5 rounded-full bg-[#4D49FC] hover:bg-[#3d39cc] transition-colors group"
                            title="Add Link"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.41477 25.1818V0.500017H16.2841V25.1818H9.41477ZM0.5 16.2841V9.41479H25.1818V16.2841H0.5Z" fill="white" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeReportUrl(index)}
                            className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors group"
                            title="Remove Link"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14.9997 8.66504C15.736 8.66504 16.3335 9.26182 16.3337 9.99805C16.3337 10.7344 15.7361 11.332 14.9997 11.332H4.99969C4.26347 11.3319 3.66669 10.7343 3.66669 9.99805C3.66686 9.26193 4.26357 8.66522 4.99969 8.66504H14.9997Z" fill="white" stroke="white" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#040195] mb-1">
                  Thumbnail <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="text-[9px] text-[#8180C9] mb-0.5">
                  3 MB (max)
                </div>
                <label className="flex items-center justify-center gap-1.5 w-full px-2 py-2 rounded-[11px] text-xs bg-[#4D49FC] text-white font-semibold hover:bg-[#3d39cc] transition-colors cursor-pointer group">
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.6667 4.16668V5.83332L13.9844 5.8332C15.3936 7.06988 16.2573 8.87973 16.2557 10.8517C16.2531 13.9056 14.1759 16.5673 11.2142 17.3117C8.25249 18.0562 5.16358 16.693 3.71733 14.0033C2.27112 11.3137 2.83737 7.98516 5.09166 5.925C5.41015 6.43174 5.8592 6.84337 6.39166 7.11668C5.8262 7.57351 5.37026 8.15121 5.05733 8.80734C4.74439 9.46348 4.58242 10.1814 4.58331 10.9083C4.62432 13.6404 6.85092 15.8336 9.58331 15.8333C12.0861 15.8746 14.2204 14.0288 14.5406 11.5463C14.7798 9.69145 13.9494 7.92359 10.5001 6.89988L12.5 10H10.8333V4.16668H16.6667ZM7.91667 2.5C8.83713 2.5 9.58331 3.24621 9.58331 4.16668C9.58331 5.08715 8.83713 5.83332 7.91667 5.83332C6.9962 5.83332 6.24998 5.08715 6.24998 4.16668C6.24998 3.24621 6.9962 2.5 7.91667 2.5Z"
                      fill="white"
                      className="group-hover:fill-gray-200 transition-colors"
                    />
                  </svg>
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        title="Successfully Updated"
        message="Activity updated successfully!"
        onClose={() => {
          setShowSuccessModal(false);
          navigate(`${basePath}/projects`);
        }}
      />

      {/* Error Modal */}
      <ErrorModal
        show={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
}

EditActivityForm.propTypes = {
  officeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  basePath: PropTypes.string.isRequired,
  officeColor: PropTypes.string,
};
