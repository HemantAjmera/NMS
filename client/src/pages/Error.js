import React from "react";
import { Link } from "react-router-dom";
const Error = () => {
    return (
        <div className="card">
            <div className="flex flex-wrap justify-content-center text-center">
                <div>
                    <h3 className="font-face-rb">Ohh! page not found</h3>
                    <p className="font-face-rb-medium">
                        We can't seem to find the page you're looking for{" "}
                    </p>
                    <Link to="/">Back home</Link>
                </div>
            </div>
        </div>
    );
};

export default Error;
