import { POSITIONS } from "./constants/positions";

export function attributesTests(url) {
  context("Resizer attributes", () => {
    beforeEach(() => {
      cy.visit(url);
    });

    Object.values(POSITIONS).forEach((position) => {
      it(`should have ${position} handler if the <<resize-${position}>> attr is set to true`, () => {
        // in index.html is by default set to true
        // cy.get("resizer-box")
        //   .shadow()
        //   .find(`[data-cy="handle-${position}"]`)
        //   .should('not.exist');

        cy.get("resizer-box")
          .invoke("attr", `resize-${position}`, "true")
          .should("have.attr", `resize-${position}`, "true");

        cy.get("resizer-box")
          .shadow()
          .find(`[data-cy="handle-${position}"]`)
          .should("exist");
      });

      it(`should not have ${position} handler if the <<resize-${position}>> attr is changed to false/removed`, () => {
        cy.changeResizeAttrVal(position, "false");

        cy.get("resizer-box")
          .shadow()
          .find(`[data-cy="handle-${position}"]`)
          .should("not.exist");
      });
    });
  });
}
