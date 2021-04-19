import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Button,
  Heading,
  Switch,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ControlledInput from "./helpers/ControlledInput";
import axios from "axios";
import "./main.css";
import { useHistory } from "react-router-dom";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../utils/validators";

const Register = (props) => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sampleData, setSampleData] = useState(true);
  const [errors, setErrors] = useState({
    name: "Name is required!",
    email: "Email is invalid!",
    password: "Password is required!",
  });
  const [submitClicked, setSubmitClicked] = useState(false);

  const validateForm = () => {
    const errEmail = validateEmail(email);
    const errName = validateName(name);
    const errPassword = validatePassword(password);

    const newErrors = { name: errName, email: errEmail, password: errPassword };
    setErrors(newErrors);
  };

  useEffect(() => {
    validateForm();
  }, [name, email, password]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // make sure that all Input fields are considered "touched"
    // in case somebody clicked submit without touching any fields
    setSubmitClicked(true);

    console.log("From the function: ", errors.name);
    // if there are any errors return early and dont submit data
    if (
      errors.name.length + errors.email.length + errors.password.length !==
      0
    ) {
      console.log("IF RUNNING");
      return;
    }

    // submit data to backend

    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        if (sampleData) {
          const sampleDataRes = await axios.post(
            "/dashboard",
            {},
            {
              headers: {
                token: localStorage.getItem("token"),
              },
            }
          );
        }
        props.setIsSignedIn(true);
        history.push("/");
      }
    } catch (error) {
      if (error.request.status === 401) {
        setErrors({ ...errors, email: error.request.response });
        return;
      }
      alert(error.message);
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
          Register
        </Heading>
        <form onSubmit={handleSubmit}>
          <ControlledInput
            submitClicked={submitClicked}
            label="Email Address"
            type="email"
            value={email}
            setValue={setEmail}
            error={errors.email}
            formHelperText="We'll never share your email"
          />
          <ControlledInput
            submitClicked={submitClicked}
            label="Name"
            type="text"
            value={name}
            setValue={setName}
            error={errors.name}
            formHelperText="What shall we call you"
          />
          <ControlledInput
            submitClicked={submitClicked}
            label="Password"
            type="password"
            value={password}
            setValue={setPassword}
            error={errors.password}
            formHelperText="Use something secure"
          />
          <FormControl mb="20px" display="flex" alignItems="center">
            <FormLabel mb="0">Start with Sample data? (Recomended)</FormLabel>
            <Switch
              isChecked={sampleData}
              onChange={() => {
                setSampleData(!sampleData);
              }}
            />
          </FormControl>
          <Button bg="green.500" type="submit">
            Submit
          </Button>
        </form>
        <Box textAlign="end" mt="3">
          <Text fontSize="lg" color="gray.500">
            Already have an account?{" "}
            <Link to="/login">
              <Text as="span" color="blue.500" _hover={{ color: "blue.100" }}>
                Login
              </Text>
            </Link>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Register;
