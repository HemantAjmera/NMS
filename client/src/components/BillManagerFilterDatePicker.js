import { Calendar } from 'primereact/calendar';
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/appContext';
const BillManagerFilterDatePicker = ({setSelectedDate}) => {
    const { fetchBillsStartEndDate } = useAppContext();
    let [dates, setDates] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            let data = await fetchBillsStartEndDate();
            let startDate = new Date(data.startDate)
            startDate.setHours(0,0,0,0);
            let endDate = new Date(data.endDate)
            endDate.setHours(0,0,0,0);
            setDates([startDate,endDate])
        }
        fetchData();
        // eslint-disable-next-line
    },[])
    const onDateChangeHandler = (e) => {
        if(e === null) return;
        setSelectedDate(e)
        //fetchBillsByDate(e)
    }
    return <> {dates &&  <Calendar  onChange={(e) => onDateChangeHandler(e.value)} minDate={dates[0]} maxDate={dates[1]}  inline />} </>
}

export default BillManagerFilterDatePicker;