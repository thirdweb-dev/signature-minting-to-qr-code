import { Box, Spinner } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router-dom";
import CodeCard from "../../components/qrCodes/CodeCard";
import { codeDb } from "../../databases/code";

export default function ViewCode() {
  const { id } = useParams();
  const qrCode = useLiveQuery(() =>
    codeDb.codes.filter((c) => c.id?.toString() === id).first()
  );

  if (qrCode === undefined) {
    return <Spinner></Spinner>;
  }

  return (
    <Box>
      <CodeCard qrCode={qrCode} showCopyLinkButton={true} />
    </Box>
  );
}
