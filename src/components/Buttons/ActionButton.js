import React from "react";
import { Button } from "react-bootstrap";

const ActionButton = ({ onClick, label, variant = "primary", type = "button" }) => {
  return (
    <Button type={type} onClick={onClick} variant={variant}>
      {label}
    </Button>
  );
};

export default ActionButton;
