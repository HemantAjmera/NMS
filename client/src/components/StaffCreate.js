import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from 'primereact/password'
import { Checkbox } from "primereact/checkbox";
import { useState } from "react";
import validator from "validator";
import { useAppContext } from "../context/appContext";
const StaffCreate = () => {
    const { createStaff, isLoading, fetchStaffList } = useAppContext();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false)
    const [active, setActive] = useState(false);
    const onNameChange = (e) => {
        if (e.target.name === "firstname") {
            setFirstname(e.target.value.replace(/[\\"\\'~`!@#$%^&*()_={}[\]:;,.<>+\\|/?-]+|\d+|^\s+$/g, '').replace(/\s+/ig, ' '))
        }
        if (e.target.name === "lastname") {
            setLastname(e.target.value.replace(/[\\"\\'~`!@#$%^&*()_={}[\]:;,.<>+\\|/?-]+|\d+|^\s+$/g, '').replace(/\s+/ig, ' '))
        }
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value.replaceAll(/\s/g, ''))
        if (validator.isStrongPassword(e.target.value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setPasswordError(false)
        } else {
            setPasswordError(true)
        }
    }

    const onUsernameChange = (e) => {
        setUsername(e.target.value.replace(/[\\"\\'~`!@#$%^&*()={}[\]:;,.<>+\\/?|-\s]+$/g, '').replace(/\s+/ig, ' '))
    }
    const createStaffHandler = () => {
        if (firstname === "" || lastname === "" || username === "" || password === "" || passwordError) return;
        setFirstname("")
        setLastname("")
        setUsername("")
        setPassword("")
        setPasswordError(false)
        createStaff({ firstname, lastname, username, password, active })
        fetchStaffList();
        console.log("Staff Created")
    }
    return (<>
            <div  className="grid ">
                <div  className="col-12 md:col-6 flex align-items-center justify-content-center sm:justify-content-center md:justify-content-end gap-2" >
                    <label htmlFor="firstname4" style={{fontFamily:"Hindi-Regular", fontSize:"1.2em" }}>नाम</label>
                    <InputText name="firstname" value={firstname} onChange={onNameChange} />
                </div>
                <div  className="col-12 md:col-6 sm:col-12 flex justify-content-center sm:justify-content-center md:justify-content-start  align-items-center gap-2">
                    <label htmlFor="lastname4" style={{fontFamily:"Hindi-Regular", fontSize:"1.2em" }}>सरनेम</label>
                    <InputText name="lastname" value={lastname} onChange={onNameChange} />
                </div>
                <div  className="col-12 md:col-6 sm:col-12 flex  sm:justify-content-center align-items-center md:justify-content-end justify-content-center gap-2">
                    <label htmlFor="firstname4"style={{fontFamily:"Hindi-Regular", fontSize:"1.2em" }} >यूजरनेम</label>
                    <InputText value={username} onChange={onUsernameChange} />
                </div>
                <div  className="col-12 md:col-6 sm:col-12 flex justify-content-center sm:justify-content-center md:justify-content-start align-items-center gap-2">
                    <label htmlFor="lastname4" style={{fontFamily:"Hindi-Regular", fontSize:"1.2em" }}>पासवर्ड</label>
                    <Password onChange={onPasswordChange} value={password} feedback={false} toggleMask className={passwordError ? "p-invalid" : ""} />
                </div>
                    <div className="col-12 flex flex-wrap align-items-center justify-content-center">
                        <div className="grid p-0">
                            <div className="col-12 md:col-12 flex flex-wrap align-items-center justify-content-center py-3">
                                <Checkbox checked={active} onChange={e => setActive(e.checked)} name="accept" inputId="accept" />
                                <label htmlFor="accept" className="px-2" style={{fontFamily:"Hindi-Regular" , fontSize:"1.2em" }}>क्रियात्मक</label>
                            </div>
                            <div className="col-12 md:col-12 flex flex-wrap align-items-center justify-content-center">

                                <Button disabled={isLoading} onClick={createStaffHandler} label="स्टाफ़ बनाए" />
                            </div>
                        </div>

                    </div>
            </div>
            </>
    );
};
export default StaffCreate;
