import { InputText } from "primereact/inputtext";
import { useAppContext } from "../context/appContext";
import { Button } from "primereact/button";
const StaffBillConfirmComponent = () => {
    const { customerName,
        updateCustomerName, isLoading, draftBill, billTableData, customerNumber, updateCustomerNumber } = useAppContext();
    const onBillSubmit = () => {
        draftBill();
        console.log("Send done!")
    }
    return <div>
        <div className="grid">
            <div className="gap-2 col-12 flex justify-content-center align-items-center">
                ग्राहक का नाम :

                <div >
                    <InputText
                        value={customerName}
                        onChange={(e) => updateCustomerName(e.target.value)}
                    />
                </div>
            </div>
            <div className="gap-2 col-12 flex justify-content-center align-items-center">
            मोबाइल नंबर :

                <div >
                    <InputText
                        value={customerNumber}
                        maxLength={32}
                        className="p-2 w-full md:w-8 xl:w-10"
                        onChange={(e) => updateCustomerNumber(e.target.value)}
                    />
                </div>
            </div>
            <div className="col-12 flex justify-content-center align-items-center">
                <Button
                    label="बिल भेजे"
                    disabled={isLoading || billTableData.length <= 0 || customerName.length <= 0}
                    onClick={onBillSubmit}
                />
            </div>

        </div>
    </div>
}

export default StaffBillConfirmComponent;