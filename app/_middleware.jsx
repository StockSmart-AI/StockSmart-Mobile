//@ts-ignore
import { Redirect, router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (!user || !user.isVerified) {
    // Redirect to the login screen if not authenticated or verified
    return <Redirect href="/(auth)/login" />;
  }

  return children;
}
