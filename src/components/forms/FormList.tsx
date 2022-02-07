import { Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { ImPencil } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { formDb } from "../../databases/forms";
import DeleteButton from "../DeleteButton";

export default function FormList() {
  const navigate = useNavigate();

  const forms = useLiveQuery(() =>
    formDb.forms.orderBy("createdAtInSeconds").toArray()
  );

  if (forms === undefined) {
    return <Spinner size={"sm"}></Spinner>;
  }

  return (
    <Flex flexDir={"column"}>
      <Heading mt={2} size={"sm"}>
        All forms
      </Heading>

      {forms.map((form) => (
        <Flex
          key={form.id}
          borderColor={"white"}
          flexDir={"column"}
          borderWidth={"1px"}
          m={2}
          p={2}
          borderRadius={"10px"}
        >
          <Flex flexDir={"row"} alignItems={"center"}>
            <Flex flexDir={"column"} flexGrow={1}>
              <Text>{form.name}</Text>
            </Flex>

            <Flex flexDir={"row"} alignItems={"flex-end"}>
              <Button
                variant={"unstyled"}
                onClick={() => {
                  navigate(
                    `/forms/edit/?id=${form.id}&fields=${JSON.stringify(
                      form.fields
                    )}&name=${form.name}`
                  );
                }}
              >
                <ImPencil />
              </Button>

              <DeleteButton
                title=""
                deleteFunction={async () => {
                  await formDb.forms.delete(form.id as number);
                }}
              />
            </Flex>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
}
