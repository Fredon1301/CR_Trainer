import { useQuery, useQueryClient } from "@tanstack/react-query";
interface User {
  permission: number;
  name: string;
  email: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, status } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/user");
        if (!response.ok) {
          if (response.status === 401) {
            return null;
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
      } catch (error: any) {
        if (!error.message.startsWith("401")) {
          console.error("Error fetching user:", error);
        }
        throw error;
      }
    },
    retry: false, // Optional: prevent retrying on auth errors
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
