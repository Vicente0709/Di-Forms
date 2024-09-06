import React from "react";

const DownloadButton = ({ onClick, icon, altText, label }) => {
  return (
    <div onClick={onClick} className="download-item" style={{ cursor: "pointer" }}>
      <img src={icon} alt={altText} className="download-icon" />
      <span>{label}</span>
    </div>
  );
};

export default DownloadButton;
