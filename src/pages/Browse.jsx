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
  .pcard { transition: transform 0.22s, box-shadow 0.22s; cursor: pointer; }
  .pcard:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(28,25,23,0.12); }
  .tag-pill { background: #F5F5F4; color: #57534E; font-size: 11px; padding: 3px 9px; border-radius: 20px; font-weight: 500; display: inline-block; }
  .filter-sel { width: 100%; padding: 10px 12px; border: 1px solid #E7E5E4; border-radius: 8px; font-size: 14px; font-family: "DM Sans",sans-serif; color: #1C1917; background: white; outline: none; }
  .filter-sel:focus { border-color: #D97706; }
  .inp { width: 100%; padding: 10px 14px; border: 1px solid #E7E5E4; border-radius: 8px; font-size: 14px; font-family: "DM Sans",sans-serif; color: #1C1917; background: white; outline: none; }
  .inp:focus { border-color: #D97706; }
`;

const CITIES = [
  "All cities",
  "Abuja",
  "Lagos",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Enugu",
];
const TYPES = ["All types", "apartment", "house", "flat"];
const STATUS = ["All", "for_sale", "for_rent"];
const SORT = ["Newest", "Price: low to high", "Price: high to low"];

function formatPrice(price, period) {
  const formatted = Number(price).toLocaleString("en-NG");
  if (period === "per_year") return "₦" + formatted + "/yr";
  if (period === "per_month") return "₦" + formatted + "/mo";
  return "₦" + formatted;
}

function PropertyCard({ p, onViewRequest }) {
  const gradients = [
    "linear-gradient(135deg,#4F46E5,#7C3AED)",
    "linear-gradient(135deg,#0D9488,#0891B2)",
    "linear-gradient(135deg,#D97706,#DC2626)",
    "linear-gradient(135deg,#059669,#0D9488)",
    "linear-gradient(135deg,#7C3AED,#EC4899)",
  ];
  const grad =
    gradients[p.id?.charCodeAt(0) % gradients.length] || gradients[0];
  const imageUrl = p.images && p.images.length > 0 ? p.images[0] : null;

  return (
    <div
      className="pcard"
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid " + C.border,
      }}
    >
      <div
        onClick={() => (window.location.href = "/property/" + p.id)}
        style={{
          height: 200,
          background: imageUrl ? "url(" + imageUrl + ") center/cover" : grad,
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
          {p.status === "for_sale" ? "For Sale" : "For Rent"}
        </span>
        {p.profiles?.verified && (
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
            Verified
          </span>
        )}
      </div>
      <div style={{ padding: "18px 20px 20px" }}>
        <h3
          onClick={() => (window.location.href = "/property/" + p.id)}
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 5,
            lineHeight: 1.3,
            cursor: "pointer",
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
            color: C.dark,
          }}
        >
          {formatPrice(p.price, p.price_period)}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: C.muted,
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          📍 {p.city}
          {p.address ? ", " + p.address : ""}
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
          {p.bedrooms && <span>🛏 {p.bedrooms} bed</span>}
          {p.bathrooms && <span>🚿 {p.bathrooms} bath</span>}
          {p.sqm && <span>{p.sqm} sqm</span>}
        </div>
        {p.amenities && p.amenities.length > 0 && (
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
            {p.amenities.length > 3 && (
              <span className="tag-pill">+{p.amenities.length - 3}</span>
            )}
          </div>
        )}
        <div
          style={{
            borderTop: "1px solid " + C.border,
            paddingTop: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
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
              {(p.profiles?.company_name ||
                p.profiles?.full_name ||
                "D")[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 12, color: C.muted }}>
              {p.profiles?.company_name || p.profiles?.full_name || "Developer"}
            </span>
          </div>
          <button
            onClick={() => onViewRequest(p)}
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
  );
}

export default function Browse() {
  const params = new URLSearchParams(window.location.search);
  const urlCity = params.get("city");
  const urlType = params.get("type");
  
  const matchedCity = CITIES.find(c => c.toLowerCase() === urlCity?.toLowerCase()) || "All cities";
  const matchedType = TYPES.find(t => t.toLowerCase() === urlType?.toLowerCase()) || "All types";
  const initialStatus = params.get("status") || "All";
  const initialSearch = params.get("search") || "";
  const initialPrice = params.get("price") || "Any price";

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [city, setCity] = useState(matchedCity);
  const [type, setType] = useState(matchedType);
  const [status, setStatus] = useState(initialStatus);
  const [priceRange, setPriceRange] = useState(initialPrice);
  const [sort, setSort] = useState("Newest");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    fetchProperties();
  }, [city, type, status, sort]);

  async function fetchProperties() {
    setLoading(true);
    let query = supabase
      .from("properties")
      .select("*, profiles(full_name, company_name, verified)")
      .eq("is_active", true);

    if (city !== "All cities") query = query.eq("city", city);
    if (type !== "All types") query = query.eq("type", type);
    if (status === "for_sale") query = query.eq("status", "for_sale");
    if (status === "for_rent") query = query.eq("status", "for_rent");

    if (sort === "Newest")
      query = query.order("created_at", { ascending: false });
    if (sort === "Price: low to high")
      query = query.order("price", { ascending: true });
    if (sort === "Price: high to low")
      query = query.order("price", { ascending: false });

    const { data, error } = await query;
    if (!error) setProperties(data || []);
    setLoading(false);
  }

  function matchPriceRange(price, range) {
    if (range === "Under ₦1M") return price < 1000000;
    if (range === "₦1M-₦5M") return price >= 1000000 && price <= 5000000;
    if (range === "₦5M-₦20M") return price >= 5000000 && price <= 20000000;
    if (range === "Above ₦20M") return price > 20000000;
    return true;
  }

  const filtered = properties.filter(
    (p) =>
      (search === "" ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase())) &&
      matchPriceRange(p.price, priceRange)
  );

  const handleViewRequest = (p) => {
    const user = supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    window.location.href = "/property/" + p.id;
  };

  return (
    <div style={{ fontFamily: sans, background: C.bg, minHeight: "100vh" }}>
      <style>{STYLES}</style>

      <Navbar activePage="browse" />

      {/* Page header */}
      <div
        style={{
          background: C.dark,
          padding: "48px 48px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            color: C.brand,
            fontSize: 17,
            marginBottom: 12,
          }}
        >
          Find your next home
        </p>
        <h1
          style={{
            fontFamily: serif,
            fontSize: 48,
            fontWeight: 600,
            color: "white",
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          Browse properties
        </h1>
        <p style={{ color: "#A8A29E", fontSize: 16 }}>
          Direct from developers. No agent fees.
        </p>
      </div>

      {/* Filters bar */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid " + C.border,
          padding: "16px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <input
            className="inp"
            placeholder="Search by title or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 260 }}
          />
          <select
            className="filter-sel"
            style={{ maxWidth: 160 }}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="filter-sel"
            style={{ maxWidth: 140 }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            className="filter-sel"
            style={{ maxWidth: 130 }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            className="filter-sel"
            style={{ maxWidth: 150 }}
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            {["Any price", "Under ₦1M", "₦1M-₦5M", "₦5M-₦20M", "Above ₦20M"].map((pr) => (
              <option key={pr}>{pr}</option>
            ))}
          </select>
          <select
            className="filter-sel"
            style={{ maxWidth: 180, marginLeft: "auto" }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div style={{ padding: "40px 48px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Count */}
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>
          {loading
            ? "Loading..."
            : filtered.length +
              " propert" +
              (filtered.length === 1 ? "y" : "ies") +
              " found"}
        </p>

        {/* Loading state */}
        {loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 24,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid " + C.border,
                }}
              >
                <div style={{ height: 200, background: "#F5F5F4" }} />
                <div style={{ padding: 20 }}>
                  <div
                    style={{
                      height: 16,
                      background: "#F5F5F4",
                      borderRadius: 4,
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      background: "#F5F5F4",
                      borderRadius: 4,
                      width: "60%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
            <h3
              style={{
                fontFamily: serif,
                fontSize: 28,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              No properties found
            </h3>
            <p style={{ color: C.muted, fontSize: 15 }}>
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}

        {/* Property grid */}
        {!loading && filtered.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 24,
            }}
          >
            {filtered.map((p) => (
              <PropertyCard
                key={p.id}
                p={p}
                onViewRequest={handleViewRequest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
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
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
