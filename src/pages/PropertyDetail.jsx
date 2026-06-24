import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

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
  .inp { width: 100%; padding: 12px 14px; border: 1px solid #E7E5E4; border-radius: 8px; font-size: 14px; font-family: "DM Sans",sans-serif; color: #1C1917; background: white; outline: none; transition: border-color 0.15s; }
  .inp:focus { border-color: #D97706; }
  .tag-pill { background: #F5F4F4; color: #57534E; font-size: 12px; padding: 5px 12px; border-radius: 20px; font-weight: 500; display: inline-block; }
  .btn-primary { width: 100%; padding: 14px; background: #D97706; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: "DM Sans",sans-serif; }
  .btn-primary:disabled { background: #D4D0CA; cursor: not-allowed; }
  .succ { background: #F0FDF4; border: 1px solid #BBF7D0; color: #166534; padding: 12px 16px; border-radius: 8px; font-size: 14px; }
  .err  { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; padding: 12px 16px; border-radius: 8px; font-size: 14px; }
  
  /* Rightmove styling additions */
  .tab-btn {
    padding: 14px 28px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    font-size: 15px;
    font-weight: 500;
    color: #78716C;
    cursor: pointer;
    font-family: "DM Sans",sans-serif;
    transition: all 0.15s ease;
  }
  .tab-btn.active {
    color: #D97706;
    border-bottom-color: #D97706;
    font-weight: 600;
  }
  .tab-btn:hover {
    color: #1C1917;
  }
  .carousel-btn {
    background: rgba(28,25,23,0.55);
    color: white;
    border: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
    font-size: 18px;
  }
  .carousel-btn:hover {
    background: rgba(28,25,23,0.85);
    transform: scale(1.05);
  }
  .indicator-pill {
    background: rgba(28,25,23,0.75);
    color: white;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }
  .score-card {
    background: white;
    border: 1px solid #E7E5E4;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
  }
  .score-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 4px solid #D97706;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700;
    color: #1C1917;
  }
  .school-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px dashed #E7E5E4;
  }
  .school-item:last-child {
    border-bottom: none;
  }
`;

function formatPrice(price, period) {
  const f = Number(price).toLocaleString("en-NG");
  if (period === "per_year") return "₦" + f + "/yr";
  if (period === "per_month") return "₦" + f + "/mo";
  return "₦" + f;
}

function generateSVGFloorPlan(bedrooms) {
  const colorDark = "#1C1917";
  const colorMuted = "#78716C";
  const strokeWOuter = "4";
  const strokeWInner = "2.5";

  if (Number(bedrooms) <= 1) {
    return (
      <svg viewBox="0 0 400 300" style={{ width: "100%", maxWidth: 460, background: "#FFFFFF", border: "1px solid #E7E5E4", borderRadius: 12 }}>
        {/* Outer walls */}
        <rect x="20" y="20" width="360" height="260" fill="none" stroke={colorDark} strokeWidth={strokeWOuter} />
        {/* Main room divider */}
        <line x1="210" y1="20" x2="210" y2="280" stroke={colorDark} strokeWidth={strokeWInner} />
        {/* Bathroom divider */}
        <line x1="210" y1="170" x2="380" y2="170" stroke={colorDark} strokeWidth={strokeWInner} />
        <line x1="290" y1="170" x2="290" y2="280" stroke={colorDark} strokeWidth={strokeWInner} />

        {/* Doors */}
        <path d="M 210,110 A 30,30 0 0,1 180,140" fill="none" stroke={colorMuted} strokeWidth="1.5" />
        <path d="M 290,200 A 30,30 0 0,1 320,170" fill="none" stroke={colorMuted} strokeWidth="1.5" />
        
        {/* Labels */}
        <text x="115" y="140" fontFamily="DM Sans, sans-serif" fontSize="15" fontWeight="600" fill={colorDark} textAnchor="middle">Living Area</text>
        <text x="115" y="160" fontFamily="DM Sans, sans-serif" fontSize="12" fill={colorMuted} textAnchor="middle">5.4m × 4.8m</text>
        
        <text x="295" y="90" fontFamily="DM Sans, sans-serif" fontSize="15" fontWeight="600" fill={colorDark} textAnchor="middle">Bedroom</text>
        <text x="295" y="110" fontFamily="DM Sans, sans-serif" fontSize="12" fill={colorMuted} textAnchor="middle">4.2m × 3.8m</text>
        
        <text x="250" y="225" fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="600" fill={colorDark} textAnchor="middle">Kitchen</text>
        <text x="250" y="240" fontFamily="DM Sans, sans-serif" fontSize="10" fill={colorMuted} textAnchor="middle">2.4m × 2.2m</text>
        
        <text x="335" y="225" fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="600" fill={colorDark} textAnchor="middle">Bath</text>
        <text x="335" y="240" fontFamily="DM Sans, sans-serif" fontSize="10" fill={colorMuted} textAnchor="middle">2.2m × 1.8m</text>
      </svg>
    );
  }

  if (Number(bedrooms) === 2) {
    return (
      <svg viewBox="0 0 400 300" style={{ width: "100%", maxWidth: 460, background: "#FFFFFF", border: "1px solid #E7E5E4", borderRadius: 12 }}>
        {/* Outer walls */}
        <rect x="20" y="20" width="360" height="260" fill="none" stroke={colorDark} strokeWidth={strokeWOuter} />
        {/* Master Bedroom divider (top left) */}
        <line x1="20" y1="140" x2="200" y2="140" stroke={colorDark} strokeWidth={strokeWInner} />
        {/* Bedroom 2 divider (bottom left) */}
        <line x1="200" y1="20" x2="200" y2="280" stroke={colorDark} strokeWidth={strokeWInner} />
        {/* Kitchen / Bath dividers (right side) */}
        <line x1="200" y1="180" x2="380" y2="180" stroke={colorDark} strokeWidth={strokeWInner} />
        <line x1="290" y1="180" x2="290" y2="280" stroke={colorDark} strokeWidth={strokeWInner} />

        {/* Master Bath divider */}
        <line x1="120" y1="20" x2="120" y2="140" stroke={colorDark} strokeWidth={strokeWInner} />

        {/* Labels */}
        <text x="70" y="70" fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="600" fill={colorDark} textAnchor="middle">Master Bed</text>
        <text x="70" y="85" fontFamily="DM Sans, sans-serif" fontSize="10" fill={colorMuted} textAnchor="middle">3.2m × 3.6m</text>
        
        <text x="160" y="70" fontFamily="DM Sans, sans-serif" fontSize="12" fontWeight="600" fill={colorDark} textAnchor="middle">M. Bath</text>
        <text x="160" y="85" fontFamily="DM Sans, sans-serif" fontSize="9" fill={colorMuted} textAnchor="middle">2.2m × 1.6m</text>

        <text x="110" y="210" fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="600" fill={colorDark} textAnchor="middle">Bedroom 2</text>
        <text x="110" y="225" fontFamily="DM Sans, sans-serif" fontSize="10" fill={colorMuted} textAnchor="middle">4.0m × 3.2m</text>

        <text x="290" y="100" fontFamily="DM Sans, sans-serif" fontSize="15" fontWeight="600" fill={colorDark} textAnchor="middle">Living Area</text>
        <text x="290" y="120" fontFamily="DM Sans, sans-serif" fontSize="12" fill={colorMuted} textAnchor="middle">4.8m × 4.2m</text>

        <text x="245" y="230" fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="600" fill={colorDark} textAnchor="middle">Kitchen</text>
        <text x="245" y="245" fontFamily="DM Sans, sans-serif" fontSize="10" fill={colorMuted} textAnchor="middle">2.4m × 2.2m</text>

        <text x="335" y="230" fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="600" fill={colorDark} textAnchor="middle">Bath 2</text>
        <text x="335" y="245" fontFamily="DM Sans, sans-serif" fontSize="10" fill={colorMuted} textAnchor="middle">2.2m × 2.0m</text>
      </svg>
    );
  }

  // 3+ bedrooms
  return (
    <svg viewBox="0 0 400 300" style={{ width: "100%", maxWidth: 460, background: "#FFFFFF", border: "1px solid #E7E5E4", borderRadius: 12 }}>
      {/* Outer walls */}
      <rect x="20" y="20" width="360" height="260" fill="none" stroke={colorDark} strokeWidth={strokeWOuter} />
      
      {/* 3 Bedroom divisions */}
      <line x1="140" y1="20" x2="140" y2="280" stroke={colorDark} strokeWidth={strokeWInner} />
      <line x1="20" y1="150" x2="140" y2="150" stroke={colorDark} strokeWidth={strokeWInner} />

      <line x1="140" y1="180" x2="380" y2="180" stroke={colorDark} strokeWidth={strokeWInner} />
      <line x1="270" y1="180" x2="270" y2="280" stroke={colorDark} strokeWidth={strokeWInner} />

      <line x1="280" y1="20" x2="280" y2="180" stroke={colorDark} strokeWidth={strokeWInner} />
      <line x1="280" y1="110" x2="380" y2="110" stroke={colorDark} strokeWidth={strokeWInner} />

      {/* Labels */}
      <text x="80" y="80" fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="600" fill={colorDark} textAnchor="middle">Bedroom 2</text>
      <text x="80" y="95" fontFamily="DM Sans, sans-serif" fontSize="10" fill={colorMuted} textAnchor="middle">3.2m × 3.0m</text>

      <text x="80" y="210" fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="600" fill={colorDark} textAnchor="middle">Bedroom 3</text>
      <text x="80" y="225" fontFamily="DM Sans, sans-serif" fontSize="10" fill={colorMuted} textAnchor="middle">3.2m × 3.0m</text>

      <text x="210" y="90" fontFamily="DM Sans, sans-serif" fontSize="14" fontWeight="600" fill={colorDark} textAnchor="middle">Living Room</text>
      <text x="210" y="110" fontFamily="DM Sans, sans-serif" fontSize="11" fill={colorMuted} textAnchor="middle">4.6m × 4.4m</text>

      <text x="205" y="225" fontFamily="DM Sans, sans-serif" fontSize="13" fontWeight="600" fill={colorDark} textAnchor="middle">Master Bed</text>
      <text x="205" y="240" fontFamily="DM Sans, sans-serif" fontSize="10" fill={colorMuted} textAnchor="middle">4.2m × 3.6m</text>

      <text x="325" y="225" fontFamily="DM Sans, sans-serif" fontSize="12" fontWeight="600" fill={colorDark} textAnchor="middle">Master Bath</text>
      <text x="325" y="240" fontFamily="DM Sans, sans-serif" fontSize="9" fill={colorMuted} textAnchor="middle">2.8m × 2.0m</text>

      <text x="330" y="60" fontFamily="DM Sans, sans-serif" fontSize="12" fontWeight="600" fill={colorDark} textAnchor="middle">Kitchen</text>
      <text x="330" y="75" fontFamily="DM Sans, sans-serif" fontSize="9" fill={colorMuted} textAnchor="middle">2.8m × 2.2m</text>

      <text x="330" y="145" fontFamily="DM Sans, sans-serif" fontSize="12" fontWeight="600" fill={colorDark} textAnchor="middle">Bath 2</text>
      <text x="330" y="160" fontFamily="DM Sans, sans-serif" fontSize="9" fill={colorMuted} textAnchor="middle">2.8m × 1.8m</text>
    </svg>
  );
}

export default function PropertyDetail() {
  const id = window.location.pathname.split("/").pop();

  const [property, setProperty] = useState(null);
  const [user, setUser] = useState(null);
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  
  // Rightmove states
  const [activeTab, setActiveTab] = useState("overview");
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
    checkAuth();
  }, []);

  async function fetchProperty() {
    const { data } = await supabase
      .from("properties")
      .select("*, profiles(full_name, company_name, phone, verified)")
      .eq("id", id)
      .single();
    setProperty(data);
    setLoading(false);
    if (data)
      await supabase
        .from("properties")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", id);
  }

  async function checkAuth() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setBuyerProfile(data);
      const { data: savedCheck } = await supabase
        .from("saved_properties")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("property_id", id)
        .maybeSingle();

      const localKey = `propera_saved_${session.user.id}`;
      const localSavedIds = JSON.parse(localStorage.getItem(localKey) || "[]");
      const isSavedLocal = localSavedIds.includes(id);

      setIsSaved(!!savedCheck || isSavedLocal);
    }
  }

  async function handleRequestViewing() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!date) {
      setError("Please select a preferred date.");
      return;
    }
    setError("");
    setSubmitting(true);

    const { error: dbError } = await supabase.from("meeting_requests").insert({
      property_id: property.id,
      buyer_id: user.id,
      developer_id: property.developer_id,
      preferred_date: date,
      preferred_time: time,
      message: message,
      status: "pending",
    });

    if (dbError) {
      setError(dbError.message);
      setSubmitting(false);
      return;
    }

    try {
      await fetch("http://localhost:5678/webhook/propera-meeting-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_title: property.title,
          property_id: property.id,
          buyer_name: buyerProfile?.full_name || user.email,
          buyer_email: user.email,
          buyer_phone: buyerProfile?.phone || "Not provided",
          developer_phone: property.profiles?.phone || "Not provided",
          developer_name:
            property.profiles?.company_name || property.profiles?.full_name,
          preferred_date: date,
          preferred_time: time || "Flexible",
          message: message || "No message",
        }),
      });
    } catch (e) {
      console.log("Webhook error:", e);
    }

    setSubmitting(false);
    setSuccess("Viewing request sent! The developer will confirm shortly.");
    setDate("");
    setTime("");
    setMessage("");
  }

  async function toggleSave() {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const localKey = `propera_saved_${user.id}`;
    let localSavedIds = JSON.parse(localStorage.getItem(localKey) || "[]");

    if (isSaved) {
      await supabase
        .from("saved_properties")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", property.id);

      localSavedIds = localSavedIds.filter((x) => x !== property.id);
      localStorage.setItem(localKey, JSON.stringify(localSavedIds));
      setIsSaved(false);
    } else {
      await supabase
        .from("saved_properties")
        .insert({ user_id: user.id, property_id: property.id });

      if (!localSavedIds.includes(property.id)) {
        localSavedIds.push(property.id);
        localStorage.setItem(localKey, JSON.stringify(localSavedIds));
      }
      setIsSaved(true);
    }
  }

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

  if (!property)
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
        <p style={{ color: C.muted }}>Property not found.</p>
      </div>
    );

  const gradients = [
    "linear-gradient(135deg,#4F46E5,#7C3AED)",
    "linear-gradient(135deg,#0D9488,#0891B2)",
    "linear-gradient(135deg,#D97706,#DC2626)",
    "linear-gradient(135deg,#059669,#0D9488)",
  ];
  const grad =
    gradients[property.id?.charCodeAt(0) % gradients.length] || gradients[0];
  const heroImage =
    property.images && property.images.length > 0 ? property.images[activeImgIndex] : null;

  return (
    <div style={{ fontFamily: sans, background: C.bg, minHeight: "100vh" }}>
      <style>{STYLES}</style>

      <Navbar activePage="browse" />

      {/* Premium Image Gallery Carousel */}
      <div>
        <div
          style={{
            height: 460,
            background: heroImage ? "url(" + heroImage + ") center/cover" : grad,
            position: "relative",
            transition: "background 0.3s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px"
          }}
        >
          {property.images && property.images.length > 1 ? (
            <>
              <button
                className="carousel-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
                }}
              >
                ‹
              </button>
              <button
                className="carousel-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
                }}
              >
                ›
              </button>
            </>
          ) : <div />}

          {property.images && property.images.length > 1 && (
            <div style={{ position: "absolute", top: 20, right: 20 }} className="indicator-pill">
              {activeImgIndex + 1} of {property.images.length}
            </div>
          )}

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              background: "linear-gradient(transparent, rgba(28,25,23,0.7))",
              pointerEvents: "none"
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: 48,
              display: "flex",
              gap: 10,
              zIndex: 10
            }}
          >
            <span
              style={{
                background: "white",
                color: C.dark,
                fontSize: 12,
                fontWeight: 600,
                padding: "5px 12px",
                borderRadius: 6,
              }}
            >
              {property.status === "for_sale" ? "For Sale" : "For Rent"}
            </span>
            {property.profiles?.verified && (
              <span
                style={{
                  background: C.brand,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: 6,
                }}
              >
                Verified Developer
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Navigation Row */}
        {property.images && property.images.length > 1 && (
          <div style={{ background: "#0C0A09", padding: "12px 48px", display: "flex", gap: 10, overflowX: "auto" }}>
            {property.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                style={{
                  width: 72,
                  height: 48,
                  borderRadius: 6,
                  background: `url(${img}) center/cover`,
                  cursor: "pointer",
                  border: activeImgIndex === idx ? `2px solid ${C.brand}` : "2px solid transparent",
                  opacity: activeImgIndex === idx ? 1 : 0.6,
                  transition: "all 0.15s",
                  flexShrink: 0
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 48px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: 48,
            alignItems: "start",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: serif,
                fontSize: 46,
                fontWeight: 600,
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              {property.title}
            </h1>
            <div
              style={{
                fontFamily: serif,
                fontSize: 32,
                fontWeight: 700,
                color: C.dark,
                marginBottom: 16,
              }}
            >
              {formatPrice(property.price, property.price_period)}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: C.muted,
                fontSize: 15,
                marginBottom: 24,
              }}
            >
              📍 {property.city}
              {property.address ? ", " + property.address : ""}
            </div>

            <div
              style={{
                display: "flex",
                gap: 32,
                marginBottom: 36,
                padding: "20px 24px",
                background: "white",
                borderRadius: 12,
                border: "1px solid " + C.border,
              }}
            >
              {property.bedrooms && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ fontFamily: serif, fontSize: 28, fontWeight: 600 }}
                  >
                    {property.bedrooms}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    Bedrooms
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ fontFamily: serif, fontSize: 28, fontWeight: 600 }}
                  >
                    {property.bathrooms}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    Bathrooms
                  </div>
                </div>
              )}
              {property.sqm && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ fontFamily: serif, fontSize: 28, fontWeight: 600 }}
                  >
                    {property.sqm}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    Sqm
                  </div>
                </div>
              )}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: serif,
                    fontSize: 28,
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {property.type}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  Type
                </div>
              </div>
            </div>

            {/* Rightmove Tab Bar */}
            <div style={{ display: "flex", borderBottom: "1px solid " + C.border, marginBottom: 32 }}>
              <button
                className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === "floorplan" ? "active" : ""}`}
                onClick={() => setActiveTab("floorplan")}
              >
                Floor Plan
              </button>
              <button
                className={`tab-btn ${activeTab === "neighborhood" ? "active" : ""}`}
                onClick={() => setActiveTab("neighborhood")}
              >
                Schools & Neighborhood
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "overview" && (
              <div>
                {property.description && (
                  <div style={{ marginBottom: 32 }}>
                    <h2
                      style={{
                        fontFamily: serif,
                        fontSize: 22,
                        fontWeight: 600,
                        marginBottom: 12,
                      }}
                    >
                      About this property
                    </h2>
                    <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.8 }}>
                      {property.description}
                    </p>
                  </div>
                )}

                {property.amenities && property.amenities.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <h2
                      style={{
                        fontFamily: serif,
                        fontSize: 22,
                        fontWeight: 600,
                        marginBottom: 16,
                      }}
                    >
                      Amenities
                    </h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {property.amenities.map((a) => (
                        <span key={a} className="tag-pill">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "floorplan" && (
              <div style={{ marginBottom: 32 }}>
                <h2
                  style={{
                    fontFamily: serif,
                    fontSize: 22,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  Floor Plan Layout
                </h2>
                <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>
                  Estimated spatial layout for a {property.bedrooms || 1}-bedroom {property.type}. For illustration purposes only.
                </p>
                <div style={{ display: "flex", justifyContent: "center", background: "#F5F4F0", padding: "32px", borderRadius: 16, border: "1px solid " + C.border }}>
                  {generateSVGFloorPlan(property.bedrooms || 1)}
                </div>
              </div>
            )}

            {activeTab === "neighborhood" && (
              <div style={{ marginBottom: 32 }}>
                <h2
                  style={{
                    fontFamily: serif,
                    fontSize: 22,
                    fontWeight: 600,
                    marginBottom: 20,
                  }}
                >
                  Neighborhood Proximity
                </h2>
                
                {/* Score meters grid */}
                <div style={{ display: "flex", gap: 20, marginBottom: 32 }}>
                  <div className="score-card">
                    <div className="score-circle">
                      <span style={{ fontSize: 22 }}>{72 + (property.sqm % 19)}</span>
                      <span style={{ fontSize: 8, color: C.muted, fontWeight: 500 }}>/100</span>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Walk Score®</h4>
                      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.4 }}>Very walkable. Daily errands can be accomplished on foot.</p>
                    </div>
                  </div>
                  
                  <div className="score-card">
                    <div className="score-circle" style={{ borderColor: "#0D9488" }}>
                      <span style={{ fontSize: 22 }}>{65 + (property.sqm % 23)}</span>
                      <span style={{ fontSize: 8, color: C.muted, fontWeight: 500 }}>/100</span>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Transit Score®</h4>
                      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.4 }}>Convenient public transport links nearby for commuters.</p>
                    </div>
                  </div>
                </div>

                {/* Nearby schools */}
                <div style={{ background: "white", border: "1px solid " + C.border, borderRadius: 14, padding: 24, marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Local Schools</h3>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {[
                      { name: "Greenwood Primary School", dist: "0.3 miles", rating: "Outstanding" },
                      { name: "Maitama Heights Secondary", dist: "0.8 miles", rating: "Good" },
                      { name: "Elite Prep Academy", dist: "1.4 miles", rating: "Outstanding" }
                    ].map((school, sIdx) => (
                      <div key={sIdx} className="school-item">
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: C.dark }}>{school.name}</div>
                          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{school.dist} · Co-educational</div>
                        </div>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: 20,
                          background: school.rating === "Outstanding" ? "#D1FAE5" : "#FEF3C7",
                          color: school.rating === "Outstanding" ? "#065F46" : "#92400E"
                        }}>
                          {school.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nearby amenities */}
                <div style={{ background: "white", border: "1px solid " + C.border, borderRadius: 14, padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Key Locations</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 13, color: C.dark }}>
                    <div>🛒 <strong>Supermarket</strong>: Shoprite Mall (0.6 miles)</div>
                    <div>🏥 <strong>Health</strong>: Prime Care Clinic (1.1 miles)</div>
                    <div>🌳 <strong>Park</strong>: Millennium Park (1.5 miles)</div>
                    <div>🚌 <strong>Transit</strong>: Central Bus Terminal (0.9 miles)</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ position: "sticky", top: 80 }}>
            <div
              style={{
                background: "white",
                border: "1px solid " + C.border,
                borderRadius: 14,
                padding: "20px 24px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: C.dark,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  {(property.profiles?.company_name ||
                    property.profiles?.full_name ||
                    "D")[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>
                    {property.profiles?.company_name ||
                      property.profiles?.full_name}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    Property Developer
                  </div>
                </div>
              </div>
              {property.profiles?.verified && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#065F46",
                    background: "#D1FAE5",
                    padding: "4px 10px",
                    borderRadius: 20,
                    display: "inline-block",
                    fontWeight: 500,
                  }}
                >
                  Verified Developer
                </div>
              )}
            </div>

            <button
              onClick={toggleSave}
              style={{
                width: "100%",
                padding: "12px",
                background: isSaved ? "#FEE2E2" : "white",
                color: isSaved ? "#991B1B" : "#1C1917",
                border: "1px solid #E7E5E4",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                marginBottom: 12,
              }}
            >
              {isSaved ? "Saved to favourites" : "Save property"}
            </button>

            <div
              style={{
                background: "white",
                border: "1px solid " + C.border,
                borderRadius: 14,
                padding: "24px",
              }}
            >
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 22,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Request a viewing
              </h3>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
                Pick a date and the developer will confirm.
              </p>

              {success && (
                <div className="succ" style={{ marginBottom: 16 }}>
                  {success}
                </div>
              )}
              {error && (
                <div className="err" style={{ marginBottom: 16 }}>
                  {error}
                </div>
              )}

              {!success && (
                <>
                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 500,
                        marginBottom: 6,
                      }}
                    >
                      Preferred date *
                    </label>
                    <input
                      className="inp"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 500,
                        marginBottom: 6,
                      }}
                    >
                      Preferred time
                    </label>
                    <select
                      className="inp"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    >
                      <option value="">Flexible</option>
                      <option>Morning (9am - 12pm)</option>
                      <option>Afternoon (12pm - 3pm)</option>
                      <option>Evening (3pm - 6pm)</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: 500,
                        marginBottom: 6,
                      }}
                    >
                      Message (optional)
                    </label>
                    <textarea
                      className="inp"
                      placeholder="Any questions for the developer?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{ minHeight: 80, resize: "vertical" }}
                    />
                  </div>
                  <button
                    className="btn-primary"
                    onClick={handleRequestViewing}
                    disabled={submitting}
                  >
                    {submitting
                      ? "Sending request..."
                      : user
                        ? "Send viewing request"
                        : "Sign in to request viewing"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
