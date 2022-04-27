import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../index";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          time: "2022-04-20T19:14:35.749Z",
          patientName: "Adam",
          dateOfBirth: "02/01/1990",
          proceduralist: "Whitebeard",
          procedureDate: "04/28/2022",
          location: "Great Plains Hospital",
          caseID: 2199,
          confirmationNum: 987,
          numOfAttachments: 2,
        },
        {
          time: "2022-04-20T15:14:35.749Z",
          patientName: "Bob",
          dateOfBirth: "05/01/1996",
          proceduralist: "Beerus",
          procedureDate: "04/20/2022",
          location: "Great Medtel Hospital",
          caseID: 2890,
          confirmationNum: 123,
          numOfAttachments: 0,
        },
      ]),
  })
);

describe("Home", () => {
  test("renders the index home page", () => {
    const { getByText } = render(<Home />);

    expect(getByText("h1 component with h3 variant")).toBeInTheDocument();
    expect(getByText("Hello World")).toBeInTheDocument();
  });

  test("Show/hide title in Popover/tooltip", async () => {
    const { getByText, findByText, queryByText, getByTestId } = render(
      <Home />
    );

    fireEvent.mouseOver(getByText("Hover for Popover"));

    expect(await findByText("I use Popover.")).toBeInTheDocument();

    fireEvent.mouseOut(getByText("Hover for Popover"));

    await waitFor(() => {
      expect(queryByText("I use Popover.")).not.toBeInTheDocument();
    });

    fireEvent.mouseOver(getByTestId("Notifications"));

    expect(await findByText("Notifications")).toBeInTheDocument();
    expect(await queryByText("Dashboard")).not.toBeInTheDocument();
  });
});
