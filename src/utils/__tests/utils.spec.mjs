import { isValueInPixels, clamp } from "../utils.mjs";

describe("utils", () => {
  describe("isValueInPixels", () => {
    it("works as expected for valid values", () => {
      ["10px", "15px"].forEach((val) => {
        expect(isValueInPixels(val)).toBe(true);
      });
    });

    it("works as expected for invalid values", () => {
      ["10", "", "100em", "50%"].forEach((val) => {
        expect(isValueInPixels(val)).toBe(false);
      });
    });
  });

  describe("clamp", () => {
    it("works as expected for default value within bounds", () => {
      const val = 200;
      const min = 100;
      const max = 500;

      expect(clamp(val, min, max)).toBe(val);
    });

    it("works as expected for value exceeding max", () => {
      const val = 600;
      const min = 100;
      const max = 500;

      expect(clamp(val, min, max)).toBe(max);
    });

    it("works as expected for value below min", () => {
      const val = 20;
      const min = 100;
      const max = 500;

      expect(clamp(val, min, max)).toBe(min);
    });

    it("ignores min constraint when min is null", () => {
      const val = 20;
      const min = null;
      const max = 500;

      expect(clamp(val, min, max)).toBe(val);
    });

    it("ignores max constraint when max is null", () => {
      const val = 600;
      const min = 100;
      const max = null;

      expect(clamp(val, min, max)).toBe(val);
    });

    it("allows min to be 0 and enforces it", () => {
      const val = 20;
      const min = 0;
      const max = 500;

      expect(clamp(val, min, max)).toBe(val);
    });

    it("allows min to be 0 when value is above min", () => {
      const val = 100;
      const min = 0;
      const max = 500;

      expect(clamp(val, min, max)).toBe(val);
    });

    it("respects both null max and min of 0", () => {
      const val = 500;
      const min = 0;
      const max = null;

      expect(clamp(val, min, max)).toBe(val);
    });
  });
});
