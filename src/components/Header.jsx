import React from "react";

const Header = () => {
  return (
    <div className="flex items-center justify-between h-full border-l border-b border-[#2a2a2a] px-4">
      <div className="flex-1 min-w-0 text-left" >
        <div className="text-sm sm:text-base md:text-lg font-bold truncate" title="Productivity Dashboard - AAN">
          Productivity Dashboard - AAN
        </div>
      </div>
    </div>
  );
};

export default Header;
