import { ThirdwebSDK } from "@3rdweb/sdk";
import { Signer } from "ethers";
import { alchemyUrlMap } from "../utils/network";
import { SupportedChainId } from "./../utils/network";

export default function useSdk(options: {
  chainId?: SupportedChainId;
  signer?: Signer;
}) {
  if (!options.signer && !options.chainId) {
    throw new Error("useSdk: Either signer or chainId must be provided");
  }

  if (options.signer) {
    return new ThirdwebSDK(options.signer);
  }

  if (options.chainId) {
    const rpcUrl = alchemyUrlMap[options.chainId];
    return new ThirdwebSDK(rpcUrl);
  }

  throw new Error("useSdk: Neither signer nor chainId provided");
}
