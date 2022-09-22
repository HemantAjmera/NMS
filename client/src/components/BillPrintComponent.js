import { useEffect } from "react";
import "../assets/css/billprint.css";
import { useAppContext } from "../context/appContext";
import { useNavigate, useLocation } from "react-router-dom";

const BillPrintComponent = () => {
    const {
        user,
        customerName,
        billAmounts,
        billTableData,
        showPrintPreview,
        resetBillState,
        billNo,
    } = useAppContext();

    const { state } = useLocation();
    const navigate = useNavigate();
    const amountTemplate = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };
    let _billTableData = [...billTableData]
    useEffect(() => {
      
        if ((billTableData.length <= 0 || billAmounts.totalAmt <= 0 ) && state === null) {
         
            navigate("/", { replace: true });
            return;
        }

    });
    useEffect(() => {
        if ((billTableData.length <= 0 || billAmounts.totalAmt <= 0) && state === null) {
         
            navigate("/", { replace: true });
            return;
        }
        if (state != null) {
            _billTableData.length = 0
            Object.values(state.billTrees).forEach((data) => _billTableData.push(data))
        }
        let c = document.getElementById("myCanvas");
        let ctx = c.getContext("2d");
        ctx.textAlign = "right";
        ctx.fillText("Page: " + 1, 370, 20);
        ctx.textAlign = "center";
        ctx.fillText(user.nurseryName, 180, 20);
        ctx.fillText(user.nurseryAddress, 180, 38);
        ctx.fillText(user.nurseryLocation, 180, 54);
        ctx.fillText("मो.: " + user.mobileNumbers.join(", "), 180, 72);
        ctx.textAlign = "left";
        ctx.fillText("बिल न.: " + (state !== null ? state.billData.billNo : (billNo !== 0 ? billNo : "-")), 10, 88);
        ctx.textAlign = "right";
        ctx.fillText(
            "दिनांक: " + (state !== null ? new Date(state.billData.billDate).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN")),
            370,
            88
        );
        ctx.textAlign = "left";
        ctx.fillText("नाम :", 15, 108);
        ctx.fillText((state !== null ? state.billData.customerName : customerName), 48, 108);
        ctx.beginPath(); // Start a new path
        ctx.moveTo(50, 114); // Move the pen to (30, 50)
        ctx.lineTo(360, 114); // Draw a line to (150, 100)
        ctx.stroke();
        ctx.beginPath();
        ctx.setLineDash([8, 5]);
        ctx.moveTo(0, 120);
        ctx.lineTo(380, 120);
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.fillText("No.", 15, 142);
        ctx.fillText("पेड़ों के नाम", 67, 142);
        ctx.fillText("आकार", 148, 142);
        ctx.fillText("मात्रा", 200, 142);
        ctx.fillText("कीमत", 260, 142);
        ctx.fillText("कुल कीमत", 338, 142);
        let current_y = 144;
        let priceTotal = 0;
        let quantityTotal = 0;
        let isOverflowItem = false;
        let pages = 0;
        if (_billTableData.length < 21) {
            isOverflowItem = false;
        } else {
            pages = Math.ceil((_billTableData.length - 20) / 30);
            for (let i = 0; i < pages; i++) {
                const section = document.createElement("section");
                section.className = "sheet";
                section.id = "page" + (i + 2);
                const canvas = document.createElement("canvas");
                canvas.id = "myCanvas" + (i + 2);
                canvas.width = 380;
                canvas.height = 594;
                canvas.style.border = "1px solid red";
                section.appendChild(canvas);
               
                document.getElementsByClassName("A5")[0].appendChild(section);
            }
            isOverflowItem = true;
        }
        let counter = 20;

        let currentCanvasCtx;
        let current_new_page_y;
        let currentPage = 2;
        let isLastPage = false;
        for (let index = 0; index < _billTableData.length; index++) {
            quantityTotal += parseInt(_billTableData[index].quantity);
            priceTotal +=  parseInt(_billTableData[index].price);
            if (!isOverflowItem && index < 23) {
                
                current_y += 16;
                billItem({ current_y, ctx, index });
            } else {
               
                if (index < 20) {
                    current_y += 20;
                    billItem({ current_y, ctx, index });
                } else {
                  
                    if (index >= counter) {
                        counter += 30;
                        let can = document.getElementById(
                            "myCanvas" + currentPage
                        );
                        currentPage++;
                        isLastPage = currentPage - 2 === pages ? true : false;
                        currentCanvasCtx = can.getContext("2d");
                        currentCanvasCtx.textAlign = "left";
                        currentCanvasCtx.fillText("बिल न.: -", 10, 20);
                        currentCanvasCtx.textAlign = "right";
                        currentCanvasCtx.fillText(
                            "दिनांक: " + new Date().toLocaleDateString("en-IN"),
                            370,
                            20
                        );
                        currentCanvasCtx.textAlign = "center";
                        currentCanvasCtx.fillText(
                            "Page: " + (currentPage - 2 + 1),
                            180,
                            20
                        );
                        currentCanvasCtx.beginPath();
                        currentCanvasCtx.setLineDash([8, 5]);
                        currentCanvasCtx.moveTo(0, 28);
                        currentCanvasCtx.lineTo(380, 28);
                        currentCanvasCtx.stroke();

                        current_new_page_y = 30;
                    }
                    if (isLastPage) {
                        current_new_page_y += 16;
                    } else {
                        
                        current_new_page_y += 18;
                    }
                    billItem({
                        current_y: current_new_page_y,
                        ctx: currentCanvasCtx,
                        index,
                    });
                }
            }
        }
        if (!isOverflowItem) {
            billFooter({ current_y, ctx, priceTotal, quantityTotal });
        } else {
            
            billFooter({
                current_y: current_new_page_y,
                ctx: currentCanvasCtx,
                priceTotal,
                quantityTotal,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const billItem = ({ current_y, ctx, index }) => {
        ctx.fillText(index + 1, 12, current_y);
        ctx.fillText(_billTableData[index].tree, 67, current_y);
        ctx.fillText(
            _billTableData[index].size ? _billTableData[index].size : "-",
            148,
            current_y
        );
        ctx.fillText(_billTableData[index].quantity, 200, current_y);
        ctx.fillText(
            amountTemplate(_billTableData[index].price),
            260,
            current_y
        );
        ctx.fillText(
            amountTemplate(_billTableData[index].totalPrice),
            338,
            current_y
        );
    };
    const billFooter = ({ current_y, ctx, priceTotal, quantityTotal }) => {
        current_y += 10;
        ctx.beginPath();
        ctx.setLineDash([8, 5]);
        ctx.moveTo(0, current_y);
        ctx.lineTo(380, current_y);
        ctx.stroke();
        current_y += 12;
        ctx.fillText("उप कुल ", 65, current_y);
        ctx.fillText(quantityTotal, 200, current_y);
        ctx.fillText(amountTemplate(priceTotal), 260, current_y);
        ctx.fillText(amountTemplate((state !== null ? state.billData.price : billAmounts.totalAmt)), 338, current_y);
        current_y += 5;
        ctx.beginPath();
        ctx.setLineDash([8, 5]);
        ctx.moveTo(0, current_y);
        ctx.lineTo(380, current_y);
        ctx.stroke();
        current_y += 12;
        ctx.fillText("लोड चार्ज (+) ", 244, current_y);
        ctx.fillText(amountTemplate((state !== null ? state.billData.loadingCharge : billAmounts.loadChargeAmt)), 338, current_y);
        current_y += 5;
        ctx.beginPath();
        ctx.setLineDash([8, 5]);
        ctx.moveTo(0, current_y);
        ctx.lineTo(380, current_y);
        ctx.stroke();
        current_y += 12;
        ctx.fillText("कुल कीमत ", 262, current_y);
        ctx.fillText(
            amountTemplate((state !== null ? (state.billData.price + state.billData.loadingCharge) : billAmounts.loadPlusTotalAmt)),
            338,
            current_y
        );
        current_y += 5;
        ctx.beginPath();
        ctx.setLineDash([8, 5]);
        ctx.moveTo(0, current_y);
        ctx.lineTo(380, current_y);
        ctx.stroke();
        current_y += 12;
        ctx.fillText("धन्यवाद", 180, current_y);
        if (!showPrintPreview && state === null) {
            window.print();
            resetBillState();
            navigate("/", { replace: true });
        }
        if(state !== null){
            window.print();
            navigate(state?.redirectLocation ||  "/", { replace: true });
        }
    };
    return (
        <div className="A5">
            <section className="sheet">
                <canvas
                    style={{ border: "1px solid red" }}
                    id="myCanvas"
                    width="380"
                    height="594"
                >
                    Your browser does not support the HTML canvas tag.
                </canvas>
            </section>
        </div>
    );
};

export default BillPrintComponent;
