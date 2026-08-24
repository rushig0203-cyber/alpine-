import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Compass,
  ExternalLink,
  FileText,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Phone,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { submitEnquiry } from "@/lib/enquiries";
import { SITE, waLink } from "@/lib/site";
import heroBuilding from "@/assets/hero-building.jpg";
import heroAstonia from "@/assets/hero-astonia.jpg";
import pool from "@/assets/astonia-day.jpg";
import garden from "@/assets/alpine-garden.jpg";
import living from "@/assets/interior-living.jpg";
import bedroom from "@/assets/interior-bedroom.jpg";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Amenities", href: "#amenities" },
  { label: "Floor plans", href: "#floor-plans" },
  { label: "Location", href: "#location" },
];

const amenityGroups = [
  {
    id: "premium",
    label: "Premium facilities",
    eyebrow: "Wellness, leisure & more",
    title: "A better everyday, built in.",
    copy: "Thoughtfully planned spaces give every age and every mood a place to belong. Step out of your home and into a lifestyle that feels effortless.",
    image: pool,
    imageAlt: "Rooftop swimming pool at Alpine Astonia",
    items: ["Yoga deck", "Party lounge", "Gymnasium", "Swimming pool with deck", "Indoor games", "Children's play park", "Open badminton court", "Senior citizen pavilion"],
  },
  {
    id: "green",
    label: "Green living",
    eyebrow: "Space to slow down",
    title: "Room to breathe.",
    copy: "Lush landscapes and open-to-sky spaces bring a little more calm into the rhythm of the day — right at your doorstep.",
    image: garden,
    imageAlt: "Landscaped garden at an Alpine residence",
    items: ["Open-to-sky artificial lawn", "Cycle and jogging tracks", "Pergola sitting area", "Landscape garden", "Pickleball court", "Gazebo seating", "Barbeque area", "Outdoor exercise area"],
  },
  {
    id: "security",
    label: "Safety & security",
    eyebrow: "Peace of mind, always",
    title: "Comfort in the details.",
    copy: "From a video door phone at your entrance to round-the-clock security, the essentials are considered so you can focus on what matters.",
    image: living,
    imageAlt: "Warm, thoughtfully designed Alpine living room",
    items: ["CCTV camera security", "Fire sprinklers", "Rainwater harvesting", "Security cabin", "Video door security", "Solid waste management", "Fire-fighting system", "24 / 7 security"],
  },
];

type PlanType = "2 BHK" | "3 BHK";

const specs = [
  { title: "Structure", copy: "Earthquake-resistant RCC frame structure. Walls using AAC block with internal gypsum plaster and external double-coat sand-finish plaster.", icon: ShieldCheck },
  { title: "Flooring & kitchen", copy: "Vitrified floor tiles, black granite kitchen otta with stainless-steel sink and dado up to lintel, with provision for a water purifier.", icon: Sparkles },
  { title: "Plumbing & sanitary", copy: "Concealed CPVC plumbing with Jaquar Opal Prime series or equivalent CP fittings.", icon: DropletIcon },
  { title: "Electrical", copy: "TV point in living and master bedroom, AC point in master bedroom, geyser points in all bathrooms, washing machine and Aquaguard points, and Goldmedal modular switches or equivalent.", icon: BoltIcon },
  { title: "Doors & windows", copy: "Designer laminated entrance door and internal laminated doors. Powder-coated 3-track aluminium sliding windows with mosquito net.", icon: HomeIcon },
  { title: "Lift & solar", copy: "Schindler or equivalent lift with generator backup, plus solar water connection in one bathroom per flat.", icon: SunIcon },
];

const nearby = [
  ["Symbiosis Skills & Open University", "1 min"],
  ["City Pride School, Nigdi", "5 mins"],
  ["JSPM Institute, Tathawade", "6 mins"],
  ["SB Patil Public School, Ravet", "7 mins"],
  ["Unique Multispeciality Hospital, Ravet", "8 mins"],
  ["Life Point Hospital, Wakad", "9 mins"],
  ["Decathlon, Wakad", "11 mins"],
  ["Aditya Birla Hospital, Chinchwad", "13 mins"],
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a className={`aston-brand ${light ? "aston-brand-light" : ""}`} href="#home" aria-label="Alpine Landmarks home">
      <span className="aston-brand-icon" aria-hidden="true">A</span>
      <span className="aston-brand-wordmark">
        <strong>alpine</strong>
        <small>LANDMARKS LLP</small>
      </span>
    </a>
  );
}

function SectionIntro({ eyebrow, title, copy, light = false }: { eyebrow: string; title: ReactNode; copy?: string; light?: boolean }) {
  return (
    <div className={`aston-section-intro ${light ? "aston-intro-light" : ""}`}>
      <p className="aston-eyebrow"><span className="aston-eyebrow-line" />{eyebrow}</p>
      <h2>{title}</h2>
      {copy && <p className="aston-section-copy">{copy}</p>}
    </div>
  );
}

function StatStrip() {
  const stats = [
    ["197", "Premium residences"],
    ["39", "Retail shops"],
    ["4 L", "Built-up sq. ft."],
    ["12+", "Curated amenities"],
  ];
  return (
    <section className="aston-stat-strip" aria-label="Alpine Astonia highlights">
      <div className="aston-container aston-stat-grid">
        {stats.map(([value, label]) => (
          <div className="aston-stat" key={label}>
            <strong>{value}<em>{value === "4 L" ? "" : "+"}</em></strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section id="home" className="aston-hero">
      <div className="aston-hero-image">
        <img src={heroBuilding} alt="Alpine Astonia residences in Kiwale" />
      </div>
      <div className="aston-hero-overlay" />
      <div className="aston-hero-grid" />
      <div className="aston-container aston-hero-content">
        <div className="aston-hero-copy">
          <p className="aston-kicker"><span /> Welcome to Alpine Astonia</p>
          <h1><span>Alpine</span> <b>Astonia.</b></h1>
          <p className="aston-hero-subtitle">Finely crafted <strong>2 &amp; 3 BHK homes</strong><br />made for the life you are building.</p>
          <div className="aston-hero-actions">
            <button className="aston-button aston-button-solid" type="button" onClick={() => scrollToId("contact")}>
              Book a site visit <ArrowRight size={16} />
            </button>
            <a className="aston-button aston-button-ghost" href="#about">Discover Astonia <ArrowDown size={15} /></a>
          </div>
        </div>
        <div className="aston-hero-side">
          <span className="aston-side-label">Starting from</span>
          <strong>₹67.32<small>L*</small></strong>
          <span className="aston-side-note">All inclusive · 2 BHK</span>
        </div>
      </div>
      <div className="aston-container aston-hero-bottom">
        <div className="aston-scroll-cue"><span className="aston-scroll-line" /> Scroll to explore</div>
        <div className="aston-hero-rera">MahaRERA <b>P52100047595</b></div>
      </div>
    </section>
  );
}

function About() {
  return (
    <>
      <section id="about" className="aston-about aston-section">
        <div className="aston-container aston-about-layout">
          <div className="aston-about-media">
            <div className="aston-image-frame"><img src={living} alt="An elegant Alpine Astonia living room" loading="lazy" /></div>
            <div className="aston-image-tag"><span>01</span> Spaces that feel like you</div>
            <div className="aston-outline-box" />
          </div>
          <div className="aston-about-copy">
            <SectionIntro eyebrow="The Astonia story" title={<>A home that gives<br /><i>life more room.</i></>} />
            <p>Introducing Alpine Astonia, an esteemed residential development that redefines modern living in the vibrant Kiwale neighbourhood, promising an unparalleled lifestyle experience.</p>
            <p>With artistically designed residences and an array of amenities, Alpine Astonia is set to transform your way of life. Discover the perfect blend of urban convenience and an uplifting lifestyle in this remarkable project.</p>
            <a className="aston-text-link" href="#amenities">Explore the lifestyle <ArrowRight size={15} /></a>
          </div>
        </div>
      </section>
      <StatStrip />
    </>
  );
}

function ProjectStory() {
  return (
    <section className="aston-story aston-section">
      <div className="aston-container aston-story-layout">
        <SectionIntro eyebrow="The Alpine difference" title={<>A collection of<br /><i>living landmarks.</i></>} copy="For close to two decades, Alpine Landmarks has been creating homes and commercial spaces across Pimpri-Chinchwad with a simple belief: quality should be felt long after handover." />
        <div className="aston-story-points">
          <div><span>01</span><div><h3>Designed for living</h3><p>Thoughtful planning, natural light and spaces that adapt to the way families really live.</p></div></div>
          <div><span>02</span><div><h3>Built on trust</h3><p>Clear paperwork, transparent pricing and a relationship that continues beyond possession.</p></div></div>
          <div><span>03</span><div><h3>Rooted in PCMC</h3><p>Strategic addresses close to schools, work hubs, healthcare and everything you need each day.</p></div></div>
        </div>
      </div>
    </section>
  );
}

function Developer() {
  return (
    <section className="aston-developer aston-section">
      <div className="aston-container aston-developer-layout">
        <div className="aston-developer-image"><img src={heroAstonia} alt="Alpine Astonia, a landmark by Alpine Landmarks LLP" loading="lazy" /><span>Alpine Landmarks LLP<br /><b>Since 2006</b></span></div>
        <div className="aston-developer-copy"><SectionIntro eyebrow="About the developer" title={<>Building trust<br /><i>into every address.</i></>} copy="With a wealth of experience in real estate, Alpine Landmarks LLP is dedicated to creating living spaces that consistently surpass expectations." /><p>Our commitment to quality, craftsmanship and customer satisfaction is unwavering. We create havens where luxury meets comfort, and dreams turn into reality — with transparency at the core.</p><div className="aston-developer-meta"><div><strong>20</strong><span>Years of experience</span></div><div><strong>1100+</strong><span>Happy families</span></div><div><strong>12+</strong><span>Projects delivered</span></div></div><a className="aston-text-link" href="#contact">Meet the Alpine team <ArrowRight size={15} /></a></div>
      </div>
    </section>
  );
}

function Amenities() {
  const [active, setActive] = useState(amenityGroups[0].id);
  const group = amenityGroups.find((item) => item.id === active) ?? amenityGroups[0];
  return (
    <section id="amenities" className="aston-amenities aston-section">
      <div className="aston-container">
        <div className="aston-amenities-heading">
          <SectionIntro eyebrow="Life at Astonia" title={<>Everything you need.<br /><i>More to look forward to.</i></>} copy="Experience a range of world-class amenities designed to elevate your everyday, from state-of-the-art fitness spaces to serene landscaped gardens." light />
          <div className="aston-amenity-count"><span>0{amenityGroups.findIndex((item) => item.id === active) + 1}</span> / 03</div>
        </div>
        <div className="aston-amenities-tabs" role="tablist" aria-label="Amenity categories">
          {amenityGroups.map((item, index) => (
            <button key={item.id} type="button" role="tab" aria-selected={active === item.id} className={active === item.id ? "active" : ""} onClick={() => setActive(item.id)}>
              <span>0{index + 1}</span>{item.label}<ArrowRight size={14} />
            </button>
          ))}
        </div>
        <div className="aston-amenity-feature" key={group.id}>
          <div className="aston-amenity-image"><img src={group.image} alt={group.imageAlt} loading="lazy" /><span className="aston-image-number">0{amenityGroups.findIndex((item) => item.id === active) + 1}</span></div>
          <div className="aston-amenity-copy">
            <p className="aston-eyebrow"><span className="aston-eyebrow-line" />{group.eyebrow}</p>
            <h3>{group.title}</h3>
            <p>{group.copy}</p>
            <ul>{group.items.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul>
            <button className="aston-text-link aston-text-link-light" type="button" onClick={() => scrollToId("contact")}>Enquire about Astonia <ArrowRight size={15} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const items = [
    { image: pool, label: "A rooftop made for sunsets", className: "gallery-wide" },
    { image: bedroom, label: "Your own quiet corner", className: "gallery-tall" },
    { image: heroAstonia, label: "A landmark address", className: "gallery-square" },
    { image: garden, label: "Green, at every turn", className: "gallery-small" },
  ];
  return (
    <section className="aston-gallery aston-section">
      <div className="aston-container">
        <div className="aston-gallery-head"><SectionIntro eyebrow="A glimpse of Astonia" title={<>See the feeling<br /><i>for yourself.</i></>} /><a href="#contact" className="aston-text-link">Request the full brochure <FileText size={15} /></a></div>
        <div className="aston-gallery-grid">
          {items.map((item, index) => <figure className={item.className} key={item.label}><img src={item.image} alt={item.label} loading="lazy" /><figcaption><span>0{index + 1}</span>{item.label}</figcaption></figure>)}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="aston-pricing aston-section">
      <div className="aston-container aston-pricing-layout">
        <div><SectionIntro eyebrow="Choose your space" title={<>Find the right<br /><i>fit for your life.</i></>} copy="Carefully planned 2 and 3 BHK homes, with the finishes, light and breathing room your everyday deserves." /><p className="aston-pricing-note">*Indicative pricing. Terms and conditions apply.</p></div>
        <div className="aston-price-cards">
          <article className="aston-price-card"><div className="aston-price-card-top"><span>01 · 2 BHK</span><HomeIcon size={21} /></div><p>Starting from</p><strong>₹67.32<small>L</small></strong><span className="aston-price-detail">All inclusive · 722 sq. ft. carpet</span><button type="button" onClick={() => scrollToId("contact")}>Enquire now <ArrowRight size={15} /></button></article>
          <article className="aston-price-card aston-price-card-dark"><div className="aston-price-card-top"><span>02 · 3 BHK</span><HomeIcon size={21} /></div><p>Starting from</p><strong>₹87.95<small>L</small></strong><span className="aston-price-detail">All inclusive · 1010 sq. ft. carpet</span><button type="button" onClick={() => scrollToId("contact")}>Enquire now <ArrowRight size={15} /></button></article>
        </div>
      </div>
    </section>
  );
}

function FloorPlanDiagram({ type }: { type: PlanType }) {
  if (type === "2 BHK") {
    return <div className="plan-drawing plan-two"><span className="room room-living">Living / Dining</span><span className="room room-kitchen">Kitchen</span><span className="room room-bed-a">Bedroom</span><span className="room room-bed-b">Master bedroom</span><span className="room room-bath-a">Toilet</span><span className="room room-bath-b">Toilet</span><span className="room room-balcony">Balcony</span></div>;
  }
  return <div className="plan-drawing plan-three"><span className="room room-living">Living / Dining</span><span className="room room-kitchen">Kitchen</span><span className="room room-bed-a">Bedroom</span><span className="room room-bed-b">Master bedroom</span><span className="room room-bed-c">Bedroom</span><span className="room room-bath-a">Toilet</span><span className="room room-bath-b">Toilet</span><span className="room room-balcony">Balcony</span></div>;
}

function FloorPlans() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  return (
    <section id="floor-plans" className="aston-plans aston-section">
      <div className="aston-container">
        <div className="aston-plans-head"><SectionIntro eyebrow="Make it yours" title={<>Plans with<br /><i>purpose.</i></>} copy="Every residence is crafted around the way you want to live. Explore the plans and find the one that feels like home." /><span className="aston-plans-badge"><Compass size={16} /> 2 thoughtfully planned formats</span></div>
        <div className="aston-plan-grid">
          <button type="button" className="aston-plan-card" onClick={() => setSelectedPlan("2 BHK")}><div className="aston-plan-preview"><FloorPlanDiagram type="2 BHK" /><span>View floor plan <ExternalLink size={14} /></span></div><div className="aston-plan-info"><div><span>2 BHK</span><h3>Comfort, considered.</h3></div><strong>722.15 <small>sq. ft. carpet</small></strong></div></button>
          <button type="button" className="aston-plan-card aston-plan-card-featured" onClick={() => setSelectedPlan("3 BHK")}><div className="aston-plan-preview"><FloorPlanDiagram type="3 BHK" /><span>View floor plan <ExternalLink size={14} /></span></div><div className="aston-plan-info"><div><span>3 BHK</span><h3>Space to grow into.</h3></div><strong>1009.87 <small>sq. ft. carpet</small></strong></div></button>
        </div>
        <div className="aston-plan-foot"><span>Floor plans are indicative and subject to change.</span><a href="#contact">Get detailed plans <ArrowRight size={15} /></a></div>
      </div>
      {selectedPlan && <div className="aston-modal-backdrop" role="presentation" onClick={() => setSelectedPlan(null)}><div className="aston-plan-modal" role="dialog" aria-modal="true" aria-label={`${selectedPlan} floor plan`} onClick={(event) => event.stopPropagation()}><button className="aston-modal-close" type="button" onClick={() => setSelectedPlan(null)} aria-label="Close floor plan"><X size={18} /></button><p className="aston-eyebrow"><span className="aston-eyebrow-line" /> Alpine Astonia</p><h3>{selectedPlan} floor plan</h3><p>Carpet area · {selectedPlan === "2 BHK" ? "722.15" : "1009.87"} sq. ft.</p><FloorPlanDiagram type={selectedPlan} /><a className="aston-button aston-button-dark" href="#contact" onClick={() => setSelectedPlan(null)}>Enquire for this plan <ArrowRight size={15} /></a></div></div>}
    </section>
  );
}

function Specifications() {
  const [open, setOpen] = useState(0);
  return (
    <section className="aston-specs aston-section">
      <div className="aston-container aston-spec-layout">
        <SectionIntro eyebrow="The finer details" title={<>Made to a<br /><i>higher standard.</i></>} copy="From the structure beneath your feet to the light switches at your fingertips, quality is built into every layer of your home." />
        <div className="aston-spec-list">{specs.map((item, index) => { const Icon = item.icon; return <div className={`aston-spec ${open === index ? "open" : ""}`} key={item.title}><button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span><Icon size={17} /><b>0{index + 1}</b>{item.title}</span><ChevronDown size={17} /></button><div className="aston-spec-content"><p>{item.copy}</p></div></div>; })}</div>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="location" className="aston-location aston-section">
      <div className="aston-container aston-location-layout">
        <div className="aston-location-copy"><SectionIntro eyebrow="A connected address" title={<>Close to what<br /><i>moves you.</i></>} copy="Situated in the prime location of Kiwale, Alpine Astonia connects you to Pune and beyond via NH 48 and the Aundh–Ravet BRTS road." /><p>With the Mumbai–Pune Expressway close by, Hinjewadi IT hub, Pimpri-Chinchwad's industrial belt, educational institutions, shopping and healthcare are all within easy reach.</p><a className="aston-button aston-button-dark" href="https://maps.google.com/?q=Alpine+Astonia+Kiwale" target="_blank" rel="noreferrer">Open in Google Maps <ExternalLink size={15} /></a></div>
        <div className="aston-location-map"><div className="aston-map-grid" /><div className="aston-map-road road-one" /><div className="aston-map-road road-two" /><div className="aston-map-road road-three" /><div className="aston-map-pin"><span><MapPin size={17} /></span><b>Alpine<br />Astonia</b></div><div className="aston-map-label map-label-one">Hinjewadi</div><div className="aston-map-label map-label-two">Ravet</div><div className="aston-map-label map-label-three">Kiwale</div><div className="aston-map-compass"><Navigation size={15} /><small>N</small></div></div>
      </div>
      <div className="aston-container aston-nearby"><p className="aston-eyebrow"><span className="aston-eyebrow-line" />Around Astonia</p><div className="aston-nearby-list">{nearby.map(([place, time]) => <div key={place}><span>{place}</span><strong>{time}</strong></div>)}</div></div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const email = String(data.get("email") ?? "");
    if (name.trim().length < 2 || phone.trim().length < 7 || !email.includes("@")) {
      setError("Please add your name, phone number and a valid email.");
      return;
    }
    setStatus("sending");
    const result = await submitEnquiry({ name, phone, email, interest: String(data.get("interest") ?? "Alpine Astonia"), message: String(data.get("message") ?? "") });
    setStatus("done");
    if (!result.ok) {
      window.open(waLink(`Hello Alpine Landmarks, I'm ${name}. I would like to enquire about Alpine Astonia.\nPhone: ${phone}\nEmail: ${email}`), "_blank", "noopener,noreferrer");
    }
    form.reset();
  }
  return (
    <section id="contact" className="aston-contact aston-section">
      <div className="aston-container aston-contact-layout">
        <div className="aston-contact-copy"><p className="aston-eyebrow"><span className="aston-eyebrow-line" /> Start a conversation</p><h2>Come home<br /><i>to Astonia.</i></h2><p>Tell us a little about what you are looking for. Our team will get back to you to arrange a private site visit.</p><div className="aston-contact-links"><a href={`tel:${SITE.phoneRaw}`}><Phone size={16} /><span><small>Call us</small>{SITE.phone}</span></a><a href={`mailto:${SITE.email}`}><Mail size={16} /><span><small>Email us</small>{SITE.email}</span></a></div><div className="aston-contact-rera"><span>Registered project</span><strong>MahaRERA · {SITE.rera.astonia}</strong></div></div>
        <form className="aston-form" onSubmit={handleSubmit} noValidate><div className="aston-form-head"><span>01</span><div><h3>Plan your visit</h3><p>We usually respond within 24 hours.</p></div></div><div className="aston-form-fields"><label><span>Full name</span><input name="name" placeholder="Your name" required /></label><label><span>Phone number</span><input name="phone" type="tel" placeholder="+91" required /></label><label className="field-full"><span>Email address</span><input name="email" type="email" placeholder="you@example.com" required /></label><label className="field-full"><span>I'm interested in</span><select name="interest" defaultValue="Alpine Astonia"><option>Alpine Astonia · 2 BHK</option><option>Alpine Astonia · 3 BHK</option><option>Site visit</option><option>Brochure</option></select></label><label className="field-full"><span>Message <em>Optional</em></span><textarea name="message" rows={3} placeholder="Tell us how we can help..." /></label></div>{error && <p className="aston-form-error">{error}</p>}{status === "done" ? <div className="aston-success"><Check size={17} /> Thank you — your enquiry has been received.</div> : <button className="aston-button aston-button-accent" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Request a site visit"} <Send size={15} /></button>}<p className="aston-form-privacy">By submitting, you agree to be contacted by Alpine Landmarks LLP.</p></form>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="aston-footer"><div className="aston-container aston-footer-top"><div><Brand light /><p>We build your dreams.<br />Landmark residences across PCMC, Pune.</p><div className="aston-socials"><a href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a><a href={`mailto:${SITE.email}`} aria-label="Email"><Mail size={16} /></a><a href={waLink("Hello Alpine Landmarks, I'd like to enquire.")} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={16} /></a></div></div><div><p className="aston-footer-label">Explore</p><ul><li><a href="#about">About Astonia</a></li><li><a href="#amenities">Amenities</a></li><li><a href="#floor-plans">Floor plans</a></li><li><a href="#location">Location</a></li></ul></div><div><p className="aston-footer-label">Visit us</p><p className="aston-footer-address">{SITE.address}</p><a href={`tel:${SITE.phoneRaw}`} className="aston-footer-phone">{SITE.phone}</a></div></div><div className="aston-container aston-footer-bottom"><span>© {new Date().getFullYear()} Alpine Landmarks LLP</span><span>RERA · {SITE.rera.astonia}</span><a href="#home">Back to top <ArrowDown size={13} /></a></div><div className="aston-container aston-disclaimer">Disclaimer: Images, specifications, amenities and plans are indicative and subject to change. Please refer to the MahaRERA-registered documents and sale agreement for final details. *Pricing is indicative and all inclusive.</div></footer>;
}

export default function AstoniaLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);
  const closeMenu = () => setMenuOpen(false);
  return <main className="aston-page"><header className={`aston-header ${scrolled ? "aston-header-scrolled" : ""}`}><div className="aston-container aston-nav"><Brand light={!scrolled} /><nav aria-label="Main navigation">{navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><div className="aston-nav-actions"><a className="aston-nav-phone" href={`tel:${SITE.phoneRaw}`}><Phone size={15} /> {SITE.phone}</a><a className="aston-nav-cta" href="#contact">Enquire <ArrowRight size={14} /></a><button className="aston-menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div></div>{menuOpen && <div className="aston-mobile-menu"><div className="aston-container"><p className="aston-mobile-kicker">Alpine Astonia · Kiwale</p>{navItems.map((item, index) => <a key={item.href} href={item.href} onClick={closeMenu}><span>0{index + 1}</span>{item.label}<ArrowRight size={17} /></a>)}<div className="aston-mobile-contact"><a href={`tel:${SITE.phoneRaw}`}><Phone size={15} /> {SITE.phone}</a><a href="#contact" onClick={closeMenu}>Book a site visit <ArrowRight size={15} /></a></div></div></div>}</header><Hero /><About /><ProjectStory /><Developer /><Amenities /><Gallery /><Pricing /><FloorPlans /><Specifications /><Location /><Contact /><Footer /></main>;
}

// Small inline icon components keep the specification list readable without adding dependencies.
function DropletIcon({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3.5S5.5 10.1 5.5 14.4a6.5 6.5 0 0 0 13 0C18.5 10.1 12 3.5 12 3.5Z" /><path d="M9.5 15.2a2.8 2.8 0 0 0 2.5 2" /></svg>; }
function BoltIcon({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" /></svg>; }
function HomeIcon({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></svg>; }
function SunIcon({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></svg>; }
