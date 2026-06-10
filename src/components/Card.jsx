import React from "react";

const Card = ({ title, value, subtitle, icon }) => {
    return (
        <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0 w-full">
            <div className="flex flex-col text-left gap-4 min-w-0">
                <div className="bg-dark text-white rounded px-3 py-2 truncate" title={title}>
                    {title}
                </div>
                <div className="min-w-0">
                    <div className="fw-bold text-danger mb-1 text-4xl truncate max-w-full" title={value}>
                        {value}
                    </div>
                    <small className="text-secondary wrap-break-word">
                        {subtitle}
                    </small>
                </div>
            </div>
            <div className="shrink-0">
                {icon}
            </div>
        </div>
    );
};

export default Card;