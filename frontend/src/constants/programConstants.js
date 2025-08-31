// Constants for SDG and ADZU Goals dropdown options

export const SUSTAINABLE_DEVELOPMENT_GOALS = [
  { value: "1. No Poverty", label: "1. No Poverty" },
  { value: "2. Zero Hunger", label: "2. Zero Hunger" },
  {
    value: "3. Good Health and Well-being",
    label: "3. Good Health and Well-being",
  },
  { value: "4. Quality Education", label: "4. Quality Education" },
  { value: "5. Gender Equality", label: "5. Gender Equality" },
  {
    value: "6. Clean Water and Sanitation",
    label: "6. Clean Water and Sanitation",
  },
  {
    value: "7. Affordable and Clean Energy",
    label: "7. Affordable and Clean Energy",
  },
  {
    value: "8. Decent Work and Economic Growth",
    label: "8. Decent Work and Economic Growth",
  },
  {
    value: "9. Industry, Innovation and Infrastructure",
    label: "9. Industry, Innovation and Infrastructure",
  },
  { value: "10. Reduced Inequality", label: "10. Reduced Inequality" },
  {
    value: "11. Sustainable Cities and Communities",
    label: "11. Sustainable Cities and Communities",
  },
  {
    value: "12. Responsible Consumption and Production",
    label: "12. Responsible Consumption and Production",
  },
  { value: "13. Climate Action", label: "13. Climate Action" },
  { value: "14. Life Below Water", label: "14. Life Below Water" },
  { value: "15. Life on Land", label: "15. Life on Land" },
  {
    value: "16. Peace and Justice Strong Institutions",
    label: "16. Peace and Justice Strong Institutions",
  },
  {
    value: "17. Partnerships to achieve the Goal",
    label: "17. Partnerships to achieve the Goal",
  },
];

export const ADZU_GOALS = [
  { value: "Academic Excellence", label: "Academic Excellence" },
  { value: "Community Engagement", label: "Community Engagement" },
  { value: "Faith Formation", label: "Faith Formation" },
  { value: "Social Justice", label: "Social Justice" },
];

export const PROGRAM_STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const FUNDING_SOURCES = [
  { value: "University Fund", label: "University Fund" },
  { value: "External Grant", label: "External Grant" },
  { value: "Government Grant", label: "Government Grant" },
  { value: "Private Donation", label: "Private Donation" },
  { value: "International Grant", label: "International Grant" },
  { value: "Student Fund", label: "Student Fund" },
  { value: "Alumni Fund", label: "Alumni Fund" },
  { value: "Corporate Partnership", label: "Corporate Partnership" },
  { value: "Other", label: "Other" },
];

// Office-specific information for dashboard customization
export const OFFICE_INFO = {
  1: {
    name: "SDO",
    fullName: "Social Development Office",
    description:
      "Coordinates social development programs and community outreach",
    primaryColor: "#1976d2",
    focusAreas: ["Community Health", "Educational Support", "Social Services"],
  },
  2: {
    name: "CCES",
    fullName: "Center for Community Extension Services",
    description: "Manages community extension and rural development programs",
    primaryColor: "#388e3c",
    focusAreas: ["Rural Development", "Agriculture", "Skills Training"],
  },
  3: {
    name: "API",
    fullName: "Ateneo Peace Institute",
    description: "Promotes peace education and conflict resolution",
    primaryColor: "#f57c00",
    focusAreas: [
      "Peace Education",
      "Conflict Resolution",
      "Dialogue Facilitation",
    ],
  },
  4: {
    name: "SACSI",
    fullName: "Student Affairs and Community Service Involvement",
    description: "Manages student community service and volunteer programs",
    primaryColor: "#7b1fa2",
    focusAreas: [
      "Student Volunteers",
      "Environmental Programs",
      "Community Service",
    ],
  },
  5: {
    name: "ACLG",
    fullName: "Ateneo Center for Leadership and Governance",
    description: "Develops leadership and governance capabilities",
    primaryColor: "#c62828",
    focusAreas: ["Leadership Training", "Governance", "Civic Education"],
  },
  6: {
    name: "ACCA",
    fullName: "Ateneo Center for Culture and Arts",
    description: "Promotes cultural preservation and arts education",
    primaryColor: "#6a1b9a",
    focusAreas: ["Cultural Heritage", "Arts Education", "Community Arts"],
  },
};

// Database table column definitions for CRUD operations
export const PROGRAMS_TABLE_COLUMNS = {
  // Display columns (what users see)
  display: [
    { key: "title", label: "Program Title", type: "text", required: true },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      required: false,
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: PROGRAM_STATUS_OPTIONS,
      required: true,
    },
    {
      key: "sustainable_development_goals",
      label: "SDG Goals",
      type: "multiselect",
      options: SUSTAINABLE_DEVELOPMENT_GOALS,
      required: false,
    },
    {
      key: "adzu_goals",
      label: "ADZU Goals",
      type: "multiselect",
      options: ADZU_GOALS,
      required: false,
    },
    {
      key: "funding_source",
      label: "Funding Source",
      type: "select",
      options: FUNDING_SOURCES,
      required: false,
    },
    {
      key: "program_heads",
      label: "Program Heads",
      type: "text_array",
      required: false,
    },
    {
      key: "proposed_date",
      label: "Proposed Date",
      type: "date",
      required: false,
    },
    {
      key: "actual_start_date",
      label: "Actual Start Date",
      type: "date",
      required: false,
    },
    {
      key: "start_date",
      label: "Planned Start Date",
      type: "date",
      required: false,
    },
    { key: "end_date", label: "End Date", type: "date", required: false },
    {
      key: "target_beneficiaries",
      label: "Target Beneficiaries",
      type: "number",
      required: false,
    },
    {
      key: "actual_beneficiaries",
      label: "Actual Beneficiaries",
      type: "number",
      required: false,
    },
    {
      key: "participants_count",
      label: "Participants Count",
      type: "number",
      required: false,
    },
  ],

  // Editable columns (what can be modified)
  editable: [
    "title",
    "description",
    "status",
    "sustainable_development_goals",
    "adzu_goals",
    "funding_source",
    "program_heads",
    "proposed_date",
    "actual_start_date",
    "start_date",
    "end_date",
    "target_beneficiaries",
    "actual_beneficiaries",
    "participants_count",
  ],

  // Required columns for creation
  required: ["title", "status"],

  // Read-only columns (system managed)
  readonly: ["id", "office_id", "created_by", "created_at", "updated_at"],
};
