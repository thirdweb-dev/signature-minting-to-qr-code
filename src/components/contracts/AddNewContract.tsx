import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { contractDb } from "../../databases/contracts";
import useSdk from "../../hooks/useSdk";
import { AllChains, SupportedChainIdToLabelMap } from "../../utils/network";

export default function AddNewContract() {
  const [searchParams] = useSearchParams();

  const [address, setAddress] = useState<string>(
    searchParams.get("address") || ""
  );
  const [label, setLabel] = useState<string>(searchParams.get("label") || "");
  const [chainId, setChainId] = useState<number>(
    parseInt(searchParams.get("chainId") || "1", 10)
  );

  const [hasTested, setHasTested] = useState(false);
  const [testing, setTesting] = useState(false);

  const [saving, setSaving] = useState(false);

  const toast = useToast();

  const sdk = useSdk({
    chainId,
  });

  useEffect(() => {
    window.history.replaceState(
      null,
      "Add New Contract",
      `/contracts/new/?address=${address}&label=${label}&chainId=${chainId}`
    );
  }, [address, label, chainId]);

  const testConnection = useCallback(async () => {
    const module = sdk.getNFTModule(address);
    console.log("testing contract");
    try {
      await module.readOnlyContract.nextTokenIdToMint();
    } catch (err: any) {
      console.error(err);
      toast({
        status: "error",
        title:
          "Failed to connect to contract, please check the address and chain",
        description: err.message,
        position: "bottom-right",
      });
      return;
    }

    toast({
      status: "success",
      title: "Connection established!",
      description: "The connection to the contract was successful.",
    });
    setHasTested(true);
  }, [address, sdk, toast]);

  const save = useCallback(async () => {
    const result = await contractDb.contracts.add({
      address,
      chainId,
      label,
      createdAtInSeconds: Math.floor(Date.now() / 1000),
    });

    console.log("saved contract", result);
  }, [address, label, chainId]);

  return (
    <Flex mt={2} flexDir={"column"}>
      <Heading mb={4} size={"md"}>
        Add New Contract
      </Heading>

      <FormControl mt={2}>
        <FormLabel>Contract Address</FormLabel>
        <Input
          required
          onChange={(ev) => setAddress(ev.target.value)}
          value={address}
        />
      </FormControl>

      <FormControl mt={2}>
        <FormLabel>Custom Label</FormLabel>
        <Input
          required
          onChange={(ev) => setLabel(ev.target.value)}
          value={label}
        />
      </FormControl>

      <FormControl mt={2}>
        <FormLabel>Chain</FormLabel>
        <Select
          onChange={(ev) => setChainId(parseInt(ev.target.value, 10))}
          value={chainId}
        >
          {AllChains.map((key) => (
            <option onSelect={() => setChainId(key)} value={key} key={key}>
              {SupportedChainIdToLabelMap[key]}
            </option>
          ))}
        </Select>
      </FormControl>

      <Text mt={2}>
        In order to save the contract, click <strong>Test Connection</strong>
      </Text>

      <Flex flexDir={"row"}>
        <Button
          mt={2}
          colorScheme={"yellow"}
          mr={2}
          isLoading={testing}
          onClick={async () => {
            setTesting(true);
            try {
              await testConnection();
            } catch (err: any) {
              console.error(err);
              toast({
                status: "error",
                title:
                  "Failed to connect to contract, please check the address and chain",
                description: err.message,
              });
            } finally {
              setTesting(false);
            }
          }}
        >
          Test Connection
        </Button>
        <Button
          isLoading={saving}
          mt={2}
          colorScheme={"green"}
          disabled={!hasTested}
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
