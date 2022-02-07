import { Flex, Heading, Spinner } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { contractDb } from "../../databases/contracts";

export default function FormList() {
  const contracts = useLiveQuery(() =>
    contractDb.contracts.orderBy("createdAtInSeconds").toArray()
  );

  if (contracts === undefined) {
    return <Spinner size={"sm"}></Spinner>;
  }

  return (
    <Flex flexDir={"column"}>
      <Heading mt={2} size={"sm"}>
        All contracts
      </Heading>
    </Flex>
  );
}
