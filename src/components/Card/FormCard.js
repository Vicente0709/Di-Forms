import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const FormCard = ({ title, description, imageSrc, altText, buttonText, path, ariaLabel }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(path);
  };

  return (
    <Card border="primary" style={{ width: "100%", marginBottom: "20px" }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Img
          variant="top"
          src={imageSrc}
          alt={altText}
          style={{ width: "100%", height: "150px", objectFit: "contain" }}
        />
        <Card.Text>{description}</Card.Text>
        <Button variant="outline-primary" onClick={handleCardClick} aria-label={ariaLabel}>
          {buttonText}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FormCard;
