import { TEST_CASES_TOP_LEFT } from "./testCases";
import { HANDLER_WIDTH } from "../../constants/handlerWidth";

export function topLeftTests(url) {
  context("Postion - X:left Y:top", () => {
    beforeEach(() => {
      // The box is positioned top left

      cy.visit(url);
      cy.changeBoxPositionX("left");
      cy.changeBoxPositionY("top");
    });

    TEST_CASES_TOP_LEFT.forEach((testCase) => {
      it(`should resize if is dragged to the ${testCase.position} - ${testCase.description}`, () => {
        const newClientX = testCase.newClientX;
        const newClientY = testCase.newClientY;
        const handlerWidth = HANDLER_WIDTH;

        cy.get("resizer-box")
          .invoke("attr", testCase.position, "true")
          .should("have.attr", testCase.position, "true");

        cy.resizeBox(
          testCase.position,
          newClientX + handlerWidth,
          newClientY + handlerWidth,
        );

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
