import BillItemsComponent from "./BillItemsComponent.js";
import BillCalculationComponent from "./BillCalculationComponent.js";
import React from "react";
const BillComponent = () => {
    return (
        <div className="grid">
            <div className="col-12  xl:col-8">
                <React.StrictMode>
                    <BillItemsComponent />
                </React.StrictMode>
            </div>
            <div className="col-12 xl:col-4">
                <BillCalculationComponent />
            </div>
        </div>
    );
};
export default BillComponent;
