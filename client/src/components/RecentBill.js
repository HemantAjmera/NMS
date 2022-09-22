import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/appContext';
 
import BillSettlement from './BillSettlemenet';
const RecentBill = () => {
    const {fetchRecentBills, recentBillList, isFetching} = useAppContext();
    const [selectedBill, setSelectedBill] = useState(null)
    const [visible, setVisible] = useState(false)
    useEffect(()=> {
        fetchRecentBills()
    },[])
    if (isFetching) {
        return <h2>लोड हो रहा है</h2>;
    }
    const handleClick = (e, bill) => {
        setSelectedBill(bill)
        setVisible(true);
    }
    const amountTemplate = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };
    const footer = (bill) => {
        //console.log(bill)
        return <div>
           <p style={{margin:0}}>कुल देय: {amountTemplate(bill.price + bill.loadingCharge)}</p>
           <p style={{margin:0}}>बकाया: {amountTemplate(bill.dueAmount)}</p>
        </div>
    }
   
    return <>
        <h2 style={{fontFamily:"Hindi-Regular"}}>हाल ही के बिल</h2>
        <div style={{ overflow: "auto", whiteSpace: "nowrap" }}>
                {recentBillList.map((bill) => {
                    return <Card onClick={event => handleClick(event, bill)}  key={bill._id}  style={{ cursor: "pointer", display: "inline-block" }} className='w-min mx-2' title={bill.customerName !== "" ?  (bill.customerName.length > 14 ? bill.customerName.slice(0,13)+"..." : bill.customerName ) : "?"  } subTitle={"बिल न."+bill.billNo} footer={footer(bill)}/> ;
                })}
           
        </div>
        <BillSettlement visible={visible} setVisible={setVisible} bill={selectedBill}/>
       
    </>
}

export default RecentBill   