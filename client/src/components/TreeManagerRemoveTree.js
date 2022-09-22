import { ListBox } from 'primereact/listbox';
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/appContext';
const TreeManagerRemoveTree = ({setVisible, setActionName, setTreeName, restFields, setRestFields}) => {
    const { treeNames } = useAppContext();
    useEffect(() => {
        if(restFields === true){
            setTreeName([])
            setRestFields(false)
        }
    }, [restFields])
    const onItemClick = (e,data) =>{
        setTreeName([data.label, data.value])
        setActionName("REMOVETREE")
        setVisible(true)
    }
    const itemTemplate = (data) => {
        return <p className='p-0 m-0' onClick={(e) => onItemClick(e, data)}>{data.label} : {data.value}</p>
    }
    console.log()
    return <div>
        <ListBox itemTemplate={itemTemplate}   options={treeNames} virtualScrollerOptions={{ itemSize: 38 }} style={{ width: '20rem' }} listStyle={{ height: '250px' }}/>
    </div>
}
export default TreeManagerRemoveTree;