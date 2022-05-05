import { render, waitFor, fireEvent } from "@testing-library/react";
import AppBar from "../appBar";

describe("AppBar", () => {
  test("renders the appbar and can open dropdown", async () => {
    const {
      getByText,
      queryAllByLabelText,
      queryByLabelText,
      queryByPlaceholderText,
      queryAllByPlaceholderText,
    } = render(<AppBar />);

    expect(getByText("Search")).toBeInTheDocument();
    expect(queryByLabelText("Array Choice")).not.toBeInTheDocument();
    expect(queryByPlaceholderText("Search...")).not.toBeInTheDocument();

    fireEvent.click(getByText("Search"));

    expect(queryAllByLabelText("Array Choice")[0]).toBeInTheDocument();
    expect(queryAllByPlaceholderText("Search...")[0]).toBeInTheDocument();
  });

  test("hovers over the popover", async () => {
    const { getByText, queryByText } = render(<AppBar />);

    expect(getByText("Hover for Popover")).toBeInTheDocument();
    expect(queryByText("I use Popover.")).not.toBeInTheDocument();

    fireEvent.mouseOver(getByText("Hover for Popover"));

    expect(getByText("I use Popover.")).toBeInTheDocument();

    fireEvent.mouseOut(getByText("Hover for Popover"));

    await waitFor(() => {
      expect(queryByText("I use Popover.")).not.toBeInTheDocument();
    });
  });
});
