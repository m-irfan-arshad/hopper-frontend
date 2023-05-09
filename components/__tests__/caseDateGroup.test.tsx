import { render, fireEvent, waitFor } from "@testing-library/react";
import CaseDateGroup from "../caseDateGroup";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../../theme";
import * as R from 'ramda';
import { mockCasesWithCompletedBookingSheetData } from "../../testReference";
import moment from 'moment'

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    QueryClient: jest.fn()
    }));
  
describe("CaseDateGroup", () => {
    const props = {
        list: mockCasesWithCompletedBookingSheetData,
        date: moment('05-05-2023').toString(),
        index: 0
    }

    test("renders a CaseDateGroup", () => {
        const { getByText } = render(
            <CaseDateGroup {...props}  />
        );  
        expect(getByText("Booking Request")).toBeInTheDocument();
        expect(getByText("Case Progress")).toBeInTheDocument();
        expect(getByText("May 5, 2023 (2 cases)")).toBeInTheDocument();

    });
});
