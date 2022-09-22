import { useEffect, useState } from "react";
import TreeManagerAddTree from "./TreeManagerAddTree";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useAppContext } from "../context/appContext";
import TreeManagerRemoveTree from "./TreeManagerRemoveTree";
import TreeManagerAddTreeSize from "./TreeManagerAddTreeSize";
import TreeManagerRemoveTreeSize from "./TreeManagerRemoveTreeSize";
import Alert from "./Alert";
const TreeManager = () => {
    const { showAlert, insertTreeName, treeNames, removeTreeName, fetchTreeNames, insertTreeSize, removeTreeSize } = useAppContext();
    const [visible, setVisible] = useState(false);
    const [treeName, setTreeName] = useState([])
    const [treeSize, setTreeSize] = useState("")
    const [actionName, setActionName] = useState("")
    const [msg, setMsg] = useState("")
    const [header, setHeader] = useState("")
    const [restFields, setRestFields] = useState(false)
    useEffect(() => {
        if (treeNames.length === 0) {
            fetchTreeNames();
        }
    }, [])
    useEffect(() => {
        if (actionName === "ADDTREE") {
            setHeader("पेड़ जोड़ें")
            setMsg(treeName[0] + " : " + treeName[1])
        }
        if (actionName === "REMOVETREE") {
            setHeader("पेड़ हटाए")
            setMsg(treeName[0] + " : " + treeName[1])
        }
        if (actionName === "ADDTREESIZE") {
            setHeader("पेड़ का आकार जोड़ें")
            setMsg(treeSize)
        }
        if (actionName === "REMOVETREESIZE") {
            setHeader("पेड़ का आकार हटाए")
            setMsg(treeSize)
        }


    }, [treeName, treeSize])
    const onAccept = () => {
        if (actionName === "ADDTREE") {
            if (treeName.length !== 0) {
                insertTreeName({ hindiName: treeName[0], englishName: treeName[1] })
                fetchTreeNames();
                setRestFields(true);
            } else {
                setVisible(false)
            }
        }
        if (actionName === "REMOVETREE") {
            if (treeName.length !== 0) {
                removeTreeName({ hindiName: treeName[0] })
                fetchTreeNames()
                setRestFields(true);
            } else {
                setVisible(false)
            }
        }
        if (actionName === "ADDTREESIZE") {
            if (treeSize.length !== 0) {
                insertTreeSize(treeSize)
                fetchTreeNames();
                setRestFields(true);
            } else {
                setVisible(false)
            }
        }
        if (actionName === "REMOVETREESIZE") {
            if (treeSize.length !== 0) {
                removeTreeSize(treeSize)
                fetchTreeNames();
                setRestFields(true);
            } else {
                setVisible(false)
            }
        }
    }

    return <div >
        <h1 style={{ fontFamily: "Hindi-Regular" }}>पेड़ मैनेजर</h1>
        {showAlert && <Alert />}
        <div className="grid">
            <div className="col-12 ">
                <div>
                    <h2 style={{ fontFamily: "Hindi-Regular" }}>पेड़ों का नाम</h2>
                </div>
                <div className="grid">
                    <div className="col-12 sm:col-12 md:col-12  lg:col-6 flex justify-content-center align-items-center">
                        <TreeManagerAddTree setVisible={setVisible} setActionName={setActionName} setTreeName={setTreeName} restFields={restFields} setRestFields={setRestFields} />
                    </div>
                    <div className="col-12 sm:col-12 md:col-12 lg:col-6 flex justify-content-center align-items-center">
                        <div>
                            <p style={{ fontFamily: "Hindi-Regular", fontSize:"1.2em" }} className="pt-0 mt-0"  >पेड़ का नाम हटाए :</p>
                            <TreeManagerRemoveTree setVisible={setVisible} setActionName={setActionName} setTreeName={setTreeName} restFields={restFields} setRestFields={setRestFields} />
                        </div>

                    </div>
                </div>
            </div>
            <div className="col-12 ">
                <div>
                    <h2 style={{ fontFamily: "Hindi-Regular" }}>पेड़ों का आकार</h2>
                </div>
                <div className="grid">
                    <div className="col-12 sm:col-12 md:col-12  lg:col-6 flex justify-content-center align-items-center">
                        <TreeManagerAddTreeSize setVisible={setVisible} setActionName={setActionName} setTreeSize={setTreeSize} restFields={restFields} setRestFields={setRestFields} />
                    </div>
                    <div className="col-12 sm:col-12 md:col-12 lg:col-6 flex justify-content-center align-items-center">
                        <div>
                            <p style={{ fontFamily: "Hindi-Regular", fontSize:"1.2em" }} className="pt-0 mt-0"  >पेड़ का आकार हटाए :</p>
                            <TreeManagerRemoveTreeSize setVisible={setVisible} setActionName={setActionName} setTreeSize={setTreeSize} restFields={restFields} setRestFields={setRestFields} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message={msg} header={header} accept={onAccept} />
    </div>
}
export default TreeManager;