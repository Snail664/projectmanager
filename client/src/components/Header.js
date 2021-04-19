import { Flex, Box, Button, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const Header = (props) => {
  if (
    window.location.pathname == "/register" ||
    window.location.pathname == "/login"
  ) {
    return <></>;
  }

  const handleLogOut = () => {
    localStorage.removeItem("token");
    props.setIsSignedIn(false);
  };

  const renderButtons = () => {
    if (props.isSignedIn) {
      return (
        <Button colorScheme="facebook" onClick={handleLogOut}>
          Log out
        </Button>
      );
    } else if (!props.isSignedIn) {
      return (
        <>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/register">
            <Button>Sign up</Button>
          </Link>
        </>
      );
    }
  };

  return (
    <Flex
      p="5"
      flexDirection="row"
      justifyContent="space-between"
      bg="gray.800"
      color="white"
    >
      <Text fontSize="2xl">ProjectManager</Text>
      <Flex justifyContent="space-around" w="40vw">
        <Link to="/">
          <Text fontSize="4xl" colorScheme="facebook"></Text>Dashboard
        </Link>
        <Link to="/projects">
          <Text fontSize="4xl" colorScheme="facebook"></Text>My projects
        </Link>
      </Flex>
      <Box>{renderButtons()}</Box>
    </Flex>
  );
};

export default Header;
