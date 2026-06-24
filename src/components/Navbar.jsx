import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const C = { brand: "#D97706", dark: "#1C1917" };
const serif = "Cormorant Garamond,serif";
const sans = "DM Sans,sans-serif";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  .nl { color:#A8A29E; font-size:14px; text-decoration:none; transition:color 0.15s; }
  .nl:hover { color:white; }
`;

export default function Navbar({ activePage }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        const { data } = await supabase
          .from("profiles")
          .select("role, full_name, company_name")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    });
  }, []);

  function handleListProperty() {
    if (!user) {
      window.location.href = "/signup";
      return;
    }
    if (profile?.role === "developer") {
      window.location.href = "/developer/add-listing";
    } else {
      window.location.href = "/developer/add-listing";
    }
  } 

  function handleSignOut() {
    supabase.auth.signOut().then(() => (window.location.href = "/"));
  }

  return (
    <nav
      style={{
        background: C.dark,
        padding: "0 48px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        fontFamily: sans,
      }}
    >
      <style>{STYLES}</style>

      <a
        href="/"
        style={{
          fontFamily: serif,
          fontSize: 26,
          fontWeight: 600,
          color: "white",
          textDecoration: "none",
          letterSpacing: "-0.02em",
        }}
      >
        Prop<span style={{ color: C.brand }}>era</span>
      </a>

      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        <a
          href="/browse"
          className={activePage === "browse" ? "nl" : "nl"}
          style={{
            color: activePage === "browse" ? "white" : "#A8A29E",
            fontWeight: activePage === "browse" ? 500 : 400,
            fontSize: 14,
            textDecoration: "none",
            transition: "color 0.15s",
          }}
        >
          Browse
        </a>

        {!loading && (
          <>
            {user && profile?.role === "developer" ? (
              <>
                <a href="/developer/dashboard" className="nl">
                  Dashboard
                </a>
                <a href="/developer/meetings" className="nl">
                  Meetings
                </a>
                <button
                  onClick={handleListProperty}
                  style={{
                    background: C.brand,
                    color: C.dark,
                    padding: "8px 18px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: sans,
                  }}
                >
                  + List property
                </button>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#A8A29E",
                    fontSize: 14,
                    fontFamily: sans,
                  }}
                >
                  Sign out
                </button>
              </>
            ) : user && profile?.role === "buyer" ? (
              <>
                <a href="/buyer/saved" className="nl">
                  Saved
                </a>
                <a href="/buyer/viewings" className="nl">
                  My viewings
                </a>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#A8A29E",
                    fontSize: 14,
                    fontFamily: sans,
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleListProperty}
                  style={{
                    background: C.brand,
                    color: C.dark,
                    padding: "8px 18px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: sans,
                  }}
                >
                  List property
                </button>
                <a href="/login" className="nl">
                  Sign in
                </a>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
