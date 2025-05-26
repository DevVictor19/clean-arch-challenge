// no mundo ideal era melhor isolar dependências externas do domínio (zod)
// mas vai ficar muito complexo...
import { z } from "zod";

import {
  BaseEntity,
  BaseEntityProps,
  ValidateError,
} from "../@shared/abstractions/entity";

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

  validate(): ValidateError {
    const schema = z.object({
      _id: z.string().uuid(),
      name: z
        .string()
        .min(1, "Nome é obrigatório")
        .max(55, "Nome deve ter no máximo 55 dígitos")
        .trim(),
      email: z.string().email("Email inválido").trim(),
      phone: z
        .string()
        .min(10, "O telefone deve ter no mínimo 10 dígitos")
        .trim()
        .max(15, "O telefone deve ter no máximo 15 dígitos")
        .trim(),
      created_at: z.date(),
      updated_at: z.date(),
    });

    const result = schema.safeParse({
      _id: this._id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      created_at: this.created_at,
      updated_at: this.updated_at,
    });

    if (result.success) {
      return { valid: true };
    }

    const errors: Record<string, string> = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      errors[field] = issue.message;
    }

    return {
      valid: false,
      errors,
    };
  }
}
