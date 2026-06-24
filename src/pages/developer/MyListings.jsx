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
  .btn-primary { padding: 10px 20px; background: #D97706; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: "DM Sans",sans-serif; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
  .btn-primary:hover { background: #B45309; }
  .btn-secondary { padding: 10px 20px; background: white; color: #1C1917; border: 1px solid #E7E5E4; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: "DM Sans",sans-serif; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
  .btn-secondary:hover { background: #FAFAF9; }
  .inp { padding: 10px 14px; border: 1px solid #E7E5E4; border-radius: 8px; font-size: 14px; font-family: "DM Sans",sans-serif; color: #1C1917; background: white; outline: none; transition: border-color 0.15s; }
  .inp:focus { border-color: #D97706; }
  .sel { padding: 10px 14px; border: 1px solid #E7E5E4; border-radius: 8px; font-size: 14px; font-family: "DM Sans",sans-serif; color: #1C1917; background: white; outline: none; }
  .sel:focus { border-color: #D97706; }
  
  .prop-card {
    background: white;
    border: 1px solid #E7E5E4;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    gap: 24px;
    align-items: center;
    margin-bottom: 16px;
    transition: all 0.2s ease;
  }
  .prop-card:hover {
    box-shadow: 0 10px 25px rgba(28, 25, 23, 0.05);
    border-color: #D4D0CA;
  }
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #E7E5E4;
    transition: .3s;
    border-radius: 24px;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .3s;
    border-radius: 50%;
  }
  input:checked + .slider {
    background-color: #D97706;
  }
  input:checked + .slider:before {
    transform: translateX(20px);
  }
  .badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    display: inline-block;
  }
  .badge-active { background: #D1FAE5; color: #065F46; }
  .badge-draft { background: #F5F4F4; color: #57534E; }
`;

export default function MyListings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchProperties(session.user.id);
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  async function fetchProperties(userId) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("developer_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  }

  async function handleToggleActive(id, currentActive) {
    const { error } = await supabase
      .from("properties")
      .update({ is_active: !currentActive })
      .eq("id", id);

    if (error) {
      if (error.code === "42501" || error.message?.toLowerCase().includes("row-level security") || error.message?.toLowerCase().includes("policy")) {
        alert("System Policy: Toggling active status to draft is restricted by database security policies. Listings must remain active. You can edit or delete the listing instead.");
      } else {
        alert("Error updating status: " + error.message);
      }
    } else {
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !currentActive } : p))
      );
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to permanently delete this listing? This action cannot be undone.")) return;

    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      alert("Error deleting listing: " + error.message);
    } else {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    }
  }

  function handleSignOut() {
    supabase.auth.signOut().then(() => {
      window.location.href = "/";
    });
  }

  function formatPrice(price, period) {
    const f = Number(price).toLocaleString("en-NG");
    if (period === "per_year") return "₦" + f + "/yr";
    if (period === "per_month") return "₦" + f + "/mo";
    return "₦" + f;
  }

  if (loading) {
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
        <p style={{ color: C.muted }}>Loading your listings...</p>
      </div>
    );
  }

  // Filter listings
  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === "active") return matchesSearch && p.is_active;
    if (statusFilter === "draft") return matchesSearch && !p.is_active;
    return matchesSearch;
  });

  return (
    <div style={{ fontFamily: sans, background: C.bg, minHeight: "100vh" }}>
      <style>{STYLES}</style>

      <Navbar activePage="listings" />

      <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>
        
        {/* Breadcrumbs and Action Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
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
            <h1
              style={{
                fontFamily: serif,
                fontSize: 42,
                fontWeight: 600,
                lineHeight: 1.1,
              }}
            >
              My Listings <span style={{ fontSize: 24, color: C.muted, fontWeight: 400 }}>({properties.length})</span>
            </h1>
          </div>
          <a href="/developer/add-listing" className="btn-primary">
            ➕ Add new listing
          </a>
        </div>

        {/* Filters bar */}
        <div
          style={{
            background: "white",
            border: "1px solid " + C.border,
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            gap: 16,
            marginBottom: 24,
            alignItems: "center"
          }}
        >
          <input
            className="inp"
            style={{ flex: 1, minWidth: 200 }}
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select
            className="sel"
            style={{ width: 160 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active (Published)</option>
            <option value="draft">Inactive (Draft)</option>
          </select>
        </div>

        {/* Listings List */}
        {filtered.length === 0 ? (
          <div
            style={{
              background: "white",
              border: "1px solid " + C.border,
              borderRadius: 16,
              padding: "64px 32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏡</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No listings found</h3>
            <p style={{ color: C.muted, fontSize: 15, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
              {search || statusFilter !== "all"
                ? "No properties match your current search filters. Try clearing them."
                : "Get started by publishing your first property listing to PropEra's premium buyer catalog."}
            </p>
            {!search && statusFilter === "all" && (
              <a href="/developer/add-listing" className="btn-primary">
                Create Listing
              </a>
            )}
          </div>
        ) : (
          <div>
            {filtered.map((p) => {
              const image = p.images && p.images.length > 0 ? p.images[0] : null;
              const gradients = [
                "linear-gradient(135deg,#4F46E5,#7C3AED)",
                "linear-gradient(135deg,#0D9488,#0891B2)",
                "linear-gradient(135deg,#D97706,#DC2626)",
                "linear-gradient(135deg,#059669,#0D9488)",
              ];
              const grad = gradients[p.id?.charCodeAt(0) % gradients.length] || gradients[0];
              
              return (
                <div key={p.id} className="prop-card">
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: 120,
                      height: 90,
                      borderRadius: 10,
                      background: image ? `url(${image}) center/cover` : grad,
                      flexShrink: 0,
                    }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                      <span className={`badge ${p.is_active ? "badge-active" : "badge-draft"}`}>
                        {p.is_active ? "Active" : "Draft"}
                      </span>
                      <span style={{ fontSize: 12, color: C.muted }}>
                        {p.type.charAt(0).toUpperCase() + p.type.slice(1)} · {p.status === "for_sale" ? "For Sale" : "For Rent"}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: C.dark, marginBottom: 4 }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: 13, color: C.muted }}>
                      📍 {p.city}{p.address ? `, ${p.address}` : ""}
                    </p>
                    
                    {/* Key stats row */}
                    <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: C.muted }}>
                      {p.bedrooms && <span>🛏️ {p.bedrooms} Beds</span>}
                      {p.bathrooms && <span>🛁 {p.bathrooms} Baths</span>}
                      {p.sqm && <span>📐 {p.sqm} Sqm</span>}
                      <span>👁️ {p.views || 0} views</span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: C.dark }}>
                      {formatPrice(p.price, p.price_period)}
                    </div>
                    
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      
                      {/* Active Toggle */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: C.muted }}>{p.is_active ? "Published" : "Draft"}</span>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={!!p.is_active}
                            onChange={() => handleToggleActive(p.id, p.is_active)}
                          />
                          <span className="slider" />
                        </label>
                      </div>

                      <div style={{ width: 1, height: 20, background: C.border }} />

                      {/* Edit Button */}
                      <a href={`/developer/add-listing?edit=${p.id}`} className="btn-secondary" style={{ padding: "6px 12px", fontSize: 13 }}>
                        ✏️ Edit
                      </a>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn-secondary"
                        style={{ padding: "6px 12px", fontSize: 13, color: "#DC2626", borderColor: "#FCA5A5" }}
                      >
                        🗑️ Delete
                      </button>

                    </div>
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
