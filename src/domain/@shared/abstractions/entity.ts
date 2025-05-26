import { randomUUID } from "node:crypto";

export type BaseEntityProps = {
  _id?: string;
  updated_at?: Date;
  created_at?: Date;
};

export abstract class BaseEntity {
  _id: string;
  updated_at: Date;
  created_at: Date;

  constructor(props: BaseEntityProps) {
    this._id = props._id ?? randomUUID();
    this.updated_at = props.updated_at ?? new Date();
    this.created_at = props.created_at ?? new Date();
  }
}
