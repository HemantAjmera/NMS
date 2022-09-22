import { ListBox } from "primereact/listbox";
import { useEffect } from "react";
import { useAppContext } from "../context/appContext";
const TreeManagerRemoveTreeSize = ({setTreeSize,setActionName,setVisible,restFields,setRestFields }) => {
    const { treeSizes } = useAppContext();
    useEffect(() => {
        if(restFields === true){
            setTreeSize("")
            setRestFields(false)
        }
        // eslint-disable-next-line
    }, [restFields])
    const onItemClick = (e,data) =>{
        setTreeSize(e.value)
        setActionName("REMOVETREESIZE")
        setVisible(true)
    }
    return <div>
        <ListBox options={treeSizes} onChange={onItemClick} virtualScrollerOptions={{ itemSize: 38 }} style={{ width: '20rem' }} listStyle={{ height: '250px' }}/>
    </div>
}
export default TreeManagerRemoveTreeSize;