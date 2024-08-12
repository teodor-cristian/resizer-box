// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const { default: positions } = require("../../src/constants/positions");

/**
 * Change the resize box position on the screen on the X axis
 * @param {"left"|"center"|"right"} position
 */
function changeBoxPositionX(position) {
  if (!position) return;

  cy.get(`[name="horizontal"][value=${position}]`).check();
}

Cypress.Commands.add("changeBoxPositionX", changeBoxPositionX);

/**
 * Change the resize box position on the screen on the Y axis
 * @param {"top"|"middle"|"bottom"} position
 */
function changeBoxPositionY(position) {
  if (!position) return;

  cy.get(`[name="vertical"][value=${position}]`).check();
}

Cypress.Commands.add("changeBoxPositionY", changeBoxPositionY);

/**
 * Change the resize box position on the screen on the Y axis
 * @param {"top"|"middle"|"bottom"} position
 */
function changeResizeAttrVal(position, value) {
  if (!position) return;

  cy.get("resizer-box").invoke("attr", `resize-${position}`, value);
}

Cypress.Commands.add("changeResizeAttrVal", changeResizeAttrVal);

/**
 * Resize the resize-box based on the position param that drags the corresponding handler
 * @param {any} position
 * @param {number} x
 * @param {number} y
 */
function resizeBox(position, x, y) {
  const pointerId = Cypress.browser.name === "firefox" ? 0 : 1;

  cy.get("resizer-box")
    .shadow()
    .find(`[data-cy="handle-${position}"]`)
    .trigger("pointerdown", { pointerId })
    .trigger("pointermove", { clientX: x, clientY: y })
    .trigger("pointerup", { pointerId });
}

Cypress.Commands.add("resizeBox", resizeBox);
