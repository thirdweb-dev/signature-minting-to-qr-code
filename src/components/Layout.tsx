import { Box, Flex, useColorMode } from "@chakra-ui/react";
import NavBar from "./NavBar";

const Layout: React.FC = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex flexDir={"column"} padding={6} maxW={"1200px"} margin="auto">
      <Flex flexDir={"row"}>
        <Box flexGrow={1} mr={2} alignSelf={"flex-end"}>
          {/* <ConnectWallet disableNetworkSwitching={true}></ConnectWallet> */}
        </Box>
      </Flex>

      <NavBar />
      {children}
    </Flex>
  );
};

export default Layout;
