import { useAuth } from "@/hooks/useAuth";
import YourProjectsTab from "@/components/carbon/YourProjectsTab";

/**
 * YourProjectsPage calls YourProjectsTab.
 * YourProjectsTab contains the logic to show:
 *   - Talent Pool page for Leaders
 *   - My Projects page for Intern (intern project board) 
**/

const YourProjectsPage = () => {
  const { user, loading } = useAuth();

  return <YourProjectsTab user={user} authLoading={loading} />;
};

export default YourProjectsPage;