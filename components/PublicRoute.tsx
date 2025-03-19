//@ts-ignore
import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    // Redirect to the home screen if  authenticated
    return <Redirect href="/" />;
  }

  // Render the protected content if authenticated
  return children;
}
