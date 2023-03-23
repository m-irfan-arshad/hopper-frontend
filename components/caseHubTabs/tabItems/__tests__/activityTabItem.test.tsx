import { render, fireEvent, within } from "@testing-library/react";
import ActivityTabItem from "../activityTabItem";
import moment from "moment";

describe("ActivityTabItem", () => {

    const props = {
        data: {
            createTime: moment('2023-01-09'),
            updateTime: moment(),
            activity: 'Added a comment',
            userName: 'Daphney Johnson',
            lastName: 'Johnson'
        }
    }

    test("renders the activity tab item", async() => {
        const { getByText } = render(
            <ActivityTabItem  {...props}/>
        ); 
       
        expect(getByText("Added a comment")).toBeInTheDocument();
        expect(getByText("Daphney Johnson - 12:00am, 01/09/2023")).toBeInTheDocument();

    });
});
