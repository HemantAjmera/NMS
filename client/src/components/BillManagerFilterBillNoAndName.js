import { InputNumber } from 'primereact/inputnumber'
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
const BillManagerFilterBillNoAndName = ({ setBillNo, setName, setIsSearchBtnClicked }) => {

    return <><div className="grid flex">
        <div className="col-12 flex justify-content-center sm:justify-content-center md:justify-content-center  align-items-center">
            <div >
                <p className='m-1' htmlFor="BillNo">बिल न.</p>
                <InputNumber name="BillNo" min={0} format={false} onChange={(e) => { setBillNo(e.value) }} />
            </div>
        </div>
        <div className="col-12 flex justify-content-center sm:justify-content-center md:justify-content-center  align-items-center">
            <div>

            <p className='m-1' htmlFor="Name">नाम</p>
            <InputText name="Name" onChange={(e) => { setName(e.target.value) }} />
            </div>
        </div>
        <div className="col-12 flex justify-content-center sm:justify-content-center md:justify-content-center  align-items-center">
            <Button label="ढूढें" onClick={() => setIsSearchBtnClicked(true)} />
        </div>
    </div></>
}
export default BillManagerFilterBillNoAndName