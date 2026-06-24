# PropEra 🏠

PropEra is a premium, modern real estate platform inspired by Rightmove. It features a complete two-sided marketplace architecture serving both **Buyers** looking for properties and **Developers** managing their real estate listings.

---

## Key Features

### 1. Buyer Experience
*   **Property Discovery**: Interactive search, status filtering, and map/city location tags on the browse dashboard.
*   **Premium Carousel**: High-fidelity media viewer with image index indicators, smooth animations, and interactive thumbnail bar.
*   **Procedural SVG Floor Plans**: Dynamic floor blueprints custom-rendered based on the bedroom count (1-bed, 2-bed, or 3+ bed layout with dimension scales).
*   **Neighborhood Insights**: Circular walkability and transit scorecards, alongside localized school ratings ("Outstanding", "Good") and key utility proximity.
*   **Robust Favourites System**: Dual-mode save system (writes to Supabase and leverages a `localStorage` fallback to handle strict database RLS policy environments).
*   **Meeting Scheduling**: Direct booking form allowing buyers to request on-site or virtual viewing dates/times.

### 2. Developer Portal
*   **Analytics Dashboard**: Overview of properties, cumulative views, and incoming viewing requests.
*   **Listings Manager**: Inline status indicator badges, edit forms, deletion flows, and publishing controls.
*   **Viewing Request Center**: Manage meeting invitations with status indicators (Pending, Confirmed, Declined) triggering simulated webhook integrations.
*   **Adaptive Form Modes**: Unified listing insertion and edit form carrying query param state hooks (`?edit=property_id`).

---

## Tech Stack
*   **Frontend**: React (v19) + Vite (v8)
*   **Styling**: Tailwind CSS + Custom Vanilla CSS
*   **Backend & Auth**: Supabase (PostgREST, Auth, and RLS)
*   **Icons**: Lucide React

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd propera
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 5. Build for Production
```bash
npm run build
```
The output bundle will be generated under the `/dist` directory.
