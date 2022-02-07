import { useSwitchNetwork, useWeb3 } from "@3rdweb/hooks";
import { useToast } from "@3rdweb/react/node_modules/@chakra-ui/toast";
import { Text, Box, Flex, Heading, Button } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CodeCard from "../components/qrCodes/CodeCard";
import useClaimStatus from "../hooks/useClaimStatus";
import useSdk from "../hooks/useSdk";
import { Code } from "../interfaces/code";

export default function ClaimCode() {
  const [searchParams] = useSearchParams();

  const sig = searchParams.get("sig");
  const decodedSig = atob(sig as string);
  const code: Code = JSON.parse(decodedSig);
  const payload = JSON.parse(code.payload as string);

  const { provider, chainId, connectWallet, address } = useWeb3();
  const { switchNetwork } = useSwitchNetwork();

  const [claiming, setClaiming] = useState(false);

  const toast = useToast();

  const sdk = useSdk({
    signer: provider?.getSigner(),
    chainId: code?.chainId,
  });

  const module = code?.contractAddress
    ? sdk?.getNFTModule(code?.contractAddress)
    : undefined;

  const isValid = useClaimStatus(code);

  const claim = useCallback(async () => {
    if (code.chainId !== chainId) {
      await switchNetwork(code.chainId as number);
    }

    await module?.mintWithSignature(payload as any, code.signature as string);
  }, [chainId, code.chainId, code.signature, module, payload, switchNetwork]);

  return (
    <Flex mt={2} flexDir={"column"}>
      <Heading size={"lg"}>Claim QR Code</Heading>

      {isValid ? (
        <Button
          mt={2}
          colorScheme={"green"}
          isLoading={claiming}
          onClick={async () => {
            setClaiming(true);
            try {
              await claim();
            } catch (err: any) {
              console.error(err);
              toast({
                title: "Failed to claim",
                status: "error",
                description: err.message,
              });
            } finally {
              setClaiming(false);
            }
          }}
        >
          Claim This NFT
        </Button>
      ) : (
        <>
          <Text>Sorry, this NFT has already been claimed</Text>
          <Button colorScheme={"red"} disabled variant={"solid"}>
            Claim
          </Button>
        </>
      )}

      <Box>
        <CodeCard qrCode={code} showCopyLinkButton={false} />
      </Box>
    </Flex>
  );
}
