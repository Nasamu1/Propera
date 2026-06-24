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
  .card { background: white; border: 1px solid #E7E5E4; border-radius: 14px; padding: 24px 28px; }
  .btn-sm { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; font-family: "DM Sans",sans-serif; }
`;

const STATUS = {
  pending: { bg: "#FEF3C7", color: "#92400E", label: "Pending" },
  confirmed: { bg: "#D1FAE5", color: "#065F46", label: "Confirmed" },
  declined: { bg: "#FEE2E2", color: "#991B1B", label: "Declined" },
};

export default function MyViewings() {
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadViewings();
  }, []);

  async function loadViewings() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("meeting_requests")
      .select(
        "*, properties(title, city, price, price_period, images), profiles!meeting_requests_developer_id_fkey(full_name, company_name, phone)",
      )
      .eq("buyer_id", session.user.id)
      .order("created_at", { ascending: false });

    setViewings(data || []);
    setLoading(false);
  }

  async function cancelViewing(id) {
    if (!window.confirm("Cancel this viewing request?")) return;
    await supabase.from("meeting_requests").delete().eq("id", id);
    setViewings((prev) => prev.filter((v) => v.id !== id));
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

  const filtered =
    filter === "all" ? viewings : viewings.filter((v) => v.status === filter);

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

      <Navbar activePage="viewings" />

      <div style={{ padding: "40px 48px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
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
            My viewings
          </h1>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {["all", "pending", "confirmed", "declined"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 18px",
                borderRadius: 20,
                border: "1px solid " + C.border,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: sans,
                background: filter === f ? C.dark : "white",
                color: filter === f ? "white" : C.dark,
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} (
              {
                (f === "all"
                  ? viewings
                  : viewings.filter((v) => v.status === f)
                ).length
              }
              )
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: "center", padding: "60px 24px" }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
            <h3
              style={{
                fontFamily: serif,
                fontSize: 28,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              No viewings yet
            </h3>
            <p style={{ color: C.muted, fontSize: 15, marginBottom: 24 }}>
              Browse properties and request a viewing to get started.
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
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map((v) => {
              const grad =
                gradients[v.property_id?.charCodeAt(0) % gradients.length] ||
                gradients[0];
              const img = v.properties?.images?.[0];
              return (
                <div
                  key={v.id}
                  className="card"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: 20,
                    alignItems: "start",
                  }}
                >
                  <div
                    onClick={() =>
                      (window.location.href = "/property/" + v.property_id)
                    }
                    style={{
                      height: 90,
                      borderRadius: 10,
                      background: img ? "url(" + img + ") center/cover" : grad,
                      cursor: "pointer",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 8,
                      }}
                    >
                      <div>
                        <h3
                          onClick={() =>
                            (window.location.href =
                              "/property/" + v.property_id)
                          }
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            marginBottom: 3,
                            cursor: "pointer",
                          }}
                        >
                          {v.properties?.title}
                        </h3>
                        <div style={{ fontSize: 13, color: C.muted }}>
                          📍 {v.properties?.city}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: 20,
                          background: STATUS[v.status]?.bg,
                          color: STATUS[v.status]?.color,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {STATUS[v.status]?.label}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 20,
                        fontSize: 13,
                        color: C.muted,
                        marginBottom: 10,
                      }}
                    >
                      <span>📅 {v.preferred_date}</span>
                      {v.preferred_time && <span>🕐 {v.preferred_time}</span>}
                      <span
                        style={{
                          fontFamily: serif,
                          fontWeight: 600,
                          color: C.dark,
                        }}
                      >
                        {formatPrice(
                          v.properties?.price,
                          v.properties?.price_period,
                        )}
                      </span>
                    </div>
                    {v.status === "confirmed" && (
                      <div
                        style={{
                          fontSize: 13,
                          color: "#065F46",
                          background: "#D1FAE5",
                          padding: "8px 12px",
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                      >
                        Confirmed! Developer:{" "}
                        {v.profiles?.company_name || v.profiles?.full_name} —{" "}
                        {v.profiles?.phone || "Contact via app"}
                      </div>
                    )}
                    {v.status === "declined" && (
                      <div
                        style={{
                          fontSize: 13,
                          color: "#991B1B",
                          background: "#FEE2E2",
                          padding: "8px 12px",
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                      >
                        This request was declined by the developer.
                      </div>
                    )}
                    {v.message && (
                      <div
                        style={{
                          fontSize: 13,
                          color: C.muted,
                          fontStyle: "italic",
                          marginBottom: 8,
                        }}
                      >
                        Your note: "{v.message}"
                      </div>
                    )}
                    {v.status === "pending" && (
                      <button
                        className="btn-sm"
                        onClick={() => cancelViewing(v.id)}
                        style={{ background: "#FEE2E2", color: "#991B1B" }}
                      >
                        Cancel request
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
