import { Flex, Spinner } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { codeDb } from "../../databases/code";
import CodeCard from "./CodeCard";

export default function QrCodeList() {
  const qrCodes = useLiveQuery(() =>
    codeDb.codes.orderBy("createdAtInSeconds").reverse().toArray()
  );

  if (qrCodes === undefined) {
    return <Spinner></Spinner>;
  }

  return (
    <Flex flexDir={"column"}>
      {qrCodes.map((qrCode) => (
        <CodeCard qrCode={qrCode}></CodeCard>
      ))}
    </Flex>
  );
}
