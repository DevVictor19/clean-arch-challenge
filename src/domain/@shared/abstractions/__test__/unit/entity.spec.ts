import { describe, it, expect } from "vitest";
import { BaseEntity, ValidateError } from "../../entity";

class TestEntity extends BaseEntity {
  validate(): ValidateError {
    return { valid: true };
  }
}

describe("BaseEntity", () => {
  it("should assign a random UUID if _id is not provided", () => {
    const entity = new TestEntity({});
    expect(entity._id).toBeDefined();
    expect(entity._id).toHaveLength(36); // UUID v4 has 36 characters
  });

  it("should use provided _id if available", () => {
    const customId = "custom-id";
    const entity = new TestEntity({ _id: customId });
    expect(entity._id).toBe(customId);
  });

  it("should set created_at and updated_at to current date if not provided", () => {
    const before = new Date();
    const entity = new TestEntity({});
    const after = new Date();

    expect(entity.created_at.getTime()).toBeGreaterThanOrEqual(
      before.getTime()
    );
    expect(entity.created_at.getTime()).toBeLessThanOrEqual(after.getTime());

    expect(entity.updated_at.getTime()).toBeGreaterThanOrEqual(
      before.getTime()
    );
    expect(entity.updated_at.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it("should use provided created_at and updated_at if available", () => {
    const customDate = new Date("2022-01-01T00:00:00Z");
    const entity = new TestEntity({
      created_at: customDate,
      updated_at: customDate,
    });

    expect(entity.created_at).toBe(customDate);
    expect(entity.updated_at).toBe(customDate);
  });

  it("should return valid=true when calling validate in TestEntity", () => {
    const entity = new TestEntity({});
    const result = entity.validate();
    expect(result.valid).toBe(true);
  });
});
