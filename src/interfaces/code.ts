export interface Code {
  id?: number;
  createdAtInSeconds?: number;

  signature?: string;
  payload?: string;

  contractAddress?: string;
  chainId?: number;

  restricted?: boolean;
  restrictedTo?: string;

  price?: string;
  currencyAddress?: string;

  claimEndTimeInSeconds?: number;

  metadata: any;
}
