import { useState } from "react";
import Navbar from "../components/Navbar";

const properties = [
  {
    id: 1,
    title: "Luxury 3-Bed Apartment",
    status: "For Rent",
    price: "₦2,500,000",
    period: "/yr",
    location: "Lekki Phase 1, Lagos",
    bed: 3,
    bath: 2,
    sqm: 120,
    tags: ["Parking", "Generator", "Security"],
    dev: "Emerald Homes",
    devInitial: "E",
    verified: true,
    grad: "linear-gradient(135deg,#4F46E5,#7C3AED)",
  },
  {
    id: 2,
    title: "Modern 4-Bed Duplex",
    status: "For Sale",
    price: "₦85,000,000",
    period: "",
    location: "Gwarinpa, Abuja",
    bed: 4,
    bath: 3,
    sqm: 240,
    tags: ["Pool", "Generator", "Estate"],
    dev: "Capital Builds",
    devInitial: "C",
    verified: true,
    grad: "linear-gradient(135deg,#0D9488,#0891B2)",
  },
  {
    id: 3,
    title: "1-Bed Self-Contained Flat",
    status: "For Rent",
    price: "₦750,000",
    period: "/yr",
    location: "Wuse 2, Abuja",
    bed: 1,
    bath: 1,
    sqm: 55,
    tags: ["Water", "Security", "DSTV"],
    dev: "PrimeSpace NG",
    devInitial: "P",
    verified: false,
    grad: "linear-gradient(135deg,#D97706,#DC2626)",
  },
];

const steps = [
  {
    n: "01",
    title: "Developers list",
    body: "Post your property with photos, pricing, and amenities in minutes. No agent required.",
  },
  {
    n: "02",
    title: "Buyers browse",
    body: "Filter by city, type, and price. Every listing comes straight from a verified developer.",
  },
  {
    n: "03",
    title: "Meet directly",
    body: "Request a viewing, get confirmed, and deal straight with the developer. Zero commission.",
  },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  .fu  { animation: fadeUp 0.7s ease forwards; opacity:0; }
  .fu1 { animation-delay:0.05s; }
  .fu2 { animation-delay:0.2s; }
  .fu3 { animation-delay:0.35s; }
  .fu4 { animation-delay:0.5s; }
  .fu5 { animation-delay:0.65s; }
  .pcard { transition: transform 0.22s, box-shadow 0.22s; }
  .pcard:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(28,25,23,0.14); }
  
  .tag-pill { background:#F5F5F4; color:#57534E; font-size:11px; padding:3px 9px; border-radius:20px; font-weight:500; display:inline-block; }
`;

export default function Landing() {
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };
  const C = {
    brand: "#D97706",
    dark: "#1C1917",
    bg: "#FAFAF9",
    muted: "#78716C",
    border: "#E7E5E4",
  };
  const serif = "'Cormorant Garamond',serif";
  const sans = "'DM Sans',sans-serif";

  const [city, setCity] = useState("All cities");
  const [type, setType] = useState("Property type");
  const [priceRange, setPriceRange] = useState("Any price");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city !== "All cities") {
      params.set("city", city);
    }
    if (type !== "Property type") {
      params.set("type", type.toLowerCase()); // apartment, house, flat
    }
    if (priceRange !== "Any price") {
      params.set("price", priceRange);
    }
    window.location.href = `/browse?${params.toString()}`;
  };

  return (
    <div
      style={{
        fontFamily: sans,
        background: C.bg,
        color: C.dark,
        minHeight: "100vh",
      }}
    >
      <style>{STYLES}</style>

      <Navbar activePage="home" />

      {/* HERO */}
      <section
        style={{
          background: C.dark,
          padding: "88px 48px 0",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1,
            height: 72,
            background: C.brand,
            opacity: 0.6,
          }}
        />
        <p
          className="fu fu1"
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            color: C.brand,
            fontSize: 19,
            letterSpacing: "0.04em",
            marginBottom: 22,
          }}
        >
          No agents. No middlemen.
        </p>
        <h1
          className="fu fu2"
          style={{
            fontFamily: serif,
            fontSize: 62,
            fontWeight: 600,
            color: "white",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            margin: "0 auto 22px",
            maxWidth: 720,
          }}
        >
          Buy and rent directly
          <br />
          from developers
        </h1>
        <p
          className="fu fu3"
          style={{
            color: "#A8A29E",
            fontSize: 17,
            maxWidth: 460,
            margin: "0 auto 44px",
            lineHeight: 1.65,
          }}
        >
          Propera connects property buyers directly to developers across
          Nigeria. Skip the agent fee entirely.
        </p>
        <div
          className="fu fu4"
          style={{
            background: "white",
            borderRadius: 14,
            padding: 8,
            display: "inline-flex",
            gap: 8,
            boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          }}
        >
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid " + C.border,
              borderRadius: 8,
              fontSize: 14,
              color: C.dark,
              background: "#FAFAF9",
              outline: "none",
              minWidth: 155,
              fontFamily: sans,
            }}
          >
            {["All cities", "Abuja", "Lagos", "Port Harcourt", "Ibadan"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid " + C.border,
              borderRadius: 8,
              fontSize: 14,
              color: C.dark,
              background: "#FAFAF9",
              outline: "none",
              minWidth: 148,
              fontFamily: sans,
            }}
          >
            {["Property type", "Apartment", "House", "Flat"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid " + C.border,
              borderRadius: 8,
              fontSize: 14,
              color: C.dark,
              background: "#FAFAF9",
              outline: "none",
              minWidth: 140,
              fontFamily: sans,
            }}
          >
            {[
              "Any price",
              "Under ₦1M",
              "₦1M-₦5M",
              "₦5M-₦20M",
              "Above ₦20M",
            ].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            style={{
              background: C.brand,
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "12px 30px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: sans,
            }}
          >
            Search
          </button>
        </div>
        <div
          className="fu fu5"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 72,
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            ["500+", "Active listings"],
            ["200+", "Developers"],
            ["18", "Cities covered"],
            ["₦0", "Agent fees"],
          ].map(([v, l], i, a) => (
            <div
              key={i}
              style={{
                padding: "28px 52px",
                borderRight:
                  i < a.length - 1
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 38,
                  fontWeight: 600,
                  color: C.brand,
                  lineHeight: 1,
                }}
              >
                {v}
              </div>
              <div style={{ fontSize: 13, color: "#57534E", marginTop: 6 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section style={{ padding: "80px 48px", background: C.bg }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 44,
          }}
        >
          <div>
            <p
              style={{
                color: C.brand,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.1em",
                marginBottom: 8,
              }}
            >
              FEATURED
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 42, fontWeight: 600 }}>
              Latest properties
            </h2>
          </div>
          <a
            href="/browse"
            style={{
              color: C.brand,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Browse all →
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 24,
          }}
        >
          {properties.map((p) => (
            <div
              key={p.id}
              className="pcard"
              style={{
                background: "white",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid " + C.border,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: 190,
                  background: p.grad,
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 14,
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
                  }}
                >
                  {p.status}
                </span>
                {p.verified && (
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: C.brand,
                      color: "white",
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: 20,
                    }}
                  >
                    ✓ Verified
                  </span>
                )}
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
                  {p.title}
                </h3>
                <div
                  style={{
                    fontFamily: serif,
                    fontSize: 22,
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  {p.price}
                  <span
                    style={{
                      fontFamily: sans,
                      fontSize: 13,
                      fontWeight: 400,
                      color: C.muted,
                    }}
                  >
                    {p.period}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    color: C.muted,
                    fontSize: 13,
                    marginBottom: 14,
                  }}
                >
                  📍 {p.location}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    fontSize: 13,
                    color: C.muted,
                    marginBottom: 14,
                  }}
                >
                  <span>🛏 {p.bed} bed</span>
                  <span>🛁 {p.bath} bath</span>
                  <span>{p.sqm} sqm</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginBottom: 16,
                  }}
                >
                  {p.tags.map((t) => (
                    <span key={t} className="tag-pill">
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    borderTop: "1px solid " + C.border,
                    paddingTop: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 7 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: C.dark,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {p.devInitial}
                    </div>
                    <span style={{ fontSize: 12, color: C.muted }}>
                      {p.dev}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      showToast("Viewing requested for " + p.title)
                    }
                    style={{
                      background: "#FEF3C7",
                      color: "#92400E",
                      border: "none",
                      borderRadius: 8,
                      padding: "7px 14px",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: sans,
                    }}
                  >
                    Request viewing
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: "#F5F4F0", padding: "80px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <p
            style={{
              color: C.brand,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            SIMPLE PROCESS
          </p>
          <h2 style={{ fontFamily: serif, fontSize: 42, fontWeight: 600 }}>
            How Propera works
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 48,
            maxWidth: 860,
            margin: "0 auto",
          }}
        >
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 80,
                  fontWeight: 700,
                  color: C.brand,
                  opacity: 0.2,
                  lineHeight: 1,
                  marginBottom: -18,
                }}
              >
                {s.n}
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  marginBottom: 12,
                  position: "relative",
                }}
              >
                {s.title}
              </h3>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DEVELOPER CTA */}
      <section
        style={{
          background: C.dark,
          padding: "80px 48px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            color: C.brand,
            fontSize: 19,
            marginBottom: 18,
          }}
        >
          For developers
        </p>
        <h2
          style={{
            fontFamily: serif,
            fontSize: 46,
            fontWeight: 600,
            color: "white",
            maxWidth: 560,
            margin: "0 auto 20px",
            lineHeight: 1.12,
          }}
        >
          List your property and reach buyers directly
        </h2>
        <p
          style={{
            color: "#A8A29E",
            fontSize: 16,
            maxWidth: 400,
            margin: "0 auto 40px",
            lineHeight: 1.65,
          }}
        >
          No commissions. No agent taking a cut. Just your listings and your
          buyers.
        </p>
        <button
          onClick={() => (window.location.href = "/signup")}
          style={{
            background: C.brand,
            color: "white",
            border: "none",
            padding: "16px 44px",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: sans,
          }}
        >
          List your first property free →
        </button>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#0C0A09",
          padding: "32px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: serif,
            fontSize: 24,
            fontWeight: 600,
            color: "white",
          }}
        >
          Prop<span style={{ color: C.brand }}>era</span>
        </span>
        <span style={{ color: "#44403C", fontSize: 13 }}>
          © 2025 Propera. Built to eliminate the middleman.
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              style={{ color: "#57534E", fontSize: 13, textDecoration: "none" }}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            background: C.brand,
            color: "white",
            padding: "14px 22px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
