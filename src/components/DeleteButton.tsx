import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

export default function DeleteButton(options: {
  deleteFunction: () => Promise<void>;
  title?: "";
}) {
  const toast = useToast();

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteItem = async () => {
    setIsDeleting(true);

    try {
      await options.deleteFunction();
    } catch (err: any) {
      toast({
        title: "Failed to delete",
        description: err.message,
        status: "error",
      });
    }

    setIsDeleting(false);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="unstyled" colorScheme="red" isLoading={isDeleting}>
          <FaTrashAlt color="red" />
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>{options.title || "Are you sure?"}</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Button colorScheme="red" onClick={deleteItem}>
              Delete
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
