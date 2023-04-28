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

interface Props {
    config: BookingSheetConfig,
}

interface ProductRowProps {
    index: number
    productName: string,
    manufacturer: {
        manufacturerName: string
    },
    quantity: number,
    productType: {
        productType: string
    },
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

function StatusCheckbox(props: {id: string, title: string}) {
    const { control } = useFormContext();
    const {id, title} = props;
    return <ConfigWrapper id={id} config={{}} size={16} styles={{}}><Controller
    name={id}
    control={control}
    render={({ field }) => {
        const onChangeFunc = field.onChange;
        return (<Box sx={{display: 'flex', alignItems: 'center'}}>
            <Checkbox
                {...field}
                checked={field.value}
                id={id}
                size="small"
                sx={{height: "2rem"}}
                inputProps={{ 'aria-label': 'controlled', height: "1rem" }}
                onChange={onChangeFunc}
            />
            <Typography variant="body2">{title}</Typography>
        </Box>
    )}}
  /></ConfigWrapper>
}

function ProductRow(props: ProductRowProps){
    const {index, productName, manufacturer, quantity, productType, catalogNumber, vendor, vendorConfirmation, implantDelivery, trayDelivery, sterilization} = props;
    const [showDelete, setShowDelete] = useState(false);
    return (
        <React.Fragment>
        <Grid container columns={16} width={"100%"} marginTop={"0.85rem"} 
        onMouseOver={() => setShowDelete(true)}
        onMouseOut={() => setShowDelete(false)}>
            <Grid item xs={0.5} sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                {showDelete && <DeleteIcon sx={{height:"1.3rem"}}/>}
                </Grid>
            <Grid item xs={4}>
                <Typography variant="subtitle2" sx={{fontWeight: 700, color: "black.main"}}>{productName}</Typography>
                <Typography variant="body2">{manufacturer.manufacturerName}</Typography>
                <Typography variant="body2" sx={{display: 'flex', alignItems:"center"}}>
                    Quantity: <TextField 
                        size="small" 
                        id={`product.${index}.quantity`} 
                        type="number" 
                        sx={{marginLeft: "0.5rem", width: "4.5rem", height: "2rem"}}
                        InputProps={{style: {height: "2rem"}}}
                        />
                </Typography>
            </Grid>
            <Grid item xs={2}><Typography variant="body2">{productType.productType}</Typography></Grid>
            <Grid item xs={2}><Typography variant="body2">{catalogNumber}</Typography></Grid>
            <Grid item xs={2}><Typography variant="body2">{vendor.vendorName}</Typography></Grid>
            <Grid item xs={2.5}><Link underline="none" variant="body2">Manage Trays</Link></Grid>
            <Grid item xs={3}>
                <StatusCheckbox id={`product.${index}.vendorConfirmation`} title="Vendor Confirmation" />
                <StatusCheckbox id={`product.${index}.implantDelivery`} title="Implant Delivery" />
                <StatusCheckbox id={`product.${index}.trayDelivery`}  title="Tray Delivery" />
                <StatusCheckbox id={`product.${index}.sterilization`} title="Sterilization" />
            </Grid>
        </Grid>
        <Divider light sx={{marginTop: "1rem", marginBottom: "1.6rem"}}/>
        </React.Fragment>
    )
}

export default function ProductTab(props: Props) {
    const {config} = props;
    const { control, getValues, trigger, formState: {errors} } = useFormContext();
    const { append, remove, fields } = useFieldArray({control, name: "product"});
    const sampleData = {
        productName: "Biolox delta Ceramic Femoral Head",
        manufacturer: {
            manufacturerName: "Zimmer Biolet"
        },
        quantity: 2,
        productType: {
            productType: "Implant"
        },
        catalogNumber: "122345",
        vendor: {
            vendorName: "Kendall R (SBOX-Medtel)"
        },
        vendorConfirmation: false,
        implantDelivery: false,
        trayDelivery: false,
        sterilization: false
    }
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
                <ProductRow index={0} {...sampleData} />
                
                <Grid container width={"100%"}>
                    <Typography variant="body2" sx={{fontSize: "0.88rem", marginTop: "0.25rem", marginBottom: "0.25rem", color: "gray.dark"}}>Add Product</Typography>
                    <Grid item xs={12}>
                        <DropDownSearchComponent
                            label=""
                            labelProperties={["product"]}
                            options={productData}
                            onChange={()=>{}}
                            placeholder="Select Product"                        
                            error={false}
                        />
                    </Grid>
                </Grid>
                    
            </LocalizationProvider>
    )
}

/*
{fields.map((item, index)=>(<React.Fragment key={item.id}>
                    <ProductRow index={index} {...getValues(`product.${index}`)} />
                </React.Fragment>))}
*/
