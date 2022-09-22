import { useEffect } from "react";
import { Navbar, StaffBillConfirmComponent } from "../../components"
import BillItemsComponent from "../../components/BillItemsComponent";
import { useAppContext } from "../../context/appContext.js";
import Alert from "../../components/Alert.js";
const StaffHome = () => {
    const { fetchTreeNames, treeNames, showAlert } = useAppContext();
    useEffect(() => {
        console.log("fetch")
        if (treeNames.length <= 0) {
            fetchTreeNames();
        }
        // eslint-disable-next-line
    }, []);
    return <main>
        <Navbar />
        {showAlert && <Alert />}
        <div className="xl:p-2 xl:py-4 xl:mx-4 xl:my-4 xl:border-2 xl:border-round-md xl:surface-border" >
            <BillItemsComponent />
        </div>
        <StaffBillConfirmComponent />
    </main>
}
export default StaffHome