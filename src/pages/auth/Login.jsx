import { useState } from "react";
import { supabase } from "../../lib/supabase";

const C = {
  brand: "#D97706",
  dark: "#1C1917",
  bg: "#FAFAF9",
  muted: "#78716C",
  border: "#E7E5E4",
};
const serif = "'Cormorant Garamond',serif";
const sans = "'DM Sans',sans-serif";

const STYLES = `
  * { box-sizing:border-box; margin:0; padding:0; }
  body { margin:0; }
  .inp { width:100%; padding:12px 14px; border:1px solid #E7E5E4; border-radius:12px; background:#FAFAF9; color:#1C1917; font-size:14px; outline:none; }
  .inp:focus { border-color:#D97706; }
  .btn-primary { width:100%; background:#D97706; color:white; border:none; border-radius:12px; padding:14px 0; font-size:15px; font-weight:600; cursor:pointer; transition:opacity 0.15s ease, transform 0.15s ease; }
  .btn-primary:hover:not(:disabled) { transform: translateY(-1px); }
  .btn-primary:disabled { opacity:0.65; cursor:not-allowed; }
  .err { background:#FEF3C7; color:#92400E; border:1px solid #FDE68A; border-radius:12px; padding:14px; }
  .succ { background:#ECFDF5; color:#166534; border:1px solid #A7F3D0; border-radius:12px; padding:14px; }
  .role-btn { width:100%; border:1px solid #E7E5E4; background:#F8FAF7; border-radius:14px; padding:16px 14px; text-align:left; cursor:pointer; transition:border-color 0.15s ease, background 0.15s ease; }
  .role-btn:hover { border-color:#D97706; }
  .role-btn.active { border-color:#D97706; background:#FFF7ED; }
  .role-btn > div { line-height:1.3; }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (profile?.role === "developer") {
      window.location.replace("/developer/dashboard");
    } else {
      window.location.replace("/browse");
    }
  };

  return (
    <div
      style={{
        fontFamily: sans,
        background: C.bg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{STYLES}</style>

      {/* Navbar */}
      <nav
        style={{
          background: C.dark,
          padding: "0 48px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
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
        <a
          href="/signup"
          style={{ color: "#A8A29E", fontSize: 14, textDecoration: "none" }}
        >
          No account? Sign up
        </a>
      </nav>

      {/* Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p
              style={{
                fontFamily: serif,
                fontStyle: "italic",
                color: C.brand,
                fontSize: 16,
                marginBottom: 10,
              }}
            >
              Welcome back
            </p>
            <h1
              style={{
                fontFamily: serif,
                fontSize: 38,
                fontWeight: 600,
                color: C.dark,
                lineHeight: 1.1,
              }}
            >
              Sign in to Propera
            </h1>
          </div>

          {/* Card */}
          <div
            style={{
              background: "white",
              border: "1px solid " + C.border,
              borderRadius: 16,
              padding: "32px 36px",
            }}
          >
            {error && (
              <div className="err" style={{ marginBottom: 20 }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.dark,
                  marginBottom: 6,
                }}
              >
                Email address
              </label>
              <input
                className="inp"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.dark,
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <input
                className="inp"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <a
                href="/signup"
                style={{ color: C.brand, fontSize: 14, textDecoration: "none" }}
              >
                Do not have an account? Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
