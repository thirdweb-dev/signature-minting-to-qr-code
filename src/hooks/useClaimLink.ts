import { Code } from "../interfaces/code";

export default function useClaimLink(claim?: Code) {
  if (!claim) {
    return "";
  }

  const str = JSON.stringify(claim);
  const base64 = Buffer.from(str).toString("base64");

  return `${window.location.origin}/claim?sig=${base64}`;
}
