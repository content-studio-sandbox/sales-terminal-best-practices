import { useAuth } from "@/hooks/useAuth";
import RequestsTab from "@/components/carbon/RequestsTab";

const RequestsPage = () => {
  const { user } = useAuth();

  return <RequestsTab user={user} />;
};

export default RequestsPage;