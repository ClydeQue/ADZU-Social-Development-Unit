const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "production"
    ? "/api"
    : "http://localhost:3001/api");

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ...options,
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

export const authService = {
  login: async (credentials) => {
    return await apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
    });
  },

  logout: async () => {
    return await apiRequest("/auth/logout", {
      method: "POST",
    });
  },

  verifyToken: async () => {
    return await apiRequest("/auth/verify");
  },
};

export const officeService = {
  getAllOffices: async () => {
    return await apiRequest("/office/all");
  },

  getOfficeDashboard: async (officeId) => {
    return await apiRequest(`/office/${officeId}/dashboard`);
  },
};

export const unitDirectorService = {
  getDashboard: async () => {
    return await apiRequest("/unit-director/dashboard");
  },

  getReports: async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (year) params.append("year", year);

    const queryString = params.toString();
    const endpoint = `/unit-director/reports${
      queryString ? `?${queryString}` : ""
    }`;

    return await apiRequest(endpoint);
  },
};

export const programService = {
  create: async (programData) => {
    return await apiRequest("/program", {
      method: "POST",
      body: programData,
    });
  },

  update: async (id, programData) => {
    return await apiRequest(`/program/${id}`, {
      method: "PUT",
      body: programData,
    });
  },

  delete: async (id) => {
    return await apiRequest(`/program/${id}`, {
      method: "DELETE",
    });
  },
};
