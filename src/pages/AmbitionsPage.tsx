import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import AmbitionsTab from "@/components/carbon/AmbitionsTab";
import LeaderAmbitionsPage from "@/components/leader-view/LeaderAmbitionsPage";
import InternMyCareer from "@/components/intern-view/InternMyCareer";

/**
* -----------------------------------------------------
* ROLE-BASED ROUTING
* ----------------------------------------------------- 
* - Leaders: Projects page
*   Leaders & managers get to see available projects
*   and all ambitions.
* - Interns: My career redesign
*     The redesign of Opportunities tab for the interns
*     also career paths change. 
**/
const AmbitionsPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const selectedAmbition = searchParams.get('ambition');
  
  const handleClearFilter = () => {
    setSearchParams({});
  };

  const isLeaderOrManager =
    user?.access_role?.toLowerCase() === "leader" ||
    user?.access_role?.toLowerCase() === "manager";

  return isLeaderOrManager? (
    <LeaderAmbitionsPage 
      user={user} 
      selectedAmbition={selectedAmbition}
      onClearFilter={handleClearFilter}
    />
  ) : (
    <InternMyCareer 
    user={user}
    selectedAmbition={selectedAmbition}
    onClearFilter={handleClearFilter}
  />
  );
};

export default AmbitionsPage;