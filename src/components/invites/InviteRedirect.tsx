import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Redirects old /invite/:code format to new /i/:code format
 */
const InviteRedirect = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      navigate(`/i/${code}`, { replace: true });
    }
  }, [code, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
};

export default InviteRedirect;
