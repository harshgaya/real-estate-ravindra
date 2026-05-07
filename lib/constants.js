export const VALIDATION = {
  phoneRegex: /^[6-9]\d{9}$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  minNameLength: 2,
};

export const LEAD_STATUSES = [
  { value: "new", label: "New", color: "blue" },
  { value: "contacted", label: "Contacted", color: "amber" },
  { value: "callback", label: "Callback", color: "yellow" },
  { value: "qualified", label: "Qualified", color: "purple" },
  { value: "meeting_scheduled", label: "Meeting Scheduled", color: "indigo" },
  { value: "site_visit_scheduled", label: "Site Visit Scheduled", color: "cyan" },
  { value: "site_visit_done", label: "Site Visit Done", color: "teal" },
  { value: "negotiation", label: "Negotiation", color: "orange" },
  { value: "eoi", label: "EOI", color: "pink" },
  { value: "booked", label: "Booked", color: "green" },
  { value: "not_interested", label: "Not Interested", color: "gray" },
  { value: "dropped", label: "Dropped", color: "stone" },
  { value: "lost", label: "Lost", color: "red" },
];

export const TEMPERATURES = [
  { value: "hot", label: "Hot", color: "red" },
  { value: "warm", label: "Warm", color: "amber" },
  { value: "cold", label: "Cold", color: "blue" },
];

export const TIMELINES = [
  { value: "immediate", label: "Immediate" },
  { value: "3_months", label: "Within 3 months" },
  { value: "6_months", label: "3-6 months" },
  { value: "12_months", label: "6-12 months" },
  { value: "exploring", label: "Just exploring" },
];

export const PURPOSES = [
  { value: "self_use", label: "Self use" },
  { value: "investment", label: "Investment" },
  { value: "rental_income", label: "Rental income" },
];

export const FUNDINGS = [
  { value: "loan", label: "Home loan" },
  { value: "self", label: "Self funded" },
  { value: "mix", label: "Mix" },
];

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "penthouse", label: "Penthouse" },
  { value: "plot", label: "Plot" },
  { value: "commercial", label: "Commercial" },
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
];

export const CITIES = [
  { value: "bengaluru", label: "Bengaluru" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "mumbai", label: "Mumbai" },
  { value: "pune", label: "Pune" },
  { value: "chennai", label: "Chennai" },
  { value: "delhi", label: "Delhi NCR" },
  { value: "gurgaon", label: "Gurgaon" },
];

export const PROPERTY_STATUSES = [
  "Now Selling", "Pre-Launch", "Few Left", "Sold Out", "Ready to Move", "Available",
];

export const TASK_PRIORITIES = [
  { value: "low", label: "Low", color: "gray" },
  { value: "medium", label: "Medium", color: "blue" },
  { value: "high", label: "High", color: "orange" },
  { value: "urgent", label: "Urgent", color: "red" },
];

export const TASK_TYPES = [
  { value: "followup", label: "Followup" },
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "site_visit", label: "Site Visit" },
  { value: "document", label: "Document" },
  { value: "other", label: "Other" },
];

export const VISIT_STATUSES = [
  { value: "scheduled", label: "Scheduled", color: "blue" },
  { value: "confirmed", label: "Confirmed", color: "indigo" },
  { value: "completed", label: "Completed", color: "green" },
  { value: "no_show", label: "No Show", color: "red" },
  { value: "cancelled", label: "Cancelled", color: "gray" },
  { value: "rescheduled", label: "Rescheduled", color: "amber" },
];

export const BOOKING_STATUSES = [
  { value: "pending", label: "Pending", color: "amber" },
  { value: "confirmed", label: "Confirmed", color: "green" },
  { value: "agreement_signed", label: "Agreement Signed", color: "blue" },
  { value: "registered", label: "Registered", color: "indigo" },
  { value: "possession_given", label: "Possession Given", color: "purple" },
  { value: "cancelled", label: "Cancelled", color: "red" },
  { value: "refunded", label: "Refunded", color: "gray" },
];

export const DOCUMENT_TYPES = [
  { value: "kyc_aadhaar", label: "Aadhaar" },
  { value: "kyc_pan", label: "PAN" },
  { value: "address_proof", label: "Address Proof" },
  { value: "income_proof", label: "Income Proof" },
  { value: "agreement", label: "Agreement" },
  { value: "allotment", label: "Allotment Letter" },
  { value: "brochure", label: "Brochure" },
  { value: "receipt", label: "Receipt" },
  { value: "photo", label: "Photo" },
  { value: "other", label: "Other" },
];

export const TEMPLATE_CHANNELS = ["email", "whatsapp", "call"];

export const TEMPLATE_CATEGORIES = [
  { value: "welcome", label: "Welcome" },
  { value: "followup", label: "Follow-up" },
  { value: "property_share", label: "Property Share" },
  { value: "visit_invite", label: "Site Visit Invite" },
  { value: "visit_reminder", label: "Visit Reminder" },
  { value: "negotiation", label: "Negotiation" },
  { value: "booking", label: "Booking" },
  { value: "reengagement", label: "Re-engagement" },
  { value: "other", label: "Other" },
];

export const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "agent", label: "Sales Agent" },
];

export const LEAD_SOURCES = {
  WEBSITE: "Website",
  WELCOME_POPUP: "Welcome Popup",
  CONTACT_PAGE: "Contact Page",
  PROPERTY_DETAIL: "Property Detail",
  PROJECT_DETAIL: "Project Detail",
  HERO_SEARCH: "Hero Search",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  GOOGLE_ADS: "Google Ads",
  WALK_IN: "Walk-in",
  REFERRAL: "Referral",
  WHATSAPP: "WhatsApp",
  MANUAL: "Manual",
  OTHER: "Other",
};

export const WELCOME_POPUP = {
  delaySeconds: 5,
  cooldownDays: 7,
  storageKey: "verdant_popup_seen",
  title: "Looking for your next home?",
  subtitle: "Get a free, hand-picked shortlist of 3 properties matching your needs. Sent within 24 hours.",
  ctaText: "Get my shortlist",
  thanksTitle: "Thanks!",
  thanksMessage: "Our advisor will reach out within 24 hours.",
  benefits: [
    "Curated 3-property shortlist",
    "Walkthrough call with our advisor",
    "Site visit coordination",
  ],
};

export const SITE = {
  name: "Jyothi Properties",
  tagline: "Find your dream home",
  description: "Discover premium properties for sale and rent across major Indian cities.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  established: "2014",
  logoText: "Jyothi",
  logoSub: "Properties",
};

export const CONTACT = {
  phone: "+91 9337104909",
  phoneHref: "tel:+919337104909",
  email: "jyothi.propertyagent@gmail.com",
  emailHref: "mailto:jyothi.propertyagent@gmail.com",
  whatsapp: "+919337104909",
  whatsappHref: "https://wa.me/919337104909",
  address: { line1: "Hyderabad, India", line2: "" },
  hours: "Mon-Sat, 10 AM - 7 PM",
};

export const RERA = { number: "", status: "RERA Registered" };

export const SOCIAL = {
  instagram: "",
  facebook: "",
  youtube: "",
  linkedin: "",
  twitter: "",
};

export const NAV = [
  { label: "Properties", href: "/properties" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_NAV = {
  Explore: [
    { label: "Properties", href: "/properties" },
    { label: "Projects", href: "/projects" },
    { label: "Locations", href: "/locations" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export const NAV_LINKS = NAV;

export const HOME_CATEGORIES = [
  { type: "apartment", name: "Apartments", label: "Apartments", href: "/properties?type=apartment", count: "120+ listings", accent: "City living, ready to move", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80" },
  { type: "villa", name: "Villas", label: "Villas", href: "/properties?type=villa", count: "60+ listings", accent: "Private gardens, luxury living", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" },
  { type: "penthouse", name: "Penthouses", label: "Penthouses", href: "/properties?type=penthouse", count: "30+ listings", accent: "Skyline views, exclusive", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80" },
  { type: "plot", name: "Plots", label: "Plots", href: "/properties?type=plot", count: "40+ listings", accent: "Build your own dream home", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80" },
];

export const HOME_LOCALITIES = [
  { slug: "whitefield", name: "Whitefield", city: "Bengaluru", count: "32", properties: "32", avgPrice: "Rs 1.2 Cr", note: "Tech hub, premium apartments", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80" },
  { slug: "koregaon-park", name: "Koregaon Park", city: "Pune", count: "18", properties: "18", avgPrice: "Rs 2.1 Cr", note: "Tree-lined streets, cosmopolitan", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80" },
  { slug: "gachibowli", name: "Gachibowli", city: "Hyderabad", count: "24", properties: "24", avgPrice: "Rs 1.0 Cr", note: "Financial district, modern living", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80" },
  { slug: "bandra-west", name: "Bandra West", city: "Mumbai", count: "12", properties: "12", avgPrice: "Rs 4.5 Cr", note: "Sea views, vibrant nightlife", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80" },
];

export const HOME_PRINCIPLES = [
  { title: "Curated Inventory", body: "Every property hand-picked. We list fewer, better." },
  { title: "Verified Listings", body: "RERA approved, legal-clear, due-diligence done." },
  { title: "Personal Advisor", body: "One advisor for you - through search, visit, and signing." },
];

export const HOME_TESTIMONIALS = [
  { name: "Rohit Sharma", author: "Rohit Sharma", title: "Software Engineer, Bengaluru", home: "Whitefield, Bengaluru", text: "Excellent service from start to finish.", quote: "Excellent service from start to finish. They understood exactly what my family needed and delivered beyond expectations.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
  { name: "Priya Mehta", author: "Priya Mehta", title: "Doctor, Mumbai", home: "Bandra West, Mumbai", text: "Highly professional team, patient and helpful.", quote: "Highly professional team, patient and helpful through every step of the buying process. Strongly recommend.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" },
];

export const STATS = [
  { value: "500+", label: "Properties listed" },
  { value: "12", label: "Cities covered" },
  { value: "1200+", label: "Happy families" },
];

export const TEAM = [
  { name: "Founder & CEO", role: "10+ years in real estate" },
];

export const SEARCH_TABS = [
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
];

export const BUDGET_RANGES = [
  { value: "", label: "Any budget" },
  { value: "0-50", label: "Up to Rs 50 L" },
  { value: "50-100", label: "Rs 50 L - 1 Cr" },
  { value: "100-200", label: "Rs 1 - 2 Cr" },
  { value: "200-500", label: "Rs 2 - 5 Cr" },
  { value: "500+", label: "Rs 5 Cr+" },
];

export const TRENDING_SEARCHES = ["Whitefield", "Bandra West", "Gachibowli", "Koregaon Park", "HSR Layout"];

export const BEDROOM_OPTIONS = [
  { value: "", label: "Any" },
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4 BHK+" },
];

export const INTENT_OPTIONS = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
];

export const CONTACT_SUBJECTS = [
  "General inquiry", "Property details", "Site visit", "Investment advisory", "Feedback", "Other",
];
export const FOOTER_COLUMNS = [
  { title: "Explore", links: [{ label: "Properties", href: "/properties" }, { label: "Projects", href: "/projects" }, { label: "Locations", href: "/locations" }] },
  { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Blog", href: "/blog" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
];

export const FAQS = [
  { q: "How do I schedule a site visit?", a: "Click the contact form on any property page. Our team will reach out within 24 hours." },
  { q: "Are properties RERA approved?", a: "Yes. We list only RERA-approved properties from verified builders." },
  { q: "Can NRIs purchase?", a: "Yes. We assist with NRI documentation and remote purchase processes." },
];
