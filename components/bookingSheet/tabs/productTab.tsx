import React, { useState } from "react";
import { 
    Typography, 
    Grid, 
    Box,
    Divider,
    Link,
    Checkbox,
    Dialog,
    DialogActions,
    Button,
    DialogTitle,
    DialogContent
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {InputController, DropDownSearchController, ConfigWrapper} from '../../../utils/formControllers'
import {IndexObject} from "../../../reference";
import DropDownSearchComponent from "../../shared/dropdownSearch";
import { 
    Delete as DeleteIcon
  } from "@mui/icons-material";
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { useGetDropdownOptionsHook } from "../../../utils/hooks";
import * as R from "ramda"
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

interface CreateProductModalProps {
    open: boolean,
    closeDialog: () => void
    append: ({}) => void
}

interface ProductRowProps {
    index: number,
    remove: any,
    productName: string,
    productType: string,
    manufacturer: {
        manufacturerName: string
    },
    quantity: number,
    catalogNumber: string,
    vendor: {
        vendorName: string
    },
    vendorConfirmation: Boolean,
    implantDelivery: Boolean,
    trayDelivery: Boolean,
    sterilization: Boolean
}

function HeaderCell(props: {title: string, size: number}) {
    return (<Grid item xs={props.size} sx={{backgroundColor: 'gray.light', width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '3.5rem'}}>
        <Typography variant="body2" >{props.title}</Typography>
    </Grid>)
}

function StatusCheckbox(props: {id: string, title: string, value: Boolean}) {
    const { control } = useFormContext();
    const {id, title, value} = props;
    return <ConfigWrapper id={id} size={16}>
        <Controller
        name={id}
        control={control}
        render={({ field }) => {
            return (<Box sx={{display: 'flex', alignItems: 'center'}}>
                <Checkbox
                    {...field}
                    checked={field.value}
                    id={id}
                    value={value}
                    size="small"
                    sx={{height: "2rem"}}
                    inputProps={{ 'aria-label': 'controlled', height: "1rem" }}
                    onChange={field.onChange}
                />
                <Typography variant="body2">{title}</Typography>
            </Box>
        )}} />
    </ConfigWrapper>
}

function ProductRow(props: ProductRowProps){
    const {index, remove, quantity, productType, productName, manufacturer, catalogNumber, vendor, vendorConfirmation, implantDelivery, trayDelivery, sterilization} = props;
    const [showDelete, setShowDelete] = useState(false);
    return (
        <React.Fragment>
        <Grid container columns={16} width={"100%"} marginTop={"0.85rem"} 
        onMouseOver={() => setShowDelete(true)}
        onMouseOut={() => setShowDelete(false)}>
            <Grid item xs={0.5} sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                {showDelete && <DeleteIcon sx={{height:"1.3rem", cursor:"pointer"}} onClick={()=>remove(index)}/>}
                </Grid>
            <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{fontWeight: 700, color: "black.main"}}>{productName}</Typography>
                <Typography variant="body2">{manufacturer?.manufacturerName}</Typography>
                <Typography variant="body2" sx={{display: 'flex', alignItems:"center"}}>
                    Quantity: 
                        <InputController 
                        title=""
                        id={`productTab.${index}.quantity`}
                        placeholder="" 
                        size={5}
                        type="number"
                        config={{}}
                    />
                </Typography>
            </Grid>
            <Grid item xs={2}><Typography variant="body2">{productType}</Typography></Grid>
            <Grid item xs={2}><Typography variant="body2">{catalogNumber}</Typography></Grid>
            <Grid item xs={2}><Typography variant="body2">{vendor?.vendorName}</Typography></Grid>
            <Grid item xs={2.5}><Link underline="none" variant="body2">Manage Trays</Link></Grid>
            <Grid item xs={3}>
                <StatusCheckbox id={`productTab.${index}.vendorConfirmation`} title="Vendor Confirmation" value={vendorConfirmation}/>
                <StatusCheckbox id={`productTab.${index}.implantDelivery`} title="Implant Delivery" value={implantDelivery}/>
                <StatusCheckbox id={`productTab.${index}.trayDelivery`}  title="Tray Delivery" value={trayDelivery}/>
                <StatusCheckbox id={`productTab.${index}.sterilization`} title="Sterilization" value={sterilization}/>
            </Grid>
        </Grid>
        <Divider light sx={{marginTop: "1rem", marginBottom: "1.6rem"}}/>
        </React.Fragment>
    )
}

export function CreateProductModal(props: CreateProductModalProps){
    const {open, closeDialog, append} = props;
    const schema = yup.object().shape({
        productName: yup.string().required(),
        productType: yup.object().shape({
            productType: yup.string().required(),
        }),
        manufacturer: yup.object().shape({
            manufacturerName: yup.string().required(),
        }),
        vendor: yup.object().shape({
            vendorName: yup.string().required(),
        }),
        catalogNumber: yup.string().required()
    })
    const form = useForm({ 
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
          productName: "",
          productType: null,
          manufacturer: null,
          vendor: null,
          catalogNumber: ""
        }
      });
      
    const { handleSubmit, reset, formState: { isValid } } = form;

    const onSubmit = (data: IndexObject) => {
        append({
            manufacturer: data.manufacturer,
            quantity: 1,
            productName: data.productName,
            productType: data.productType.productType,
            catalogNumber: data.catalogNumber,
            vendor: data.vendor,
            vendorConfirmation: false,
            implantDelivery: false,
            trayDelivery: false,
            sterilization: false
        });
        reset()
        closeDialog();
      };

    return (
        <Dialog fullWidth open={open} maxWidth="sm" sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
            <DialogTitle sx={{fontWeight: 400, color: 'gray.dark', fontSize: '1.5rem'}}>Other</DialogTitle> 
            <DialogContent>
                <Grid container width={"100%"} rowSpacing={"0.65rem"}>
                <FormProvider {...form}>
                    <InputController id="productName" title="Product Name" placeholder="Product Name" size={12}/>
                    <DropDownSearchController 
                        title="Product Manufacturer"
                        id="manufacturer"
                        labelProperties={["manufacturerName"]}
                        placeholder="Product Manufacturer" 
                        queryKey="getManufacturers"
                        size={12} 
                        config={{}}
                    />
                    <DropDownSearchController 
                        title="Product Type"
                        id="productType"
                        labelProperties={["productType"]}
                        placeholder="Product Type" 
                        queryKey="getProductTypes"
                        size={12} 
                        config={{}}
                    />
                    <DropDownSearchController 
                        title="Vendor Representative"
                        id="vendor"
                        labelProperties={["vendorName"]}
                        placeholder="Vendor Representative" 
                        queryKey="getVendors"
                        size={12} 
                        config={{}}
                    />
                    <InputController id="catalogNumber" title="Catalog Number" placeholder="Catalog Number" size={12}/>
                </FormProvider>
                </Grid>
            </DialogContent>
            <DialogActions 
                sx={{
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    borderTop: "0.063rem solid", 
                    padding: "0.625rem", 
                    borderColor: "gray.main"
                }}>
                <Button 
                    onClick={() => closeDialog()}
                    sx={{ color: "grey", padding: "0.625rem"}}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit(onSubmit)}
                    disabled={!isValid}
                    sx={{
                        backgroundColor: isValid ? "blue.main" : "gray.main",
                        border: 1,
                        borderColor: isValid ? "blue.main" : "gray.main",
                        marginRight: "1.75rem",
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default function ProductTab() {
    const { control, getValues, formState: {errors} } = useFormContext();
    const { append, remove, fields } = useFieldArray({control, name: "productTab"});
    const { data: productData = [] } = useGetDropdownOptionsHook({queryKey: "getProducts", paramString: "", dependency: undefined})
    const [isProductModalOpen, setProductModalState] = useState(false)

    function onSelectProduct(productOption: {productName: string, productType: {productType: string}}){
        if (productOption.productName === "Other") {
            setProductModalState(true)
        } else {
            append({
                manufacturer: undefined,
                quantity: 1,
                productName: productOption.productName,
                productType: productOption.productType.productType,
                catalogNumber: "",
                vendor: undefined,
                vendorConfirmation: false,
                implantDelivery: false,
                trayDelivery: false,
                sterilization: false
            })
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Typography variant="h5" sx={{marginTop: "2.25rem", marginBottom: "2.25rem", color: "gray.dark"}}>Product</Typography>
            {!R.isEmpty(fields) && <Grid container columns={16} width={"100%"} sx={{position: "sticky", top: 0, zIndex: 1}}>
                <HeaderCell title="" size={0.5} />
                <HeaderCell title="Product" size={4} />
                <HeaderCell title="Product Type" size={2} />
                <HeaderCell title="Catalog Number" size={2} />
                <HeaderCell title="Representative" size={2} />
                <HeaderCell title="Tray Delivery Details" size={2.5} />
                <HeaderCell title="Statuses" size={3} />
            </Grid>}
            {fields.map((item, index)=>(<React.Fragment key={item.id}>
                <ProductRow index={index} {...getValues(`productTab.${index}`)} remove={remove}/>
            </React.Fragment>))}
            <Grid container width={"100%"}>
                <Typography variant="body2" sx={{fontSize: "0.88rem", marginTop: "0.25rem", marginBottom: "0.25rem", color: "gray.dark"}}>Add Product</Typography>
                <Grid item xs={12}>
                    <DropDownSearchComponent
                        label=""
                        labelProperties={["productName"]}
                        options={productData}
                        onChange={onSelectProduct}
                        placeholder="Select Product"  
                        error={false}
                        value={{}}
                    />
                </Grid>
            </Grid>
            <CreateProductModal open={isProductModalOpen} closeDialog={()=>setProductModalState(false)} append={append}/>         
        </LocalizationProvider>
    )
}
