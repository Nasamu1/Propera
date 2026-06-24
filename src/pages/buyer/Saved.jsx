import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";

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
  @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap");
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .nl { color: #A8A29E; font-size: 14px; text-decoration: none; transition: color 0.15s; }
  .nl:hover { color: white; }
  .pcard { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
  .pcard:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(28,25,23,0.12); }
  .tag-pill { background: #F5F5F4; color: #57534E; font-size: 11px; padding: 3px 9px; border-radius: 20px; font-weight: 500; display: inline-block; }
`;

export default function Saved() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadSaved();
  }, []);

  async function loadSaved() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/login";
      return;
    }
    setUser(session.user);

    const { data } = await supabase
      .from("saved_properties")
      .select("*, properties(*, profiles(full_name, company_name, verified))")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    let merged = data || [];
    
    // localStorage Fallback
    const localKey = `propera_saved_${session.user.id}`;
    const localSavedIds = JSON.parse(localStorage.getItem(localKey) || "[]");
    
    const dbPropIds = new Set(merged.map((s) => s.property_id));
    const missingIds = localSavedIds.filter((id) => !dbPropIds.has(id));
    
    if (missingIds.length > 0) {
      const { data: missingProps } = await supabase
        .from("properties")
        .select("*, profiles(full_name, company_name, verified)")
        .in("id", missingIds);
        
      if (missingProps) {
        const missingSaved = missingProps.map((p) => ({
          id: `local_${p.id}`,
          user_id: session.user.id,
          property_id: p.id,
          created_at: new Date().toISOString(),
          properties: p,
        }));
        merged = [...merged, ...missingSaved];
      }
    }

    setSaved(merged);
    setLoading(false);
  }

  async function unsave(propertyId) {
    await supabase
      .from("saved_properties")
      .delete()
      .eq("user_id", user.id)
      .eq("property_id", propertyId);

    const localKey = `propera_saved_${user.id}`;
    const localSavedIds = JSON.parse(localStorage.getItem(localKey) || "[]");
    const updated = localSavedIds.filter((id) => id !== propertyId);
    localStorage.setItem(localKey, JSON.stringify(updated));

    setSaved((prev) => prev.filter((s) => s.property_id !== propertyId));
  }

  function formatPrice(price, period) {
    const f = Number(price).toLocaleString("en-NG");
    if (period === "per_year") return "\u20a6" + f + "/yr";
    if (period === "per_month") return "\u20a6" + f + "/mo";
    return "\u20a6" + f;
  }

  const gradients = [
    "linear-gradient(135deg,#4F46E5,#7C3AED)",
    "linear-gradient(135deg,#0D9488,#0891B2)",
    "linear-gradient(135deg,#D97706,#DC2626)",
    "linear-gradient(135deg,#059669,#0D9488)",
  ];

  if (loading)
    return (
      <div
        style={{
          fontFamily: sans,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: C.bg,
        }}
      >
        <p style={{ color: C.muted }}>Loading...</p>
      </div>
    );

  return (
    <div style={{ fontFamily: sans, background: C.bg, minHeight: "100vh" }}>
      <style>{STYLES}</style>

      <Navbar activePage="saved" />

      <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 36 }}>
          <p
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              color: C.brand,
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            Your account
          </p>
          <h1 style={{ fontFamily: serif, fontSize: 42, fontWeight: 600 }}>
            Saved properties
          </h1>
        </div>

        {saved.length === 0 ? (
          <div
            style={{
              background: "white",
              border: "1px solid " + C.border,
              borderRadius: 14,
              padding: "60px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤍</div>
            <h3
              style={{
                fontFamily: serif,
                fontSize: 28,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              No saved properties
            </h3>
            <p style={{ color: C.muted, fontSize: 15, marginBottom: 24 }}>
              Save properties you like while browsing to see them here.
            </p>
            <a
              href="/browse"
              style={{
                background: C.brand,
                color: "white",
                padding: "12px 28px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Browse properties
            </a>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>
              {saved.length} saved{" "}
              {saved.length === 1 ? "property" : "properties"}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 24,
              }}
            >
              {saved.map((s) => {
                const p = s.properties;
                const grad =
                  gradients[p?.id?.charCodeAt(0) % gradients.length] ||
                  gradients[0];
                const img = p?.images?.[0];
                return (
                  <div
                    key={s.id}
                    className="pcard"
                    style={{
                      background: "white",
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "1px solid " + C.border,
                    }}
                  >
                    <div
                      onClick={() =>
                        (window.location.href = "/property/" + p.id)
                      }
                      style={{
                        height: 190,
                        background: img
                          ? "url(" + img + ") center/cover"
                          : grad,
                        position: "relative",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        padding: 12,
                      }}
                    >
                      <span
                        style={{
                          background: "white",
                          color: C.dark,
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: 6,
                          position: "absolute",
                          bottom: 14,
                          left: 14,
                        }}
                      >
                        {p?.status === "for_sale" ? "For Sale" : "For Rent"}
                      </span>
                    </div>
                    <div style={{ padding: "18px 20px 20px" }}>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          marginBottom: 5,
                          lineHeight: 1.3,
                        }}
                      >
                        {p?.title}
                      </h3>
                      <div
                        style={{
                          fontFamily: serif,
                          fontSize: 22,
                          fontWeight: 700,
                          marginBottom: 10,
                        }}
                      >
                        {formatPrice(p?.price, p?.price_period)}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: C.muted,
                          marginBottom: 12,
                        }}
                      >
                        📍 {p?.city}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          fontSize: 13,
                          color: C.muted,
                          marginBottom: 12,
                        }}
                      >
                        {p?.bedrooms && <span>🛏 {p.bedrooms} bed</span>}
                        {p?.bathrooms && <span>🚿 {p.bathrooms} bath</span>}
                        {p?.sqm && <span>{p.sqm} sqm</span>}
                      </div>
                      {p?.amenities?.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            flexWrap: "wrap",
                            marginBottom: 14,
                          }}
                        >
                          {p.amenities.slice(0, 3).map((a) => (
                            <span key={a} className="tag-pill">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                      <div
                        style={{
                          borderTop: "1px solid " + C.border,
                          paddingTop: 14,
                          display: "flex",
                          gap: 10,
                        }}
                      >
                        <button
                          onClick={() =>
                            (window.location.href = "/property/" + p.id)
                          }
                          style={{
                            flex: 1,
                            background: C.brand,
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "9px 0",
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            fontFamily: sans,
                          }}
                        >
                          View property
                        </button>
                        <button
                          onClick={() => unsave(p.id)}
                          style={{
                            padding: "9px 14px",
                            background: "#FEE2E2",
                            color: "#991B1B",
                            border: "none",
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            fontFamily: sans,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
