import { POSITIONS } from "./constants/positions";
import { HANDLER_WIDTH } from "./constants/handlerWidth";

export function resizeEventTests(url) {
  context("Resize event dispatch", () => {
    let resizeEventHandlerMock;

    beforeEach(() => {
      cy.visit(url, {
        onBeforeLoad(win) {
          resizeEventHandlerMock = cy.spy().as("resizeEvent");
          Cypress.$(win).on("resize", resizeEventHandlerMock);
        },
      });
    });

    it(`should dispatch the event 'resize' with detail containing the new width and height`, () => {
      const originalWidth = 300,
        originalHeight = 200;
      const newClientX = 500,
        newClientY = 500;
      const handlerWidth = HANDLER_WIDTH;

      cy.resizeBox(
        POSITIONS.BOTTOM_RIGHT,
        newClientX + handlerWidth,
        newClientY + handlerWidth,
      ).then(() => {
        cy.get("@resizeEvent").should("have.been.calledTwice");

        cy.get("@resizeEvent")
          .its("firstCall.args.0.detail")
          .should("deep.equal", {
            width: originalWidth,
            height: originalHeight,
          });

        cy.get("@resizeEvent")
          .its("secondCall.args.0.detail")
          .should("deep.equal", {
            width: newClientX,
            height: newClientY,
          });
      });
    });
  });
}
