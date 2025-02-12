import React from "react";

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={`rounded-lg shadow-lg bg-white p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card };
