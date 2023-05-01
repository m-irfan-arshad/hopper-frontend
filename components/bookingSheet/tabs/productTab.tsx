import React, { useState } from "react";
import { 
    Typography, 
    Grid, 
    Box,
    Divider,
    TextField,
    Link,
    Checkbox,
    FormLabel
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {InputController, DateController, DropDownSearchController, CheckboxController, ConfigWrapper} from '../../../utils/formControllers'
import { BookingSheetConfig, productData } from "../../../reference";
import DropDownSearchComponent from "../../shared/dropdownSearch";
import { 
    Delete as DeleteIcon
  } from "@mui/icons-material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useGetDropdownOptionsHook } from "../../../utils/hooks";

interface Props {
    config: BookingSheetConfig,
}

interface ProductRowProps {
    index: number,
    remove: any,
    product: {
        productName: string,
        productType: string,
    },
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
    return (<Grid item xs={props.size} sx={{backgroundColor: 'gray.light', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '3.5rem'}}>
        <Typography variant="body2" >{props.title}</Typography>
    </Grid>)
}

function StatusCheckbox(props: {id: string, title: string, value: Boolean}) {
    const { control } = useFormContext();
    const {id, title, value} = props;
    return <ConfigWrapper id={id} config={{}} size={16} styles={{}}><Controller
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
    )}}
  /></ConfigWrapper>
}

function ProductRow(props: ProductRowProps){
    const {index, remove, quantity, product, manufacturer, catalogNumber, vendor, vendorConfirmation, implantDelivery, trayDelivery, sterilization} = props;
    const [showDelete, setShowDelete] = useState(false);
    return (
        <React.Fragment>
        <Grid container columns={16} width={"100%"} marginTop={"0.85rem"} 
        onMouseOver={() => setShowDelete(true)}
        onMouseOut={() => setShowDelete(false)}>
            <Grid item xs={0.5} sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                {showDelete && <DeleteIcon sx={{height:"1.3rem"}} onClick={()=>remove(index)}/>}
                </Grid>
            <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{fontWeight: 700, color: "black.main"}}>{product?.productName}</Typography>
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
            <Grid item xs={2}><Typography variant="body2">{product?.productType}</Typography></Grid>
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

export default function ProductTab(props: Props) {
    const {config} = props;
    const { control, getValues, trigger, formState: {errors} } = useFormContext();
    const { append, remove, fields } = useFieldArray({control, name: "productTab"});
    const { data: productData = [] } = useGetDropdownOptionsHook({queryKey: "getProducts", paramString: "", dependency: undefined})

    return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2.25rem", marginBottom: "2.25rem", color: "gray.dark"}}>Product</Typography>
                <Grid container columns={16} width={"100%"}>
                    <HeaderCell title="" size={0.5} />
                    <HeaderCell title="Product" size={4} />
                    <HeaderCell title="Product Type" size={2} />
                    <HeaderCell title="Catalog Number" size={2} />
                    <HeaderCell title="Representative" size={2} />
                    <HeaderCell title="Tray Delivery Details" size={2.5} />
                    <HeaderCell title="Statuses" size={3} />
                </Grid>
                {fields.map((item, index)=>(<React.Fragment key={item.id}>
                    <ProductRow index={index} {...getValues(`productTab.${index}`)} remove={remove}/>
                </React.Fragment>))}
                
                <Grid container width={"100%"}>
                    <Typography variant="body2" sx={{fontSize: "0.88rem", marginTop: "0.25rem", marginBottom: "0.25rem", color: "gray.dark"}}>Add Product</Typography>
                    <Grid item xs={12}>
                        <DropDownSearchComponent
                            label=""
                            id="productTab.product"
                            labelProperties={["productName"]}
                            options={productData}
                            onChange={(productOption) => append({
                                productId: productOption.productId,
                                manufacturer: undefined,
                                quantity: 1,
                                product: productOption,
                                catalogNumber: "122345",
                                vendor: undefined,
                                vendorConfirmation: false,
                                implantDelivery: false,
                                trayDelivery: false,
                                sterilization: false
                            })}
                            placeholder="Select Product"                        
                            error={false}
                        />
                    </Grid>
                </Grid>
                    
            </LocalizationProvider>
    )
}
