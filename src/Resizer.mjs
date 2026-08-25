import attributes from "./constants/attributes.js";
import positions from "./constants/positions.js";
import ResizeObserverManager from "./resize-observer-manager/resize-observer-manager.mjs";
import { isValueInPixels, clamp } from "./utils/utils.mjs";
import templateHtml from "./template.html";

export class Resizer extends HTMLElement {
  #container = null;
  #resizeObserver = null;
  #isValid = false;

  static observedAttributes = [
    attributes.WIDTH,
    attributes.HEIGHT,
    attributes.RESIZE_RIGHT,
    attributes.RESIZE_BOTTOM,
    attributes.RESIZE_LEFT,
    attributes.RESIZE_TOP,
    attributes.RESIZE_TOP_LEFT,
    attributes.RESIZE_BOTTOM_LEFT,
    attributes.RESIZE_TOP_RIGHT,
    attributes.RESIZE_BOTTOM_RIGHT,
  ];

  handlesAddMethodMap = {
    [attributes.RESIZE_RIGHT]: this._addRightHandle,
    [attributes.RESIZE_BOTTOM]: this._addBottomHandle,
    [attributes.RESIZE_BOTTOM_RIGHT]: this._addBottomRightHandle,
    [attributes.RESIZE_LEFT]: this._addLeftHandle,
    [attributes.RESIZE_BOTTOM_LEFT]: this._addBottomLeftHandle,
    [attributes.RESIZE_TOP_LEFT]: this._addTopLeftHandle,
    [attributes.RESIZE_TOP_RIGHT]: this._addTopRightHandle,
    [attributes.RESIZE_TOP]: this._addTopHandle,
  };

  attributesToPositionMap = {
    [attributes.RESIZE_RIGHT]: positions.RIGHT,
    [attributes.RESIZE_BOTTOM]: positions.BOTTOM,
    [attributes.RESIZE_BOTTOM_RIGHT]: positions.BOTTOM_RIGHT,
    [attributes.RESIZE_LEFT]: positions.LEFT,
    [attributes.RESIZE_BOTTOM_LEFT]: positions.BOTTOM_LEFT,
    [attributes.RESIZE_TOP_LEFT]: positions.TOP_LEFT,
    [attributes.RESIZE_TOP_RIGHT]: positions.TOP_RIGHT,
    [attributes.RESIZE_TOP]: positions.TOP,
  };

  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = templateHtml;
    shadow.appendChild(template.content.cloneNode(true));

    this.#container = shadow.querySelector(".resizer");

    const width = this.getAttribute(attributes.WIDTH);
    const height = this.getAttribute(attributes.HEIGHT);
    this._setContainerDimensions(width, height);

    this._addResizeHandles();
  }

  disconnectedCallback() {
    if (this.#resizeObserver) {
      this.#resizeObserver.unsubscribe();
    }
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === null) return;

    if (
      attributeName === attributes.WIDTH ||
      attributeName === attributes.HEIGHT
    ) {
      let newWidth =
        attributeName === attributes.WIDTH
          ? newValue
          : this.getAttribute(attributes.WIDTH);
      let newHeight =
        attributeName === attributes.HEIGHT
          ? newValue
          : this.getAttribute(attributes.HEIGHT);

      this._setContainerDimensions(newWidth, newHeight);
      return;
    }

    if (Resizer.observedAttributes.includes(attributeName) && this.#isValid) {
      if (this.attributeIsValid(attributeName)) {
        this.handlesAddMethodMap[attributeName].call(this);
      } else {
        this._removeResizeHandle(this.attributesToPositionMap[attributeName]);
      }
    }
  }

  #_setValidity(newVal) {
    if (this.#isValid === newVal) return;

    this.#isValid = newVal;

    if (this.#isValid) {
      // For tracking the changes
      this.#resizeObserver = new ResizeObserverManager(
        this.#container,
        (detail) => this.dispatch("resize", detail),
      );
      this.#resizeObserver.subscribe();

      this._addResizeHandles();
    } else {
      this._removeAllHandles();

      if (this.#resizeObserver) {
        this.#resizeObserver.unsubscribe();
      }
    }
  }

  _setContainerDimensions(width, height) {
    let validWidth = false;
    let validHeight = false;

    if (width && isValueInPixels(width)) {
      this.#container.style.width = width;
      validWidth = true;
    } else {
      console.error(
        `resizer-box: Missing required attributes: Please set a valid ${attributes.WIDTH} attribute to the resizer tag. Usage: <resizer-box width='300px' height='200px'>`,
      );
    }

    if (height && isValueInPixels(height)) {
      this.#container.style.height = height;
      validHeight = true;
    } else {
      console.error(
        `resizer-box: Missing required attributes: Please set a valid ${attributes.HEIGHT} attribute to the resizer tag. Usage: <resizer-box width='300px' height='200px'>`,
      );
    }

    const computedValidity = validHeight && validWidth;
    this.#_setValidity(computedValidity);
  }

  dispatch(type, detail) {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        cancelable: false,
        detail,
      }),
    );
  }

  get maxWidth() {
    const max = this.getAttribute(attributes.MAX_WIDTH);
    if (!isValueInPixels(max)) return null;

    return parseInt(max, 10);
  }

  get minWidth() {
    const min = this.getAttribute(attributes.MIN_WIDTH);
    if (!isValueInPixels(min)) return null;

    return parseInt(min, 10);
  }

  get maxHeight() {
    const max = this.getAttribute(attributes.MAX_HEIGHT);
    if (!isValueInPixels(max)) return null;

    return parseInt(max, 10);
  }

  get minHeight() {
    const min = this.getAttribute(attributes.MIN_HEIGHT);
    if (!isValueInPixels(min)) return null;

    return parseInt(min, 10);
  }

  /**
   * Checks if attribute exists/is true
   * @param {string} attributeName
   * @returns {boolean}
   */
  attributeIsValid(attributeName) {
    if (!this.hasAttribute(attributeName)) return false;

    const attValue = this.getAttribute(attributeName);

    if (attValue === "") return true;

    return attValue === "true";
  }

  _addResizeHandles() {
    if (!this.#isValid) return;

    for (const [attributeName, addHandle] of Object.entries(
      this.handlesAddMethodMap,
    )) {
      if (this.attributeIsValid(attributeName)) {
        addHandle.call(this);
      }
    }
  }

  _removeAllHandles() {
    this.#container
      .querySelectorAll(".handle")
      .forEach((handle) => handle.remove());
  }

  _removeResizeHandle(position) {
    const handle = this.#container.querySelector(`.handle.${position}`);
    if (!handle) return;

    this.#container.removeChild(handle);
  }

  _createHandle(position) {
    const existingHandle = this.#container.querySelector(`.handle.${position}`);

    if (existingHandle) {
      return existingHandle;
    }

    const handle = document.createElement("div");
    handle.classList.add("handle", position);
    handle.setAttribute("part", `handle handle-${position}`);
    handle.setAttribute("data-cy", `handle-${position}`);

    this.#container.appendChild(handle);

    return handle;
  }

  _addRightHandle() {
    const rightHandle = this._createHandle(positions.RIGHT);

    const onDrag = (event) => {
      event.preventDefault();

      const shiftX = event.clientX - rightHandle.getBoundingClientRect().left;

      rightHandle.setPointerCapture(event.pointerId);

      rightHandle.onpointermove = (e) =>
        this._setWidth(e.clientX, shiftX, "right");

      rightHandle.onpointerup =
        rightHandle.onpointercancel =
        rightHandle.onlostpointercapture =
          () => {
            rightHandle.onpointermove = null;
            rightHandle.onpointerup = null;
            rightHandle.onpointercancel = null;
            rightHandle.onlostpointercapture = null;
          };
    };

    rightHandle.onpointerdown = onDrag;

    rightHandle.ondragstart = () => false;
  }

  _addLeftHandle() {
    const leftHandle = this._createHandle(positions.LEFT);

    const onDrag = (event) => {
      event.preventDefault();

      const shiftX = event.clientX - leftHandle.getBoundingClientRect().right;

      leftHandle.setPointerCapture(event.pointerId);

      leftHandle.onpointermove = (e) =>
        this._setWidth(e.clientX, shiftX, "left");

      leftHandle.onpointerup =
        leftHandle.onpointercancel =
        leftHandle.onlostpointercapture =
          () => {
            leftHandle.onpointermove = null;
            leftHandle.onpointerup = null;
            leftHandle.onpointercancel = null;
            leftHandle.onlostpointercapture = null;
          };
    };

    leftHandle.onpointerdown = onDrag;

    leftHandle.ondragstart = () => false;
  }

  _addBottomHandle() {
    const bottomHandle = this._createHandle(positions.BOTTOM);

    const onDrag = (event) => {
      event.preventDefault();

      const shiftY = event.clientY - bottomHandle.getBoundingClientRect().top;

      bottomHandle.setPointerCapture(event.pointerId);

      bottomHandle.onpointermove = (e) =>
        this._setHeight(e.clientY, shiftY, "bottom");

      bottomHandle.onpointerup =
        bottomHandle.onpointercancel =
        bottomHandle.onlostpointercapture =
          () => {
            bottomHandle.onpointermove = null;
            bottomHandle.onpointerup = null;
            bottomHandle.onpointercancel = null;
            bottomHandle.onlostpointercapture = null;
          };
    };

    bottomHandle.onpointerdown = onDrag;

    bottomHandle.ondragstart = () => false;
  }

  _addTopHandle() {
    const topHandle = this._createHandle(positions.TOP);

    const onDrag = (event) => {
      event.preventDefault();

      const shiftY = event.clientY - topHandle.getBoundingClientRect().bottom;

      topHandle.setPointerCapture(event.pointerId);

      topHandle.onpointermove = (e) =>
        this._setHeight(e.clientY, shiftY, "top");

      topHandle.onpointerup =
        topHandle.onpointercancel =
        topHandle.onlostpointercapture =
          () => {
            topHandle.onpointermove = null;
            topHandle.onpointerup = null;
            topHandle.onpointercancel = null;
            topHandle.onlostpointercapture = null;
          };
    };

    topHandle.onpointerdown = onDrag;

    topHandle.ondragstart = () => false;
  }

  _addBottomRightHandle() {
    const bottomRightHandle = this._createHandle(positions.BOTTOM_RIGHT);

    const onDrag = (event) => {
      event.preventDefault();

      const shiftX =
        event.clientX - bottomRightHandle.getBoundingClientRect().left;
      const shiftY =
        event.clientY - bottomRightHandle.getBoundingClientRect().top;

      bottomRightHandle.setPointerCapture(event.pointerId);

      bottomRightHandle.onpointermove = (e) => {
        this._setWidth(e.clientX, shiftX, "right");
        this._setHeight(e.clientY, shiftY, "bottom");
      };

      bottomRightHandle.onpointerup =
        bottomRightHandle.onpointercancel =
        bottomRightHandle.onlostpointercapture =
          () => {
            bottomRightHandle.onpointermove = null;
            bottomRightHandle.onpointerup = null;
            bottomRightHandle.onpointercancel = null;
            bottomRightHandle.onlostpointercapture = null;
          };
    };

    bottomRightHandle.onpointerdown = onDrag;

    bottomRightHandle.ondragstart = () => false;
  }

  _addBottomLeftHandle() {
    const bottomLeftHandle = this._createHandle(positions.BOTTOM_LEFT);

    const onDrag = (event) => {
      event.preventDefault();

      const shiftX =
        event.clientX - bottomLeftHandle.getBoundingClientRect().left;
      const shiftY =
        event.clientY - bottomLeftHandle.getBoundingClientRect().top;

      bottomLeftHandle.setPointerCapture(event.pointerId);

      bottomLeftHandle.onpointermove = (e) => {
        this._setWidth(e.clientX, shiftX, "left");
        this._setHeight(e.clientY, shiftY, "bottom");
      };

      bottomLeftHandle.onpointerup =
        bottomLeftHandle.onpointercancel =
        bottomLeftHandle.onlostpointercapture =
          () => {
            bottomLeftHandle.onpointermove = null;
            bottomLeftHandle.onpointerup = null;
            bottomLeftHandle.onpointercancel = null;
            bottomLeftHandle.onlostpointercapture = null;
          };
    };

    bottomLeftHandle.onpointerdown = onDrag;

    bottomLeftHandle.ondragstart = () => false;
  }

  _addTopLeftHandle() {
    const topLeftHandle = this._createHandle(positions.TOP_LEFT);

    const onDrag = (event) => {
      event.preventDefault();

      const shiftX = event.clientX - topLeftHandle.getBoundingClientRect().left;
      const shiftY = event.clientY - topLeftHandle.getBoundingClientRect().top;

      topLeftHandle.setPointerCapture(event.pointerId);

      topLeftHandle.onpointermove = (e) => {
        this._setWidth(e.clientX, shiftX, "left");
        this._setHeight(e.clientY, shiftY, "top");
      };

      topLeftHandle.onpointerup =
        topLeftHandle.onpointercancel =
        topLeftHandle.onlostpointercapture =
          () => {
            topLeftHandle.onpointermove = null;
            topLeftHandle.onpointerup = null;
            topLeftHandle.onpointercancel = null;
            topLeftHandle.onlostpointercapture = null;
          };
    };

    topLeftHandle.onpointerdown = onDrag;

    topLeftHandle.ondragstart = () => false;
  }

  _addTopRightHandle() {
    const topRightHandle = this._createHandle(positions.TOP_RIGHT);

    const onDrag = (event) => {
      event.preventDefault();

      const shiftX =
        event.clientX - topRightHandle.getBoundingClientRect().left;
      const shiftY =
        event.clientY - topRightHandle.getBoundingClientRect().bottom;

      topRightHandle.setPointerCapture(event.pointerId);

      topRightHandle.onpointermove = (e) => {
        this._setWidth(e.clientX, shiftX, "right");
        this._setHeight(e.clientY, shiftY, "top");
      };

      topRightHandle.onpointerup =
        topRightHandle.onpointercancel =
        topRightHandle.onlostpointercapture =
          () => {
            topRightHandle.onpointermove = null;
            topRightHandle.onpointerup = null;
            topRightHandle.onpointercancel = null;
            topRightHandle.onlostpointercapture = null;
          };
    };

    topRightHandle.onpointerdown = onDrag;

    topRightHandle.ondragstart = () => false;
  }

  /**
   * Sets the container height
   * @param {number} clientY
   * @param {number} shiftY
   * @param {"bottom"|"top"} direction
   */
  _setHeight = (clientY, shiftY, direction) => {
    const clientRectMapper = {
      bottom: "top",
      top: "bottom",
    };

    let newHeight =
      clientY -
      shiftY -
      this.#container.getBoundingClientRect()[clientRectMapper[direction]];
    newHeight = direction === "top" ? -newHeight : newHeight;

    newHeight = clamp(newHeight, this.minHeight, this.maxHeight);

    this.#container.style.height = `${newHeight}px`;
  };

  /**
   * Description
   * @param {number} clientX
   * @param {number} shiftX
   * @param {"left"|"right"} direction
   */
  _setWidth = (clientX, shiftX, direction) => {
    const clientRectMapper = {
      left: "right",
      right: "left",
    };

    let newWidth =
      clientX -
      shiftX -
      this.#container.getBoundingClientRect()[clientRectMapper[direction]];
    newWidth = direction === "left" ? -newWidth : newWidth;

    newWidth = clamp(newWidth, this.minWidth, this.maxWidth);

    this.#container.style.width = `${newWidth}px`;
  };
}
