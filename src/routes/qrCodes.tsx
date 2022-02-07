import { Flex, Heading } from "@chakra-ui/react";
import { FcPlus as AddButton } from "react-icons/fc";
import { Link, Outlet } from "react-router-dom";

export default function QrCodesPages() {
  return (
    <Flex flexDir={"column"}>
      <Flex flexDir={"row"} alignItems={"center"}>
        <Heading mr={2} size={"xl"}>
          QR Codes
        </Heading>
        <Link to="/qr-codes/new" color="white">
          <AddButton fontSize={"1.5rem"} />
        </Link>
      </Flex>
      <Outlet />
    </Flex>
  );
}
