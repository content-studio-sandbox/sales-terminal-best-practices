import { useAuth } from "@/hooks/useAuth";
import LeadershipTab from "@/components/carbon/LeadershipTab";

const LeadershipPage = () => {
  const { user } = useAuth();

  return <LeadershipTab user={user} 
  /> ;
};

export default LeadershipPage;