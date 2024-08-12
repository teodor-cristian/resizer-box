import { TEST_CASES_TOP_RIGHT } from "./testCases";
import { HANDLER_WIDTH } from "../../constants/handlerWidth";

export function topRightTests(url) {
  context("Postion - X:right Y:top", () => {
    beforeEach(() => {
      // The box is positioned top right

      cy.visit(url);
      cy.changeBoxPositionX("right");
      cy.changeBoxPositionY("top");
    });

    TEST_CASES_TOP_RIGHT.forEach((testCase) => {
      it(`should resize if is dragged to the ${testCase.position} - ${testCase.description}`, () => {
        const newClientX = testCase.newClientX;
        const newClientY = testCase.newClientY;
        const handlerWidth = HANDLER_WIDTH;
        const viewportWidth = Cypress.config().viewportWidth;

        cy.get("resizer-box")
          .invoke("attr", testCase.position, "true")
          .should("have.attr", testCase.position, "true");

        const resizeX =
          viewportWidth -
          newClientX +
          (testCase.position === "bottom-left" ? handlerWidth : -handlerWidth);
        const resizeY = newClientY + handlerWidth;

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
