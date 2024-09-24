import attributes from "./constants/attributes.js";
import defaultStyles from "./constants/defaultStyles.js";
import positions from "./constants/positions.js";
import ResizeObserverManager from "./resize-observer-manager/resize-observer-manager.mjs";
import { isValueInPixels } from "./utils/utils.mjs";
import templateHtml from './template.html';

export class Resizer extends HTMLElement {
  #container = null;
  #resizeObserver = null;

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
    template.innerHTML =  templateHtml;
    shadow.appendChild(template.content.cloneNode(true));

    this.#container = shadow.querySelector(".resizer");

    // For tracking the changes
    this.#resizeObserver = new ResizeObserverManager(
      this.#container,
      (detail) => this.dispatch("resize", detail),
    );
    this.#resizeObserver.subscribe();

    const width = this.getAttribute(attributes.WIDTH);
    if (width && isValueInPixels(width)) {
      this.#container.style.width = width;
    } else {
      this.#container.style.width = defaultStyles.width;
      console.error(
        `Please set a ${attributes.WIDTH} attribute to the resizer tag.`,
      );
    }

    const height = this.getAttribute(attributes.HEIGHT);
    if (height && isValueInPixels(height)) {
      this.#container.style.height = height;
    } else {
      this.#container.style.height = defaultStyles.height;
      console.error(
        `Please set a ${attributes.HEIGHT} attribute to the resizer tag.`,
      );
    }

    this._addResizeHandles();
  }

  disconnectedCallback() {
    this.#resizeObserver.unsubscribe();
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === null) return;

    if (
      attributeName === attributes.WIDTH ||
      attributeName === attributes.HEIGHT
    ) {
      this.#container.style[attributeName] = newValue;
      return;
    }

    if (Resizer.observedAttributes.includes(attributeName)) {
      if (this.attributeIsValid(attributeName)) {
        this.handlesAddMethodMap[attributeName].call(this);
      } else {
        this._removeResizeHandle(this.attributesToPositionMap[attributeName]);
      }
    }
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
    if (!isValueInPixels(max)) return 0;

    return parseInt(max, 10);
  }

  get minWidth() {
    const min = this.getAttribute(attributes.MIN_WIDTH);
    if (!isValueInPixels(min)) return 0;

    return parseInt(min, 10);
  }

  get maxHeight() {
    const max = this.getAttribute(attributes.MAX_HEIGHT);
    if (!isValueInPixels(max)) return 0;

    return parseInt(max, 10);
  }

  get minHeight() {
    const min = this.getAttribute(attributes.MIN_HEIGHT);
    if (!isValueInPixels(min)) return 0;

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
    for (const [attributeName, addHandle] of Object.entries(
      this.handlesAddMethodMap,
    )) {
      if (this.attributeIsValid(attributeName)) {
        addHandle.call(this);
      }
    }
  }

  _removeResizeHandle(position) {
    const handle = this.#container.querySelector(
      `.handle.${position}`,
    );

    this.#container.removeChild(handle);
  }

  _createHandle(position) {
    let handleHtml = `<div class='handle ${position}' part='handle handle-${position}' data-cy='handle-${position}'></div>`;
    this.#container.insertAdjacentHTML("beforeend", handleHtml);
    const handle = this.#container.querySelector(`.handle.${position}`);

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

      rightHandle.onpointerup = () => {
        rightHandle.onpointermove = null;
        rightHandle.onpointerup = null;
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

      leftHandle.onpointerup = () => {
        leftHandle.onpointermove = null;
        leftHandle.onpointerup = null;
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

      bottomHandle.onpointerup = () => {
        bottomHandle.onpointermove = null;
        bottomHandle.onpointerup = null;
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

      topHandle.onpointerup = () => {
        topHandle.onpointermove = null;
        topHandle.onpointerup = null;
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

      bottomRightHandle.onpointerup = () => {
        bottomRightHandle.onpointermove = null;
        bottomRightHandle.onpointerup = null;
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

      bottomLeftHandle.onpointerup = () => {
        bottomLeftHandle.onpointermove = null;
        bottomLeftHandle.onpointerup = null;
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

      topLeftHandle.onpointerup = () => {
        topLeftHandle.onpointermove = null;
        topLeftHandle.onpointerup = null;
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

      topRightHandle.onpointerup = () => {
        topRightHandle.onpointermove = null;
        topRightHandle.onpointerup = null;
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

    if (this.maxHeight && newHeight >= this.maxHeight) {
      newHeight = this.maxHeight;
    }

    if (this.minHeight && newHeight <= this.minHeight) {
      newHeight = this.minHeight;
    }

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

    if (this.maxWidth && newWidth >= this.maxWidth) {
      newWidth = this.maxWidth;
    }

    if (this.minWidth && newWidth <= this.minWidth) {
      newWidth = this.minWidth;
    }

    this.#container.style.width = `${newWidth}px`;
  };
}
