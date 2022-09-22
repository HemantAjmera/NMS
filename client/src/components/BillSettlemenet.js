import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react'
import { InputNumber } from "primereact/inputnumber";
import { Button } from 'primereact/button';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';
const BillSettlement = ({ visible, setVisible, bill, redirectLocation }) => {
    const navigate = useNavigate();
    const { isLoading, updateBill, lastBill, resetLastBillValue, fetchRecentBills,getAllBillTreeListById} = useAppContext();
    const [price, setPrice] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalPayable, setTotalPayable] = useState(0)
    const [totalPaid, setTotalPaid] = useState(0)
    const [totalDue, setTotalDue] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [payInCash, setPayInCash] = useState(0)
    const [payInOnline, setPayInOnline] = useState(0);
    const [billData, setBillData] = useState(null)
    useEffect(() => {
        if (bill === null) {
            if (setVisible !== null) {
                setVisible(false)
            }
            return;
        }
        setBillData(bill);
        setPrice(bill.price)
        setTotalPrice(bill.price + bill.loadingCharge)
        setTotalPayable(bill.price + bill.loadingCharge - bill.discount)
        setTotalPaid(bill.payInCash + bill.payInOnline)
        setTotalDue((bill.price + bill.loadingCharge - bill.discount) - (bill.payInCash + bill.payInOnline))
        setDiscount(bill.discount)
        setPayInCash(bill.payInCash)
        setPayInOnline(bill.payInOnline)
        // eslint-disable-next-line
    }, [bill])

    if (bill === null) {
        return (
            <></>
        );
    }
    const amountTemplate = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };
    const onDiscountChange = (e) => {
        if (e.value > totalPrice) {
            setDiscount(totalPrice);
            setTotalDue(0)
            setTotalPayable(0)
        } else if (e.value < 0) {
            setDiscount(0)
            setTotalDue(totalPrice)
            setTotalPayable(totalPrice)
        } else if (e.value <= totalPrice) {
            setDiscount(e.value)
            setTotalPayable(totalPrice - e.value)
            setTotalDue(totalPrice - e.value)
        }
        setPayInCash(0)
        setPayInOnline(0)
        setTotalPaid(0)
    }
    const onPayInCashChange = (e) => {
        if (e.value > (((totalPrice - discount) - payInOnline))) {
            setPayInCash(((totalPrice - discount) - payInOnline));
            setTotalPaid(payInOnline + payInCash)
            setTotalDue(totalPayable - (payInOnline + payInCash))
        } else if (e.value < 0) {
            setPayInCash(0)
            setTotalDue(totalPayable - payInOnline)
        } else if (e.value <= (((totalPrice - discount) - payInOnline))) {
            setPayInCash(e.value)
            setTotalPaid(e.value + payInOnline)
            setTotalDue(totalPayable - (e.value + payInOnline))
        }
    }
    const onPayInOnlineChange = (e) => {
        if (e.value > (((totalPrice - discount) - payInCash))) {
            setPayInOnline(((totalPrice - discount) - payInCash));
            setTotalPaid(payInOnline + payInCash)
            setTotalDue(totalPayable - (payInOnline + payInCash))
        } else if (e.value < 0) {
            setPayInOnline(0)
            setTotalDue(totalPayable - payInCash)
        } else if (e.value <= (((totalPrice - discount) - payInCash))) {
            setPayInOnline(e.value)
            setTotalPaid(e.value + payInCash)
            setTotalDue(totalPayable - (e.value + payInCash))
        }
    }
    const onSaveHandler = () => {
        const finalBill = {
            _id: billData._id,
            price: price,
            discount: discount,
            totalPrice: totalPrice,
            payInCash: payInCash,
            payInOnline: payInOnline,
            totalPaid: totalPaid,
            dueAmount: totalDue,
        }
        
        updateBill({ finalBill })
        fetchRecentBills();
        setVisible(false)

    }
    const onPrintHandler = async () => {
        
        let data = await getAllBillTreeListById(billData.treeListId)
        if(data === null) return; 
        
        navigate("/printbill", {state: {billData:bill, billTrees:data.billTrees, redirectLocation:redirectLocation }});
    }
    const onHide = () => {
        setVisible(false)
        if (Object.keys(lastBill).length !== 0) {
            resetLastBillValue();
            fetchRecentBills();
        }
    }
    return <Dialog header={bill.customerName} visible={visible} onHide={onHide} className=" w-full sm:w-full md:w-10 lg:w-9 xl:w-7 " >
        <div className='grid'>
            <div className='col-12 flex justify-content-end'>
            <div>
                    <Button
                        icon="pi pi-print"
                        disabled={isLoading}
                        onClick={onPrintHandler}
                    />
                </div>
            </div>
            <div className='col-12 flex justify-content-center'>
                <p className='text-xl font-bold m-1' style={{ letterSpacing: "1px" }}> बिल न. {bill.billNo}</p>
            </div>
            <div className='col-12 sm:col-6'>
                <div className='grid'>
                    <div className='col-6 flex justify-content-end text-lg font-semibold'>
                    कीमत:
                    </div>
                    <div className='col-6 text-lg font-bold'>
                        {amountTemplate(price)}
                    </div>
                </div>
            </div>

            <div className='col-12 sm:col-6'>
                <div className='grid'>
                    <div className='col-6 flex justify-content-end text-lg font-semibold'>
                    लोड चार्ज:
                    </div>
                    <div className='col-6 text-lg font-bold'>
                        {amountTemplate(bill.loadingCharge)}
                    </div>
                </div>
            </div>


            <div className='col-12 sm:col-6'>
                <div className='grid'>
                    <div className='col-6 flex justify-content-end text-lg font-semibold'>
                    लोड + कीमत:
                    </div>
                    <div className='col-6 text-lg font-bold'>
                        {amountTemplate(totalPrice)}
                    </div>
                </div>
            </div>


            <div className='col-12 sm:col-6'>
                <div className='grid'>
                    <div className='col-6 flex justify-content-end text-lg font-semibold'>
                        कुल देय:
                    </div>
                    <div className='col-6 text-lg font-bold'>
                        {amountTemplate(totalPayable)}
                    </div>
                </div>
            </div>

            <div className='col-12 sm:col-6'>
                <div className='grid'>
                    <div className='col-6 flex justify-content-end text-lg font-semibold'>
                    पूर्ण भुगतान:
                    </div>
                    <div className='col-6 text-lg font-bold'>
                        {amountTemplate(totalPaid)}
                    </div>
                </div>
            </div>


            <div className='col-12 sm:col-6'>
                <div className='grid'>
                    <div className='col-6 flex justify-content-end text-lg font-semibold'>
                       
                    बकाया:
                    </div>
                    <div className='col-6 text-lg font-bold '>
                        {amountTemplate(totalDue)}
                    </div>
                </div>
            </div>


            <div className='col-12 flex justify-content-center'>
                <div>
                    <p className='m-1' htmlFor="Discount">डिस्काउंट</p>
                    <InputNumber name="discount" min={0} max={(bill.loadingCharge + bill.price)} value={discount} onChange={onDiscountChange} />
                </div>
            </div>
            <div className='col-12 flex justify-content-center' >
                <div>
                    <p className='m-1' htmlFor="PayInCash">नकदी भुगतान</p>
                    <InputNumber name="PayInCash" min={0} max={(((bill.loadingCharge + bill.price) - discount) - payInOnline)} value={payInCash} onChange={onPayInCashChange} />
                </div>
            </div>
            <div className='col-12 flex justify-content-center'>
                <div>
                    <p className='m-1' htmlFor="PayInOnline">ऑनलाइन भुगतान</p>
                    <InputNumber name="PayInOnline" min={0} max={(((bill.loadingCharge + bill.price) - discount) - payInCash)} value={payInOnline} onChange={onPayInOnlineChange} />
                </div>
            </div>
            <div className='col-12 flex justify-content-center'>
                <div>
                    <Button
                        label="सेव करे"
                        disabled={isLoading}
                        onClick={onSaveHandler}
                    />
                </div>
            </div>
        </div>
    </Dialog>
    // return <ConfirmDialog visible={visible} className="h-6rem" onHide={() => setVisible(false)} message={body}
    //     header="Update Bill Amounts" accept={accept} />
}

export default BillSettlement