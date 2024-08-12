import "./index.mjs";
import { withActions } from "@storybook/addon-actions/decorator";

export default {
  title: "ResizerBox/Resizer-Box",
  component: "resizer-box",
  parameters: {
    actions: {
      handles: ["resize"],
    },
  },
  decorators: [withActions],
  args: {
    width: {
      control: { type: "text" },
    },
    height: {
      control: { type: "text" },
    },
    maxWidth: {
      control: { type: "text" },
    },
    minWidth: {
      control: { type: "text" },
    },
    maxHeight: {
      control: { type: "text" },
    },
    minHeight: {
      control: { type: "text" },
    },
    resizeRight: true,
    resizeBottom: false,
    resizeTop: false,
    resizeLeft: false,
    resizeBottomRight: false,
    resizeBottomLeft: false,
    resizeTopLeft: false,
    resizeTopRight: false,
  },
};

const PrimaryTemplate = ({
  width,
  height,
  maxWidth,
  minWidth,
  maxHeight,
  minHeight,
  resizeRight,
  resizeBottom,
  resizeTop,
  resizeLeft,
  resizeBottomRight,
  resizeBottomLeft,
  resizeTopLeft,
  resizeTopRight,
}) => `
      <resizer-box
        width=${width}
        height=${height}
        max-width=${maxWidth}
        min-width=${minWidth}
        max-height=${maxHeight}
        min-height=${minHeight}
        resize-right=${resizeRight}
        resize-bottom=${resizeBottom}
        resize-top=${resizeTop}
        resize-left=${resizeLeft}
        resize-bottom-right=${resizeBottomRight}
        resize-bottom-left=${resizeBottomLeft}
        resize-top-left=${resizeTopLeft}
        resize-top-right=${resizeTopRight}
      >
        <style>
            .myBox{
                width: 100%;
                height: 100%;
                overflow: auto;
                border: 1px solid grey;
            }
        </style>
          <div class="myBox" slot="content">
              <img src="https://www.w3schools.com/html/pic_trulli.jpg" alt="Trulli" width="500" height="333">
              <h1>Test 123</h1>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
          </div>
      </resizer-box>`;

export const Default = PrimaryTemplate.bind({});

Default.args = {
  width: "300px",
  height: "200px",
  maxWidth: "500px",
  minWidth: "100px",
  maxHeight: "400px",
  minHeight: "100px",
};
