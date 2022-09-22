import React from "react";

const FormRow = ({
    type,
    name,
    value,
    handleChange,
    placeholder,
    labelText,
}) => {
    return (
        <div className="field my-4 flex justify-content-start flex-wrap">
            <label className="font-face-rb-medium" htmlFor={name}>
                {labelText || name}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
            />
        </div>
    );
};

export default FormRow;
