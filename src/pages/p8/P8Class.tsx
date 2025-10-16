import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const P8Class = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to combined P8Asl page
    navigate("/p8/asl", { replace: true });
  }, [navigate]);

  return null;
};

export default P8Class;