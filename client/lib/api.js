import("whatwg-fetch");

const defaults = {
  credentials: "include"
};

function fetchApi(endpoint, init) {
  return fetch(`/api${endpoint}`, init);
}

export default {
  get(endpoint) {
    return fetchApi(endpoint, {
      method: "GET",
      ...defaults
    });
  },

  post(endpoint, data = {}) {
    return fetchApi(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      ...defaults
    });
  },

  update(endpoint, data = {}) {
    return fetchApi(endpoint, {
      method: "UPDATE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      ...defaults
    });
  },

  delete(endpoint) {
    return fetchApi(endpoint, {
      method: "DELETE",
      ...defaults
    });
  }
};

export class ApiError extends Error {
  constructor(response, data, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.status = response.status;
    this.statusText = response.statusText;
    this.errors = data.errors;
  }
}
