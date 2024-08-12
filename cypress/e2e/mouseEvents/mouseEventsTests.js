import { topLeftTests } from "./topLeftTests/topLeftTests";
import { topRightTests } from "./topRightTests/topRightTests";
import { bottomLeftTests } from "./bottomLeftTests/bottomLeftTests";
import { bottomRightTests } from "./bottomRightTests/bottomRightTests";

export function mouseEventsTests(url) {
  context("Mouse events", () => {
    // Giving the multiple cases where the element can be position
    // a good strategy would be to test all the possible resizes that can be made
    // giving a certain position

    topLeftTests(url);
    topRightTests(url);
    bottomLeftTests(url);
    bottomRightTests(url);
  });
}
