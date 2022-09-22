import BillManagerFilterDatePicker from "./BillManagerFilterDatePicker";
import BillManagerBillsTable from "./BillManagerBillsTable";

import { useState } from "react";
import BillManagerFilterBillNoAndName from "./BillManagerFilterBillNoAndName";

const BillManager = () => {
    const [selectedDate, setSelectedDate] = useState(null)
    const [billNo, setBillNo] = useState();
    const [name, setName] = useState("")
    const [isSearchBtnClicked, setIsSearchBtnClicked] = useState(false)
    return <div>
        <h1 style={{ fontFamily: "Hindi-Regular" }}>बिल मैनेजर</h1>
        <div className="grid">
            <div className="col-12 ">
                <div>
                    <h2 style={{ fontFamily: "Hindi-Regular" }}>द्वारा खोजें</h2>
                </div>
                <div>
                    <div className="grid ">
                        <div className="col-12 sm:col-7 md:col-7 md-6 flex justify-content-center sm:justify-content-center md:justify-content-center align-items-center">
                            <BillManagerFilterDatePicker setSelectedDate={setSelectedDate} />
                        </div>
                        <div className="col-12 sm:col-5 md:col-5 md-6 sm:">
                            <BillManagerFilterBillNoAndName setBillNo={setBillNo} setName={setName} setIsSearchBtnClicked={setIsSearchBtnClicked}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 ">
                <div>
                    <h2 style={{ fontFamily: "Hindi-Regular" }}>बिल सूची</h2>
                </div>
                <div>
                    <BillManagerBillsTable selectedDate={selectedDate} billNo={billNo} name={name} isSearchBtnClicked={isSearchBtnClicked} setIsSearchBtnClicked={setIsSearchBtnClicked}/>
                </div>
            </div>
        </div>
    </div>
}
export default BillManager;