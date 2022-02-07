import Dexie, { Table } from "dexie";
import { Form } from "./../interfaces/form";

export class FormDatabase extends Dexie {
  public forms!: Table<Form, number>;

  public constructor() {
    super("FormDatabase");
    this.version(1).stores({
      forms: "++id, name, fields, createdAtInSeconds",
    });
  }
}

export const formDb = new FormDatabase();
