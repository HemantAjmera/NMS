import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useAppContext } from "../context/appContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DraftBillsList from "./DraftBillsList";
const BillCalculationComponent = () => {
    const {
        isLoading,
        billAmounts,
        updateBillAmountsWithPercent,
        customerName,
        updateCustomerName,
        resetBillState,
        displayPrintPreview,
        billTableData,
        updateBillNo,
        deleteDraft,
        customerNumber,
        updateCustomerNumber
    } = useAppContext();
    const [percentage, setPercentage] = useState(billAmounts.loadChargePer);
    const navigate = useNavigate();
    const amountTemplate = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };
    useEffect(() => {
        setPercentage(billAmounts.loadChargePer);
    }, [billAmounts.loadChargePer]);
    const onPercentChangeHandler = (e) => {
        if (e.value <= 0 || billAmounts.totalAmt <= 0) return;
        if (e.value > 0 && e.value <= 100) {
            updateBillAmountsWithPercent(e.value);
        } else {
            e.value = 100;
            updateBillAmountsWithPercent(100);
        }
    };

    const onPrintHandler = async () => {
        if (!(billTableData.length <= 0) && !(billAmounts.totalAmt <= 0)) {
            await updateBillNo();
            deleteDraft();
            displayPrintPreview(false);
            updateBillAmountsWithPercent(percentage)
            navigate("/printbill");
        }
    };
    const onPrintPreviewHandler = () => {
        if (!(billTableData.length <= 0) && !(billAmounts.totalAmt <= 0)) {
            displayPrintPreview(true);
            navigate("/printbill");
        }
    };

    const onCalculateBtnClickHandler = () => {
        updateBillAmountsWithPercent(percentage);
    };
    const onRestBtnClickHandler = () => {
        setPercentage(1);
        resetBillState();
    };
    return (
        <div className="grid gap-1 p-1 sm:px-4 md:px-12 lg:px-12 xl:px-1   xl:py-1 ">
            <div className="col-12 flex justify-content-center align-items-center  gap-8">
                <DraftBillsList/>
                <Button  label="सब हटाओ" onClick={onRestBtnClickHandler} />
            </div>
            <div className="col-12 border-2 border-round-md surface-border">
                <div className="grid">
                    <div className="col-6 flex justify-content-end align-items-center">
                        <p className="m-0  p-0" style={{fontFamily:"Hindi-Regular" ,'fontSize': '1.1em' }}>ग्राहक का नाम :</p>
                    </div>
                    <div className="col-6 flex align-items-center">
                        <InputText
                            value={customerName}
                            maxLength={60}
                            className="p-2 w-full md:w-8 xl:w-10"
                            onChange={(e) => updateCustomerName(e.target.value)}
                        />
                    </div>
                    <div className="col-6 flex justify-content-end align-items-center">
                        <p className="m-0  p-0" style={{fontFamily:"Hindi-Regular" ,'fontSize': '1.1em' }}>मोबाइल नंबर :</p>
                    </div>
                    <div className="col-6 flex align-items-center">
                        <InputText
                            value={customerNumber}
                            maxLength={32}
                            className="p-2 w-full md:w-8 xl:w-10"
                            onChange={(e) => updateCustomerNumber(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="col-12 border-2 border-round-md surface-border">
                <div className="grid">
                    {/* col */}
                    <div className="col-12 mt-2">
                        <div className="grid">
                            <div className="col-6 flex justify-content-end ">
                            <p className="m-0  p-0" style={{fontFamily:"Hindi-Regular" ,'fontSize': '1.1em' }}> कुल कीमत :</p>
                            </div>
                            <div className="col-6 flex justify-content-start">
                            <p className="m-0  p-0" style={{fontFamily:"Hindi-Regular" ,'fontSize': '1em' }}>{amountTemplate(billAmounts.totalAmt)}</p>
                            </div>
                        </div>
                    </div>
                    {/* col end */}
                    {/* col */}
                    <div className="col-12">
                        <div className="p-fluid grid">
                            <div className="col-6 flex justify-content-end align-items-center">
                            <p className="m-0  p-0" style={{fontFamily:"Hindi-Regular" ,'fontSize': '1.1em' }}>लोड चार्ज प्रतिशत (%):</p>
                            </div>
                            <div className="col-6 p-0  flex justify-content-start">
                                <InputNumber
                                    suffix="%"
                                    className="p-2 w-full xs:w-5 sm:w-4 md:w-3 lg:w-3 xl:w-5 "
                                    value={percentage}
                                    defaultValue={1}
                                    allowEmpty={false}
                                    min={1}
                                    max={100}
                                    onChange={onPercentChangeHandler}
                                    onValueChange={(e) =>
                                        setPercentage(e.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    {/* col end */}
                    {/* col */}
                    <div className="col-12">
                        <div className="grid">
                            <div className="col-6 flex justify-content-end">
                            <p className="m-0  p-0" style={{fontFamily:"Hindi-Regular" ,'fontSize': '1.1em' }}> लोड चार्ज कीमत :</p>
                            </div>
                            <div className="col-6 flex justify-content-start">
                            <p className="m-0  p-0" style={{fontFamily:"Hindi-Regular" ,'fontSize': '1em' }}> {amountTemplate(Math.ceil(billAmounts.loadChargeAmt))}</p>
                            </div>
                        </div>
                    </div>
                    {/* col end */}
                    {/* col */}
                    <div className="col-12">
                        <div className="grid">
                            <div className="col-6 flex justify-content-end">
                            <p className="m-0  p-0" style={{fontFamily:"Hindi-Regular" ,'fontSize': '1.1em' }}>कुल कीमत + लोड चार्ज :</p>
                            </div>
                            <div className="col-6 flex justify-content-startr">
                            <p className="m-0  p-0" style={{fontFamily:"Hindi-Regular" ,'fontSize': '1em' }}> {amountTemplate(Math.ceil(billAmounts.loadPlusTotalAmt))}</p>
                            </div>
                        </div>
                    </div>
                    {/* col end */}
                </div>
            </div>
            <div className="col-12 border-2 border-round-md surface-border">
                <div className="grid">
                    <div className="col-4 flex justify-content-center align-items-center">
                        <Button
                            label="Calculate"
                            disabled={isLoading}
                            onClick={onCalculateBtnClickHandler}
                        />
                    </div>
                    <div className="col-4 flex justify-content-center align-items-center">
                        <Button
                            label="बिल देखे"
                            disabled={isLoading}
                            onClick={onPrintPreviewHandler}
                        />
                    </div>
                    <div className="col-4 flex justify-content-center align-items-center">
                        <Button
                            label="बिल निकाले"
                            disabled={isLoading}
                            onClick={onPrintHandler}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillCalculationComponent;
