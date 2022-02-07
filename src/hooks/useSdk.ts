import { ThirdwebSDK } from "@3rdweb/sdk";
import { Signer } from "ethers";
import { alchemyUrlMap } from "../utils/network";
import { SupportedChainId } from "./../utils/network";

export default function useSdk(options: {
  chainId?: SupportedChainId;
  signer?: Signer;
}): ThirdwebSDK | undefined {
  if (!options.signer && !options.chainId) {
    return undefined;
  }

  if (options.signer) {
    return new ThirdwebSDK(options.signer);
  }

  if (options.chainId) {
    const rpcUrl = alchemyUrlMap[options.chainId];
    return new ThirdwebSDK(rpcUrl, {
      readOnlyRpcUrl: rpcUrl,
    });
  }

  return undefined;
}
