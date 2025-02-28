import { createContext, useContext, ReactNode } from "react";
import { useUserStorage } from "../../hooks/useUserStorage";
// Define the context type
interface UserContextType {
  user: { token: string; userId: string,role:string} | null;
  saveUser: (token: string, userId: string,role:string) => void;
  updateToken: (newToken: string) => void;
  getUser: () => { token: string; userId: string,role:string } | null;
  deleteUser: () => void;
}

// Create the UserContext with an empty default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userStorage = useUserStorage();

  return (
    <UserContext.Provider value={userStorage}>{children}</UserContext.Provider>
  );
};

// Custom hook for using the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
