// Blog posts (journal entries) - short editorial content.

const POSTS = [
  {
    id: "post-1",
    slug: "buying-property-in-bengaluru-2026",
    title: "Buying property in Bengaluru in 2026: a practical guide",
    excerpt:
      "What's changed since 2024, what to watch for in the new RERA amendments, and how to negotiate when inventory is tight.",
    content: `
The Bengaluru property market in 2026 is markedly different from what we saw two years ago. Here's what we've learned from advising 240 families through their purchases this year.

## Inventory is tight, but not uniformly

The narrative of "Bengaluru is sold out" needs nuance. South Bengaluru and Whitefield are tight; North Bengaluru and Sarjapur Road have inventory. We've found buyers excellent value just 4 km from the high-demand zones.

## RERA amendments to know

The 2025 RERA amendments tightened the definition of "common areas" in carpet area calculations. This benefits buyers - the carpet area you see on the brochure is now closer to what you'll actually use.

## How to negotiate

Builders won't move on base price, but most will give you GST rebates, registration support, and free upgrades. We've seen 4-7% effective discount through these levers.

## Our advice

Go with developers who've delivered at least three projects in the last five years. New entrants are tempting on price, but the delivery risk is real.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1600&q=85",
    author: "Ankit Sharma",
    authorImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    category: "Buyer Guide",
    readTime: "6 min read",
    publishedAt: "2026-04-12",
    isPublished: true,
  },
  {
    id: "post-2",
    slug: "what-i-look-for-in-a-floor-plan",
    title: "What I look for in a floor plan (besides square footage)",
    excerpt:
      "Eleven years of advising buyers has taught me to read floor plans the way a director reads a script - for the things that aren't there.",
    content: `
The first thing I check on a floor plan isn't the room sizes. It's the wall thickness - because that tells me whether the builder is using AAC blocks or solid concrete. AAC blocks mean better thermal insulation. Solid concrete means better sound insulation.

## Cross-ventilation, always

If both bedrooms only open to one side of the building, you'll have stale air no matter how good the ducting is. Look for openings on at least two sides of the unit.

## The bathroom rule

Door swings matter. If the bathroom door swings outward, you can fit a wardrobe in the bedroom. If it swings inward, you cannot.

## Storage you can't see

Look for nooks under stairs, behind doors, and in corridors. The square footage on the brochure includes the corridor, but bad floor plans waste it. Good ones use it.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85",
    author: "Priya Iyer",
    authorImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    category: "Architecture",
    readTime: "4 min read",
    publishedAt: "2026-03-28",
    isPublished: true,
  },
  {
    id: "post-3",
    slug: "the-quiet-power-of-the-pre-launch",
    title: "The quiet power of the pre-launch (and why we recommend it)",
    excerpt:
      "Pre-launch pricing is real, but only if you know what you're buying. Here's how to evaluate.",
    content: `
Pre-launch usually means 8-15% below launch prices. Most buyers pass because of "RERA risk" - but RERA registration in pre-launch is now mandatory in most states. The actual risk is delay, not regulation.

## Three things to verify

1. Land title documents (and not just the sale deed)
2. Encumbrance certificate for last 30 years
3. Approval status with the local development authority

If all three check out, pre-launch is one of the few places left in 2026 where you can earn 15% on day one.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    author: "Vikram Suri",
    authorImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    category: "Investment",
    readTime: "5 min read",
    publishedAt: "2026-03-05",
    isPublished: true,
  },
  {
    id: "post-4",
    slug: "indiranagar-rediscovered",
    title: "Indiranagar, rediscovered",
    excerpt:
      "After two years of construction chaos, the metro is open and the neighbourhood is settling into a new rhythm.",
    content: `
Indiranagar has been the most-debated neighbourhood in Bengaluru for the last decade. What used to be quiet residential streets became a restaurant district, then a brewery district, then a traffic nightmare.

The metro changes things. With the Purple Line now operational on 100 Feet Road, the through-traffic is finally easing.

## What it means for buyers

Inventory is opening up. Old residents who were waiting for the construction to end are now selling. Prices are still high but the negotiation room is wider than it's been in years.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=85",
    author: "Ankit Sharma",
    authorImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    category: "Neighbourhood",
    readTime: "3 min read",
    publishedAt: "2026-02-18",
    isPublished: true,
  },
];

function toPublicShape(p) {
  if (!p) return null;
  const { id, isPublished, ...rest } = p;
  return rest;
}

export async function getPosts({ limit = 10, offset = 0, category } = {}) {
  await new Promise((r) => setTimeout(r, 0));
  let results = POSTS.filter((p) => p.isPublished);
  if (category) results = results.filter((p) => p.category === category);
  results.sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  return {
    total: results.length,
    items: results.slice(offset, offset + limit).map(toPublicShape),
  };
}

export async function getPostBySlug(slug) {
  await new Promise((r) => setTimeout(r, 0));
  const post = POSTS.find((p) => p.slug === slug && p.isPublished);
  return post ? toPublicShape(post) : null;
}

export async function getRelatedPosts(slug, limit = 3) {
  await new Promise((r) => setTimeout(r, 0));
  const current = POSTS.find((p) => p.slug === slug);
  if (!current) return [];
  return POSTS.filter(
    (p) =>
      p.slug !== slug &&
      p.isPublished &&
      p.category === current.category
  )
    .slice(0, limit)
    .map(toPublicShape);
}
