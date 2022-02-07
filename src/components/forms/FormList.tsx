import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { formDb } from "../../databases/forms";

export default function FormList() {
  const contracts = useLiveQuery(() =>
    formDb.forms.orderBy("createdAtInSeconds").toArray()
  );

  if (contracts === undefined) {
    return <Spinner size={"sm"}></Spinner>;
  }

  return (
    <Flex flexDir={"column"}>
      <Heading mt={2} size={"sm"}>
        All forms
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
          <Flex flexDir={"row"}>
            <Flex flexDir={"column"} flexGrow={1}>
              <Text>{contract.name}</Text>
            </Flex>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}
