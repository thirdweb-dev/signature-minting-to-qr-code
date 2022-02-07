import Dexie, { Table } from "dexie";
import { Code } from "../interfaces/code";

export class CodeDatabase extends Dexie {
  public codes!: Table<Code, number>;

  public constructor() {
    super("CodeDatabase");
    this.version(1).stores({
      codes:
        "++id, name, createdAtInSeconds, contractAddress, chainId, restricted, restrictedTo, currencyAddress",
    });
  }
}

export const codeDb = new CodeDatabase();
