// reducers.js

import { SIGNUP_SUCCESS, ADD_USER } from "../action";

const initialState = {
  user: null,
  signupSuccessful: false,
  userList: [], // Array to hold registered users
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_SUCCESS:
      return {
        ...state,
        user: action.payload,
        signupSuccessful: true,
      };
    case ADD_USER:
      return {
        ...state,
        userList: [...state.userList, action.payload],
      };
    default:
      return state;
  }
};

export default rootReducer;
