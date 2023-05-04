import { render, fireEvent, within, waitFor } from '@testing-library/react'        
import { useForm, FormProvider } from "react-hook-form";
import { mockSingleProduct } from "../../../../testReference";
import ProductTab, { CreateProductModal } from '../productTab';

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
        } else if (queryKey === 'getProductTypes') {
            return {data: [{productType: "Bone Graft"}]}
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


  export const mockSingledsProduct = {
    productTabId: 1, 
    manufacturerId: 1, 
    vendorId: 1,
    caseId: 1, 
    productName: "testProduct",
    productType: "testProductType",
    manufacturer: {
        manufacturerId: 1, 
        manufacturerName: "testManufacturer"
    },
    quantity: 2,
    catalogNumber: "12345",
    vendor: {
        vendorId: 1,
        vendorName: "testVendor"
    },
    vendorConfirmation: false,
    implantDelivery: false,
    trayDelivery: false,
    sterilization: false
  }

describe("ProductTab", () => {
    test("renders the product tab", () => {
        const { queryAllByText, getByText, getByLabelText, getByRole } = render(
            <ProductFormWrapper>
                <ProductTab />
            </ProductFormWrapper>
        );  

        expect(queryAllByText("Product").length).toEqual(2);
        expect(getByRole('heading', {name: 'Product'})).toBeInTheDocument();

        expect(getByText("Product Type")).toBeInTheDocument();
        expect(getByText("Catalog Number")).toBeInTheDocument();
        expect(getByText("Representative")).toBeInTheDocument();
        expect(getByText("Tray Delivery Details")).toBeInTheDocument();
        expect(getByText("Statuses")).toBeInTheDocument();

        expect(getByRole('heading', {name: 'testProduct'})).toBeInTheDocument();
        expect(getByText("testProductType")).toBeInTheDocument();
        expect(getByText("12345")).toBeInTheDocument();
        expect(getByText("testVendor")).toBeInTheDocument();
        expect(getByText("Quantity:")).toBeInTheDocument();

        expect(getByText("Vendor Confirmation")).toBeInTheDocument();
        expect(getByText("Implant Delivery")).toBeInTheDocument();
        expect(getByText("Tray Delivery")).toBeInTheDocument();
        expect(getByText("Sterilization")).toBeInTheDocument();
    });


    test("selecting product from dropdown adds a row to table", () => {
        const { queryAllByText, getByText, getByPlaceholderText, getByRole } = render(
            <ProductFormWrapper>
                <ProductTab />
            </ProductFormWrapper>
        );  

        expect(getByPlaceholderText("Select Product")).toBeInTheDocument();
        fireEvent.change(getByRole('combobox', {name: ''}), {target: {value: 'Product 1'}});
        expect(getByText("Product 1")).toBeInTheDocument();
        fireEvent.click(getByText("Product 1"))
        expect(getByText("Product Type 1")).toBeInTheDocument();
        expect(queryAllByText("Quantity:").length).toEqual(2);
    });

    test("renders the create product modal", () => {
        const mockClose = jest.fn()
        const mockAppend = jest.fn()
        const { queryAllByText, getByText, getByPlaceholderText, getByRole } = render(
                <CreateProductModal open={true} closeDialog={mockClose} append={mockAppend}/>
        );  

        expect(getByRole('textbox', {name: 'Product Name'})).toBeInTheDocument();
        expect(getByRole('combobox', {name: 'Product Manufacturer'})).toBeInTheDocument();
        expect(getByRole('combobox', {name: 'Product Type'})).toBeInTheDocument();
        expect(getByRole('combobox', {name: 'Vendor Representative'})).toBeInTheDocument();
        expect(getByRole('textbox', {name: 'Catalog Number'})).toBeInTheDocument();
    });

    test("can fill out product modal and submit form", async () => {
        const mockClose = jest.fn()
        const mockAppend = jest.fn()
        const { queryAllByText, getByText, getByPlaceholderText, getByRole } = render(
                <CreateProductModal open={true} closeDialog={mockClose} append={mockAppend}/>
        );  

        expect(getByRole('textbox', {name: 'Product Name'})).toBeInTheDocument();
        fireEvent.change(getByRole('textbox', {name: 'Product Name'}), {target: {value: 'Strawberries'}});

        expect(getByRole('combobox', {name: 'Product Manufacturer'})).toBeInTheDocument();
        fireEvent.change(getByRole('combobox', {name: 'Product Manufacturer'}), {target: {value: 'Manufacturer Test'}});
        expect(getByText("Manufacturer Test")).toBeInTheDocument();
        fireEvent.click(getByText("Manufacturer Test"))

        expect(getByRole('combobox', {name: 'Product Type'})).toBeInTheDocument();
        fireEvent.change(getByRole('combobox', {name: 'Product Type'}), {target: {value: 'Bone Graft'}});
        expect(getByText("Bone Graft")).toBeInTheDocument();
        fireEvent.click(getByText("Bone Graft"))

        expect(getByRole('combobox', {name: 'Vendor Representative'})).toBeInTheDocument();
        fireEvent.change(getByRole('combobox', {name: 'Vendor Representative'}), {target: {value: 'Vendor Test'}});
        expect(getByText("Vendor Test")).toBeInTheDocument();
        fireEvent.click(getByText("Vendor Test"))

        expect(getByRole('textbox', {name: 'Catalog Number'})).toBeInTheDocument();
        fireEvent.change(getByRole('textbox', {name: 'Catalog Number'}), {target: {value: '12345'}});

        await waitFor(() => {
            expect(getByRole('button', {name: 'Save'})).not.toBeDisabled();
            fireEvent.click(getByRole('button', {name: 'Save'}));
          })
      
        await waitFor(() => {
            expect(mockClose).toHaveBeenCalledTimes(1);
            expect(mockAppend).toHaveBeenCalledTimes(1);
            expect(mockAppend).toHaveBeenCalledWith({
                catalogNumber: "12345",
                implantDelivery: false,
                manufacturer: {
                    manufacturerName: "Manufacturer Test"
                },
                productName: "Strawberries",
                productType: "Bone Graft",
                quantity: 1,
                sterilization: false,
                trayDelivery: false,
                vendor: {
                    vendorName: "Vendor Test"
                },
                vendorConfirmation: false
            });
        })
    });
});