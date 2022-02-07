import { Box, Flex, Heading, Spinner, Switch } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { codeDb } from "../../databases/code";
import CodeCard from "./CodeCard";

export default function QrCodeList() {
  const [hideClaimed, setHideClaimed] = useState(false);

  const qrCodes = useLiveQuery(() =>
    codeDb.codes.orderBy("createdAtInSeconds").reverse().toArray()
  );

  if (qrCodes === undefined) {
    return <Spinner></Spinner>;
  }

  return (
    <Flex flexDir={"column"} ml={4}>
      <Flex flexDir={"row"} alignItems={"center"} mt={2}>
        <Heading size="sm">Hide Claimed</Heading>
        <Switch
          isChecked={hideClaimed}
          onChange={() => setHideClaimed(!hideClaimed)}
          ml={2}
        ></Switch>
      </Flex>

      {qrCodes.map((qrCode) => (
        <CodeCard
          key={qrCode.id}
          hideClaimed={hideClaimed}
          qrCode={qrCode}
          showCopyLinkButton={true}
        ></CodeCard>
      ))}
    </Flex>
  );
}
