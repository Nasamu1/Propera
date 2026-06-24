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
  .inp { width: 100%; padding: 12px 14px; border: 1px solid #E7E5E4; border-radius: 8px; font-size: 14px; font-family: "DM Sans",sans-serif; color: #1C1917; background: white; outline: none; transition: border-color 0.15s; }
  .inp:focus { border-color: #D97706; }
  .sel { width: 100%; padding: 12px 14px; border: 1px solid #E7E5E4; border-radius: 8px; font-size: 14px; font-family: "DM Sans",sans-serif; color: #1C1917; background: white; outline: none; }
  .sel:focus { border-color: #D97706; }
  .btn-primary { padding: 13px 32px; background: #D97706; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: "DM Sans",sans-serif; }
  .btn-primary:disabled { background: #D4D0CA; cursor: not-allowed; }
  .btn-secondary { padding: 13px 32px; background: white; color: #1C1917; border: 1px solid #E7E5E4; border-radius: 8px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: "DM Sans",sans-serif; }
  .amenity-btn { padding: 8px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1.5px solid #E7E5E4; background: white; font-family: "DM Sans",sans-serif; transition: all 0.15s; }
  .amenity-btn.on { border-color: #D97706; background: #FFFBEB; color: #92400E; }
  .err  { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; padding: 10px 14px; border-radius: 8px; font-size: 13px; }
  .succ { background: #F0FDF4; border: 1px solid #BBF7D0; color: #166534; padding: 10px 14px; border-radius: 8px; font-size: 13px; }
  .nl { color: #A8A29E; font-size: 14px; text-decoration: none; transition: color 0.15s; }
  .nl:hover { color: white; }
`;

const AMENITIES = [
  "Parking",
  "Generator",
  "Security",
  "Swimming pool",
  "Gym",
  "Running water",
  "Borehole",
  "DSTV",
  "Wi-Fi",
  "Estate",
  "BQ",
  "Solar",
  "Air conditioning",
  "Tiled floors",
  "POP ceiling",
];
const CITIES = [
  "Abuja",
  "Lagos",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Enugu",
  "Benin City",
  "Kaduna",
  "Jos",
  "Warri",
];

export default function AddListing() {
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [type, setType] = useState("apartment");
  const [status, setStatus] = useState("for_rent");
  const [price, setPrice] = useState("");
  const [period, setPeriod] = useState("per_year");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sqm, setSqm] = useState("");
  const [city, setCity] = useState("Abuja");
  const [address, setAddress] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [imageUrls, setImageUrls] = useState(["", "", ""]);

  const editId = new URLSearchParams(window.location.search).get("edit");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        if (editId) {
          supabase
            .from("properties")
            .select("*")
            .eq("id", editId)
            .single()
            .then(({ data }) => {
              if (data) {
                setTitle(data.title || "");
                setDesc(data.description || "");
                setType(data.type || "apartment");
                setStatus(data.status || "for_rent");
                setPrice(data.price || "");
                setPeriod(data.price_period || "per_year");
                setBedrooms(data.bedrooms || "");
                setBathrooms(data.bathrooms || "");
                setSqm(data.sqm || "");
                setCity(data.city || "Abuja");
                setAddress(data.address || "");
                setAmenities(data.amenities || []);
                const imgs = [...(data.images || [])];
                while (imgs.length < 3) imgs.push("");
                setImageUrls(imgs);
              }
              setPageLoading(false);
            });
        } else {
          setPageLoading(false);
        }
      } else {
        setPageLoading(false);
      }
    });
  }, []);

  function toggleAmenity(a) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  }

  async function handleSubmit() {
    setError("");
    if (!title || !price || !city) {
      setError("Please fill in title, price and city.");
      return;
    }

    setSaving(true);
    const images = imageUrls.filter((u) => u.trim() !== "");

    let res;
    if (editId) {
      res = await supabase
        .from("properties")
        .update({
          title,
          description,
          type,
          status,
          price: Number(price),
          price_period: period,
          bedrooms: bedrooms ? Number(bedrooms) : null,
          bathrooms: bathrooms ? Number(bathrooms) : null,
          sqm: sqm ? Number(sqm) : null,
          city,
          address,
          amenities,
          images,
        })
        .eq("id", editId);
    } else {
      res = await supabase.from("properties").insert({
        developer_id: user.id,
        title,
        description,
        type,
        status,
        price: Number(price),
        price_period: period,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        sqm: sqm ? Number(sqm) : null,
        city,
        address,
        amenities,
        images,
        is_active: true,
      });
    }

    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setSuccess(editId ? "Listing updated successfully!" : "Listing published successfully!");
    setTimeout(() => (window.location.href = "/developer/listings"), 1500);
  }

  if (pageLoading)
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

  return (
    <div style={{ fontFamily: sans, background: C.bg, minHeight: "100vh" }}>
      <style>{STYLES}</style>

      <Navbar activePage="add-listing" />

      <div style={{ padding: "40px 48px", maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
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
            {editId ? "Edit listing" : "Add a new listing"}
          </h1>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid " + C.border,
            borderRadius: 16,
            padding: "36px 40px",
          }}
        >
          {error && (
            <div className="err" style={{ marginBottom: 24 }}>
              {error}
            </div>
          )}
          {success && (
            <div className="succ" style={{ marginBottom: 24 }}>
              {success}
            </div>
          )}

          {/* Basic info */}
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 18,
              paddingBottom: 10,
              borderBottom: "1px solid " + C.border,
            }}
          >
            Basic information
          </h3>

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Listing title *
            </label>
            <input
              className="inp"
              placeholder="e.g. Luxury 3-Bed Apartment in Maitama"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Description
            </label>
            <textarea
              className="inp"
              placeholder="Describe the property..."
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              style={{ minHeight: 100, resize: "vertical" }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 18,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Property type *
              </label>
              <select
                className="sel"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House / Duplex</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Listing type *
              </label>
              <select
                className="sel"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="for_rent">For Rent</option>
                <option value="for_sale">For Sale</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 18,
              paddingBottom: 10,
              borderBottom: "1px solid " + C.border,
              marginTop: 28,
            }}
          >
            Pricing
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 18,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Price (₦) *
              </label>
              <input
                className="inp"
                type="number"
                placeholder="e.g. 2500000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Price period
              </label>
              <select
                className="sel"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="per_year">Per year</option>
                <option value="per_month">Per month</option>
                <option value="total">Total (one-time)</option>
              </select>
            </div>
          </div>

          {/* Details */}
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 18,
              paddingBottom: 10,
              borderBottom: "1px solid " + C.border,
              marginTop: 28,
            }}
          >
            Property details
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginBottom: 18,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Bedrooms
              </label>
              <input
                className="inp"
                type="number"
                placeholder="3"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Bathrooms
              </label>
              <input
                className="inp"
                type="number"
                placeholder="2"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Size (sqm)
              </label>
              <input
                className="inp"
                type="number"
                placeholder="120"
                value={sqm}
                onChange={(e) => setSqm(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 18,
              paddingBottom: 10,
              borderBottom: "1px solid " + C.border,
              marginTop: 28,
            }}
          >
            Location
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 18,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                City *
              </label>
              <select
                className="sel"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Area / street address
              </label>
              <input
                className="inp"
                placeholder="e.g. Maitama, Plot 14"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Amenities */}
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 18,
              paddingBottom: 10,
              borderBottom: "1px solid " + C.border,
              marginTop: 28,
            }}
          >
            Amenities
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 18,
            }}
          >
            {AMENITIES.map((a) => (
              <button
                key={a}
                className={"amenity-btn" + (amenities.includes(a) ? " on" : "")}
                onClick={() => toggleAmenity(a)}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Image URLs */}
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 6,
              paddingBottom: 10,
              borderBottom: "1px solid " + C.border,
              marginTop: 28,
            }}
          >
            Property images
          </h3>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
            Paste image URLs (from Google Drive, Cloudinary, or any public link)
          </p>
          {imageUrls.map((url, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Image {i + 1} URL
              </label>
              <input
                className="inp"
                placeholder="https://..."
                value={url}
                onChange={(e) => {
                  const arr = [...imageUrls];
                  arr[i] = e.target.value;
                  setImageUrls(arr);
                }}
              />
            </div>
          ))}

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (editId ? "Updating..." : "Publishing...") : (editId ? "Update listing" : "Publish listing")}
            </button>
            <button
              className="btn-secondary"
              onClick={() => (window.location.href = "/developer/listings")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
