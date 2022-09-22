import { Dropdown } from 'primereact/dropdown'
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/appContext';
const DashboardHomeBillChart = () => {
    const { fetchBillsStartEndDate, fetchBillsMonthByYear, fetchAmountsByMonth } = useAppContext();
    const [selectedYear, setSelectedYear] = useState(null);
    const [years, setYears] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [months, setMonths] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [totalPaid, setTotalPaid] = useState(0)
    const [totalDue, setTotalDue] = useState(0)
    const monthNames = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
        "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchBillsStartEndDate();
            let startDate = new Date(data.startDate)
            let endDate = new Date(data.endDate)
            let yearList = []
            for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
                yearList.push({ name: year.toString(), code: year.toString() })
            }
            setYears(yearList)
        }
        fetchData();
    }, [])
    useEffect(() => {
        if (selectedYear !== null) {
            const fetchData = async () => {
                const data = await fetchBillsMonthByYear(selectedYear);
                let monthList = []
                for (let month = data.startMonth; month <= data.endMonth; month++) {
                    monthList.push({ name: monthNames[month], code: monthNames[month] })
                }
                setMonths(monthList)
                
            }
            fetchData();
        }
    }, [selectedYear])
    useEffect(()=> {
        if(selectedYear !== null && selectedMonth !== null){
            const fetchData = async () => {
                const data = await fetchAmountsByMonth(monthNames.indexOf(selectedMonth), selectedYear)
                setTotalAmount(data.amounts.totalAmount)
                setTotalPaid(data.amounts.totalPaid)
                setTotalDue(data.amounts.totalDue)
            }
            fetchData();
        }
    }, [selectedMonth])
    const onYearChange = (e) => {
        setSelectedYear(e.value.code)
    }
    const onMonthChange = (e) => {
        setSelectedMonth(e.value.code)
    }
    const amountTemplate = (data) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(data);
    };
    return <>
        <div className="grid">
            <div className="col-12 ">
                <div className="grid ">
                    <div className="col-12 sm:col-12 md:col-6 flex justify-content-center sm:justify-content-center md:justify-content-end  align-items-center">
                        <h3 className="pr-1">वर्ष चुनें: </h3>
                        {years && <Dropdown value={selectedYear} options={years} onChange={onYearChange} optionLabel="name" emptyMessage="खाली" placeholder={selectedYear || "वर्ष चुनें"} />}
                    </div>
                    <div className="col-12 sm:col-12 md:col-6 flex justify-content-center sm:justify-content-center md:justify-content-start  align-items-center">
                        <h3 className="pr-1">महीना चुनें: </h3>
                        {(months && years) && <Dropdown value={selectedMonth} options={months} onChange={onMonthChange} optionLabel="code" emptyMessage="पहला वर्ष चुनें" placeholder={selectedMonth || "महीना चुनें"} />}
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="grid ">
                    <div className="col-12 sm:col-6 md:col-4 ">
                        <div  className="flex justify-content-center align-items-center">
                            <h2 className="mb-0" style={{fontFamily:"Hindi-Regular", fontSize:"2em" }}>कुल राशि</h2>
                        </div>
                        <div className="flex justify-content-center align-items-center">
                            <h2>{amountTemplate(totalAmount)}</h2>
                        </div>
                    </div>
                    <div className="col-12 sm:col-6 md:col-4">
                        <div className="flex justify-content-center align-items-center">
                            <h2 className="mb-0" style={{fontFamily:"Hindi-Regular", fontSize:"2em" }}>पूर्ण भुगतान</h2>
                        </div>
                        <div className="flex justify-content-center align-items-center">
                            <h2>{amountTemplate(totalPaid)}</h2>
                        </div>
                    </div>
                    <div className="col-12 sm:col-12 md:col-4">
                        <div className="flex justify-content-center align-items-center">
                            <h2 className="mb-0" style={{fontFamily:"Hindi-Regular", fontSize:"2em" }}>कुल बचे</h2>
                        </div>
                        <div className="flex justify-content-center align-items-center">
                            <h2>{amountTemplate(totalDue)}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default DashboardHomeBillChart