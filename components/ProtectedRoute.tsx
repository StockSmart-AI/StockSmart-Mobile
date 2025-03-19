//@ts-ignore
import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // Redirect to the login screen if not authenticated
    return <Redirect href="/login" />;
  }

  // Render the protected content if authenticated
  return children;
}
