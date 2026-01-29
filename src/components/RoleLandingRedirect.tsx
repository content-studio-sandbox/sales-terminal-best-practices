import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Index-route controller:
 * - If user is leader/manager -> /leadership
 * - Otherwise -> /projects
 * - If no user (shouldn't happen with oauth2-proxy, but safe) -> /projects
 */
export default function RoleLandingRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const role = user?.access_role?.toLowerCase?.();

    if (role === "leader" || role === "manager") {
      navigate("/leadership", { replace: true });
    } else {
      navigate("/projects", { replace: true });
    }
  }, [loading, user, navigate]);

  
  return null;
}
