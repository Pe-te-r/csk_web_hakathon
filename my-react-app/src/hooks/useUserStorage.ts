import useLocalStorageState from "use-local-storage-state";

const STORAGE_KEY = "user";

// Define a type for stored user data
interface UserStorageType {
  token: string;
  userId: string;
}

export function useUserStorage() {
  // Use localStorage state hook with a default value of null
  const [user, setUser] = useLocalStorageState<UserStorageType | null>(
    STORAGE_KEY,
    { defaultValue: null }
  );

  // Set user with token and userId
  const saveUser = (token: string, userId: string) => {
    setUser({ token, userId });
  };

  // Update only the token
  const updateToken = (newToken: string) => {
    setUser((prev) => (prev ? { ...prev, token: newToken } : null));
  };

  // Retrieve user data
  const getUser = () => user;

  // Delete user data from storage
  const deleteUser = () => {
    setUser(null);
  };

  return { user, saveUser, updateToken, getUser, deleteUser };
}
