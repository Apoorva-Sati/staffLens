import React from "react";

const Card = ({ title, value, subtitle, icon }) => {
    return (
        <div className="card flex justify-between">
            <div className=" flex flex-col text-left gap-5">
                <div className=" bg-dark text-white">
                    {title}
                </div>
                <div>
                    <div className="fw-bold text-danger mb-1 text-4xl truncate max-w-37.5"  title={value}>
                        {value}
                    </div>
                    <small className="text-secondary">
                        {subtitle}
                    </small>
                </div>
            </div>
            <div>
                {icon}
            </div>
        </div>
    );
};

export default Card;