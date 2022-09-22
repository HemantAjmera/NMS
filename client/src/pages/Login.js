import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Alert, FormRow } from "../components/index.js";
import { useAppContext } from "../context/appContext.js";
import { useNavigate } from "react-router-dom";
const initialState = {
    username: "",
    password: "",
};
const Login = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState(initialState);
    const { isLoading, showAlert, displayAlert, loginUser, user } =
        useAppContext();
    const onSubmit = (e) => {
        e.preventDefault();
        const { username, password } = values;
        if (!username || !password) {
            displayAlert();
            return;
        }
        const currentUser = { username, password };
        loginUser(currentUser);
    };
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    useEffect(() => {
        if (user) {
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
    }, [user, navigate]);

    return (
        <div className="card">
            <div className="flex flex-wrap justify-content-center">
                <div className="shadow-2 m-6 sm:m-6 md:m-6 lg:m-6 xl:m-8 surface-card text-center p-3 border-round-sm  flex align-items-center justify-content-center font-semibold">
                    <div className="mx-3 sm:mx-2 md:mx-4 lg:mx-5 xl:mx-6 mb-5">
                        <h3 className="font-face-rb text-3xl">साइन इन करें</h3>
                        {showAlert && <Alert />}
                        <form onSubmit={onSubmit}>
                            <FormRow
                                type="text"
                                name="username"
                                labelText="यूजरनेम"
                                placeholder="यहाँ लिखें"
                                value={values.username}
                                handleChange={handleChange}
                            />
                            <FormRow
                                type="password"
                                name="password"
                                labelText="	पासवर्ड"
                                placeholder="यहाँ लिखें"
                                value={values.password}
                                handleChange={handleChange}
                            />
                            <div className="mt-4">
                                <Button
                                    type="Submit"
                                    className="w-full font-face-rb-regular p-button-info"
                                    label="सबमिट करे"
                                    disabled={isLoading}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
