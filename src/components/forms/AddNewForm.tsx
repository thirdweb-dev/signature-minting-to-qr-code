import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useCallbackRef,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formDb } from "../../databases/forms";
import { Field } from "../../interfaces/field";
import { BsFillTrashFill } from "react-icons/bs";

export default function AddNewForm() {
  const [searchParams] = useSearchParams();

  const isEditingId = searchParams.get("id");

  const [fields, setFields] = useState<Field[]>(
    JSON.parse(searchParams.get("fields") || "[]")
  );
  const [formName, setFormName] = useState<string>(
    searchParams.get("name") || ""
  );

  const [saving, setSaving] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const save = useCallbackRef(async () => {
    if (fields.some((f) => f.label === "")) {
      toast({
        title: "Fields cannot be empty",
        description: "Please fill in all fields",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const uniqueFields = Array.from(new Set(fields.map((f) => f.label)));

    if (isEditingId) {
      await formDb.forms.update(parseInt(isEditingId, 10), {
        fields: uniqueFields.map((f) => ({ label: f })),
        name: formName,
        createdAtInSeconds: Math.floor(Date.now() / 1000),
      });
    } else {
      await formDb.forms.add({
        fields: uniqueFields.map((f) => ({ label: f })),
        name: formName,
        createdAtInSeconds: Math.floor(Date.now() / 1000),
      });
    }
    navigate("/forms");
  }, [fields, formName, isEditingId]);

  useEffect(() => {
    const serializedFields = JSON.stringify(fields);
    console.log(serializedFields);

    window.history.replaceState(
      null,
      "Add New Contract",
      `/forms/new/?name=${formName}&fields=${serializedFields}${
        isEditingId ? "&id=" + isEditingId : ""
      }`
    );
  }, [fields, formName, isEditingId]);

  return (
    <Flex mt={2} flexDir={"column"}>
      <Heading mb={4} size={"md"}>
        Add New Form
      </Heading>

      <Text mb={2}>
        Use this page to build a form that can be used to populate the data that
        will be included in the minted NFTs.
      </Text>

      <FormControl mt={2} mb={2}>
        <FormLabel>Form Name</FormLabel>
        <Input
          required
          onChange={(ev) => setFormName(ev.target.value)}
          value={formName}
        />
      </FormControl>

      {fields.length === 0 && (
        <Box
          borderColor={"white"}
          borderWidth={"1px"}
          m={4}
          p={4}
          borderRadius={"10px"}
        >
          <Text>No fields have been added yet.</Text>
        </Box>
      )}

      {fields.length > 0 && (
        <Box my={2}>
          <hr />

          <Heading mt={2} size={"sm"}>
            Form Fields
          </Heading>
        </Box>
      )}

      {fields.map((field, i) => (
        <Flex key={i} flexDir={"row"}>
          <FormControl mt={2}>
            <Flex flexDir={"row"} alignItems={"center"}>
              <Input
                placeholder="Field name"
                required
                value={field.label}
                onChange={(ev) => {
                  setFields((old) => {
                    const newFields = [...old];
                    newFields[i].label = ev.target.value;
                    return newFields;
                  });
                }}
              />
              <Button
                ml={2}
                variant={"unstyled"}
                color={"red"}
                onClick={() => {
                  setFields((old) => {
                    const newFields = old.slice(0, i).concat(old.slice(i + 1));
                    return newFields;
                  });
                }}
              >
                <BsFillTrashFill />
              </Button>
              {/* <Text ml={2}>Required?</Text>
              <Switch ml={2}></Switch> */}
            </Flex>
          </FormControl>
        </Flex>
      ))}

      <Flex flexDir={"row"} mt={2}>
        <Button
          mt={2}
          colorScheme={"yellow"}
          mr={2}
          onClick={() => {
            setFields([...fields, { label: "" }]);
          }}
        >
          Add Field
        </Button>
        <Button
          mt={2}
          colorScheme={"green"}
          isLoading={saving}
          onClick={async () => {
            setSaving(true);
            try {
              await save();
            } catch (err: any) {
              console.error(err);
              toast({
                status: "error",
                title: "Failed to save the contract",
                description: err.message,
              });
            } finally {
              setSaving(false);
            }
          }}
        >
          Save
        </Button>
      </Flex>
    </Flex>
  );
}
