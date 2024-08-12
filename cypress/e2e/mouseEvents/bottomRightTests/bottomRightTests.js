import { TEST_CASES_BOTTOM_RIGHT } from "./testCases";
import { POSITIONS } from "../../constants/positions";
import { HANDLER_WIDTH } from "../../constants/handlerWidth";

export function bottomRightTests(url) {
  context("Postion - X:right Y:bottom", () => {
    beforeEach(() => {
      // The box is positioned top right

      cy.visit(url);

      // Change box position
      cy.changeBoxPositionX("right");
      cy.changeBoxPositionY("bottom");

      // Remove unused attributes
      cy.changeResizeAttrVal(POSITIONS.BOTTOM, "false");
      cy.changeResizeAttrVal(POSITIONS.BOTTOM_RIGHT, "false");
      cy.changeResizeAttrVal(POSITIONS.BOTTOM_LEFT, "false");
      cy.changeResizeAttrVal(POSITIONS.RIGHT, "false");
      cy.changeResizeAttrVal(POSITIONS.TOP_RIGHT, "false");
    });

    TEST_CASES_BOTTOM_RIGHT.forEach((testCase) => {
      it(`should resize if is dragged to the ${testCase.position} - ${testCase.description}`, () => {
        const { newClientX, newClientY } = testCase;
        const handlerWidth = HANDLER_WIDTH;
        const viewportWidth = Cypress.config().viewportWidth;
        const viewportHeight = Cypress.config().viewportHeight;

        const resizeX =
          viewportWidth -
          newClientX +
          (testCase.position === "top-left" ? handlerWidth : -handlerWidth);
        const resizeY =
          viewportHeight -
          newClientY +
          (testCase.position === "top-left" ? handlerWidth : -handlerWidth);

        cy.resizeBox(testCase.position, resizeX, resizeY);

        if (newClientX) {
          cy.get("resizer-box")
            .shadow()
            .find('[data-cy="resizer-container"]')
            .invoke("width")
            .should("equal", newClientX);
        }

        if (newClientY) {
          cy.get("resizer-box")
            .shadow()
            .find('[data-cy="resizer-container"]')
            .invoke("height")
            .should("equal", newClientY);
        }
      });
    });
  });
}
