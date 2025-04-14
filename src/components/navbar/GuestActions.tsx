
import { UserRole } from "@/models/types";
import AccountButton from "./AccountButton";

const GuestActions = () => {
  return (
    <AccountButton 
      currentUser={null} 
      isAdmin={false} 
      logout={async () => {}}
    />
  );
};

export default GuestActions;
