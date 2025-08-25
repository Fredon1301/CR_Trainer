import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../shared/schema";
import { getQueryFn } from "../lib/queryClient";

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, status } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    onError: (error) => {
      if (!error.message.startsWith("401")) {
        console.error("Error fetching user:", error);
      }
    },
  });

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  };

  const logout = () => {
    localStorage.removeItem("user");
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  };

  return {
    user,
    isLoading: status === 'pending',
    isAuthenticated: !!user,
    login,
    logout,
  };
}
