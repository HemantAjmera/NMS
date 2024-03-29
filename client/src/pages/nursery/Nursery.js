import { useEffect, useState } from "react";
import { Navbar, BillComponent, RecentBill, BillSettlement } from "../../components/index.js";
import { useAppContext } from "../../context/appContext.js";

const Nursery = () => {
    const { fetchTreeNames, treeNames, lastBill } = useAppContext();
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        if (treeNames.length <= 0) {
            fetchTreeNames();
        }
        // eslint-disable-next-line
    }, []);
    return (
        <main>
            <Navbar />
            <BillComponent />
            <RecentBill/>
            {Object.keys(lastBill).length !== 0 && <BillSettlement visible={visible} setVisible={setVisible} bill={lastBill} />}
        </main>
    );
};

export default Nursery;
