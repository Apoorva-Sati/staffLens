import React from "react";

const Card = ({ title, value, subtitle }) => {
    return (
        <div className="card text-left">
            <div className=" bg-dark text-white">
                {title}
            </div>
            <div className=" py-3">
                <div className="fw-bold text-danger mb-1 text-4xl">
                    {value}
                </div>
                <small className="text-secondary">
                    {subtitle}
                </small>
            </div>
        </div>
    );
};

export default Card;