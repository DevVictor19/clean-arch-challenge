import { BaseEntity, BaseEntityProps } from "../@shared/abstractions/entity";

export type ClientProps = BaseEntityProps & {
  name: string;
  email: string;
  phone: string;
};

export class Client extends BaseEntity {
  name: string;
  email: string;
  phone: string;

  constructor({ email, name, phone, ...base }: ClientProps) {
    super(base);
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}
