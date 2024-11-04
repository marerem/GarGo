/* Import installed modules */
import React, { createContext, useContext, useState } from "react";

/* Import custom modules */
import Auth from "@/lib/backend/auth";

/* Define the context */
const AuthContext = createContext<any>({});
export const useAuthContext = () => useContext(AuthContext);

/* Define and export the provider */
function AuthProvider({ children } : {children: React.ReactNode}) {
  /* Define the state variables */
  const [user, setUser] = useState(null);

  /* Define a function to refresh the user */
  const refreshUser = async () => {
    const data = await Auth.getData();
    setUser(data ? data : null);
  };

  /* Return the JSX */
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;