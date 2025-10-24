import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficeDashboardLayout from '@/components/OfficeDashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Add as AddIcon } from '@mui/icons-material';

/**
 * ACCA Add Activity Page
 * Form to create a new activity based on the design layout
 */
export default function ACCAAddActivity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const officeId = user?.office_id || user?.office?.id;

  const [formData, setFormData] = useState({
    projectName: '',
    programComponent: '',
    initiation: '',
    implementation: '',
    participantsNo: '',
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
    budgetApproved: '',
    budgetUtilized: '',
    thumbnail: null,
    sdgs: []
  });

  const sdgOptions = [
    { id: 1, label: '1 - No Poverty' },
    { id: 2, label: '2 - Zero Hunger' },
    { id: 3, label: '3 - Good and Health Well Being' },
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
    // navigate back to projects page after successful submission
    navigate('/office/acca/projects');
  };

  const handleUpdate = () => {
    // TODO: Implement update functionality
    console.log('Update clicked');
  };

  return (
    <OfficeDashboardLayout
      officeColor="#040195"
      basePath="/office/acca"
      officeId={officeId}
    >
      <div className="h-full flex flex-col p-3 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-black text-[#4D49FC]" style={{ fontFamily: 'Inter, sans-serif' }}>
              #ActivityName
            </h1>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#4D49FC] text-[#4D49FC] rounded-lg font-semibold hover:bg-[#4D49FC] hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
              </button>
              
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#4D49FC] text-[#4D49FC] rounded-lg font-semibold hover:bg-[#4D49FC] hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                </svg>
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                className="px-6 py-2 bg-[#4D49FC] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                UPDATE
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-[#4D49FC] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                SUBMIT
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-right mb-4">
            UPDATED | 10/04/2024 - 11:05 PM
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
                />
              </div>

              {/* Program/Component */}
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Program / Component
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.programComponent}
                    onChange={(e) => handleInputChange('programComponent', e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                    placeholder="Enter program component"
                  />
                  <button
                    type="button"
                    className="w-10 h-10 bg-[#4D49FC] text-white rounded-lg flex items-center justify-center hover:opacity-90"
                  >
                    <AddIcon />
                  </button>
                </div>
              </div>

              {/* Initiation, Implementation, Participants, Classification */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#040195] mb-2">
                    Initiation
                  </label>
                  <input
                    type="date"
                    value={formData.initiation}
                    onChange={(e) => handleInputChange('initiation', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
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
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#040195] mb-2">
                    Participants No.
                  </label>
                  <input
                    type="number"
                    value={formData.participantsNo}
                    onChange={(e) => handleInputChange('participantsNo', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#040195] mb-2">
                    Classification
                  </label>
                  <input
                    type="text"
                    value={formData.classification}
                    onChange={(e) => handleInputChange('classification', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none text-sm"
                    placeholder="Enter classification"
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Venue
                </label>
                <div className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">Street / Room / Building</label>
                  <input
                    type="text"
                    placeholder="Salvador Campus, Ateneo de Zamboanga University"
                    value={formData.venue.street}
                    onChange={(e) => handleVenueChange('street', e.target.value)}
                    className="w-full px-3 py-2 border border-[#040195] rounded-md focus:border-[#040195] focus:outline-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-[#040195] mb-1">Town / Barangay</label>
                    <input
                      type="text"
                      placeholder="Zone III"
                      value={formData.venue.barangay}
                      onChange={(e) => handleVenueChange('barangay', e.target.value)}
                      className="w-full px-3 py-2 border border-[#040195] rounded-md focus:border-[#040195] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#040195] mb-1">Municipality / City</label>
                    <input
                      type="text"
                      placeholder="Zamboanga"
                      value={formData.venue.municipality}
                      onChange={(e) => handleVenueChange('municipality', e.target.value)}
                      className="w-full px-3 py-2 border border-[#040195] rounded-md focus:border-[#040195] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#040195] mb-1">Province</label>
                    <input
                      type="text"
                      placeholder="Zamboanga del Sur"
                      value={formData.venue.province}
                      onChange={(e) => handleVenueChange('province', e.target.value)}
                      className="w-full px-3 py-2 border border-[#040195] rounded-md focus:border-[#040195] focus:outline-none text-sm"
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
                  className="w-full px-4 py-3 border border-[#040195] rounded-md focus:border-[#040195] focus:outline-none resize-none"
                  rows="4"
                  placeholder="Enter objectives..."
                />
              </div>

              {/* Partners */}
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Partners
                </label>
                <div className="border border-[#040195] rounded-md p-4 space-y-3">
                  {formData.partners.map((partner, index) => {
                    const isLastRow = index === formData.partners.length - 1;
                    const isOnlyRow = formData.partners.length === 1;
                    
                    return (
                      <div key={index} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-end">
                        <div>
                          <label className="block text-xs text-[#040195] mb-1">Name</label>
                          <input
                            type="text"
                            placeholder="Commission on Elections"
                            value={partner.name}
                            onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-[#040195] rounded-md focus:border-[#040195] focus:outline-none text-sm text-[#040195]"
                          />
                        </div>
                        <div className="relative">
                          <label className="block text-xs text-[#040195] mb-1">Type</label>
                          <select
                            value={partner.type}
                            onChange={(e) => handlePartnerChange(index, 'type', e.target.value)}
                            className="appearance-none px-4 py-2 pr-10 border border-[#040195] rounded-md focus:border-[#040195] focus:outline-none text-sm text-[#040195] font-semibold cursor-pointer"
                            style={{ minWidth: '150px' }}
                          >
                            <option value="">Type</option>
                            <option value="government">Government</option>
                            <option value="private">Private Company</option>
                            <option value="ngo">NGO</option>
                          </select>
                          <div className="absolute right-3 top-[34px] pointer-events-none">
                            <svg className="w-4 h-4 text-[#040195]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="relative">
                          <label className="block text-xs text-[#040195] mb-1">Nature</label>
                          <select
                            value={partner.nature}
                            onChange={(e) => handlePartnerChange(index, 'nature', e.target.value)}
                            className="appearance-none px-4 py-2 pr-10 border border-[#040195] rounded-md focus:border-[#040195] focus:outline-none text-sm text-[#040195] font-semibold cursor-pointer"
                            style={{ minWidth: '170px' }}
                          >
                            <option value="">Nature</option>
                            <option value="resource">Resource Sharing</option>
                            <option value="sponsorship">Sponsorship</option>
                            <option value="collaboration">Collaboration</option>
                          </select>
                          <div className="absolute right-3 top-[34px] pointer-events-none">
                            <svg className="w-4 h-4 text-[#040195]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Show only + button if it's the only row */}
                        {isOnlyRow ? (
                          <button
                            type="button"
                            onClick={addPartner}
                            className="w-10 h-10 bg-[#040195] rounded-full flex items-center justify-center hover:opacity-90"
                          >
                            <img src="/icons/add.svg" alt="Add" className="w-5 h-5 " />
                          </button>
                        ) : isLastRow ? (
                          // Show + button on the last row
                          <button
                            type="button"
                            onClick={addPartner}
                            className="w-10 h-10 bg-[#040195] rounded-full flex items-center justify-center hover:opacity-90"
                          >
                            <img src="/icons/add.svg" alt="Add" className="w-5 h-5 " />
                          </button>
                        ) : (
                          // Show - button on all other rows
                          <button
                            type="button"
                            onClick={() => removePartner(index)}
                            className="w-10 h-10 bg-[#040195] rounded-full flex items-center justify-center hover:opacity-90"
                          >
                            <img src="/icons/minus.svg" alt="Remove" className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Budget Overview */}
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Budget Overview
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#040195] mb-1">
                      Approved / Allocated Budget
                    </label>
                    <input
                      type="text"
                      value={formData.budgetApproved}
                      onChange={(e) => handleInputChange('budgetApproved', e.target.value)}
                      className="w-full px-4 py-2 border border-[#040195] rounded-md focus:border-[#040195] focus:outline-none"
                      placeholder="$ 10,000.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#040195] mb-1">
                      Utilized Budget
                    </label>
                    <input
                      type="text"
                      value={formData.budgetUtilized}
                      onChange={(e) => handleInputChange('budgetUtilized', e.target.value)}
                      className="w-full px-4 py-2 border border-[#040195] rounded-md focus:border-[#040195] focus:outline-none"
                      placeholder="$ 92,421.00"
                    />
                  </div>
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Thumbnail
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="w-full px-4 py-3 border border-dashed border-[#040195] rounded-md flex items-center justify-center cursor-pointer hover:border-[#040195] transition-colors"
                  >
                    <span className="text-[#4D49FC] font-semibold">
                      {formData.thumbnail ? formData.thumbnail.name : 'Choose File'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Status, Phase, and SDGs */}
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded-md focus:outline-none appearance-none border border-[#040195]"
                >
                  <option value="completed">COMPLETED</option>
                  <option value="pending">PENDING</option>
                  <option value="cancelled">CANCELLED</option>
                </select>
              </div>

              {/* Phase */}
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Phase
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.phase}
                    onChange={(e) => handleInputChange('phase', e.target.value)}
                    className="flex-1 px-4 py-2 border border-[#040195] rounded-md focus:border-[#040195] focus:outline-none"
                    placeholder="Completion"
                  />
                  <button
                    type="button"
                    className="w-10 h-10 bg-[#4D49FC] text-white rounded-lg flex items-center justify-center hover:opacity-90"
                  >
                    <AddIcon />
                  </button>
                </div>
              </div>

              {/* SDGs */}
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Sustainable Development Goal(s)
                </label>
              <div className=" border border-[#040195] rounded-md p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {sdgOptions.map((sdg) => (
                  <label
                    key={sdg.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.sdgs.includes(sdg.id)}
                      onChange={() => handleSDGToggle(sdg.id)}
                      className="w-4 h-4 border rounded cursor-pointer"
                    />
                    <span className="text-sm text-[#040195]">{sdg.label}</span>
                  </label>
                ))}
              </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </OfficeDashboardLayout>
  );
}
