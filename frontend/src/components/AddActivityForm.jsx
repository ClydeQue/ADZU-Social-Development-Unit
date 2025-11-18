import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Add as AddIcon } from '@mui/icons-material';
import OfficeService from '@/services/officeService';
import PropTypes from 'prop-types';

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

  const sdgOptions = [
    { id: 1, label: '1 - No Poverty' },
    { id: 2, label: '2 - Zero Hunger' },
    { id: 3, label: '3 - Good Health and Well Being' },
    { id: 4, label: '4 - Quality Education' },
    { id: 5, label: '5 - Gender Equality' },
    { id: 6, label: '6 - Clean Water and Sanitation' },
    { id: 7, label: '7 - Affordable and Clean Energy' },
    { id: 8, label: '8 - Decent Work and Economic Growth' },
    { id: 9, label: '9 - Industry, Innovation, and Infrastructure' },
    { id: 10, label: '10 - Reduced Inequalities' },
    { id: 11, label: '11 - Sustainable Cities and Communities' },
    { id: 12, label: '12 - Responsible Consumption and Production' },
    { id: 13, label: '13 - Climate Action' },
    { id: 14, label: '14 - Life Below Water' },
    { id: 15, label: '15 - Life On Land' },
    { id: 16, label: '16 - Peace, Justice, and Strong Institutions' },
    { id: 17, label: '17 - Partnership for the Goals' }
  ];

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

  const handleUpdate = () => {
    // TODO: Implement update functionality
    console.log('Update clicked');
  };

  return (
    <div className="h-full flex flex-col p-3 overflow-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-black" style={{ color: officeColor, fontFamily: 'Inter, sans-serif' }}>
            #ActivityName
          </h1>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 text-[#4D49FC] rounded-lg font-semibold hover:bg-[#4D49FC] hover:text-white transition-colors"
              style={{ borderColor: officeColor, color: officeColor }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
            </button>
            
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 text-[#4D49FC] rounded-lg font-semibold hover:bg-[#4D49FC] hover:text-white transition-colors"
              style={{ borderColor: officeColor, color: officeColor }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              className="px-6 py-2 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: officeColor }}
            >
              UPDATE
            </button>

            <button
              type="submit"
              className="px-6 py-2 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: officeColor }}
            >
              SUBMIT
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-right mb-4">
          UPDATED | {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
        </p>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                placeholder="Enter project name"
                style={{ focusBorderColor: officeColor }}
              />
            </div>

            {/* Program/Component */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Program / Component
              </label>
              <div className="flex gap-2">
                {programsLoading ? (
                  <div className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-400">
                    Loading programs...
                  </div>
                ) : (
                  <>
                    <select
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
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                      style={{ focusBorderColor: officeColor }}
                    >
                      <option value="">Select a program</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.title}
                        </option>
                      ))}
                      <option value="new">+ Add New Program</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewProgramInput(true)}
                      className="px-4 py-2 border-2 rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ borderColor: officeColor, color: officeColor }}
                    >
                      <AddIcon />
                    </button>
                  </>
                )}
              </div>
              {showNewProgramInput && (
                <input
                  type="text"
                  value={formData.programComponent}
                  onChange={(e) => handleInputChange('programComponent', e.target.value)}
                  className="w-full mt-2 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                  placeholder="Enter new program name"
                  style={{ focusBorderColor: officeColor }}
                />
              )}
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Initiation
                </label>
                <input
                  type="date"
                  value={formData.initiation}
                  onChange={(e) => handleInputChange('initiation', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
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
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                />
              </div>
            </div>

            {/* Number of Participants */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Male Participants
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.male_participants}
                  onChange={(e) => handleInputChange('male_participants', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                  placeholder="Enter count"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Female Participants
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.female_participants}
                  onChange={(e) => handleInputChange('female_participants', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                  placeholder="Enter count"
                />
              </div>
            </div>

            {/* Classification and Phase */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Classification
                </label>
                <select
                  value={formData.classification}
                  onChange={(e) => handleInputChange('classification', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                >
                  <option value="">Select classification</option>
                  <option value="Academic">Academic</option>
                  <option value="Extension">Extension</option>
                  <option value="Research">Research</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Phase
                </label>
                <select
                  value={formData.phase}
                  onChange={(e) => handleInputChange('phase', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
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

            {/* Venue */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Venue
              </label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Street"
                    value={formData.venue.street}
                    onChange={(e) => handleVenueChange('street', e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Room"
                    value={formData.venue.room}
                    onChange={(e) => handleVenueChange('room', e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Building"
                  value={formData.venue.building}
                  onChange={(e) => handleVenueChange('building', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Barangay"
                    value={formData.venue.barangay}
                    onChange={(e) => handleVenueChange('barangay', e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Municipality"
                    value={formData.venue.municipality}
                    onChange={(e) => handleVenueChange('municipality', e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.venue.city}
                    onChange={(e) => handleVenueChange('city', e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Province"
                    value={formData.venue.province}
                    onChange={(e) => handleVenueChange('province', e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Objectives
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none resize-none"
                placeholder="Enter objectives"
              />
            </div>

            {/* Partners */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-[#040195]">
                  Partners
                </label>
                <button
                  type="button"
                  onClick={addPartner}
                  className="text-sm font-semibold hover:opacity-80"
                  style={{ color: officeColor }}
                >
                  + Add Partner
                </button>
              </div>
              <div className="space-y-3">
                {formData.partners.map((partner, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="text"
                      placeholder="Partner Name"
                      value={partner.name}
                      onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                    />
                    <select
                      value={partner.type}
                      onChange={(e) => handlePartnerChange(index, 'type', e.target.value)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                    >
                      <option value="">Type</option>
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="NGO">NGO</option>
                      <option value="Academic">Academic</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Nature"
                      value={partner.nature}
                      onChange={(e) => handlePartnerChange(index, 'nature', e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                    />
                    {formData.partners.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePartner(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Budget Amount
                </label>
                <input
                  type="number"
                  value={formData.budgetAmount}
                  onChange={(e) => handleInputChange('budgetAmount', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                  placeholder="₱0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Budget Type
                </label>
                <select
                  value={formData.budgetType}
                  onChange={(e) => handleInputChange('budgetType', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                >
                  <option value="external">External Fund</option>
                  <option value="internal">Internal Fund</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Thumbnail
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.thumbnail ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">{formData.thumbnail.name}</div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('thumbnail', null)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <label className="cursor-pointer text-sm font-semibold hover:opacity-80" style={{ color: officeColor }}>
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* SDG Selection */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Sustainable Development Goals
              </label>
              <div className="space-y-2 max-h-96 overflow-y-auto border-2 border-gray-300 rounded-lg p-3">
                {sdgOptions.map((sdg) => (
                  <label key={sdg.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.sdgs.includes(sdg.id)}
                      onChange={() => handleSDGToggle(sdg.id)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: officeColor }}
                    />
                    <span className="text-sm">{sdg.label}</span>
                  </label>
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
