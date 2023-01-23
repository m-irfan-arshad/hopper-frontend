import React, {createContext, useState} from 'react';
import { render, fireEvent, waitFor } from "@testing-library/react";
import moment from "moment";
import AlertComponent from "../alertComponent";
import {AlertContext} from "../../../pages/_app.page"
    
describe("AlertComponent", () => {
    test("renders correctly", async () => {
        const alertState = [{open: false, title: 'Test Alert Error', status: 'error'}, jest.fn()]
        const { getByText } = render(
            <AlertContext.Provider value={alertState}>
                <AlertComponent />
            </AlertContext.Provider>
        );

        expect(getByText("Test Alert Error")).toBeInTheDocument();
    });
});
