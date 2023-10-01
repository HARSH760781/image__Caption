export const setAuthToken = (token) => {
  // Store the token in localStorage
  localStorage.setItem("authToken", token);
};

export const getAuthToken = () => {
  // Retrieve the token from localStorage
  return localStorage.getItem("authToken");
};

export const removeAuthToken = () => {
  // Remove the token from localStorage
  localStorage.removeItem("authToken");
};
