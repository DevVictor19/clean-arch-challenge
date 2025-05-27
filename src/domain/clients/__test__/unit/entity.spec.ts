import { describe, it, expect } from "vitest";
import { Client } from "../../entity";

describe("ClientEntity", () => {
  it("should validate a valid client", () => {
    const client = new Client({
      name: "João Silva",
      email: "joao.silva@example.com",
      phone: "12345678901",
    });

    const result = client.validate();
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it("should invalidate client with empty name", () => {
    const client = new Client({
      name: "",
      email: "joao.silva@example.com",
      phone: "12345678901",
    });

    const result = client.validate();
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("name");
    expect(result.errors?.name).toContain("Nome é obrigatório");
  });

  it("should invalidate client with name longer than 55 chars", () => {
    const longName = "a".repeat(56);
    const client = new Client({
      name: longName,
      email: "joao.silva@example.com",
      phone: "12345678901",
    });

    const result = client.validate();
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("name");
    expect(result.errors?.name).toContain("Nome deve ter no máximo 55 dígitos");
  });

  it("should invalidate client with invalid email", () => {
    const client = new Client({
      name: "João Silva",
      email: "invalid-email",
      phone: "12345678901",
    });

    const result = client.validate();
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("email");
    expect(result.errors?.email).toContain("Email inválido");
  });

  it("should invalidate client with phone shorter than 10 digits", () => {
    const client = new Client({
      name: "João Silva",
      email: "joao.silva@example.com",
      phone: "123456789",
    });

    const result = client.validate();
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("phone");
    expect(result.errors?.phone).toContain(
      "O telefone deve ter no mínimo 10 dígitos"
    );
  });

  it("should invalidate client with phone longer than 15 digits", () => {
    const longPhone = "1".repeat(16);
    const client = new Client({
      name: "João Silva",
      email: "joao.silva@example.com",
      phone: longPhone,
    });

    const result = client.validate();
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("phone");
    expect(result.errors?.phone).toContain(
      "O telefone deve ter no máximo 15 dígitos"
    );
  });

  it("should invalidate client with invalid _id", () => {
    const client = new Client({
      name: "João Silva",
      email: "joao.silva@example.com",
      phone: "12345678901",
      _id: "invalid-uuid",
    });

    const result = client.validate();
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("_id");
  });

  it("should invalidate client if created_at or updated_at are invalid", () => {
    const client = new Client({
      name: "João Silva",
      email: "joao.silva@example.com",
      phone: "12345678901",
      created_at: "invalid-date" as any,
      updated_at: "invalid-date" as any,
    });

    const result = client.validate();
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("created_at");
    expect(result.errors).toHaveProperty("updated_at");
  });
});
