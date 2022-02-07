import { Box, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Flex
      flexDir={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      padding={6}
    >
      <Box mx={2}>
        <Link to="/contracts">Contracts</Link>
      </Box>

      <Box mx={2}>
        <Link to="/forms">Forms</Link>
      </Box>
    </Flex>
  );
}
