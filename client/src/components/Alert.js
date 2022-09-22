import { Message } from "primereact/message";
import { useAppContext } from "../context/appContext";
const Alert = () => {
    const { alertText, alertType } = useAppContext();
    return (
        <div>
            <Message
                className="w-full"
                severity={alertType}
                text={alertText}
            ></Message>
        </div>
    );
};
export default Alert;
