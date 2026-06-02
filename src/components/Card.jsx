import React from "react";
import { useI18n } from "../hooks/useI18n";

const Card = ({ title, value, subtitle, icon }) => {
    const { i18n } = useI18n();
    const isRtl = i18n?.dir?.() === "rtl" || i18n?.language === "ar";

    const formatValue = (val) => {
        if (val === undefined || val === null) return "";
        const strVal = String(val);
        
        if (!isRtl) return strVal;

        return strVal.replace(/[0-9]/g, (w) => "٠١٢٣٤٥٦٧٨٩"[w]);
    };

    return (
        <div 
            className="card flex justify-between" 
            dir={isRtl ? "rtl" : "ltr"}
        >
            <div className={`flex flex-col gap-5 ${isRtl ? "text-right" : "text-left"}`}>
                <div className="bg-dark text-white">
                    {title}
                </div>
                <div>
                    <div 
                        className="fw-bold text-danger mb-1 text-4xl truncate max-w-37.5" 
                        title={formatValue(value)}
                    >
                        {formatValue(value)}
                    </div>
                    <small className="text-secondary">
                        {formatValue(subtitle)}
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