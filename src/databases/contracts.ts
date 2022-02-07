import Dexie, { Table } from "dexie";
import Contract from "../interfaces/contract";

export class ContractDatabase extends Dexie {
  public contracts!: Table<Contract, number>;

  public constructor() {
    super("ContractDatabase");
    this.version(1).stores({
      contracts: "++id, chainId, address, label, createdAtInSeconds",
    });
  }
}

export const contractDb = new ContractDatabase();
