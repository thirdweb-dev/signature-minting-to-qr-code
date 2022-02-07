import { useSwitchNetwork, useWeb3 } from "@3rdweb/hooks";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  Switch,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { FcInfo as InfoIcon } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { codeDb } from "../../databases/code";
import { contractDb } from "../../databases/contracts";
import { formDb } from "../../databases/forms";
import useMinterAddresses from "../../hooks/useMinterAddresses";
import useSdk from "../../hooks/useSdk";
import { Code } from "../../interfaces/code";
import Contract from "../../interfaces/contract";
import { Form } from "../../interfaces/form";

export default function AddNewQrCode() {
  const forms = useLiveQuery(() =>
    formDb.forms.orderBy("createdAtInSeconds").toArray()
  );
  const contracts = useLiveQuery(() =>
    contractDb.contracts.orderBy("createdAtInSeconds").toArray()
  );

  const [formValues, setFormValues] = useState<any>();
  const [selectedForm, setSelectedForm] = useState<Form | undefined>(undefined);
  const [selectedContract, setSelectedContract] = useState<
    Contract | undefined
  >(undefined);

  const { provider, address, chainId, connectWallet } = useWeb3();
  const { switchNetwork } = useSwitchNetwork();

  const sdk = useSdk({
    signer: provider?.getSigner(),
    chainId: selectedContract?.chainId,
  });

  const toast = useToast();
  const navigate = useNavigate();

  const module = selectedContract?.address
    ? sdk?.getNFTModule(selectedContract?.address)
    : undefined;

  const minterAddresses = useMinterAddresses(module);

  const [saving, setSaving] = useState(false);

  const [restricted, setRestricted] = useState(false);
  const [restrictedTo, setRestrictedTo] = useState<string>("");

  const generateQrCode = useCallback(async () => {
    if (module === undefined) {
      return;
    }

    if (provider === undefined) {
      await connectWallet("injected");
    }

    if (chainId !== selectedContract?.chainId) {
      await switchNetwork(selectedContract?.chainId as number);
    }

    const mintEndTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
    const { payload, signature } = await module.generateSignature({
      metadata: {
        ...formValues,
      },
      price: 0,
      currencyAddress: ethers.constants.AddressZero,
      mintStartTimeEpochSeconds: Math.floor(Date.now() / 1000) - 60,
      mintEndTimeEpochSeconds: mintEndTime,
      to: restricted
        ? restrictedTo
        : "0x0000000000000000000000000000000000000000",
    });

    const code: Code = {
      metadata: formValues,
      chainId: selectedContract?.chainId,
      claimEndTimeInSeconds: mintEndTime,
      contractAddress: selectedContract?.address,
      createdAtInSeconds: Math.floor(Date.now() / 1000),
      currencyAddress: ethers.constants.AddressZero,
      payload: JSON.stringify(payload),
      price: "0",
      restricted,
      restrictedTo,
      signature,
    };

    await codeDb.codes.add(code);
    toast({
      title: "QR Code Generated",
      status: "success",
    });

    navigate(`/qr-codes/${code.id}`);
  }, [
    chainId,
    connectWallet,
    formValues,
    module,
    navigate,
    provider,
    restricted,
    restrictedTo,
    selectedContract?.address,
    selectedContract?.chainId,
    switchNetwork,
    toast,
  ]);

  if (forms === undefined || contracts === undefined) {
    return <Spinner size={"sm"}></Spinner>;
  }

  //   const generateQrCode = useCallback(async () => {}, []);

  return (
    <Flex mt={2} flexDir={"column"}>
      <Heading mb={4} size={"md"}>
        Create a new QR Code
      </Heading>

      <Text mb={2}>
        Use this page to create a new QR Code based on a specific set of fields
        from a form, and generate it using a specific contract.
      </Text>

      <FormControl mt={2}>
        <FormLabel>Select a form</FormLabel>
        <Select
          defaultValue={-1}
          onChange={(ev) => {
            const id = parseInt(ev.target.value, 10);
            if (id === -1) {
              setSelectedForm(undefined);
              return;
            }
            setSelectedForm(forms.find((f) => f.id === id));
          }}
        >
          <option value={-1}>---</option>
          {forms?.map((f, i) => (
            <option value={f.id} key={i}>
              {f.name}
            </option>
          ))}
        </Select>
      </FormControl>

      {selectedForm !== undefined && (
        <Box mt={2}>
          <Box my={2}>
            <hr />
          </Box>

          {selectedForm.fields?.map((field, i) => (
            <Input
              my={1}
              key={i}
              placeholder={field.label}
              onChange={(ev) => {
                setFormValues((old: any) => {
                  const value = ev.target.value;
                  const key = field.label.split(" ").join("_").toLowerCase();
                  return {
                    ...old,
                    [key]: value,
                  };
                });
              }}
            />
          ))}
        </Box>
      )}

      <FormControl mt={2}>
        <FormLabel>Select a contract the QR should mint to</FormLabel>
        <Select
          defaultValue={-1}
          onChange={(ev) => {
            const id = parseInt(ev.target.value, 10);
            if (id === -1) {
              setSelectedContract(undefined);
              return;
            }
            setSelectedContract(contracts.find((f) => f.id === id));
          }}
        >
          <option value={-1}>---</option>
          {contracts?.map((f, i) => (
            <option value={f.id} key={i}>
              {f.label} - {f.address}
            </option>
          ))}
        </Select>
      </FormControl>

      {minterAddresses !== undefined && (
        <>
          <Heading size="md" mt={2} mb={2}>
            Wallets that can mint
          </Heading>
          <Text>Be sure to use one of the wallets listed below</Text>
        </>
      )}

      {minterAddresses?.map((a) => (
        <li key={a}>{a}</li>
      ))}

      {(selectedContract === undefined || selectedForm === undefined) && (
        <Text mt={2} color={"red.500"}>
          <blockquote>
            Select a form and contract in order to generate a QR Code
          </blockquote>
        </Text>
      )}

      <FormControl mt={2}>
        <FormLabel alignItems={"center"}>
          Restrict to specific wallet{" "}
          <Tooltip label="Only the address you specify will be allowed to redeem the QR code">
            <span>
              <InfoIcon
                style={{
                  display: "inline",
                }}
              />
            </span>
          </Tooltip>
        </FormLabel>

        <HStack>
          <Switch
            onChange={(ev) => setRestricted(!restricted)}
            isChecked={restricted}
          ></Switch>

          {restricted && (
            <Input
              value={restrictedTo}
              onChange={(ev) => setRestrictedTo(ev.target.value)}
              placeholder="Address that will be allowed to mint this QR code"
            />
          )}
        </HStack>
      </FormControl>

      <Flex flexDir={"row"} mt={2}>
        <Button
          mt={2}
          disabled={
            selectedForm === undefined || selectedContract === undefined
          }
          colorScheme={"green"}
          isLoading={saving}
          onClick={async () => {
            setSaving(true);
            try {
              await generateQrCode();
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
          Generate QR Code
        </Button>
      </Flex>
    </Flex>
  );
}
