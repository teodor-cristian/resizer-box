import ResizeObserverManager from "../resize-observer-manager.mjs";

describe("ResizeObserverManager class", () => {
  let demoBox = null;

  beforeAll(() => {
    document.body.innerHTML =
      '<div id="demoBox" style="background-color: red"></div>';
    demoBox = document.getElementById("demoBox");
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  });

  beforeEach(() => {
    demoBox.style.width = "200px";
    demoBox.style.height = "300px";
  });

  afterEach(() => {
    demoBox.style.width = "200px";
    demoBox.style.height = "300px";
  });

  afterAll(() => {
    demoBox.style.width = "200px";
    demoBox.style.height = "300px";
  });

  describe("constructor", () => {
    it("works as expected", () => {
      const mockOnChange = jasmine.createSpy("OnChangeMock");
      let resizeObserver;

      expect(() => {
        resizeObserver = new ResizeObserverManager(demoBox, mockOnChange);
      }).not.toThrow();

      expect(resizeObserver.onChange).toBe(mockOnChange);
    });

    it('throws error without "container" argument', () => {
      expect(() => {
        new ResizeObserverManager();
      }).toThrow(
        new Error('resize-observer-manager: Missing "container" argument'),
      );
    });

    it('throws errors without "onChange" arguments', () => {
      expect(() => {
        new ResizeObserverManager(demoBox);
      }).toThrow(
        new Error('resize-observer-manager: Missing "onChange" argument'),
      );
    });
  });

  describe("_onResize", () => {
    it("not to call onChange if called without an argument", () => {
      const mockOnChange = jasmine.createSpy("OnChangeMock");
      const resizeObserver = new ResizeObserverManager(demoBox, mockOnChange);

      resizeObserver._onResize();

      expect(mockOnChange).toHaveBeenCalledTimes(0);
    });

    it("not to call onChange if the ResizeObserverEntry argument is an empty array", () => {
      const mockOnChange = jasmine.createSpy("OnChangeMock");
      const resizeObserver = new ResizeObserverManager(demoBox, mockOnChange);
      const resizeObserverEntry = {};

      resizeObserver._onResize(resizeObserverEntry);

      expect(mockOnChange).toHaveBeenCalledTimes(0);
    });
  });
});
