import React from "react";
import "./BrandLines.css";

const BrandLines: React.FC = () => {
  return (
    <>
      {/* Left diagonal–purple line */}
      <div className="brand-line brand-line--left" style={{backgroundImage: 'url(/assets/Vector-brandlinesleft.svg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}} />
      {/* Right diagonal–green line */}
      <div className="brand-line brand-line--right" style={{backgroundImage: 'url(/assets/Vector-brandlinesright.svg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}} />
    </>
  );
};

export default BrandLines;
