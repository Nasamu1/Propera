import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({ children, requiredRole }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function check() {
      // Wait for supabase to restore session from localStorage
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setStatus("no-session");
        return;
      }

      if (!requiredRole) {
        setStatus("ok");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role === requiredRole) {
        setStatus("ok");
      } else {
        setStatus("wrong-role");
      }
    }

    check();
  }, [requiredRole]);

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "DM Sans,sans-serif",
          color: "#78716C",
          background: "#FAFAF9",
        }}
      >
        Loading...
      </div>
    );
  }

  if (status === "no-session") {
    window.location.replace("/login");
    return null;
  }

  if (status === "wrong-role") {
    window.location.replace("/browse");
    return null;
  }

  return children;
}
