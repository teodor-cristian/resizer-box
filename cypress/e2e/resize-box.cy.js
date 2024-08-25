import { attributesTests } from "./attributesTests";
import { minMaxAttrTests } from "./minMaxAttrTests";
import { mouseEventsTests } from "./mouseEvents/mouseEventsTests";
import { resizeEventTests } from "./resizeEventTests";

// const URL = "http://localhost:6006/iframe.html?id=resizerbox-resizer-box--default&viewMode=story";
const URL = "http://127.0.0.1:3003/demo/";

describe("resizer-box component", () => {
  context("General usage", () => {
    beforeEach(() => {
      cy.visit(URL);
    });

    it("should find <<content>> slot", () => {
      cy.get("resizer-box")
        .shadow()
        .find('slot[name="content"]')
        .should("exist");
    });

    it("should find the <<content>> slot in light DOM", () => {
      cy.get("resizer-box")
        .find('[slot="content"]')
        .get("div.myBox")
        .should("exist");
      cy.get("resizer-box")
        .find('[slot="content"]')
        .get("div.myBox img")
        .should("exist");
      cy.get("resizer-box")
        .find('[slot="content"]')
        .get("div.myBox p")
        .first()
        .contains("Test 123");
      cy.get("resizer-box")
        .find('[slot="content"]')
        .get("div.myBox p")
        .eq(1)
        .contains("Lorem Ipsum is simply dummy text");
    });

    it("should have the correct width", () => {
      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("width")
        .should("equal", 300);
    });

    it("should have the correct height", () => {
      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("height")
        .should("equal", 200);
    });

    it("should change its width if the width attribut changes", () => {
      cy.get("resizer-box")
        .invoke("attr", "width", "400px")
        .should("have.attr", "width", "400px");

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("width")
        .should("equal", 400);
    });

    it("should change its height if the height attribut changes", () => {
      cy.get("resizer-box")
        .invoke("attr", "height", "400px")
        .should("have.attr", "height", "400px");

      cy.get("resizer-box")
        .shadow()
        .find('[data-cy="resizer-container"]')
        .invoke("height")
        .should("equal", 400);
    });
  });

  attributesTests(URL);

  minMaxAttrTests(URL);

  mouseEventsTests(URL);

  resizeEventTests(URL);
});
