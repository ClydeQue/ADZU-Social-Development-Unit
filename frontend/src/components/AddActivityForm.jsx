import { useState } from 'react';
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

  // Fetch programs for this office
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['office-programs', officeId],
    queryFn: () => OfficeService.getOfficePrograms(officeId),
    enabled: !!officeId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

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
    venue: {
      street: '',
      room: '',
      building: '',
      barangay: '',
      municipality: '',
      city: '',
      province: ''
    },
    objectives: '',
    partners: [{ name: '', type: '', nature: '' }],
    budgetAmount: '',
    budgetType: 'external',
    thumbnail: null,
    sdgs: []
  });

  const [showNewProgramInput, setShowNewProgramInput] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
    // TODO: Implement API call to create activity
    console.log('Form data:', formData);
    // Navigate back to projects page after successful submission
    navigate(`${basePath}/projects`);
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-auto bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Header with Hashtag and Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold" style={{ color: officeColor }}>
            #{formData.projectName || 'dAZurv'}
          </h1>
          <div className="flex gap-3">
            <button
              type="button"
              className="p-3 rounded-full bg-[#4D49FC] text-white hover:opacity-90 transition-opacity"
              title="Refresh"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              type="button"
              className="p-3 rounded-full bg-[#4D49FC] text-white hover:opacity-90 transition-opacity"
              title="Save"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => navigate(basePath)}
              className="px-6 py-2.5 rounded-lg border-2 border-[#4D49FC] text-[#4D49FC] font-semibold hover:bg-gray-50 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#4D49FC] text-white font-semibold hover:opacity-90 transition-opacity"
            >
              UPDATE
            </button>
          </div>
        </div>

        {/* Form Grid Layout */}
        <div className="space-y-6">
          {/* Row 1: Project Name, Program/Component, Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                placeholder="ndAZurv"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Program / Component
              </label>
              <div className="flex gap-2">
                {programsLoading ? (
                  <div className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-400">
                    Loading...
                  </div>
                ) : (
                  <select
                    required
                    value={formData.programId}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'new') {
                        setShowNewProgramInput(true);
                        handleInputChange('programId', '');
                      } else {
                        setShowNewProgramInput(false);
                        handleInputChange('programId', value);
                      }
                    }}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none bg-white"
                  >
                    <option value="">Select program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Status
              </label>
              <div className="px-4 py-2.5 bg-gray-100 border-2 border-gray-300 rounded-lg text-center font-bold text-[#040195]">
                NO STATUS
              </div>
            </div>
          </div>

          {/* Row 2: Description (col-span-2), Phase */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Description
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none resize-none text-sm"
                placeholder="It brings you in-depth conversations about candidates shaping Zamboanga's future..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Phase
              </label>
              <select
                value={formData.phase}
                onChange={(e) => handleInputChange('phase', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none bg-white"
                required
              >
                <option value="">Select phase</option>
                <option value="Planning">Planning</option>
                <option value="Implementation">Implementation</option>
                <option value="Evaluation">Evaluation</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Row 3: Objectives, Participant Demographics (2 inputs), Inception & Implementation (side by side) */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Objectives
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none resize-none text-sm"
                placeholder="To provide voters with insightful information..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Participant Demographics
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  value={formData.participantsNo}
                  onChange={(e) => handleInputChange('participantsNo', e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-center text-sm"
                  placeholder="Total Numbers"
                />
                <input
                  type="text"
                  value={formData.classification}
                  onChange={(e) => handleInputChange('classification', e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                  placeholder="Classification"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Inception
                </label>
                <input
                  type="date"
                  value={formData.initiation}
                  onChange={(e) => handleInputChange('initiation', e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Implementation
                </label>
                <input
                  type="date"
                  value={formData.implementation}
                  onChange={(e) => handleInputChange('implementation', e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rows 4-6: Venue/City/Partners/Budget/Reports (left 2 cols) + SDG (right col, spans multiple rows) */}
          <div className="grid grid-cols-3 gap-4">
            {/* Left side: 2 columns for venue and partners */}
            <div className="col-span-2 space-y-4">
              {/* Venue row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#040195] mb-2">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venue.building}
                    onChange={(e) => handleVenueChange('building', e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                    placeholder="Street / Room / Building"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#040195] mb-2">
                    Town / Barangay
                  </label>
                  <input
                    type="text"
                    value={formData.venue.barangay}
                    onChange={(e) => handleVenueChange('barangay', e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                    placeholder="Zone III"
                  />
                </div>
              </div>

              {/* Venue row 2 + Sex count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={formData.venue.city}
                    onChange={(e) => handleVenueChange('city', e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                    placeholder="Municipality / City"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.venue.province}
                    onChange={(e) => handleVenueChange('province', e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                    placeholder="Province"
                  />
                </div>
              </div>

              {/* Sex count row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#040195] mb-2">
                    Male
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.male_participants}
                    onChange={(e) => handleInputChange('male_participants', e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-center text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#040195] mb-2">
                    Female
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.female_participants}
                    onChange={(e) => handleInputChange('female_participants', e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-center text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Partners section */}
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Partners
                </label>
                <div className="space-y-2">
                  {formData.partners.map((partner, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1.5fr_1.5fr_auto] gap-2 items-start">
                      <input
                        type="text"
                        placeholder="Name"
                        value={partner.name}
                        onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                        className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                      />
                      <select
                        value={partner.type}
                        onChange={(e) => handlePartnerChange(index, 'type', e.target.value)}
                        className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm bg-white"
                      >
                        <option value="">Type</option>
                        <option value="Government">Government</option>
                        <option value="Non-Government">Non-Government</option>
                        <option value="Institutional">Institutional</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Nature"
                        value={partner.nature}
                        onChange={(e) => handlePartnerChange(index, 'nature', e.target.value)}
                        className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                      />
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => addPartner()}
                          className="p-2 rounded-full bg-[#4D49FC] text-white hover:opacity-90"
                          title="Add"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        {formData.partners.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePartner(index)}
                            className="p-2 rounded-full bg-red-500 text-white hover:opacity-90"
                            title="Remove"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Budget Overview
                </label>
                <div className="space-y-2">
                  <div className="grid grid-cols-[2fr_1.5fr_auto] gap-2">
                    <input
                      type="number"
                      value={formData.budgetAmount}
                      onChange={(e) => handleInputChange('budgetAmount', e.target.value)}
                      className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                      placeholder="Amount"
                      min="0"
                      step="0.01"
                    />
                    <select
                      value={formData.budgetType}
                      onChange={(e) => handleInputChange('budgetType', e.target.value)}
                      className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm bg-white"
                    >
                      <option value="external">External</option>
                      <option value="internal">Internal</option>
                    </select>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="p-2.5 rounded-full bg-[#4D49FC] text-white hover:opacity-90"
                        title="Add Budget"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="p-2.5 rounded-full bg-red-500 text-white hover:opacity-90"
                        title="Remove Budget"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reports Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#040195] mb-2">
                    FULL REPORT
                  </label>
                  <div className="text-xs text-gray-500 mb-1">3 MB (max)</div>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#4D49FC] text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    Change
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#040195] mb-2">
                    Thumbnail
                  </label>
                  <div className="text-xs text-gray-500 mb-1">3 MB (max)</div>
                  <label className="block w-full px-4 py-2.5 rounded-lg bg-[#4D49FC] text-white font-semibold hover:opacity-90 transition-opacity text-center cursor-pointer">
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

            {/* Right side: SDG column (spans all rows) */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                SDG Goals
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-[600px] overflow-y-auto p-2 border-2 border-gray-300 rounded-lg">
                {SDG_GOALS.map((sdg) => (
                  <div
                    key={sdg.id}
                    onClick={() => handleSDGToggle(sdg.id)}
                    className={`relative cursor-pointer rounded-lg transition-all ${
                      formData.sdg?.includes(sdg.id)
                        ? 'ring-2 ring-[#4D49FC]'
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                  >
                    <img
                      src={getSDGIcon(sdg.id)}
                      alt={sdg.label}
                      className="w-full h-auto rounded-lg"
                    />
                    {formData.sdg?.includes(sdg.id) && (
                      <div className="absolute top-1 right-1 bg-[#4D49FC] rounded-full p-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
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