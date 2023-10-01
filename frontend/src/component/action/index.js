export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const ADD_USER = "ADD_USER";

export const signupSuccess = (user) => {
  return {
    type: SIGNUP_SUCCESS,
    payload: user,
  };
};

export const addUser = (user) => ({
  type: ADD_USER,
  payload: user,
});
