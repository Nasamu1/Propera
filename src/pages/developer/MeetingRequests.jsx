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
  .btn-sm { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; font-family: "DM Sans",sans-serif; }
  .card { background: white; border: 1px solid #E7E5E4; border-radius: 14px; padding: 24px 28px; }
`;

const STATUS_COLORS = {
  pending: { bg: "#FEF3C7", color: "#92400E" },
  confirmed: { bg: "#D1FAE5", color: "#065F46" },
  declined: { bg: "#FEE2E2", color: "#991B1B" },
};

export default function MeetingRequests() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [devProfile, setDevProfile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/login";
      return;
    }

    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    setDevProfile(prof);

    const { data } = await supabase
      .from("meeting_requests")
      .select(
        "*, properties(title, city), profiles!meeting_requests_buyer_id_fkey(full_name, phone, id)",
      )
      .eq("developer_id", session.user.id)
      .order("created_at", { ascending: false });

    setMeetings(data || []);
    setLoading(false);
  }

  async function updateStatus(meetingId, newStatus, meeting) {
    await supabase
      .from("meeting_requests")
      .update({ status: newStatus })
      .eq("id", meetingId);
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, status: newStatus } : m)),
    );

    if (newStatus === "confirmed") {
      const { data: buyerAuth } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", meeting.profiles?.id)
        .single();

      try {
        await fetch("http://localhost:5678/webhook/propera-meeting-confirmed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            property_title: meeting.properties?.title,
            buyer_name: meeting.profiles?.full_name || "Buyer",
            buyer_phone: meeting.profiles?.phone || "Not provided",
            buyer_email: buyerAuth?.email || "",
            developer_name: devProfile?.company_name || devProfile?.full_name,
            developer_phone: devProfile?.phone || "Not provided",
            preferred_date: meeting.preferred_date,
            preferred_time: meeting.preferred_time || "Flexible",
          }),
        });
      } catch (e) {
        console.log("Webhook error:", e);
      }
    }
  }

  const filtered = meetings.filter((m) =>
    filter === "all" ? true : m.status === filter,
  );

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

      <Navbar activePage="meetings" />

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
            Developer portal
          </p>
          <h1 style={{ fontFamily: serif, fontSize: 42, fontWeight: 600 }}>
            Meeting requests
          </h1>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {["pending", "confirmed", "declined", "all"].map((f) => (
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
                meetings.filter((m) => (f === "all" ? true : m.status === f))
                  .length
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
            <div style={{ fontSize: 40, marginBottom: 16 }}>📅</div>
            <h3
              style={{
                fontFamily: serif,
                fontSize: 26,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              No {filter} requests
            </h3>
            <p style={{ color: C.muted, fontSize: 14 }}>
              Meeting requests from buyers will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((m) => (
              <div key={m.id} className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}
                    >
                      {m.profiles?.full_name || "Buyer"}
                    </div>
                    <div style={{ fontSize: 13, color: C.muted }}>
                      📞 {m.profiles?.phone || "No phone"}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 20,
                      background: STATUS_COLORS[m.status]?.bg,
                      color: STATUS_COLORS[m.status]?.color,
                    }}
                  >
                    {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                  </span>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    background: C.bg,
                    borderRadius: 10,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}
                  >
                    🏠 {m.properties?.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 20,
                      fontSize: 13,
                      color: C.muted,
                    }}
                  >
                    <span>📅 {m.preferred_date}</span>
                    {m.preferred_time && <span>🕐 {m.preferred_time}</span>}
                  </div>
                  {m.message && (
                    <div
                      style={{
                        fontSize: 13,
                        color: C.muted,
                        marginTop: 8,
                        fontStyle: "italic",
                      }}
                    >
                      {m.message}
                    </div>
                  )}
                </div>

                {m.status === "pending" && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      className="btn-sm"
                      onClick={() => updateStatus(m.id, "confirmed", m)}
                      style={{
                        background: "#D1FAE5",
                        color: "#065F46",
                        flex: 1,
                      }}
                    >
                      Confirm viewing
                    </button>
                    <button
                      className="btn-sm"
                      onClick={() => updateStatus(m.id, "declined", m)}
                      style={{
                        background: "#FEE2E2",
                        color: "#991B1B",
                        flex: 1,
                      }}
                    >
                      Decline
                    </button>
                  </div>
                )}

                {m.status === "confirmed" && (
                  <div
                    style={{ fontSize: 13, color: "#065F46", fontWeight: 500 }}
                  >
                    Confirmed — buyer has been notified via WhatsApp and email.
                  </div>
                )}
                {m.status === "declined" && (
                  <div
                    style={{ fontSize: 13, color: "#991B1B", fontWeight: 500 }}
                  >
                    Declined.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
