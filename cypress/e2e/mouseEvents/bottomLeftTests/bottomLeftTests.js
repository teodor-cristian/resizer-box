import { TEST_CASES_BOTTOM_LEFT } from "./testCases";
import { POSITIONS } from "../../constants/positions";
import { HANDLER_WIDTH } from "../../constants/handlerWidth";

export function bottomLeftTests(url) {
  context("Postion - X:left Y:bottom", () => {
    beforeEach(() => {
      // The box is positioned top right

      cy.visit(url);

      // Change box position
      cy.changeBoxPositionX("left");
      cy.changeBoxPositionY("bottom");

      // Remove unused attributes
      cy.changeResizeAttrVal(POSITIONS.BOTTOM, "false");
      cy.changeResizeAttrVal(POSITIONS.BOTTOM_RIGHT, "false");
      cy.changeResizeAttrVal(POSITIONS.BOTTOM_LEFT, "false");
    });

    TEST_CASES_BOTTOM_LEFT.forEach((testCase) => {
      it(`should resize if is dragged to the ${testCase.position} - ${testCase.description}`, () => {
        const { newClientX, newClientY } = testCase;
        const handlerWidth = HANDLER_WIDTH;
        const viewportHeight = Cypress.config().viewportHeight;

        const resizeX = newClientX + handlerWidth;
        const resizeY = viewportHeight - newClientY - handlerWidth;

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
