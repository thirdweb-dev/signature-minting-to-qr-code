import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useClaimLink from "../../hooks/useClaimLink";
import useClaimStatus from "../../hooks/useClaimStatus";
import { Code } from "../../interfaces/code";
import { secondsToDhms } from "../../utils/durationToCountdown";
import { SupportedChainIdToLabelMap } from "../../utils/network";

export default function CodeCard({ qrCode }: { qrCode: Code }) {
  const claimLink = useClaimLink(qrCode);

  const [qrCodeData, setQrCodeData] = useState<string>("");

  const [timeUntilEnd, setTimeUntilEnd] = useState("");

  const isValid = useClaimStatus(qrCode);

  const navigate = useNavigate();

  useEffect(() => {
    if (qrCodeData !== "") {
      return;
    }

    (async () => {
      const data = await QRCode.toDataURL(claimLink);
      setQrCodeData(data);
      console.log(data);
    })();
  }, [claimLink, qrCodeData]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeUntilEnd(
        secondsToDhms(
          Math.floor(
            (qrCode?.claimEndTimeInSeconds as number) - Date.now() / 1000
          )
        )
      );
    }, 1000);

    return () => {
      clearInterval(id);
    };
  });

  if (qrCode === undefined) {
    return <Spinner></Spinner>;
  }

  const createdAt = new Date((qrCode?.createdAtInSeconds as number) * 1000);

  const newLocal = "QR code image of the mint voucher";
  return (
    <Flex flexDir={"column"} mt={4}>
      <Heading size={"md"} mb={4}>
        Created on {createdAt.toLocaleDateString()} at{" "}
        {createdAt.toLocaleTimeString()}
      </Heading>

      <Flex flexDir={"row"}>
        <Box
          maxW={"450"}
          onClick={() => window.open(claimLink, "_blank")}
          cursor={"pointer"}
        >
          <img src={qrCodeData} alt={newLocal}></img>
        </Box>

        <Box ml={8}>
          <Heading size="md">Chain</Heading>
          <Text mb={2}>
            {SupportedChainIdToLabelMap[qrCode.chainId as number]}
          </Text>

          <Heading size="md">Contract</Heading>
          <Text mb={2}>{qrCode.contractAddress}</Text>

          <Heading size="md">Restricted To</Heading>
          {qrCode.restricted ? (
            <Text mb={2}>{qrCode.restrictedTo}</Text>
          ) : (
            <Text mb={2}>Anyone</Text>
          )}

          <Heading size="md">Metadata</Heading>
          <Text mb={2}>{JSON.stringify(qrCode.metadata)}</Text>

          <Heading size="md">Time Remaining To Claim</Heading>
          {isValid ? <Text mb={2}>{timeUntilEnd}</Text> : <Text>Expired</Text>}
        </Box>
      </Flex>
    </Flex>
  );
}
