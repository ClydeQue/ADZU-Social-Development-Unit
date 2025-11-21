import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import OfficeService from '@/services/officeService';
import PropTypes from 'prop-types';
import { SDG_GOALS, getSDGIcon } from '@/utils/sdgData';

/**
 * Reusable Add Activity Form Component
 * Works for all offices based on officeId
 */
export default function AddActivityForm({ officeId, basePath, officeColor = '#4D49FC' }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch programs for this office
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['office-programs', officeId],
    queryFn: () => OfficeService.getOfficePrograms(officeId),
    enabled: !!officeId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const [dropdownOpen, setDropdownOpen] = useState({});
  const [formData, setFormData] = useState({
    projectName: '',
    programId: '', // Changed to programId to store the selected program
    programComponent: '',
    initiation: '',
    implementation: '',
    participantsNo: '',
    male_participants: '',
    female_participants: '',
    classification: '',
    phase: '',
    status: 'pending', // Default status for new activities
    venue: {
      street: '',
      barangay: '',
      city: '',
      province: ''
    },
    description: '',
    objectives: '',
    partners: [{ name: '', type: '', nature: '' }],
    budgets: [{ amount: '', type: 'external' }],
    thumbnail: null,
    reportUrl: '',
    sdgs: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDropdown = (name) => {
    setDropdownOpen(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const closeDropdown = (name) => {
    setDropdownOpen(prev => ({ ...prev, [name]: false }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen({});
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVenueChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      venue: { ...prev.venue, [field]: value }
    }));
  };

  const handlePartnerChange = (index, field, value) => {
    const newPartners = [...formData.partners];
    newPartners[index][field] = value;
    setFormData(prev => ({ ...prev, partners: newPartners }));
  };

  const addPartner = () => {
    setFormData(prev => ({
      ...prev,
      partners: [...prev.partners, { name: '', type: '', nature: '' }]
    }));
  };

  const removePartner = (index) => {
    if (formData.partners.length > 1) {
      const newPartners = formData.partners.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, partners: newPartners }));
    }
  };

  const handleBudgetChange = (index, field, value) => {
    const newBudgets = [...formData.budgets];
    newBudgets[index][field] = value;
    setFormData(prev => ({ ...prev, budgets: newBudgets }));
  };

  const addBudget = () => {
    setFormData(prev => ({
      ...prev,
      budgets: [...prev.budgets, { amount: '', type: 'external' }]
    }));
  };

  const removeBudget = (index) => {
    if (formData.budgets.length > 1) {
      const newBudgets = formData.budgets.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, budgets: newBudgets }));
    }
  };

  const handleSDGToggle = (sdgId) => {
    setFormData(prev => ({
      ...prev,
      sdgs: prev.sdgs.includes(sdgId)
        ? prev.sdgs.filter(id => id !== sdgId)
        : [...prev.sdgs, sdgId]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
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
          street: formData.venue.street || '',
          barangay: formData.venue.barangay || '',
          city: formData.venue.city || '',
          province: formData.venue.province || ''
        }),
        description: formData.description || null,
        objectives: formData.objectives || null,
        // Map partners array to backend format
        partner_name: formData.partners.map(p => p.name).filter(Boolean).join(', ') || null,
        partner_type: formData.partners.map(p => p.type).filter(Boolean).join(', ') || null,
        partner_nature: formData.partners.map(p => p.nature).filter(Boolean).join(', ') || null,
        // Map budgets array to backend format
        budget_amount: formData.budgets[0]?.amount ? parseFloat(formData.budgets[0].amount) : null,
        budget_type: formData.budgets[0]?.type || null,
        // Submit SDG numbers as array of integers
        sdg_numbers: formData.sdgs.map(id => parseInt(id)),
        phase: formData.phase || null,
        report_url: formData.reportUrl || null,
        classification: formData.classification || null,
      };

      console.log('Submitting activity data:', activityData);

      // Call API to create activity
      const response = await fetch('/api/office/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(activityData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create activity');
      }

      const result = await response.json();
      console.log('Activity created:', result);
      
      // Show success message (you can add a toast notification here)
      alert('Activity created successfully!');
      
      // Navigate back to projects page after successful submission
      navigate(`${basePath}/projects`);
    } catch (error) {
      console.error('Error creating activity:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-auto bg-gray-50">
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
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Header with Hashtag and Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold" style={{ color: officeColor }}>
            #{formData.projectName || 'dAZurv'}
          </h1>
          <div className="flex gap-3">
            <button
              type="button"
              className="p-2 rounded-full bg-[#4D49FC] hover:bg-[#3d39cc] transition-colors group"
              title="Refresh"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.6667 4.16668V5.83332L13.9844 5.8332C15.3936 7.06988 16.2573 8.87973 16.2557 10.8517C16.2531 13.9056 14.1759 16.5673 11.2142 17.3117C8.25249 18.0562 5.16358 16.693 3.71733 14.0033C2.27112 11.3137 2.83737 7.98516 5.09166 5.925C5.41015 6.43174 5.8592 6.84337 6.39166 7.11668C5.8262 7.57351 5.37026 8.15121 5.05733 8.80734C4.74439 9.46348 4.58242 10.1814 4.58331 10.9083C4.62432 13.6404 6.85092 15.8336 9.58331 15.8333C12.0861 15.8746 14.2204 14.0288 14.5406 11.5463C14.7798 9.69145 13.9494 7.92359 12.5001 6.89988L12.5 10H10.8333V4.16668H16.6667ZM7.91667 2.5C8.83713 2.5 9.58331 3.24621 9.58331 4.16668C9.58331 5.08715 8.83713 5.83332 7.91667 5.83332C6.9962 5.83332 6.24998 5.08715 6.24998 4.16668C6.24998 3.24621 6.9962 2.5 7.91667 2.5Z" fill="white" className="group-hover:fill-gray-200 transition-colors"/>
              </svg>
            </button>
            <button
              type="button"
              className="p-2 rounded-full bg-[#4D49FC] hover:bg-[#3d39cc] transition-colors group"
              title="Save"
            >
              <svg className="w-4 h-4" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 5.25H3.75V15C3.75 15.3978 3.90804 15.7794 4.18934 16.0607C4.47064 16.342 4.85218 16.5 5.25 16.5H12.75C13.1478 16.5 13.5294 16.342 13.8107 16.0607C14.092 15.7794 14.25 15.3978 14.25 15V5.25H4.5ZM7.5 14.25H6V7.5H7.5V14.25ZM12 14.25H10.5V7.5H12V14.25ZM12.4635 3L11.25 1.5H6.75L5.5365 3H2.25V4.5H15.75V3H12.4635Z" fill="white" className="group-hover:fill-gray-200 transition-colors"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => navigate(basePath)}
              className="px-4 py-1.5 rounded-lg border-2 border-[#4D49FC] text-[#4D49FC] text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#4D49FC] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              UPDATE
            </button>
          </div>
        </div>

        {/* Form Grid Layout */}
        <div className="space-y-3">
          {/* Row 1: Project Name, Program/Component, Status */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                placeholder="ndAZurv"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Program / Component
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
                      onClick={() => toggleDropdown('program')}
                      className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none bg-white text-left flex items-center justify-between"
                    >
                      <span className={formData.programId ? '' : 'text-gray-400'}>
                        {formData.programId ? programs.find(p => p.id === formData.programId)?.title : 'Select program'}
                      </span>
                      <div className="w-5 h-5 rounded-sm bg-[#040195] flex items-center justify-center flex-shrink-0">
                        <svg width="10" height="10" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.8985 6.75C4.5136 7.41667 3.55135 7.41667 3.16645 6.75L0.135357 1.5C-0.249543 0.833334 0.231582 0 1.00138 0L7.06356 0C7.83336 0 8.31449 0.833333 7.92959 1.5L4.8985 6.75Z" fill="white"/>
                        </svg>
                      </div>
                    </button>
                    {dropdownOpen.program && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-[#8180C9] rounded-[11px] shadow-lg max-h-60 overflow-y-auto">
                        {programs.map((program) => (
                          <button
                            key={program.id}
                            type="button"
                            onClick={() => {
                              handleInputChange('programId', program.id);
                              closeDropdown('program');
                            }}
                            className="w-full px-3 py-2 text-xs text-left text-[#040195] hover:bg-[#F5F5FF] transition-colors first:rounded-t-[11px] last:rounded-b-[11px]"
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
              <div className="px-2 py-2 bg-gray-100 border border-[#8180C9] rounded-[11px] text-center text-xs font-bold text-[#040195] uppercase">
                {formData.status || 'PENDING'}
              </div>
            </div>
          </div>

          {/* Row 2: Description (col-span-2), Phase */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={2}
                className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none resize-none placeholder:text-gray-400"
                placeholder="It brings you in-depth conversations about candidates shaping Zamboanga's future..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Phase
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleDropdown('phase')}
                  className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none bg-white text-left flex items-center justify-between"
                >
                  <span className={formData.phase ? '' : 'text-gray-400'}>
                    {formData.phase || 'Select phase'}
                  </span>
                  <div className="w-5 h-5 rounded-sm bg-[#040195] flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.8985 6.75C4.5136 7.41667 3.55135 7.41667 3.16645 6.75L0.135357 1.5C-0.249543 0.833334 0.231582 0 1.00138 0L7.06356 0C7.83336 0 8.31449 0.833333 7.92959 1.5L4.8985 6.75Z" fill="white"/>
                    </svg>
                  </div>
                </button>
                {dropdownOpen.phase && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-[#8180C9] rounded-[11px] shadow-lg">
                    {['Planning', 'In Progress', 'Completed', 'Cancelled'].map((phase) => (
                      <button
                        key={phase}
                        type="button"
                        onClick={() => {
                          handleInputChange('phase', phase);
                          closeDropdown('phase');
                        }}
                        className="w-full px-3 py-2 text-xs text-left text-[#040195] hover:bg-[#F5F5FF] transition-colors first:rounded-t-[11px] last:rounded-b-[11px]"
                      >
                        {phase}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 3: Objectives, Participant Demographics (2 inputs), Inception & Implementation (side by side) */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Objectives
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                rows={2}
                className="w-full px-2 py-2 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none resize-none placeholder:text-gray-400"
                placeholder="To provide voters with insightful information..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#040195] mb-1">
                Participant Demographics
              </label>
              <div className="grid grid-cols-[70px_1fr] gap-1.5">
                <div>
                  <div className="text-[9px] text-[#8180C9] mb-0.5">Total Numbers</div>
                  <input
                    type="number"
                    value={formData.participantsNo}
                    onChange={(e) => handleInputChange('participantsNo', e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] text-center focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="0"
                  />
                </div>
                <div>
                  <div className="text-[9px] text-[#8180C9] mb-0.5">Classification</div>
                  <input
                    type="text"
                    value={formData.classification}
                    onChange={(e) => handleInputChange('classification', e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="Type"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="block text-xs font-bold text-[#040195] mb-1">
                  Inception
                </label>
                <input
                  type="date"
                  value={formData.initiation}
                  onChange={(e) => handleInputChange('initiation', e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#040195] mb-1">
                  Implementation
                </label>
                <input
                  type="date"
                  value={formData.implementation}
                  onChange={(e) => handleInputChange('implementation', e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rows 4-6: Venue/City/Partners/Budget/Reports (left 2 cols) + SDG (right col, spans multiple rows) */}
          <div className="grid grid-cols-3 gap-3">
            {/* Left side: 2 columns for venue and partners */}
            <div className="col-span-2 space-y-2">
              {/* Venue row 1: Street, Barangay, Male */}
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <div>
                  <div className="text-[9px] text-[#8180C9] mb-0.5">Street / Room / Building</div>
                  <input
                    type="text"
                    value={formData.venue.street}
                    onChange={(e) => handleVenueChange('street', e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="Venue"
                  />
                </div>

                <div>
                  <div className="text-[9px] text-[#8180C9] mb-0.5">Town / Barangay</div>
                  <input
                    type="text"
                    value={formData.venue.barangay}
                    onChange={(e) => handleVenueChange('barangay', e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="Zone"
                  />
                </div>

                <div>
                  <div className="text-[9px] text-[#8180C9] mb-0.5">Male</div>
                  <input
                    type="number"
                    min="0"
                    value={formData.male_participants}
                    onChange={(e) => handleInputChange('male_participants', e.target.value)}
                    className="w-16 px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] text-center focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Venue row 2: City, Province, Female */}
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <div>
                  <div className="text-[9px] text-[#8180C9] mb-0.5">Municipality / City</div>
                  <input
                    type="text"
                    value={formData.venue.city}
                    onChange={(e) => handleVenueChange('city', e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="City"
                  />
                </div>

                <div>
                  <div className="text-[9px] text-[#8180C9] mb-0.5">Province</div>
                  <input
                    type="text"
                    value={formData.venue.province}
                    onChange={(e) => handleVenueChange('province', e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="Province"
                  />
                </div>

                <div>
                  <div className="text-[9px] text-[#8180C9] mb-0.5">Female</div>
                  <input
                    type="number"
                    min="0"
                    value={formData.female_participants}
                    onChange={(e) => handleInputChange('female_participants', e.target.value)}
                    className="w-16 px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] text-center focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Partners section */}
              <div>
                <label className="block text-xs font-bold text-[#040195] mb-1">
                  Partners
                </label>
                <div className="border border-[#8180C9] rounded-[11px] p-2 space-y-1.5">
                  {formData.partners.map((partner, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1.5">
                      <div>
                        <div className="text-[9px] text-[#8180C9] mb-0.5">Name</div>
                        <input
                          type="text"
                          value={partner.name}
                          onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <div className="text-[9px] text-[#8180C9] mb-0.5">Type</div>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => toggleDropdown(`partner-type-${index}`)}
                            className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none bg-white text-left flex items-center justify-between"
                          >
                            <span className={partner.type ? '' : 'text-gray-400'}>
                              {partner.type || 'Select'}
                            </span>
                            <div className="w-5 h-5 rounded-sm bg-[#040195] flex items-center justify-center flex-shrink-0">
                              <svg width="9" height="10" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.8985 6.75C4.5136 7.41667 3.55135 7.41667 3.16645 6.75L0.135357 1.5C-0.249543 0.833334 0.231582 0 1.00138 0L7.06356 0C7.83336 0 8.31449 0.833333 7.92959 1.5L4.8985 6.75Z" fill="white"/>
                              </svg>
                            </div>
                          </button>
                          {dropdownOpen[`partner-type-${index}`] && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-[#8180C9] rounded-[11px] shadow-lg">
                              {['Government', 'Non-Government', 'Institutional'].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => {
                                    handlePartnerChange(index, 'type', type);
                                    closeDropdown(`partner-type-${index}`);
                                  }}
                                  className="w-full px-3 py-2 text-xs text-left text-[#040195] hover:bg-[#F5F5FF] transition-colors first:rounded-t-[11px] last:rounded-b-[11px]"
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#8180C9] mb-0.5">Nature</div>
                        <input
                          type="text"
                          value={partner.nature}
                          onChange={(e) => handlePartnerChange(index, 'nature', e.target.value)}
                          className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
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
                            <svg className="w-3.5 h-3.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.41477 25.1818V0.500017H16.2841V25.1818H9.41477ZM0.5 16.2841V9.41479H25.1818V16.2841H0.5Z" fill="white" className="group-hover:fill-gray-200 transition-colors"/>
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removePartner(index)}
                            className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors group"
                            title="Remove Partner"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14.9997 8.66504C15.736 8.66504 16.3335 9.26182 16.3337 9.99805C16.3337 10.7344 15.7361 11.332 14.9997 11.332H4.99969C4.26347 11.3319 3.66669 10.7343 3.66669 9.99805C3.66686 9.26193 4.26357 8.66522 4.99969 8.66504H14.9997Z" fill="white" stroke="white" className="group-hover:fill-gray-200 group-hover:stroke-gray-200 transition-colors"/>
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
                  Budget Overview
                </label>
                <div className="border border-[#8180C9] rounded-[11px] p-2 space-y-1.5">
                  {formData.budgets.map((budget, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                      <div>
                        <div className="text-[9px] text-[#8180C9] mb-0.5">Amount</div>
                        <input
                          type="number"
                          value={budget.amount}
                          onChange={(e) => handleBudgetChange(index, 'amount', e.target.value)}
                          className="w-full px-3 py-2 border border-[#8180C9] rounded-[11px] text-sm text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <div className="text-[9px] text-[#8180C9] mb-0.5">Type</div>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => toggleDropdown(`budget-type-${index}`)}
                            className="w-full px-3 py-2 border border-[#8180C9] rounded-[11px] text-sm text-[#040195] focus:border-[#5B5A9E] focus:outline-none bg-white text-left flex items-center justify-between"
                          >
                            <span className={budget.type ? '' : 'text-gray-400'}>
                              {budget.type === 'external' ? 'External' : budget.type === 'internal' ? 'Internal' : 'Select'}
                            </span>
                            <div className="w-5 h-5 rounded-sm bg-[#040195] flex items-center justify-center flex-shrink-0">
                              <svg width="10" height="11" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.8985 6.75C4.5136 7.41667 3.55135 7.41667 3.16645 6.75L0.135357 1.5C-0.249543 0.833334 0.231582 0 1.00138 0L7.06356 0C7.83336 0 8.31449 0.833333 7.92959 1.5L4.8985 6.75Z" fill="white"/>
                              </svg>
                            </div>
                          </button>
                          {dropdownOpen[`budget-type-${index}`] && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-[#8180C9] rounded-[11px] shadow-lg">
                              {[{value: 'external', label: 'External'}, {value: 'internal', label: 'Internal'}].map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => {
                                    handleBudgetChange(index, 'type', type.value);
                                    closeDropdown(`budget-type-${index}`);
                                  }}
                                  className="w-full px-3 py-2 text-sm text-left text-[#040195] hover:bg-[#F5F5FF] transition-colors first:rounded-t-[11px] last:rounded-b-[11px]"
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
                            <svg className="w-3.5 h-3.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.41477 25.1818V0.500017H16.2841V25.1818H9.41477ZM0.5 16.2841V9.41479H25.1818V16.2841H0.5Z" fill="white" className="group-hover:fill-gray-200 transition-colors"/>
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeBudget(index)}
                            className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors group"
                            title="Remove Budget"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14.9997 8.66504C15.736 8.66504 16.3335 9.26182 16.3337 9.99805C16.3337 10.7344 15.7361 11.332 14.9997 11.332H4.99969C4.26347 11.3319 3.66669 10.7343 3.66669 9.99805C3.66686 9.26193 4.26357 8.66522 4.99969 8.66504H14.9997Z" fill="white" stroke="white" className="group-hover:fill-gray-200 group-hover:stroke-gray-200 transition-colors"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: SDG column (spans all rows) */}
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-1">
                  Sustainable Development Goal(s)
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-[260px] overflow-y-auto p-3 border border-[#8180C9] rounded-[11px]">
                  {SDG_GOALS.map((sdg) => (
                    <div
                      key={sdg.id}
                      onClick={() => handleSDGToggle(sdg.id)}
                      className={`relative cursor-pointer rounded-lg transition-all ${
                        formData.sdgs?.includes(sdg.id)
                          ? 'ring-2 ring-[#4D49FC] ring-offset-2'
                          : 'hover:opacity-80'
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

              {/* Reports Section */}
              <div>
                <label className="block text-xs font-bold text-[#040195] mb-1">
                  FULL REPORT URL
                </label>
                <div className="text-[9px] text-[#8180C9] mb-0.5">Paste report link</div>
                <input
                  type="url"
                  value={formData.reportUrl}
                  onChange={(e) => handleInputChange('reportUrl', e.target.value)}
                  className="w-full px-2 py-1.5 border border-[#8180C9] rounded-[11px] text-xs text-[#040195] focus:border-[#5B5A9E] focus:outline-none placeholder:text-gray-400"
                  placeholder="https://example.com/report.pdf"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#040195] mb-1">
                  Thumbnail
                </label>
                <div className="text-[9px] text-[#8180C9] mb-0.5">3 MB (max)</div>
                <label className="flex items-center justify-center gap-1.5 w-full px-2 py-1.5 rounded-[11px] text-xs bg-[#4D49FC] text-white font-semibold hover:bg-[#3d39cc] transition-colors cursor-pointer group">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.6667 4.16668V5.83332L13.9844 5.8332C15.3936 7.06988 16.2573 8.87973 16.2557 10.8517C16.2531 13.9056 14.1759 16.5673 11.2142 17.3117C8.25249 18.0562 5.16358 16.693 3.71733 14.0033C2.27112 11.3137 2.83737 7.98516 5.09166 5.925C5.41015 6.43174 5.8592 6.84337 6.39166 7.11668C5.8262 7.57351 5.37026 8.15121 5.05733 8.80734C4.74439 9.46348 4.58242 10.1814 4.58331 10.9083C4.62432 13.6404 6.85092 15.8336 9.58331 15.8333C12.0861 15.8746 14.2204 14.0288 14.5406 11.5463C14.7798 9.69145 13.9494 7.92359 12.5001 6.89988L12.5 10H10.8333V4.16668H16.6667ZM7.91667 2.5C8.83713 2.5 9.58331 3.24621 9.58331 4.16668C9.58331 5.08715 8.83713 5.83332 7.91667 5.83332C6.9962 5.83332 6.24998 5.08715 6.24998 4.16668C6.24998 3.24621 6.9962 2.5 7.91667 2.5Z" fill="white" className="group-hover:fill-gray-200 transition-colors"/>
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
    </div>
  );
}

AddActivityForm.propTypes = {
  officeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  basePath: PropTypes.string.isRequired,
  officeColor: PropTypes.string,
};