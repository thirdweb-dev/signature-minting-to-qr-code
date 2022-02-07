import { Field } from "./field";
export interface Form {
  id?: number;
  name?: string;
  fields?: Field[];
  createdAtInSeconds?: number;
}
