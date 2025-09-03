import { AuthProviderEnum, Prisma, PrismaClient, RolesEnum } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export default async (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`TRUNCATE TABLE "Templates" RESTART IDENTITY CASCADE;`);
  
    await tx.templates.createMany({
      data: [
        // Wedding Templates
        {
          slug: "wed-colorfull-romance",
          name: "Romance Colorfull",
          price: 159000,
          disc_price: null,
          desc: "Celebrate your love story with this romantic, colorful design featuring elegant layouts and joyful accents perfect for modern weddings.",
          ctg_key: "wed",
          ctg_name: "Wedding",
          url: "/templates/wedding/romance-colorfull",
          flag_name: "New",
          flag_color: "danger",
          is_active: true,
          createdBy: "SEEDER"
        },
        {
          slug: "wed-minimalist-elegance",
          name: "Minimalist Elegance",
          price: 159000,
          disc_price: 30000,
          desc: "Designed for couples who appreciate simplicity, this minimalist wedding theme delivers elegance with a clean and timeless aesthetic.",
          ctg_key: "wed",
          ctg_name: "Wedding",
          url: "/templates/wedding/minimalist-elegance",
          flag_name: "Promo",
          flag_color: "success",
          is_active: true,
          createdBy: "SEEDER"
        },
        {
          slug: "wed-garden-glow",
          name: "Garden Glow",
          price: 159000,
          disc_price: 20000,
          desc: "Infused with floral elegance and natural tones, Garden Glow brings the outdoors into your wedding design with a fresh and charming look.",
          ctg_key: "wed",
          ctg_name: "Wedding",
          url: "/templates/wedding/garden-glow",
          flag_name: "Popular",
          flag_color: "warning",
          is_active: true,
          createdBy: "SEEDER"
        },

        // Birthday Templates
        {
          slug: "bth-candyland-dream",
          name: "Candyland Dream",
          price: 159000,
          disc_price: null,
          desc: "A vibrant and sweet birthday theme inspired by candylands, perfect for kids and dreamers who want a playful and colorful celebration.",
          ctg_key: "bth",
          ctg_name: "Birthday",
          url: "/templates/birthday/candyland-dream",
          flag_name: "New",
          flag_color: "danger",
          is_active: true,
          createdBy: "SEEDER"
        },
        {
          slug: "bth-retro-vibes",
          name: "Retro Vibes",
          price: 159000,
          disc_price: 20000,
          desc: "Bring back the funky charm of the 70s and 80s with this retro-themed birthday template featuring bold colors and nostalgic patterns.",
          ctg_key: "bth",
          ctg_name: "Birthday",
          url: "/templates/birthday/retro-vibes",
          flag_name: "Promo",
          flag_color: "success",
          is_active: true,
          createdBy: "SEEDER"
        },
        {
          slug: "bth-glow-party",
          name: "Glow Party",
          price: 159000,
          disc_price: 25000,
          desc: "Light up the night with a glow-in-the-dark birthday invitation, combining neon elements and electric vibes for a high-energy celebration.",
          ctg_key: "bth",
          ctg_name: "Birthday",
          url: "/templates/birthday/glow-party",
          flag_name: "Hot",
          flag_color: "danger",
          is_active: true,
          createdBy: "SEEDER"
        },

        // Parties Templates
        {
          slug: "pts-summer-bliss",
          name: "Summer Bliss",
          price: 159000,
          disc_price: null,
          desc: "Capture the sunshine and beach vibes with this summer party design, ideal for pool parties, barbecues, and tropical celebrations.",
          ctg_key: "pts",
          ctg_name: "Parties",
          url: "/templates/parties/summer-bliss",
          flag_name: "New",
          flag_color: "danger",
          is_active: true,
          createdBy: "SEEDER"
        },
        {
          slug: "pts-masquerade-magic",
          name: "Masquerade Magic",
          price: 159000,
          disc_price: 30000,
          desc: "Elegant and mysterious, this masquerade invitation theme blends luxurious colors with mask graphics for an unforgettable party experience.",
          ctg_key: "pts",
          ctg_name: "Parties",
          url: "/templates/parties/masquerade-magic",
          flag_name: "Popular",
          flag_color: "warning",
          is_active: true,
          createdBy: "SEEDER"
        },
        {
          slug: "pts-vintage-night",
          name: "Vintage Night",
          price: 159000,
          disc_price: 15000,
          desc: "A throwback to classic celebrations with stylish vintage fonts, sepia tones, and timeless decorative touches for your special party.",
          ctg_key: "pts",
          ctg_name: "Parties",
          url: "/templates/parties/vintage-night",
          flag_name: "Classic",
          flag_color: "secondary",
          is_active: true,
          createdBy: "SEEDER"
        },

        // Meeting Templates
        {
          slug: "mti-corporate-clean",
          name: "Corporate Clean",
          price: 159000,
          disc_price: null,
          desc: "A sleek and professional layout for business meetings, online webinars, or formal corporate events with clear structure and branding.",
          ctg_key: "mti",
          ctg_name: "Meeting",
          url: "/templates/meeting/corporate-clean",
          flag_name: "New",
          flag_color: "danger",
          is_active: true,
          createdBy: "SEEDER"
        },
        {
          slug: "mti-tech-connect",
          name: "Tech Connect",
          price: 159000,
          disc_price: 20000,
          desc: "Perfect for tech conferences and startups, this modern design uses gradients and clean lines to create a futuristic impression.",
          ctg_key: "mti",
          ctg_name: "Meeting",
          url: "/templates/meeting/tech-connect",
          flag_name: "Promo",
          flag_color: "success",
          is_active: true,
          createdBy: "SEEDER"
        },
        {
          slug: "mti-minimal-pro",
          name: "Minimal Pro",
          price: 159000,
          disc_price: 10000,
          desc: "Designed for serious professionals, Minimal Pro keeps the invitation clean and elegant while staying informative and business-friendly.",
          ctg_key: "mti",
          ctg_name: "Meeting",
          url: "/templates/meeting/minimal-pro",
          flag_name: "Elegant",
          flag_color: "secondary",
          is_active: true,
          createdBy: "SEEDER"
        },

        // Gathering Templates
        {
          slug: "gth-family-day",
          name: "Family Day",
          price: 159000,
          disc_price: null,
          desc: "Warm and friendly, this design is ideal for family reunions and gatherings, focusing on fun, food, and heartfelt moments.",
          ctg_key: "gth",
          ctg_name: "Gathering",
          url: "/templates/gathering/family-day",
          flag_name: "Warm",
          flag_color: "warning",
          is_active: true,
          createdBy: "SEEDER"
        },
        {
          slug: "gth-community-bond",
          name: "Community Bond",
          price: 159000,
          disc_price: 15000,
          desc: "Celebrate community and togetherness with a clean and inclusive template, perfect for RT/RW events, reunions, and local meetups.",
          ctg_key: "gth",
          ctg_name: "Gathering",
          url: "/templates/gathering/community-bond",
          flag_name: "Promo",
          flag_color: "success",
          is_active: true,
          createdBy: "SEEDER"
        },
        {
          slug: "gth-picnic-chill",
          name: "Picnic Chill",
          price: 159000,
          disc_price: 10000,
          desc: "Relax and unwind with this cozy picnic-themed template, ideal for casual hangouts in the park or potluck-style gatherings.",
          ctg_key: "gth",
          ctg_name: "Gathering",
          url: "/templates/gathering/picnic-chill",
          flag_name: "New",
          flag_color: "danger",
          is_active: true,
          createdBy: "SEEDER"
        }
      ]
    });
  });
  console.log('Multiple Template Created!');
};