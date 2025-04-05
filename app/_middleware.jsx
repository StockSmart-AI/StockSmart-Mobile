// import { useRouter, useRootNavigationState } from "expo-router";
// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";

// export default function Middleware() {
//   const { user, loading } = useContext(AuthContext);
//   const router = useRouter();
//   const rootNavigationState = useRootNavigationState();
//   const [hasRedirected, setHasRedirected] = useState(false);

//   useEffect(() => {
//     if (!loading && rootNavigationState?.key && !user && !hasRedirected) {
//       setHasRedirected(true);
//       router.replace("/");
//     }
//   }, [user, loading, rootNavigationState, hasRedirected]);

//   return null;
// }

//@ts-ignore
import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Redirect to the login screen if not authenticated
    return <Redirect href="/(auth)/login" />;
  }

  // Render the protected content if authenticated
  return children;
}
