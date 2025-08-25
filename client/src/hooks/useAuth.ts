import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { getQueryFn } from "../lib/queryClient";

export function useAuth() {
  const { data: user, status } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    onError: (error) => {
      // This onError is now primarily for other types of errors, as 401s are handled by queryFn
      if (!error.message.startsWith("401")) { // Only log if it's not a 401
        console.error("Error fetching user:", error);
      }
    },
  });

  return {
    user,
    isLoading: status === 'pending',
    isAuthenticated: !!user,
  };
}
