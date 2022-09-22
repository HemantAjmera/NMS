import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react"
import { Dropdown } from "primereact/dropdown";
import { useAppContext } from "../context/appContext"
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
const SingleBillItem = ({ visibleSingleBillItem, setVisibleSingleBillItem, selectedTreeName }) => {
    const { addRowInBillTable, billTableData, treeSizes, isLoading } = useAppContext();
    const [name, setName] = useState(selectedTreeName || "")
    const [treeSize, setTreeSize] = useState("")
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    useEffect(()=> {
        setName(selectedTreeName || "")
        setTreeSize("")
        setQuantity(0)
        setPrice(0)
    },[visibleSingleBillItem])
    const onHide = () => {
        setVisibleSingleBillItem(false);
    }
    const onQuantityChange = (e) => {
        if(e.value >= 0 && e.value <= 10000 ){
            setQuantity(e.value)
        }else if(e.value < 0){
            setQuantity(0)
        }else {
            setQuantity(1000)
        }
    }
    const onPriceChange = (e) => {
        if(e.value >= 0 && e.value <= 100000 ){
            setPrice(e.value)
        }else if(e.value < 0){
            setPrice(0)
        }else {
            setPrice(10000)
        }

        
    }
    const onSaveHandler =(e) => {
        addRowInBillTable({
            no: billTableData.length + 1,
            tree: name,
            size: treeSize,
            quantity: quantity,
            price: price,
            totalPrice: (quantity * price),
        });
        setVisibleSingleBillItem(false);
    }
    return <Dialog header={"पेड़ जोड़ें"} visible={visibleSingleBillItem} onHide={onHide} className=" w-full sm:w-full md:w-10 lg:w-9 xl:w-6 " >

        <div className='grid '>
            <div className='col-12 sm:col-6 flex justify-content-center sm:justify-content-end' >
                <div className="mx-4">
                    <p className='m-1' htmlFor="treeName">पेड़ का नाम </p>
                    <InputText name="treeName" value={name} onChange={e => setName(e.target.value)}/>
                </div>
            </div>
            <div className='col-12 sm:col-6 flex justify-content-center sm:justify-content-start ' >
                <div className="mx-4">
                    <p className='m-1' htmlFor="treeName">पेड़ का आकार </p>
                    <Dropdown
                        value={treeSize}
                        options={treeSizes}
                        onChange={(e) => setTreeSize(e.value)}
                    />
                </div>
            </div>
            <div className='col-12 sm:col-6 flex justify-content-center sm:justify-content-end' >
                <div className="mx-4">
                    <p className='m-1' htmlFor="quantity">पेड़ की मात्रा</p>
                    <InputNumber name="quantity" min={0} max={10000} value={quantity} onChange={onQuantityChange}/>
                </div>
            </div>
            <div className='col-12 sm:col-6 flex justify-content-center sm:justify-content-start' >
                <div className="mx-4">
                    <p className='m-1' htmlFor="price">पेड़ की कीमत</p>
                    <InputNumber  name="price" prefix="₹" min={0} max={100000} value={price} onChange={onPriceChange}/>
                </div>
            </div>
            <div className='col-12 flex justify-content-center'>
                <div>
                    <Button
                        label="जोड़ें"
                        disabled={isLoading}
                        onClick={onSaveHandler}
                    />
                </div>
            </div>
        </div>
    </Dialog>
}

export default SingleBillItem