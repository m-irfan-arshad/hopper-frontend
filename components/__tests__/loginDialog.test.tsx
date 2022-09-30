import { render, fireEvent, waitFor, getByPlaceholderText } from "@testing-library/react";
import LoginDialog from "../loginDialog";

describe("LoginDialog", () => {
    const props = {
        onForgotPasswordClick: jest.fn(),
        open: true
    };

    test("renders the loginDialog", () => {
        const { getByRole, getByPlaceholderText } = render(
            <LoginDialog {...props}  />
        );  
        expect(getByRole("button", {name: "Forgot password?"})).toBeInTheDocument();
        expect(getByRole("button", {name: "SIGN IN"})).toBeInTheDocument();
        expect(getByPlaceholderText("Email Address")).toBeInTheDocument();
        expect(getByPlaceholderText("Password")).toBeInTheDocument();

    });

    test("calls onclick of forgot password button", () => {
        const { getByRole } = render(
            <LoginDialog {...props}  />
        );  
        expect(getByRole("button", {name: "Forgot password?"})).toBeInTheDocument();
        fireEvent.click(getByRole("button", {name: "Forgot password?"}));

        expect(props.onForgotPasswordClick).toHaveBeenCalledTimes(1); 
    });
});
