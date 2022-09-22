import { useEffect, useState } from "react"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
const TreeManagerAddTree = ({setVisible, setTreeName,setActionName, restFields, setRestFields}) => {
    const [hindiName, setHindiName] = useState("")
    const [englishName, setEnglishName] = useState("")
    useEffect(() => {
        if(restFields === true){
            setHindiName("")
            setEnglishName("")
            setRestFields(false)
        }
    }, [restFields])
    const onSaveBtnClick = () => {
        if (hindiName !== "" && englishName !== "") {
            setTreeName([hindiName, englishName])
            setActionName("ADDTREE")
            setVisible(true)
        }
    }
    return <div className="grid">
        <div className="col-12  flex justify-content-center align-items-center gap-2" >
            <label htmlFor="firstname4" style={{ fontFamily: "Hindi-Regular", fontSize:"1.2em" }}>हिन्दी नाम: </label>
            <InputText name="firstname" value={hindiName} onChange={(e)=>setHindiName(e.target.value)} />
        </div>
        <div className="col-12 flex justify-content-center align-items-center gap-2">
            <label htmlFor="lastname4" style={{ fontFamily: "Hindi-Regular", fontSize:"1.2em" }}>अंग्रेज़ी नाम: </label>
            <InputText name="lastname" value={englishName} onChange={(e)=>setEnglishName(e.target.value)} />
        </div>
        <div className="col-12 flex justify-content-center ">
            <Button label="जोड़ें" onClick={onSaveBtnClick} />
        </div>
    </div>
}

export default TreeManagerAddTree