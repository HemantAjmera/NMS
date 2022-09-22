import { useEffect, useState } from 'react';
import { useAppContext } from '../context/appContext.js'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import { ConfirmDialog } from 'primereact/confirmdialog'; 
const StaffList = () => {
    const { isLoading, fetchStaffList, staffList, updateStaffList, updateServerStaffList, deleteStaff } = useAppContext()
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        fetchStaffList();
    }, [staffList])
    const onCellEditComplete = (e) => {
        let { rowData, newValue, field } = e;
        rowData[field] = newValue
        updateStaffList(staffList)
    }

    const activeEditor = (options) => {
        return (
            <Checkbox
                checked={options.value}
                onClickCapture={(e) => options.editorCallback(!options.value)}
            />
        );
    }
    const activeBody = (e) => {
        return (
            <Checkbox
                checked={e.active}
            />
        );
    }
    const saveStaffListChanges = () => {
        console.log(staffList)
        updateServerStaffList(staffList)
    }
    const passwordBody =(e)=> {
        return <Password readOnly value={e.password} feedback={false} toggleMask />
    }
    const [seletedStaff, setseletedStaff] = useState(null)
    const onDelectClickHandler = (o,e) => {
        console.log(e)
        setseletedStaff(e)
        setVisible(true)
    };
    const deleteBody = (e) => {
        return (
            <Button
                disabled={isLoading}
                label="X"
                className="p-button-link"
                onClick={(o) => onDelectClickHandler(o, e)}
            />
        );
    }
    const accept = () => {
        console.log("Clicked " + seletedStaff)
        deleteStaff({staffId: seletedStaff._id})
        fetchStaffList();
    }
    return <>
        <DataTable stripedRows editMode="cell"
            className="editable-cells-table"
            value={staffList}
            scrollHeight="400px"
            responsiveLayout="scroll" >
            <Column key={"no"} field={"no"} header={"न."}></Column>
            <Column key={"name"} field={"name"} header={"नाम"}></Column>
            <Column key={"username"} field={"username"} header={"यूजरनेम"}></Column>
            <Column key={"password"} field={"password"} header={"पासवर्ड"} body={passwordBody}></Column>
            <Column key={"active"} field={"active"} header={"चालू बंद"} body={activeBody} editor={(options) => activeEditor(options)} onCellEditComplete={onCellEditComplete} ></Column>
            <Column key={"Delete"} field={"Delete"} header={"हटाये"} body={deleteBody} onCellEditComplete={onCellEditComplete} ></Column>
        </DataTable>
        <div className='flex justify-content-center py-2'>
            <Button disabled={isLoading} onClick={saveStaffListChanges} label="बदलाव करें" />
        </div>
        <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message={seletedStaff?.name || ""}
        header="हटाना?"  accept={accept} />
    </>

}
export default StaffList