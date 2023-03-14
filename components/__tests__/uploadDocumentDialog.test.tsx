import { render, fireEvent, waitFor, getByPlaceholderText, getByLabelText } from "@testing-library/react";

import UploadDocumentDialog from "../uploadDocumentDialog";

describe("UploadDocumentDialog", () => {
    const props = {
        onBackClick: jest.fn(),
        open: true
    };

    const file = new File(['(⌐□_□)'], 'chucknorris.png', {
        type: 'image/png',
    });

    test("renders the UploadDocumentDialog and clicks back button", async() => {
        const { getByRole, getByText, getByLabelText } = render(
            <UploadDocumentDialog {...props}  />
        );  
        
        const hiddenFileInput = document.querySelector('input[type="file"]') as Element;

        expect(getByRole("button", {name: "< Back"})).toBeInTheDocument();
        expect(getByRole("button", {name: "Select File"})).toBeInTheDocument();
      
        Object.defineProperty(hiddenFileInput, 'files', {
          value: [file]
        })
      
        fireEvent.change(hiddenFileInput);
        
        expect(getByRole("button", {name: "Choose File"})).toBeInTheDocument();
        expect(getByRole("textbox", {name: "Document Notes"})).toBeInTheDocument();

        expect(getByRole("button", {name: "Save"})).toBeInTheDocument();

        fireEvent.click(getByRole("button", {name: "< Back"}));

        expect(props.onBackClick).toHaveBeenCalledTimes(1);

    });

    test("interacts with doc type dropdown and renders Signature Date", async () => {
        const { getByRole, getByText, getByLabelText } = render(
            <UploadDocumentDialog {...props}  />
        );  
        
        const hiddenFileInput = document.querySelector('input[type="file"]') as Element;

        expect(getByRole("button", {name: "< Back"})).toBeInTheDocument();
        expect(getByRole("button", {name: "Select File"})).toBeInTheDocument();

        Object.defineProperty(hiddenFileInput, 'files', {
          value: [file]
        })
      
        fireEvent.change(hiddenFileInput);

        expect(getByRole("textbox", {name: "Document Notes"})).toBeInTheDocument();
        expect(getByRole("button", {name: "Save"})).toBeInTheDocument();    
        
        fireEvent.mouseDown(getByLabelText('Document Type(s)'));
        fireEvent.click(getByRole("option", {name: "H & P"}));

        expect(getByLabelText("Signature Date")).toBeInTheDocument();
    });
});
