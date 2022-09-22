import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { useAppContext } from '../context/appContext';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button'
import BillSettlement from './BillSettlemenet';
const BillManagerBillsTable = ({ selectedDate, billNo, name, isSearchBtnClicked, setIsSearchBtnClicked }) => {
    const { fetchBillsByDate, fetchBillsByBillNoAndName } = useAppContext();
    const [records, setRecords] = useState([])
    const [visible, setVisible] = useState(false)
    const [selectedBill, setSelectedBill] = useState(null)
    useEffect(() => {
        const fetchData = async (selectedDate) => {
            let startDate = new Date(selectedDate)
            if (selectedDate !== null) {
                startDate = new Date(selectedDate)
            } else {
                startDate = new Date()
            }
            startDate.setHours(0, 0, 0, 0)
            let endDate = new Date()
            endDate.setDate(startDate.getDate() + 1)
            endDate.setHours(0, 0, 0, 0);
            const data = await fetchBillsByDate(startDate, endDate)
            setRecords(data.filteredBills)
        }
        fetchData(selectedDate);
        // eslint-disable-next-line
    }, [selectedDate,visible])
    useEffect(() => {
        if (isSearchBtnClicked) {
            const fetchData = async (selectedDate) => {
                let data = []
                if ((billNo !== null && billNo !== undefined && billNo !== "") && (name !== null && name !== undefined && name !== "")) {
                    data = await fetchBillsByBillNoAndName(billNo, name)
                } else if ((billNo !== null && billNo !== undefined && billNo !== "")) {
                    data = await fetchBillsByBillNoAndName(billNo, "")
                } else if ((name !== null && name !== undefined && name !== "")) {
                    data = await fetchBillsByBillNoAndName("", name)
                }
                if (data !== []) {
                    setRecords(data.filteredBills)
                }
            }
            fetchData();
        }
        setIsSearchBtnClicked(false)
        // eslint-disable-next-line
    }, [isSearchBtnClicked,visible])
    const amountTemplate = (row, type) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(row[type]);
    };
    const editTemplate = (e) => {
        return <Button label="एडिट" className="p-button-link" onClick={(o) => onEditClickHandler(o, e)} />
    }
    const onEditClickHandler = (o, bill) => {

        setSelectedBill(bill)
        setVisible(true);
    }
    return <>
        <DataTable value={records}
            scrollHeight="400px"
            stripedRows
            showGridlines
            responsiveLayout="scroll">
            <Column field="Action" header="एडिट" body={editTemplate}></Column>
            <Column field="billNo" header="बिल न."  ></Column>
            <Column field="customerName" header="नाम" ></Column>
            <Column field="totalPrice" header="कीमत" body={(e) => amountTemplate(e, 'totalPrice')}></Column>
            <Column field="totalPaid" header="भुगतान" body={(e) => amountTemplate(e, 'totalPaid')}></Column>
            <Column field="dueAmount" header="बकाया" body={(e) => amountTemplate(e, 'dueAmount')}></Column>
        </DataTable>
        <BillSettlement visible={visible} setVisible={setVisible} bill={selectedBill} redirectLocation={"/dashboard/bill"}/></>
}
export default BillManagerBillsTable;