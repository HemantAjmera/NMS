import { Dropdown } from "primereact/dropdown";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const { logoutUser, user } = useAppContext();
    const navigate = useNavigate();
    const dropdownItems = [
        { label: "Logout", value: "logout" },
    ];
    if (user.role === "Owner") {
        dropdownItems.length = 0
        dropdownItems.push({ label: "नियंत्रण-पट्ट", value: "dashboard" })
        dropdownItems.push( { label: "बाहर जाए", value: "logout" },)
    }
    const handleChange = (e) => {
        if (e.value === "logout") {
            logoutUser();
        }
        if (e.value === "dashboard") {
            navigate("/dashboard")
        }
    };
    return (
        <div className="grid p-2 ">
            <div className="col-12 sm:col-3 md:col-3 lg:col-4 flex justify-content-center md:justify-content-start lg:justify-content-start">
                <h2 style={{fontFamily:"Roboto-Regular"}} className="m-0 flex align-items-center"> </h2>
            </div>
            <div className="col-12 sm:col-6 md:col-6 lg:col-4 flex justify-content-center ">
                <h2 className="m-0 flex align-items-center">
                    {user.nurseryName || "नर्सरी का नाम"}
                </h2>
            </div>
            <div className="col-12 sm:col-3 md:col-3 lg:col-4 flex justify-content-center md:justify-content-end lg:justify-content-end">
                <Dropdown
                    options={dropdownItems}
                    dropdownIcon="pi pi-user"
                    placeholder={user?.name}
                    onChange={handleChange}
                ></Dropdown>
            </div>
        </div>
    );
};

export default Navbar;
