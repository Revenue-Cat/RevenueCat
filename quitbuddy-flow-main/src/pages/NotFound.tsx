import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home after a brief moment
    navigate("/home", { replace: true });
  }, [navigate]);

  return null;
};

export default NotFound;
