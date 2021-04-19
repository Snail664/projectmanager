import React, { useEffect, useState } from "react";
import { Flex, Box, Button, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ControlledInput from "./helpers/ControlledInput";
import axios from "axios";
import "./main.css";
import { useHistory } from "react-router-dom";
import { validateEmail } from "../utils/validators";

const Login = (props) => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "Email is invalid!",
    password: "Password is required!",
  });
  const [submitClicked, setSubmitClicked] = useState(false);

  const validateForm = () => {
    const errEmail = validateEmail(email);
    var errPassword = password.length == 0 ? "Password is required!" : "";

    console.log("from validate: ", errPassword);
    const newErrors = { email: errEmail, password: errPassword };
    setErrors(newErrors);
  };

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // make sure that all Input fields are considered "touched"
    // in case somebody clicked submit without touching any fields
    setSubmitClicked(true);
    // if there are any errors return early and dont submit data
    if (errors.email.length + errors.password.length !== 0) {
      return;
    }

    // submit data to backend

    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        props.setIsSignedIn(true);
        history.push("/");
      }
    } catch (error) {
      if (error.request.status === 401) {
        setErrors({
          password: error.request.response,
          email: error.request.response,
        });
      }
    }
  };

  // render component
  return (
    <Flex
      className="main_box"
      justifyContent="center"
      alignItems="center"
      w="100vw"
      h="100vh"
    >
      <Box bg="whitesmoke" padding="20px" borderRadius="10px" w="50%">
        <Heading mb="30px" textAlign="center">
          Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <ControlledInput
            submitClicked={submitClicked}
            label="Email Address"
            type="email"
            value={email}
            setValue={setEmail}
            error={errors.email}
          />
          <ControlledInput
            submitClicked={submitClicked}
            label="Password"
            type="password"
            value={password}
            setValue={setPassword}
            error={errors.password}
          />
          <Button bg="green.500" type="submit">
            Submit
          </Button>
        </form>
        <Box textAlign="end" mt="3">
          <Text fontSize="lg" color="gray.500">
            Don't have an account?{" "}
            <Link to="/register">
              <Text as="span" color="blue.500" _hover={{ color: "blue.100" }}>
                Sign up!
              </Text>
            </Link>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
