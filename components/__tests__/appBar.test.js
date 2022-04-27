import { render, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
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
});
