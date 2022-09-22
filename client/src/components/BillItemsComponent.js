import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useAppContext } from "../context/appContext";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { useState } from "react";
import { InputSwitch } from 'primereact/inputswitch';
import SingleBillItem from "./SingleBillItem";

const BillItemsComponent = () => {
    console.log("billComponent Items")
    const {
        treeNames,
        treeSizes,
        addRowInBillTable,
        billTableData,
        removeRowInBillTable,
        updateSizeRowInBillTable,
        updateRowInBillTable,
        updateBillAmounts,
        isLoading,
        isAddTreeWindow,
        changeAddTreeWindowToggle,
    } = useAppContext();
    const [visibleSingleBillItem, setVisibleSingleBillItem] = useState(false)
    const [selectedTree, setSelectedTree] = useState("")
    /////////////////////////////////////
    const onChangeTree = (e) => {
        if (e.originalEvent.type !== "click") return;
        if (billTableData.length > 99) return;
        const tree = treeNames.filter((names) => names.value === e.value).map((data) => data.label).toString()
        if(isAddTreeWindow){
            setSelectedTree(tree)
            setVisibleSingleBillItem(true)
        }else{

            addRowInBillTable({
                no: billTableData.length + 1,
                tree: tree,
                size: "",
                quantity: 0,
                price: 0,
                totalPrice: 0,
            });
        }
    
    };
    //////////////////////////////

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
        }).format(rowData.price);
    };
    const totalPriceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
        }).format(rowData.totalPrice);
    };
    const isPositiveInteger = (val) => {
        let str = String(val);
        str = str.trim();
        if (!str) {
            return false;
        }
        str = str.replace(/^0+/, "") || "0";
        let n = Math.floor(Number(str));
        return n !== Infinity && String(n) === str && n >= 0;
    };

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field, originalEvent: event } = e;

        switch (field) {
            case "price":
                if (isPositiveInteger(newValue)) {
                    rowData[field] = newValue;
                    rowData["totalPrice"] =
                        parseInt(rowData["quantity"]) *
                        parseInt(rowData["price"]);
                } else {
                    rowData["totalPrice"] =
                        rowData["quantity"] * rowData["price"];
                    event.preventDefault();
                }
                break;
            case "quantity":
                if (isPositiveInteger(newValue)) {
                    rowData[field] = newValue;
                    rowData["totalPrice"] =
                        parseInt(rowData["quantity"]) *
                        parseInt(rowData["price"]);
                } else {
                    rowData["totalPrice"] =
                        rowData["quantity"] * rowData["price"];
                    event.preventDefault();
                }
                break;
            default:
                if (newValue.length > 0) rowData[field] = newValue;
                else event.preventDefault();
                break;
        }
        updateRowInBillTable(billTableData);
        //updateBillAmounts();
    };
    const cellEditor = (options) => {
        if (options.field === "price" || options.field === "quantity") {
            return priceEditor(options);
        } else {
            return textEditor(options);
        }
    };
    const textEditor = (options) => {
        return (
            <InputText
                type="text"
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
            />
        );
    };
    const priceEditor = (options) => {
        if(isNaN(options.value)){
            return ;
        }
        return (
            <InputNumber
                value={options.value}
                onValueChange={(e) => {
                    console.log(e)
                    if (isNaN(e.value) || e === undefined || e.value === undefined) {
                        return;
                    }
                    options.editorCallback(parseInt(e.value))
                }}
            />
        );

    };
    let _deleteOptions;
    const onDelectClickHandler = (e) => {
        removeRowInBillTable(_deleteOptions.rowData.no - 1);
        updateBillAmounts();
    };
    const deleteEditor = (options) => {
        _deleteOptions = options;
        return (
            <Button
                disabled={isLoading}
                label="X"
                className="p-button-link"
                onClick={onDelectClickHandler}
            />
        );
    };
    ////////////////////
    let _sizeOptions;
    const onSizeChangeHandler = (e) => {
        updateSizeRowInBillTable(_sizeOptions.rowIndex, e.value);
    };
    const sizeCellEditor = (options) => {
        _sizeOptions = options;
        return (
            <Dropdown
                value={options.value}
                options={treeSizes}
                onChange={(e) => onSizeChangeHandler(e)}
            />
        );
    };

    return (
        <>
            <div className="grid ">
                <div className="col-12 flex justify-content-end text-center align-items-center gap-2">
                    <p>एक एक जोड़ें</p>
                    <InputSwitch checked={isAddTreeWindow} onChange={(e) => changeAddTreeWindowToggle(e.value)} />
                    <Dropdown
                        disabled={isLoading}
                        showFilterClear
                        filter
                        filterBy="value"
                        options={treeNames}
                        onChange={onChangeTree}
                        placeholder="पेडो के नाम"
                    />
                </div>
                <div className="col-12">
                    <DataTable
                        editMode="cell"
                        className="editable-cells-table"
                        value={billTableData}
                        scrollable={true}
                        scrollHeight="400px"
                        responsiveLayout="scroll"
                    >
                        <Column key={"no"} field={"no"} header={"न."} />
                        <Column
                            key={"tree"}
                            field={"tree"}
                            header={"पेड़"}
                            editor={(options) => cellEditor(options)}
                            onCellEditComplete={onCellEditComplete}
                        />
                        <Column
                            key={"size"}
                            field={"size"}
                            header={"आकार"}
                            editor={(options) => sizeCellEditor(options)}
                        />
                        <Column
                            key={"quantity"}
                            field={"quantity"}
                            header={"मात्रा"}
                            editor={(options) => cellEditor(options)}
                            onCellEditComplete={onCellEditComplete}
                        />
                        <Column
                            key={"price"}
                            field={"price"}
                            header={"कीमत"}
                            body={priceBodyTemplate}
                            editor={(options) => cellEditor(options)}
                            onCellEditComplete={onCellEditComplete}
                        />
                        <Column
                            key={"totalPrice"}
                            field={"totalPrice"}
                            header={"कुल कीमत"}
                            body={totalPriceBodyTemplate}
                        />
                        <Column
                            key={"action"}
                            field={"action"}
                            header={"हटाना"}
                            body={"X"}
                            editor={(options) => deleteEditor(options)}
                        />
                    </DataTable>
                </div>
            </div>
            <SingleBillItem visibleSingleBillItem={visibleSingleBillItem} setVisibleSingleBillItem={setVisibleSingleBillItem} selectedTreeName={selectedTree}/>
        </>
    );
};
export default BillItemsComponent;
