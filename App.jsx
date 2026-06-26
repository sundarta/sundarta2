import React, { useState, useEffect } from "react";
import { Scissors, Sparkles, Clock, MapPin, Star, Check, X, ChevronRight, Plus, User, Calendar, Phone, ArrowLeft, Search } from "lucide-react";

// ---------- Design tokens ----------
// Palette: kumkum (deep rose/red - bindi/sindoor inspired), turmeric (warm gold), betel (deep green), ivory (warm paper), charcoal ink
const COLORS = {
  kumkum: "#A3193D",
  kumkumDark: "#7A1230",
  turmeric: "#D99A1B",
  betel: "#2F4A3C",
  ivory: "#FBF6EC",
  ivoryDeep: "#F3EADA",
  ink: "#241B1A",
};

// Platform commission — markup model: customer pays `price`, partner earns `price * (1 - COMMISSION_RATE)`.
const COMMISSION_RATE = 0.25;

function partnerPayout(price) {
  return Math.round(price * (1 - COMMISSION_RATE));
}

// Fixed rate card — same price for every partner on the platform.
// duration is in minutes. category: "women" | "men" | "unisex"
const SERVICES = [
  { id: "facial", name: "Facial & Glow", icon: "✦", price: 599, duration: 60, category: "women" },
  { id: "haircut-w", name: "Haircut & Styling (Women)", icon: "✂", price: 349, duration: 45, category: "women" },
  { id: "mehendi", name: "Mehendi", icon: "❀", price: 449, duration: 60, category: "women" },
  { id: "waxing", name: "Full Body Waxing", icon: "◇", price: 599, duration: 75, category: "women" },
  { id: "bridal", name: "Bridal Makeup", icon: "✺", price: 5999, duration: 180, category: "women" },
  { id: "mani", name: "Manicure & Pedicure", icon: "✦", price: 499, duration: 50, category: "unisex" },
  { id: "haircut-m", name: "Haircut (Men)", icon: "✂", price: 249, duration: 30, category: "men" },
  { id: "shave", name: "Shave & Beard Styling", icon: "▽", price: 199, duration: 25, category: "men" },
  { id: "groom-m", name: "Groom Makeup (Men)", icon: "✺", price: 2499, duration: 90, category: "men" },
  { id: "hair-color-m", name: "Hair Colour (Men)", icon: "◆", price: 399, duration: 40, category: "men" },
];

function serviceById(id) {
  return SERVICES.find((s) => s.id === id);
}

const SEED_BEAUTICIANS = [
  { id: "b1", name: "Pooja Sharma", area: "Camp Area", services: ["facial", "mani", "waxing"], experience: 6, rating: 4.8, reviews: 142, status: "approved", phone: "98xxxxxx12", bio: "Specialist in Korean glass-skin facials and bridal trials." },
  { id: "b2", name: "Rina Dey", area: "Rajapeth", services: ["mehendi", "bridal"], experience: 9, rating: 4.9, reviews: 211, status: "approved", phone: "98xxxxxx45", bio: "Bridal mehendi artist, 9 years, featured at 3 wedding expos." },
  { id: "b3", name: "Anjali Verma", area: "Gadge Nagar", services: ["haircut-w", "facial"], experience: 4, rating: 4.6, reviews: 88, status: "approved", phone: "98xxxxxx78", bio: "Trained at L'Oréal Academy, loves a good fringe cut." },
  { id: "b4", name: "Rahul Bhoyar", area: "Camp Area", services: ["haircut-m", "shave", "hair-color-m"], experience: 5, rating: 4.7, reviews: 96, status: "approved", phone: "98xxxxxx33", bio: "Men's grooming specialist — sharp fades and classic beard styling." },
  { id: "b5", name: "Sandeep Wankhade", area: "Rajapeth", services: ["haircut-m", "groom-m", "shave"], experience: 7, rating: 4.8, reviews: 134, status: "approved", phone: "98xxxxxx21", bio: "10+ years in groom makeup and styling for Amravati weddings." },
];

const AREAS = ["Camp Area", "Rajapeth", "Gadge Nagar", "Rajkamal Chowk", "Other"];

function currency(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

// ---------- Shared bits ----------
function Logo({ size = "normal" }) {
  const big = size === "big";
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: big ? 52 : 36,
          height: big ? 52 : 36,
          background: `linear-gradient(135deg, ${COLORS.kumkum}, ${COLORS.kumkumDark})`,
          color: COLORS.ivory,
          fontFamily: "'Playfair Display', serif",
          fontSize: big ? 24 : 17,
        }}
      >
        स
      </div>
      <div className="leading-none">
        <div
          style={{ fontFamily: "'Playfair Display', serif", color: COLORS.ink, fontSize: big ? 30 : 20, letterSpacing: "-0.01em" }}
        >
          Sundarta
        </div>
        {big && (
          <div style={{ color: COLORS.kumkum, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 4 }}>
            beauty, at your door
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-medium transition-all"
      style={{
        background: active ? COLORS.kumkum : "transparent",
        color: active ? COLORS.ivory : COLORS.ink,
        border: `1px solid ${active ? COLORS.kumkum : "rgba(36,27,26,0.18)"}`,
      }}
    >
      {children}
    </button>
  );
}

function GridPill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full text-sm font-medium transition-all flex items-center justify-center text-center"
      style={{
        background: active ? COLORS.kumkum : "transparent",
        color: active ? COLORS.ivory : COLORS.ink,
        border: `1px solid ${active ? COLORS.kumkum : "rgba(36,27,26,0.18)"}`,
        minHeight: 92,
        padding: "12px 10px",
        lineHeight: 1.3,
      }}
    >
      {children}
    </button>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2"
      style={{ background: COLORS.betel, color: COLORS.ivory }}
    >
      <Check size={16} />
      <span className="text-sm">{message}</span>
    </div>
  );
}

// ---------- Customer side ----------
function CustomerHome({ beauticians, onBook, onSwitchRole }) {
  const [area, setArea] = useState("all");
  const [category, setCategory] = useState("all"); // all | women | men
  const [service, setService] = useState("all");
  const [query, setQuery] = useState("");

  const approved = beauticians.filter((b) => b.status === "approved");

  const visibleServices = SERVICES.filter((s) => category === "all" || s.category === category || s.category === "unisex");

  const filtered = approved.filter((b) => {
    const areaMatch = area === "all" || b.area === area;
    const serviceMatch = service === "all" || b.services.includes(service);
    const categoryMatch =
      category === "all" || b.services.some((sid) => serviceById(sid)?.category === category || serviceById(sid)?.category === "unisex");
    const queryMatch = query.trim() === "" || b.name.toLowerCase().includes(query.toLowerCase()) || b.area.toLowerCase().includes(query.toLowerCase());
    return areaMatch && serviceMatch && categoryMatch && queryMatch;
  });

  return (
    <div style={{ background: COLORS.ivory, minHeight: "100vh" }}>
      {/* Hero */}
      <div
        className="px-6 pt-10 pb-12 relative overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${COLORS.kumkum} 0%, ${COLORS.kumkumDark} 100%)` }}
      >
        <div className="absolute -right-10 -top-10 opacity-20" style={{ fontSize: 220, color: COLORS.ivory, lineHeight: 1 }}>✺</div>
        <div className="flex items-center justify-between relative z-10">
          <Logo />
          <button
            onClick={onSwitchRole}
            className="text-xs px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)", color: COLORS.ivory }}
          >
            I'm a beautician →
          </button>
        </div>
        <h1
          className="relative z-10 mt-8 max-w-md"
          style={{ fontFamily: "'Playfair Display', serif", color: COLORS.ivory, fontSize: 34, lineHeight: 1.15 }}
        >
          Your parlour, <span style={{ color: COLORS.turmeric }}>delivered home.</span>
        </h1>
        <p className="relative z-10 mt-3 max-w-sm text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
          Verified beauticians &amp; barbers across Amravati. Facials, mehendi, grooming, bridal looks &amp; more — booked in two minutes.
        </p>

        <div className="relative z-10 mt-6 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-lg max-w-md">
          <Search size={18} style={{ color: COLORS.kumkum }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or area..."
            className="flex-1 outline-none text-sm"
            style={{ color: COLORS.ink }}
          />
        </div>
      </div>

      {/* Category toggle */}
      <div className="px-6 pt-6 flex gap-2">
        <button
          onClick={() => { setCategory("all"); setService("all"); }}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: category === "all" ? COLORS.ink : "white", color: category === "all" ? COLORS.ivory : COLORS.ink, border: `1px solid ${category === "all" ? COLORS.ink : COLORS.ivoryDeep}` }}
        >
          Everyone
        </button>
        <button
          onClick={() => { setCategory("women"); setService("all"); }}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: category === "women" ? COLORS.kumkum : "white", color: category === "women" ? COLORS.ivory : COLORS.ink, border: `1px solid ${category === "women" ? COLORS.kumkum : COLORS.ivoryDeep}` }}
        >
          ✦ Women
        </button>
        <button
          onClick={() => { setCategory("men"); setService("all"); }}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: category === "men" ? COLORS.betel : "white", color: category === "men" ? COLORS.ivory : COLORS.ink, border: `1px solid ${category === "men" ? COLORS.betel : COLORS.ivoryDeep}` }}
        >
          ✂ Men
        </button>
      </div>

      {/* Filters */}
      <div className="px-6 pt-4 pb-2 grid grid-cols-3 gap-2">
        <GridPill active={service === "all"} onClick={() => setService("all")}>All services</GridPill>
        {visibleServices.map((s) => (
          <GridPill key={s.id} active={service === s.id} onClick={() => setService(s.id)}>
            {s.icon} {s.name}
          </GridPill>
        ))}
      </div>
      <div className="px-6 pt-2 pb-4 grid grid-cols-3 gap-2">
        <GridPill active={area === "all"} onClick={() => setArea("all")}>📍 Anywhere in Amravati</GridPill>
        {AREAS.filter((a) => a !== "Other").map((a) => (
          <GridPill key={a} active={area === a} onClick={() => setArea(a)}>{a}</GridPill>
        ))}
      </div>

      {/* List */}
      <div className="px-6 pb-16 space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm" style={{ color: "rgba(36,27,26,0.6)" }}>
            {filtered.length} beautician{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ background: COLORS.ivoryDeep }}>
            <div style={{ fontSize: 32 }}>🔍</div>
            <p className="mt-3 text-sm" style={{ color: COLORS.ink }}>No one matches that yet.</p>
            <p className="text-xs mt-1" style={{ color: "rgba(36,27,26,0.55)" }}>Try a different area or service.</p>
          </div>
        )}

        {filtered.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: "white", border: `1px solid ${COLORS.ivoryDeep}`, boxShadow: "0 1px 2px rgba(36,27,26,0.04)" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div
                  className="rounded-full flex items-center justify-center font-medium shrink-0"
                  style={{ width: 48, height: 48, background: COLORS.ivoryDeep, color: COLORS.kumkum, fontFamily: "'Playfair Display', serif", fontSize: 18 }}
                >
                  {b.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="font-medium" style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif", fontSize: 17 }}>{b.name}</div>
                  <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "rgba(36,27,26,0.6)" }}>
                    <MapPin size={12} /> {b.area} · {b.experience} yrs exp
                  </div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <Star size={12} fill={COLORS.turmeric} style={{ color: COLORS.turmeric }} />
                    <span style={{ color: COLORS.ink }}>{b.rating}</span>
                    <span style={{ color: "rgba(36,27,26,0.5)" }}>({b.reviews})</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm" style={{ color: "rgba(36,27,26,0.75)" }}>{b.bio}</p>

            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.ivoryDeep}` }}>
              {b.services.map((sid, idx) => {
                const s = serviceById(sid);
                return (
                  <div
                    key={sid}
                    className="flex items-center justify-between px-3 py-2.5 text-sm"
                    style={{ background: idx % 2 === 0 ? "white" : COLORS.ivoryDeep, color: COLORS.ink }}
                  >
                    <span>{s?.icon} {s?.name} <span style={{ color: "rgba(36,27,26,0.45)", fontSize: 12 }}>· {s?.duration} min</span></span>
                    <span className="font-medium" style={{ color: COLORS.betel }}>{currency(s?.price)}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onBook(b)}
              className="mt-1 w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              style={{ background: COLORS.kumkum, color: COLORS.ivory }}
            >
              Book appointment <ChevronRight size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingFlow({ beautician, onConfirm, onBack }) {
  const [form, setForm] = useState({ service: beautician.services[0], date: "", time: "", address: "", name: "", phone: "" });
  const [step, setStep] = useState(1);

  const serviceObj = SERVICES.find((s) => s.id === form.service);
  const canStep2 = form.date && form.time;
  const canConfirm = form.address && form.name && form.phone;

  return (
    <div style={{ background: COLORS.ivory, minHeight: "100vh" }}>
      <div className="px-6 py-5 flex items-center gap-3" style={{ background: "white", borderBottom: `1px solid ${COLORS.ivoryDeep}` }}>
        <button onClick={onBack} className="p-1"><ArrowLeft size={20} style={{ color: COLORS.ink }} /></button>
        <div>
          <div className="text-xs" style={{ color: "rgba(36,27,26,0.55)" }}>Booking with</div>
          <div className="font-medium" style={{ color: COLORS.ink, fontFamily: "'Playfair Display', serif" }}>{beautician.name}</div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-lg mx-auto">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1 h-1 rounded-full" style={{ background: step >= n ? COLORS.kumkum : COLORS.ivoryDeep }} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: COLORS.ink }}>Choose a service</h2>
            <div className="space-y-2">
              {beautician.services.map((sid) => {
                const s = serviceById(sid);
                const active = form.service === sid;
                return (
                  <button
                    key={sid}
                    onClick={() => setForm({ ...form, service: sid })}
                    className="w-full flex items-center justify-between p-4 rounded-xl text-left transition-all"
                    style={{ background: active ? COLORS.kumkum : "white", border: `1px solid ${active ? COLORS.kumkum : COLORS.ivoryDeep}` }}
                  >
                    <div>
                      <div style={{ color: active ? COLORS.ivory : COLORS.ink }}>{s.icon} {s.name}</div>
                      <div style={{ color: active ? "rgba(255,255,255,0.7)" : "rgba(36,27,26,0.5)", fontSize: 12, marginTop: 2 }}>{s.duration} min</div>
                    </div>
                    <span style={{ color: active ? COLORS.ivory : COLORS.betel, fontSize: 14, fontWeight: 500 }}>{currency(s.price)}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl font-medium"
              style={{ background: COLORS.ink, color: COLORS.ivory }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: COLORS.ink }}>Pick date &amp; time</h2>
            <div>
              <label className="text-xs" style={{ color: "rgba(36,27,26,0.6)" }}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl outline-none text-sm"
                style={{ border: `1px solid ${COLORS.ivoryDeep}`, color: COLORS.ink }}
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: "rgba(36,27,26,0.6)" }}>Time</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, time: t })}
                    className="py-2.5 rounded-lg text-xs"
                    style={{
                      background: form.time === t ? COLORS.kumkum : "white",
                      color: form.time === t ? COLORS.ivory : COLORS.ink,
                      border: `1px solid ${form.time === t ? COLORS.kumkum : COLORS.ivoryDeep}`,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button
              disabled={!canStep2}
              onClick={() => setStep(3)}
              className="w-full py-3 rounded-xl font-medium disabled:opacity-40"
              style={{ background: COLORS.ink, color: COLORS.ivory }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: COLORS.ink }}>Your details</h2>
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-xl outline-none text-sm"
              style={{ border: `1px solid ${COLORS.ivoryDeep}` }}
            />
            <input
              placeholder="Phone number (for confirmation call)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-3 rounded-xl outline-none text-sm"
              style={{ border: `1px solid ${COLORS.ivoryDeep}` }}
            />
            <textarea
              placeholder="Full address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-3 rounded-xl outline-none text-sm resize-none"
              rows={3}
              style={{ border: `1px solid ${COLORS.ivoryDeep}` }}
            />

            <div className="rounded-xl p-4 mt-2" style={{ background: COLORS.ivoryDeep }}>
              <div className="text-xs" style={{ color: "rgba(36,27,26,0.6)" }}>Summary</div>
              <div className="text-sm mt-1" style={{ color: COLORS.ink }}>
                {serviceObj?.icon} {serviceObj?.name} · {form.date || "—"} at {form.time || "—"}
              </div>
              <div className="text-xs mt-1" style={{ color: "rgba(36,27,26,0.6)" }}>{serviceObj?.duration} minutes</div>
              <div className="flex items-baseline justify-between mt-3 pt-3" style={{ borderTop: `1px solid rgba(36,27,26,0.1)` }}>
                <span className="text-sm" style={{ color: COLORS.ink }}>Total</span>
                <span style={{ color: COLORS.kumkum, fontSize: 20, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>{currency(serviceObj?.price || 0)}</span>
              </div>
            </div>

            <button
              disabled={!canConfirm}
              onClick={() => onConfirm({ ...form, beauticianId: beautician.id, beauticianName: beautician.name })}
              className="w-full py-3 rounded-xl font-medium disabled:opacity-40 flex items-center justify-center gap-2"
              style={{ background: COLORS.kumkum, color: COLORS.ivory }}
            >
              Confirm booking <Check size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingSuccess({ booking, onDone }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.ivory }}>
      <div className="max-w-sm text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: COLORS.betel, color: COLORS.ivory }}
        >
          <Check size={28} />
        </div>
        <h2 className="mt-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: COLORS.ink }}>
          Request sent!
        </h2>
        <p className="mt-2 text-sm" style={{ color: "rgba(36,27,26,0.65)" }}>
          {booking.beauticianName} will call you on <strong>{booking.phone}</strong> shortly to confirm your {SERVICES.find((s) => s.id === booking.service)?.name.toLowerCase()} on {booking.date} at {booking.time}.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: COLORS.ivoryDeep }}>
          <span className="text-xs" style={{ color: "rgba(36,27,26,0.6)" }}>Amount to pay</span>
          <span style={{ color: COLORS.kumkum, fontWeight: 600 }}>{currency(SERVICES.find((s) => s.id === booking.service)?.price || 0)}</span>
        </div>
        <button
          onClick={onDone}
          className="mt-8 px-6 py-3 rounded-xl font-medium"
          style={{ background: COLORS.ink, color: COLORS.ivory }}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}

// ---------- Beautician side ----------
function BeauticianApply({ onSubmit, onBack }) {
  const [form, setForm] = useState({ name: "", phone: "", area: "Andheri West", experience: "", services: [], bio: "" });
  const toggleService = (id) =>
    setForm((f) => ({ ...f, services: f.services.includes(id) ? f.services.filter((x) => x !== id) : [...f.services, id] }));

  const canSubmit = form.name && form.phone && form.experience && form.services.length > 0;

  return (
    <div style={{ background: COLORS.ivory, minHeight: "100vh" }}>
      <div
        className="px-6 pt-8 pb-10"
        style={{ background: `linear-gradient(160deg, ${COLORS.betel}, #1d3329)` }}
      >
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1"><ArrowLeft size={20} style={{ color: COLORS.ivory }} /></button>
          <Logo />
        </div>
        <h1 className="mt-6 max-w-sm" style={{ fontFamily: "'Playfair Display', serif", color: COLORS.ivory, fontSize: 26 }}>
          Bring your skill to more clients.
        </h1>
        <p className="mt-2 text-sm max-w-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
          Join as a partner beautician. We verify your profile, then customers in your area can book you directly.
        </p>
      </div>

      <div className="px-6 py-6 max-w-lg mx-auto space-y-4">
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 rounded-xl outline-none text-sm"
          style={{ border: `1px solid ${COLORS.ivoryDeep}` }}
        />
        <input
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full p-3 rounded-xl outline-none text-sm"
          style={{ border: `1px solid ${COLORS.ivoryDeep}` }}
        />
        <select
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
          className="w-full p-3 rounded-xl outline-none text-sm bg-white"
          style={{ border: `1px solid ${COLORS.ivoryDeep}` }}
        >
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <input
          placeholder="Years of experience"
          type="number"
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
          className="w-full p-3 rounded-xl outline-none text-sm"
          style={{ border: `1px solid ${COLORS.ivoryDeep}` }}
        />

        <div>
          <label className="text-xs" style={{ color: "rgba(36,27,26,0.6)" }}>Services you offer <span style={{ color: "rgba(36,27,26,0.4)" }}>(your earning per service, after platform fee)</span></label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {SERVICES.map((s) => {
              const active = form.services.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleService(s.id)}
                  className="p-3 rounded-xl text-sm flex items-center justify-between"
                  style={{
                    background: active ? COLORS.betel : "white",
                    color: active ? COLORS.ivory : COLORS.ink,
                    border: `1px solid ${active ? COLORS.betel : COLORS.ivoryDeep}`,
                  }}
                >
                  <span>{s.icon} {s.name}</span>
                  <span style={{ color: active ? "rgba(255,255,255,0.85)" : COLORS.kumkum, fontWeight: 500 }}>You earn {currency(partnerPayout(s.price))}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs mt-2" style={{ color: "rgba(36,27,26,0.45)" }}>
            Customer pays a fixed rate-card price; Sundarta keeps {Math.round(COMMISSION_RATE * 100)}% as platform fee.
          </p>
        </div>

        <textarea
          placeholder="Tell customers about yourself (training, specialties, etc.)"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="w-full p-3 rounded-xl outline-none text-sm resize-none"
          style={{ border: `1px solid ${COLORS.ivoryDeep}` }}
        />

        <button
          disabled={!canSubmit}
          onClick={() => onSubmit(form)}
          className="w-full py-3 rounded-xl font-medium disabled:opacity-40"
          style={{ background: COLORS.kumkum, color: COLORS.ivory }}
        >
          Submit application
        </button>
        <p className="text-xs text-center" style={{ color: "rgba(36,27,26,0.5)" }}>
          Our team reviews every application before it goes live. You'll be notified once approved.
        </p>
      </div>
    </div>
  );
}

function BeauticianPending({ onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.ivory }}>
      <div className="max-w-sm text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: COLORS.turmeric, color: COLORS.ink }}>
          <Clock size={26} />
        </div>
        <h2 className="mt-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: COLORS.ink }}>
          Application received
        </h2>
        <p className="mt-2 text-sm" style={{ color: "rgba(36,27,26,0.65)" }}>
          We're reviewing your profile. This usually takes 24–48 hours. We'll call you once you're approved and live on the platform.
        </p>
        <button onClick={onBack} className="mt-8 px-6 py-3 rounded-xl font-medium" style={{ background: COLORS.ink, color: COLORS.ivory }}>
          Back to home
        </button>
      </div>
    </div>
  );
}

// ---------- Admin ----------
function AdminPanel({ beauticians, bookings, onApprove, onReject, onBack }) {
  const [tab, setTab] = useState("earnings");
  const pending = beauticians.filter((b) => b.status === "pending");
  const approved = beauticians.filter((b) => b.status === "approved");

  return (
    <div style={{ background: COLORS.ivory, minHeight: "100vh" }}>
      <div className="px-6 py-5 flex items-center gap-3" style={{ background: COLORS.ink }}>
        <button onClick={onBack} className="p-1"><ArrowLeft size={20} style={{ color: COLORS.ivory }} /></button>
        <span style={{ color: COLORS.ivory, fontFamily: "'Playfair Display', serif", fontSize: 18 }}>Admin · Sundarta</span>
      </div>

      <div className="px-6 pt-5 flex gap-2 overflow-x-auto">
        <Pill active={tab === "earnings"} onClick={() => setTab("earnings")}>Earnings</Pill>
        <Pill active={tab === "pending"} onClick={() => setTab("pending")}>Applications ({pending.length})</Pill>
        <Pill active={tab === "approved"} onClick={() => setTab("approved")}>Live partners ({approved.length})</Pill>
        <Pill active={tab === "bookings"} onClick={() => setTab("bookings")}>Bookings ({bookings.length})</Pill>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-3">
        {tab === "earnings" && (
          <EarningsView bookings={bookings} />
        )}

        {tab === "pending" && (
          pending.length === 0 ? (
            <EmptyAdmin text="No pending applications right now." />
          ) : pending.map((b) => (
            <div key={b.id} className="rounded-xl p-4 bg-white" style={{ border: `1px solid ${COLORS.ivoryDeep}` }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium" style={{ color: COLORS.ink }}>{b.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(36,27,26,0.6)" }}>{b.area} · {b.experience} yrs · {b.phone}</div>
                  <div className="text-xs mt-1.5" style={{ color: "rgba(36,27,26,0.7)" }}>{b.bio}</div>
                  <div className="flex gap-1 flex-wrap mt-2">
                    {b.services.map((sid) => {
                      const s = SERVICES.find((x) => x.id === sid);
                      return <span key={sid} className="text-xs px-2 py-0.5 rounded-full" style={{ background: COLORS.ivoryDeep, color: COLORS.betel }}>{s?.name}</span>;
                    })}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => onApprove(b.id)} className="p-2 rounded-lg" style={{ background: COLORS.betel, color: "white" }}><Check size={16} /></button>
                  <button onClick={() => onReject(b.id)} className="p-2 rounded-lg" style={{ background: "rgba(163,25,61,0.1)", color: COLORS.kumkum }}><X size={16} /></button>
                </div>
              </div>
            </div>
          ))
        )}

        {tab === "approved" && (
          approved.length === 0 ? (
            <EmptyAdmin text="No live partners yet." />
          ) : approved.map((b) => (
            <div key={b.id} className="rounded-xl p-4 bg-white flex items-center justify-between" style={{ border: `1px solid ${COLORS.ivoryDeep}` }}>
              <div>
                <div className="font-medium" style={{ color: COLORS.ink }}>{b.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(36,27,26,0.6)" }}>{b.area} · ⭐ {b.rating} ({b.reviews})</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(47,74,60,0.1)", color: COLORS.betel }}>Live</span>
            </div>
          ))
        )}

        {tab === "bookings" && (
          bookings.length === 0 ? (
            <EmptyAdmin text="No bookings yet. Once customers book, they'll show up here." />
          ) : bookings.map((bk) => (
            <div key={bk.id} className="rounded-xl p-4 bg-white" style={{ border: `1px solid ${COLORS.ivoryDeep}` }}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm" style={{ color: COLORS.ink }}>{bk.name}</span>
                <span className="text-xs" style={{ color: COLORS.kumkum }}>{bk.date} · {bk.time}</span>
              </div>
              <div className="text-xs mt-1 flex items-center justify-between" style={{ color: "rgba(36,27,26,0.65)" }}>
                <span>{SERVICES.find((s) => s.id === bk.service)?.name} with {bk.beauticianName}</span>
                <span className="font-medium" style={{ color: COLORS.betel }}>{currency(SERVICES.find((s) => s.id === bk.service)?.price || 0)}</span>
              </div>
              <div className="text-xs mt-1.5 pt-1.5 flex items-center gap-3" style={{ borderTop: `1px solid ${COLORS.ivoryDeep}`, color: "rgba(36,27,26,0.5)" }}>
                <span>Your profit: <strong style={{ color: COLORS.kumkum }}>{currency((serviceById(bk.service)?.price || 0) - partnerPayout(serviceById(bk.service)?.price || 0))}</strong></span>
                <span>Partner gets: <strong style={{ color: COLORS.betel }}>{currency(partnerPayout(serviceById(bk.service)?.price || 0))}</strong></span>
              </div>
              <div className="text-xs mt-1" style={{ color: "rgba(36,27,26,0.5)" }}>📞 {bk.phone} · 📍 {bk.address}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EarningsView({ bookings }) {
  const totals = bookings.reduce(
    (acc, bk) => {
      const s = serviceById(bk.service);
      const price = s?.price || 0;
      const payout = partnerPayout(price);
      acc.revenue += price;
      acc.payout += payout;
      acc.profit += price - payout;
      return acc;
    },
    { revenue: 0, payout: 0, profit: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-2xl p-5" style={{ background: COLORS.ink }}>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Your profit ({Math.round(COMMISSION_RATE * 100)}% commission)</div>
          <div className="mt-1" style={{ color: COLORS.turmeric, fontSize: 32, fontFamily: "'Playfair Display', serif" }}>{currency(totals.profit)}</div>
          <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>from {bookings.length} booking{bookings.length !== 1 ? "s" : ""}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4 bg-white" style={{ border: `1px solid ${COLORS.ivoryDeep}` }}>
            <div className="text-xs" style={{ color: "rgba(36,27,26,0.55)" }}>Total revenue</div>
            <div className="mt-1 font-medium" style={{ color: COLORS.ink, fontSize: 20 }}>{currency(totals.revenue)}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(36,27,26,0.45)" }}>paid by customers</div>
          </div>
          <div className="rounded-xl p-4 bg-white" style={{ border: `1px solid ${COLORS.ivoryDeep}` }}>
            <div className="text-xs" style={{ color: "rgba(36,27,26,0.55)" }}>Partner payouts</div>
            <div className="mt-1 font-medium" style={{ color: COLORS.betel, fontSize: 20 }}>{currency(totals.payout)}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(36,27,26,0.45)" }}>owed to beauticians</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: COLORS.ivoryDeep }}>
        <div className="text-xs font-medium mb-2" style={{ color: COLORS.ink }}>How the split works</div>
        <p className="text-xs" style={{ color: "rgba(36,27,26,0.65)" }}>
          Customer pays the fixed rate-card price. You keep {Math.round(COMMISSION_RATE * 100)}%, the partner keeps {Math.round((1 - COMMISSION_RATE) * 100)}% — paid out after the service is completed. Example: a {currency(599)} facial earns you {currency(599 - partnerPayout(599))}, the beautician gets {currency(partnerPayout(599))}.
        </p>
      </div>

      {bookings.length === 0 && (
        <EmptyAdmin text="No bookings yet — earnings will appear here once customers start booking." />
      )}
    </div>
  );
}

function EmptyAdmin({ text }) {
  return (
    <div className="text-center py-14 rounded-2xl" style={{ background: COLORS.ivoryDeep }}>
      <p className="text-sm" style={{ color: "rgba(36,27,26,0.6)" }}>{text}</p>
    </div>
  );
}

// ---------- Root ----------
export default function App() {
  const [view, setView] = useState("customer-home"); // customer-home | booking | success | apply | pending | admin
  const [beauticians, setBeauticians] = useState(SEED_BEAUTICIANS);
  const [bookings, setBookings] = useState([]);
  const [activeBeautician, setActiveBeautician] = useState(null);
  const [lastBooking, setLastBooking] = useState(null);
  const [toast, setToast] = useState(null);

  const handleBook = (b) => {
    setActiveBeautician(b);
    setView("booking");
  };

  const handleConfirmBooking = (booking) => {
    const withId = { ...booking, id: uid("bk") };
    setBookings((prev) => [withId, ...prev]);
    setLastBooking(withId);
    setView("success");
  };

  const handleApply = (form) => {
    const newB = { ...form, id: uid("beau"), status: "pending", rating: 0, reviews: 0 };
    setBeauticians((prev) => [newB, ...prev]);
    setView("pending");
  };

  const handleApprove = (id) => {
    setBeauticians((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "approved", rating: 4.5, reviews: 0 } : b))
    );
    setToast("Partner approved and live");
  };

  const handleReject = (id) => {
    setBeauticians((prev) => prev.filter((b) => b.id !== id));
    setToast("Application removed");
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      {view === "customer-home" && (
        <CustomerHome
          beauticians={beauticians}
          onBook={handleBook}
          onSwitchRole={() => setView("apply")}
        />
      )}

      {view === "booking" && activeBeautician && (
        <BookingFlow beautician={activeBeautician} onConfirm={handleConfirmBooking} onBack={() => setView("customer-home")} />
      )}

      {view === "success" && lastBooking && (
        <BookingSuccess booking={lastBooking} onDone={() => setView("customer-home")} />
      )}

      {view === "apply" && (
        <BeauticianApply onSubmit={handleApply} onBack={() => setView("customer-home")} />
      )}

      {view === "pending" && (
        <BeauticianPending onBack={() => setView("customer-home")} />
      )}

      {view === "admin" && (
        <AdminPanel
          beauticians={beauticians}
          bookings={bookings}
          onApprove={handleApprove}
          onReject={handleReject}
          onBack={() => setView("customer-home")}
        />
      )}

      {/* Quick admin access for demo purposes */}
      {view !== "admin" && view !== "booking" && view !== "success" && (
        <button
          onClick={() => setView("admin")}
          className="fixed bottom-5 right-5 text-xs px-3 py-2 rounded-full shadow-lg z-40"
          style={{ background: COLORS.ink, color: COLORS.ivory }}
        >
          Admin view
        </button>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
