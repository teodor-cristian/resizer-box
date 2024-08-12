/**
 * Manages the ResizeObserver lifecycle
 *
 * Includes lifecycle management of the `ResizeObserver` instance,
 * `subscribe`, `unsubscribe`, '_onResize'
 */

class ResizeObserverManager {
  #container = null;
  #resizeObserver = null;
  onChange = null;

  constructor(container, onChange) {
    if (!container) {
      throw new Error('resize-observer-manager: Missing "container" argument');
    }
    if (!onChange) {
      throw new Error('resize-observer-manager: Missing "onChange" argument');
    }
    this.#container = container;
    this.onChange = onChange;
  }

  subscribe() {
    // For tracking the changes
    this.#resizeObserver = new ResizeObserver((entries) =>
      this._onResize.call(this, entries),
    );
    this.#resizeObserver.observe(this.#container);
  }

  unsubscribe() {
    this.#resizeObserver.disconnect();
  }

  _onResize(entries) {
    if (!entries || !entries[0]) return;

    const { width, height } = entries[0].contentRect;
    const detail = { width, height };

    this.onChange(detail);
  }
}

export default ResizeObserverManager;
