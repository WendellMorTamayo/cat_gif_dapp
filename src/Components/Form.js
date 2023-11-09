import React, { useState } from "react";

const Form = ({ onInputChange, inputValue, onSubmit }) => {
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        onSubmit(); // Call the onSubmit function from props
    };
    return (
        <form onSubmit={handleSubmit} className={""}>
            <input
                type="text"
                placeholder="Enter GIF URL here"
                value={inputValue}
                onChange={onInputChange}
            />
            <button type="submit" className="text-white mx-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                Submit
            </button>
        </form>
    );
};

export default Form;
