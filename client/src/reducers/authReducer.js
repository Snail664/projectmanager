import { SIGN_IN } from "../actions/types";

const initialState = {
  isSignedIn: null,
  userId: null,
  userName: null,
  userEmail: null,
};

// reducer to store user info upon sign in
// payload must contain user_id, user_name, user_email

export default function (state = initialState, action) {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true, ...action.payload };
    default:
      return state;
  }
}
