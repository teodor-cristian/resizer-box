import { isValueInPixels } from "../utils.mjs";

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
});
