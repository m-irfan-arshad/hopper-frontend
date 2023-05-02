import { render, renderHook, fireEvent, waitFor, within } from '@testing-library/react'        
import { useForm, FormProvider } from "react-hook-form";
import { mockSingleProduct } from "../../../../testReference";
import ProductTab from '../productTab';

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    QueryClient: jest.fn(),
    useQuery: jest.fn().mockImplementation((queryKeyList) =>{
        const queryKey = queryKeyList[0]
        if (queryKey === 'getManufacturers') {
            return {data: [{manufacturerName: "Manufacturer Test"}]}
        } else if (queryKey === 'getVendors') {
            return {data: [{vendorName: "Vendor Test"}]}
        } else if (queryKey === 'getProducts') {
            return {data: [{productName: "Other"}, {productName: "Product 1", productType: {productType: "Product Type 1"}}]}
        }
        return []
    })
}));  


const ProductFormWrapper = (props: any) => {
    const formMethods = useForm({
        defaultValues: {
            productTab: [mockSingleProduct]
        }
    });

    return (
      <FormProvider {...formMethods}>
        {props.children}
      </FormProvider>
    );
  };


describe("ProductTab", () => {
    test("renders the product tab", () => {
        const { queryAllByText, getByText, getByLabelText, getByRole } = render(
            <ProductFormWrapper>
                <ProductTab />
            </ProductFormWrapper>
        );  

        expect(queryAllByText("Product").length).toEqual(2);
        expect(getByText("Product Type")).toBeInTheDocument();
        expect(getByText("Catalog Number")).toBeInTheDocument();
        expect(getByText("Representative")).toBeInTheDocument();
        expect(getByText("Tray Delivery Details")).toBeInTheDocument();
        expect(getByText("Statuses")).toBeInTheDocument();
    });
});