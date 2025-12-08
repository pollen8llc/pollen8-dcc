import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const SettingsIndex = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    } else {
      // Redirect to account settings by default
      navigate("/settings/account", { replace: true });
    }
  }, [currentUser, navigate]);

  return null;
};

export default SettingsIndex;
