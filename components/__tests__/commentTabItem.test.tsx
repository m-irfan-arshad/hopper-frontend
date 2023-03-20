import { render, fireEvent, within } from "@testing-library/react";
import CommentTabItem from "../commentTabItem";
import moment from "moment";

describe("CommentTabItem", () => {

    const props = {
        data: {
            createTime: moment('03/13/2023'),
            updateTime: moment(),
            commentText: 'Lorem ipsum sdgsdgdasgasg',
            userName: 'Daphney'
        }
    }

    test("renders the comment tab item", async() => {
        const { getByText } = render(
            <CommentTabItem  {...props}/>
        ); 

        expect(getByText("Lorem ipsum sdgsdgdasgasg")).toBeInTheDocument();
        expect(getByText("Daphney - 12:00am, 03/13/2023")).toBeInTheDocument();
    });
});
