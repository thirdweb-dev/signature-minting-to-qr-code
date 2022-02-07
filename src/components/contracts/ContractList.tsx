import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { contractDb } from "../../databases/contracts";
import { SupportedChainIdToLabelMap } from "../../utils/network";

export default function ContractList() {
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

      {contracts.map((contract) => (
        <Flex
          key={contract.id}
          borderColor={"white"}
          flexDir={"column"}
          borderWidth={"1px"}
          m={2}
          p={2}
          borderRadius={"10px"}
        >
          <Text>{contract.label}</Text>

          <Text>Address: {contract.address}</Text>
          <Text>
            Chain: {SupportedChainIdToLabelMap[contract.chainId as number]}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
