import { Resizer } from "../Resizer.mjs";

if (!customElements.get("resizer-box")) {
  customElements.define("resizer-box", Resizer);
}

describe("Resizer web component", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("creates only one right handle when the same handle is added again", () => {
    const element = document.createElement("resizer-box");
    element.setAttribute("width", "200px");
    element.setAttribute("height", "200px");
    element.setAttribute("resize-right", "true");

    document.body.appendChild(element);

    element._addRightHandle();

    expect(element.shadowRoot.querySelectorAll(".handle.right").length).toBe(1);
  });

  it("creates only one handle for each enabled resize direction", () => {
    const element = document.createElement("resizer-box");
    element.setAttribute("width", "200px");
    element.setAttribute("height", "200px");
    element.setAttribute("resize-right", "true");
    element.setAttribute("resize-bottom", "true");

    document.body.appendChild(element);

    element._addResizeHandles();

    expect(element.shadowRoot.querySelectorAll(".handle.right").length).toBe(1);
    expect(element.shadowRoot.querySelectorAll(".handle.bottom").length).toBe(
      1,
    );
  });
});
