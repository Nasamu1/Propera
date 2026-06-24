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
  .stat-card { background: white; border: 1px solid #E7E5E4; border-radius: 14px; padding: 24px 28px; }
  .prop-row { background: white; border: 1px solid #E7E5E4; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 16px; transition: box-shadow 0.15s; }
  .prop-row:hover { box-shadow: 0 4px 16px rgba(28,25,23,0.08); }
  .btn-sm { padding: 6px 14px; border-radius: 7px; font-size: 12px; font-weight: 500; cursor: pointer; border: none; font-family: "DM Sans",sans-serif; }
  .nav-link-active { color: white; font-size: 14px; text-decoration: none; font-weight: 500; }
`;

export default function DevDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const u = session.user;
    setUser(u);

    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", u.id)
      .single();
    setProfile(prof);

    const { data: props } = await supabase
      .from("properties")
      .select("*")
      .eq("developer_id", u.id)
      .order("created_at", { ascending: false });
    setProperties(props || []);

    const { data: meets } = await supabase
      .from("meeting_requests")
      .select(
        "*, properties(title), profiles!meeting_requests_buyer_id_fkey(full_name, phone)",
      )
      .eq("developer_id", u.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5);
    setMeetings(meets || []);

    setDataLoading(false);
  }

  async function toggleActive(id, current) {
    await supabase
      .from("properties")
      .update({ is_active: !current })
      .eq("id", id);
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p)),
    );
  }

  async function deleteProperty(id) {
    if (!window.confirm("Delete this listing?")) return;
    await supabase.from("properties").delete().eq("id", id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }

  async function updateMeeting(id, status) {
    await supabase.from("meeting_requests").update({ status }).eq("id", id);
    setMeetings((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function formatPrice(price, period) {
    const f = Number(price).toLocaleString("en-NG");
    if (period === "per_year") return "₦" + f + "/yr";
    if (period === "per_month") return "₦" + f + "/mo";
    return "₦" + f;
  }

  if (dataLoading)
    return (
      <div
        style={{
          fontFamily: sans,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#FAFAF9",
        }}
      >
        <p style={{ color: "#78716C" }}>Loading...</p>
      </div>
    );

  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div style={{ fontFamily: sans, background: C.bg, minHeight: "100vh" }}>
      <style>{STYLES}</style>

      <Navbar activePage="dashboard" />

      <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 36 }}>
          <p
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              color: C.brand,
              fontSize: 16,
              marginBottom: 6,
            }}
          >
            Welcome back
          </p>
          <h1
            style={{
              fontFamily: serif,
              fontSize: 40,
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            {profile?.company_name || profile?.full_name || "Developer"}
          </h1>
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            {
              label: "Active listings",
              value: properties.filter((p) => p.is_active).length,
            },
            { label: "Total listings", value: properties.length },
            { label: "Total views", value: totalViews },
            { label: "Pending meetings", value: meetings.length },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 42,
                  fontWeight: 600,
                  color: C.brand,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}
        >
          {/* Recent listings */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 600 }}>
                My listings
              </h2>
              <a
                href="/developer/add-listing"
                style={{
                  color: C.brand,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                + Add new
              </a>
            </div>

            {properties.length === 0 ? (
              <div
                style={{
                  background: "white",
                  border: "1px solid " + C.border,
                  borderRadius: 14,
                  padding: "40px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>🏠</div>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  No listings yet
                </p>
                <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>
                  Add your first property to start getting leads.
                </p>
                <a
                  href="/developer/add-listing"
                  style={{
                    background: C.brand,
                    color: "white",
                    padding: "10px 24px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Add listing
                </a>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {properties.slice(0, 5).map((p) => (
                  <div key={p.id} className="prop-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          marginBottom: 3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.title}
                      </div>
                      <div style={{ fontSize: 12, color: C.muted }}>
                        {p.city} · {p.views || 0} views
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: 20,
                        background: p.is_active ? "#D1FAE5" : "#F3F4F6",
                        color: p.is_active ? "#065F46" : "#6B7280",
                      }}
                    >
                      {p.is_active ? "Active" : "Paused"}
                    </span>
                    <button
                      className="btn-sm"
                      onClick={() => toggleActive(p.id, p.is_active)}
                      style={{ background: "#F5F5F4", color: C.dark }}
                    >
                      {p.is_active ? "Pause" : "Activate"}
                    </button>
                    <button
                      className="btn-sm"
                      onClick={() =>
                        (window.location.href =
                          "/developer/add-listing?edit=" + p.id)
                      }
                      style={{ background: "#EEF2FF", color: "#3730A3" }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-sm"
                      onClick={() => deleteProperty(p.id)}
                      style={{ background: "#FEF2F2", color: "#991B1B" }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {properties.length > 5 && (
                  <a
                    href="/developer/listings"
                    style={{
                      color: C.brand,
                      fontSize: 13,
                      textAlign: "center",
                      padding: "8px 0",
                      textDecoration: "none",
                    }}
                  >
                    View all {properties.length} listings
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Pending meetings */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 600 }}>
                Pending meetings
              </h2>
              <a
                href="/developer/meetings"
                style={{
                  color: C.brand,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                View all
              </a>
            </div>

            {meetings.length === 0 ? (
              <div
                style={{
                  background: "white",
                  border: "1px solid " + C.border,
                  borderRadius: 14,
                  padding: "40px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  No pending meetings
                </p>
                <p style={{ color: C.muted, fontSize: 14 }}>
                  Meeting requests from buyers will appear here.
                </p>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {meetings.map((m) => (
                  <div
                    key={m.id}
                    className="prop-row"
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          marginBottom: 2,
                        }}
                      >
                        {m.profiles?.full_name || "Buyer"}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.muted,
                          marginBottom: 4,
                        }}
                      >
                        {m.properties?.title}
                      </div>
                      <div style={{ fontSize: 12, color: C.muted }}>
                        📅 {m.preferred_date}{" "}
                        {m.preferred_time ? "at " + m.preferred_time : ""}
                      </div>
                      {m.message && (
                        <div
                          style={{
                            fontSize: 12,
                            color: C.muted,
                            marginTop: 4,
                            fontStyle: "italic",
                          }}
                        >
                          {m.message}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn-sm"
                        onClick={() => updateMeeting(m.id, "confirmed")}
                        style={{ background: "#D1FAE5", color: "#065F46" }}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn-sm"
                        onClick={() => updateMeeting(m.id, "declined")}
                        style={{ background: "#FEF2F2", color: "#991B1B" }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
