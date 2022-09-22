import { Button } from "primereact/button"
import { OverlayPanel } from 'primereact/overlaypanel';
import { ListBox } from 'primereact/listbox';
import timeSince from '../utils/timeSince.js'
import {  useRef, useState } from "react";
import { useAppContext } from "../context/appContext";
const DraftBillsList = () => {
    const { fetchDraftBill, draftBillList, updateBillComponentsWithDraft, updateDraftBillId } = useAppContext();
    const [isDraftEmpty, setIsDraftEmpty] = useState(false);
    const op = useRef(null);

    const onDraftButtonClick = async (e) => {
        await fetchDraftBill()
        if (draftBillList.length === 0) {
            setIsDraftEmpty(true)
            op.current.toggle(e)
        }else {
            setIsDraftEmpty(false)
            op.current.toggle(e)
        }
    }
    const onItemClick = (e) => {
       
        if (e.originalEvent.type !== "click") return;
        updateBillComponentsWithDraft({ customerName: e.target.value.customerName, customerNumber: e.target.value.customerNumber, billItemsList: e.target.value.billItemsList })
        updateDraftBillId(e.target.value._id)
        op.current.toggle(false)
    }
    const temp = (e) => {
        return <div className="p-0 m-0">
            <p className="p-0 m-0">{e.customerName}</p>
            <small className="p-0 m-0">{e.staffName}</small>
            <small> ({timeSince(new Date(e.createdAt))})</small>
        </div>
    }
    return <>
        <Button label="प्राप्त बिल देखें" onClick={(e) => onDraftButtonClick(e)} />
        {isDraftEmpty &&
            <OverlayPanel style={{ maxHeight: "15rem" }} ref={op}>
                <p>यह खाली है</p>
            </OverlayPanel>
        }
        {!isDraftEmpty &&
            <OverlayPanel style={{ overflowY: "scroll", maxHeight: "15rem" }} ref={op}>
                <ListBox itemTemplate={temp} options={draftBillList} onChange={(e) => onItemClick(e)} optionLabel="name" style={{ border: "none", width: '15rem' }} />
            </OverlayPanel>
        }
    </>
}

export default DraftBillsList