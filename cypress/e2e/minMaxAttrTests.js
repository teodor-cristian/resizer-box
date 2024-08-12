import { HANDLER_WIDTH } from "./constants/handlerWidth";

export function minMaxAttrTests(url) {
  context("Min/Max width/height attributes", () => {
    beforeEach(() => {
      cy.visit(url);
    });

    it("should not resize width more than max-width attribute", () => {
      const newWidth = 700;
      const maxWidth = 500;
      const handlerWidth = HANDLER_WIDTH;

      cy.get("resizer-box")
        .invoke("attr", "max-width", `${maxWidth}px`)
        .should("have.attr", "max-width", `${maxWidth}px`);

      cy.resizeBox("right", newWidth + handlerWidth);

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("width")
        .should("equal", maxWidth);
    });

    it("should not resize width less than min-width attribute", () => {
      const newWidth = 100;
      const minWidth = 200;
      const handlerWidth = HANDLER_WIDTH;

      cy.get("resizer-box")
        .invoke("attr", "min-width", `${minWidth}px`)
        .should("have.attr", "min-width", `${minWidth}px`);

      cy.resizeBox("right", newWidth + handlerWidth);

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("width")
        .should("equal", minWidth);
    });

    it("should not resize height more than max-height attribute", () => {
      const newHeight = 700;
      const maxHeight = 500;
      const handlerWidth = HANDLER_WIDTH;

      cy.get("resizer-box")
        .invoke("attr", "max-height", `${maxHeight}px`)
        .should("have.attr", "max-height", `${maxHeight}px`);

      cy.resizeBox("bottom", null, newHeight + handlerWidth);

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("height")
        .should("equal", maxHeight);
    });

    it("should not resize height less than min-height attribute", () => {
      const newHeight = 100;
      const minHeight = 150;
      const handlerWidth = HANDLER_WIDTH;

      cy.get("resizer-box")
        .invoke("attr", "min-height", `${minHeight}px`)
        .should("have.attr", "min-height", `${minHeight}px`);

      cy.resizeBox("bottom", null, newHeight + handlerWidth);

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("height")
        .should("equal", minHeight);
    });

    it("should not resize width & height more than max-width & max-height attributes", () => {
      const newWidth = 700;
      const newHeight = 700;
      const maxWidth = 500;
      const maxHeight = 500;
      const handlerWidth = HANDLER_WIDTH;

      cy.get("resizer-box")
        .invoke("attr", "max-width", `${maxWidth}px`)
        .should("have.attr", "max-width", `${maxWidth}px`);

      cy.get("resizer-box")
        .invoke("attr", "max-height", `${maxHeight}px`)
        .should("have.attr", "max-height", `${maxHeight}px`);

      cy.resizeBox(
        "bottom-right",
        newWidth + handlerWidth,
        newHeight + handlerWidth,
      );

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("width")
        .should("equal", maxWidth);

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("height")
        .should("equal", maxHeight);
    });

    it("should not resize width & height less than min-width & min-height attributes", () => {
      const newWidth = 100;
      const newHeight = 100;
      const minWidth = 200;
      const minHeight = 150;
      const handlerWidth = HANDLER_WIDTH;

      cy.get("resizer-box")
        .invoke("attr", "min-width", `${minWidth}px`)
        .should("have.attr", "min-width", `${minWidth}px`);

      cy.get("resizer-box")
        .invoke("attr", "min-height", `${minHeight}px`)
        .should("have.attr", "min-height", `${minHeight}px`);

      cy.resizeBox(
        "bottom-right",
        newWidth + handlerWidth,
        newHeight + handlerWidth,
      );

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("width")
        .should("equal", minWidth);

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("height")
        .should("equal", minHeight);
    });

    it("should not resize width & height more/less then the min/max attributes", () => {
      const maxWidth = 500;
      const minWidth = 200;

      const maxHeight = 500;
      const minHeight = 150;

      const handlerWidth = HANDLER_WIDTH;

      cy.get("resizer-box")
        .invoke("attr", "max-width", `${maxWidth}px`)
        .should("have.attr", "max-width", `${maxWidth}px`);

      cy.get("resizer-box")
        .invoke("attr", "max-height", `${maxHeight}px`)
        .should("have.attr", "max-height", `${maxHeight}px`);

      cy.get("resizer-box")
        .invoke("attr", "min-width", `${minWidth}px`)
        .should("have.attr", "min-width", `${minWidth}px`);

      cy.get("resizer-box")
        .invoke("attr", "min-height", `${minHeight}px`)
        .should("have.attr", "min-height", `${minHeight}px`);

      // Test max limit
      let newWidth = 700;
      let newHeight = 700;

      cy.resizeBox(
        "bottom-right",
        newWidth + handlerWidth,
        newHeight + handlerWidth,
      );

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("width")
        .should("equal", maxWidth);

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("height")
        .should("equal", maxHeight);

      // Test min limit
      newWidth = 100;
      newHeight = 100;

      cy.resizeBox(
        "bottom-right",
        newWidth + handlerWidth,
        newHeight + handlerWidth,
      );

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("width")
        .should("equal", minWidth);

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("height")
        .should("equal", minHeight);
    });
  });
}
