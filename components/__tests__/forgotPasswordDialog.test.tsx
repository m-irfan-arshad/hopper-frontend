import { render, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordDialog from "../forgotPasswordDialog";

describe("ForgotPasswordDialog", () => {
    const props = {
        onBackClick: jest.fn(),
        open: true
    };

    test("renders the ForgotPasswordDialog", () => {
        const { getByRole, getByPlaceholderText } = render(
            <ForgotPasswordDialog {...props}  />
        );  
        expect(getByRole("button", {name: "Back"})).toBeInTheDocument();
        expect(getByRole("button", {name: "SUBMIT"})).toBeInTheDocument();
        expect(getByPlaceholderText("Email Address")).toBeInTheDocument();
    });

    test("calls onclick of back button", () => {
        const { getByRole } = render(
            <ForgotPasswordDialog {...props}  />
        );

        expect(getByRole("button", {name: "Back"})).toBeInTheDocument();
        fireEvent.click(getByRole("button", {name: "Back"}));

        expect(props.onBackClick).toHaveBeenCalledTimes(1); 
    });
});
