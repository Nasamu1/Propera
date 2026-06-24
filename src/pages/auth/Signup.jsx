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

export default function Signup() {
  const [role, setRole] = useState("buyer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase
        .from("profiles")
        .update({
          phone: phone,
          company_name: role === "developer" ? company : null,
        })
        .eq("id", data.user.id);
    }

    setLoading(false);
    setSuccess("Account created! Check your email to confirm then sign in.");
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
          href="/login"
          style={{ color: "#A8A29E", fontSize: 14, textDecoration: "none" }}
        >
          Already have an account? Sign in
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
        <div style={{ width: "100%", maxWidth: 440 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p
              style={{
                fontFamily: serif,
                fontStyle: "italic",
                color: C.brand,
                fontSize: 16,
                marginBottom: 10,
              }}
            >
              Get started free
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
              Create your account
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
            {success && (
              <div className="succ" style={{ marginBottom: 20 }}>
                {success}
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.dark,
                  marginBottom: 10,
                }}
              >
                I am a
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="button"
                  className={"role-btn" + (role === "buyer" ? " active" : "")}
                  onClick={() => setRole("buyer")}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🏠</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.dark }}>
                    Buyer / Renter
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    I want to find a property
                  </div>
                </button>
                <button
                  type="button"
                  className={
                    "role-btn" + (role === "developer" ? " active" : "")
                  }
                  onClick={() => setRole("developer")}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🏗️</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.dark }}>
                    Developer
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    I want to list properties
                  </div>
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.dark,
                  marginBottom: 6,
                }}
              >
                Full name
              </label>
              <input
                className="inp"
                type="text"
                placeholder="Peter Nasamu"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
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

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.dark,
                  marginBottom: 6,
                }}
              >
                Phone number
              </label>
              <input
                className="inp"
                type="tel"
                placeholder="08012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {role === "developer" && (
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: C.dark,
                    marginBottom: 6,
                  }}
                >
                  Company / developer name
                </label>
                <input
                  className="inp"
                  type="text"
                  placeholder="Emerald Homes Ltd"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            )}

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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleSignup}
              disabled={loading || !email || !password || !fullName}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <a
                href="/login"
                style={{ color: C.brand, fontSize: 14, textDecoration: "none" }}
              >
                Already have an account? Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
