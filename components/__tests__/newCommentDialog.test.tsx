import { render, fireEvent, waitFor, getByPlaceholderText, getByLabelText } from "@testing-library/react";
import { PagesTestWrapper } from "../../testReference";
import NewCommentDialog from "../newCommentDialog";

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    QueryClient: jest.fn()
}));

describe("NewCommentDialog", () => {
    const props = {
        onBackClick: jest.fn(),
        open: true
    };

    beforeEach(() => {
        props.onBackClick.mockReset();
      });

    test("renders the NewCommentDialog and clicks back button", () => {
        const { getByRole, getByText } = render(
            <PagesTestWrapper>
                <NewCommentDialog {...props}  />
            </PagesTestWrapper>
        );  
        
        expect(getByRole("heading", {name: "Add Case Comment"})).toBeInTheDocument();
        expect(getByRole("button", {name: "Save"})).toBeInTheDocument();

        fireEvent.click(getByRole("button", {name: "< Back"}));

        expect(props.onBackClick).toHaveBeenCalledTimes(1);
    });

    test("renders the NewCommentDialog and clicks save button", async() => {
        const { getByRole, getByText } = render(
            <PagesTestWrapper>
                <NewCommentDialog {...props}  />
            </PagesTestWrapper>
        );  
        
        expect(getByRole("heading", {name: "Add Case Comment"})).toBeInTheDocument();
        expect(getByRole("button", {name: "Save"})).toBeDisabled();
        expect(getByRole("textbox", {name: ""})).toBeInTheDocument();

        fireEvent.change(getByRole("textbox", {name: ""}), {target: {value: 'test'}});

        expect(getByRole("button", {name: "Save"})).toBeEnabled();

        fireEvent.click(getByRole("button", {name: "Save"}));

        await waitFor(() => {
            expect(props.onBackClick).toHaveBeenCalledTimes(1);
        });
    });
});
