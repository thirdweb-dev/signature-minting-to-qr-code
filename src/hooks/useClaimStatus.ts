import { useSwitchNetwork, useWeb3 } from "@3rdweb/hooks";
import { useEffect, useState } from "react";
import { Code } from "../interfaces/code";
import useSdk from "./useSdk";

export default function useClaimStatus(code: Code) {
  const payload = JSON.parse(code.payload as string);

  const { provider } = useWeb3();
  const { switchNetwork } = useSwitchNetwork();

  const [isValid, setIsValid] = useState<boolean | null>(null);

  const sdk = useSdk({
    signer: provider?.getSigner(),
    chainId: code?.chainId,
  });

  const module = code?.contractAddress
    ? sdk?.getNFTModule(code?.contractAddress)
    : undefined;

  useEffect(() => {
    if (isValid !== null || !module) {
      return;
    }

    (async () => {
      const valid = await module.verify(payload, code.signature as string);
      setIsValid(valid);
    })();
  }, [code, isValid, module, payload, switchNetwork]);

  return isValid;
}
