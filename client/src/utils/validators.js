// email validation
export const validateEmail = (email) => {
  if (!email) {
    return "Email is required!";
  } else if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    return "Email is invalid!";
  } else {
    return "";
  }
};

// name validation
export const validateName = (name) => {
  if (!name) {
    return "Name is required!";
  } else {
    return "";
  }
};

// password validation
export const validatePassword = (password) => {
  if (!password) {
    return "Password is required!";
  } else if (password.length < 8) {
    return "Password must be at least 8 charecters long!";
  } else {
    return "";
  }
};
