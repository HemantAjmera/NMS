import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

const TreeManagerAddTreeSize = ({setVisible, setTreeSize ,setActionName, restFields, setRestFields}) => {
    const [size, setSize] = useState("")
    useEffect(() => {
        if(restFields === true){
            setSize("")
            setRestFields(false)
        }
        // eslint-disable-next-line
    }, [restFields])
    const onSaveBtnClick = () => {
        if (size !== "") {
            setTreeSize(size)
            setActionName("ADDTREESIZE")
            setVisible(true)
        }
    }
    return <div className="grid">
    <div className="col-12  flex justify-content-center align-items-center gap-2" >
        <label htmlFor="firstname4" style={{ fontFamily: "Hindi-Regular", fontSize:"1.2em" }}>आकार का नाम: </label>
        <InputText name="firstname" value={size} onChange={(e)=>setSize(e.target.value)} />
    </div>
    <div className="col-12 flex justify-content-center ">
        <Button label="जोड़ें" onClick={onSaveBtnClick} />
    </div>
</div>
}
export default TreeManagerAddTreeSize;