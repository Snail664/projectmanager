import { SIGN_IN } from "./types";

export const signIn = (payload) => {
  return {
    type: SIGN_IN,
    payload,
  };
};
