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
          short_desc: "Celebrate your love with vibrant colors and elegant design.",
          desc: "<h1 style=\"text-align: center;\">Romance Colorfull: A Burst of Love in Vibrant Hues</h1><p style=\"text-align: left;\">The <strong>Romance Colorfull</strong> wedding template is the perfect choice for couples who want their special day to shine with <em>vivid elegance</em>. Its bold color palette combined with refined layouts creates a festive yet classy atmosphere. This design is not only visually stunning but also versatile, making it suitable for both indoor and outdoor celebrations.</p><h2 style=\"text-align: left;\">Highlights:</h2><ul><li>Eye-catching vibrant colors with elegant contrasts</li><li>Responsive design for mobile and desktop</li><li>Customizable sections for love stories, photo galleries, and RSVP</li><li>High-quality typography that adds sophistication</li></ul><h3 style=\"text-align: left;\">Perfect For:</h3><ol><li>Couples who love festive and colorful themes</li><li>Weddings with outdoor or garden settings</li><li>Those who want an elegant yet playful touch</li></ol><p style=\"text-align: center;\"><em>“The colors made our wedding invitation unforgettable and so full of life!”</em> — <strong>Amelia &amp; Ryan</strong></p>",
          ctg_key: "wed",
          ctg_name: "Wedding",
          url: "templates/wedding/romance-colorfull",
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
          short_desc: "Clean and timeless for couples who love simplicity.",
          desc: "<h1 style=\"text-align: center;\">Minimalist Elegance: Pure Sophistication in Simplicity</h1><p style=\"text-align: left;\">The <strong>Minimalist Elegance</strong> template embraces the philosophy of <em>less is more</em>. With clean lines, balanced white spaces, and timeless typography, it sets the perfect tone for modern weddings. Every detail is thoughtfully crafted to deliver sophistication without overwhelming visuals.</p><h2 style=\"text-align: left;\">Key Features:</h2><ul><li>Minimalist layout with elegant finishing</li><li>Focus on typography and white space</li><li>Custom sections for vows, RSVP, and event details</li><li>Optimized for digital sharing and printing</li></ul><h3 style=\"text-align: left;\">Ideal For:</h3><ol><li>Couples who value simplicity and refinement</li><li>Formal and modern-style weddings</li><li>Those seeking timeless, clutter-free designs</li></ol><p style=\"text-align: center;\"><em>“Sleek, beautiful, and so timeless. It perfectly reflected our style.”</em> — <strong>Daniel &amp; Sophia</strong></p>",
          ctg_key: "wed",
          ctg_name: "Wedding",
          url: "templates/wedding/minimalist-elegance",
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
          short_desc: "Fresh floral tones for a charming outdoor-inspired wedding.",
          desc: "<h1 style=\"text-align: center;\">Garden Glow: Nature-Inspired Elegance for Your Wedding</h1><p style=\"text-align: left;\">With <strong>Garden Glow</strong>, your wedding invitation radiates the warmth of nature and the charm of outdoor romance. Designed with floral accents, subtle greenery, and glowing highlights, this template captures the essence of a magical garden wedding.</p><h2 style=\"text-align: left;\">Benefits:</h2><ul><li>Floral patterns with glowing accents</li><li>Perfect balance of elegance and natural tones</li><li>Interactive RSVP and guestbook features</li><li>Beautiful photo gallery integration</li></ul><h3 style=\"text-align: left;\">Best Suited For:</h3><ol><li>Outdoor or garden-themed weddings</li><li>Couples who love floral and nature-inspired styles</li><li>Romantic celebrations under the stars</li></ol><p style=\"text-align: center;\"><em>“It made our wedding feel like a dreamy garden fairytale.”</em> — <strong>Clara &amp; James</strong></p>",
          ctg_key: "wed",
          ctg_name: "Wedding",
          url: "templates/wedding/garden-glow",
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
          short_desc: "Sweet and playful theme inspired by colorful candylands.",
          desc: "<h1 style=\"text-align: center;\">Candyland Dream: A Sweet Adventure for Birthday Celebrations</h1><p style=\"text-align: left;\">Bring joy and excitement to your special day with the <strong>Candyland Dream</strong> template. Packed with playful colors, candy-inspired visuals, and whimsical patterns, this design is sure to delight guests of all ages.</p><h2 style=\"text-align: left;\">Features:</h2><ul><li>Bright and colorful candy-inspired illustrations</li><li>Interactive layout for event details</li><li>Customizable banners and greetings</li><li>Optimized for kids and adult birthdays</li></ul><h3 style=\"text-align: left;\">Great For:</h3><ol><li>Children’s birthday parties</li><li>Fun, playful adult celebrations</li><li>Colorful and imaginative event themes</li></ol><p style=\"text-align: center;\"><em>“Our kids loved it—so vibrant and full of fun!”</em> — <strong>Sarah, Mom of 2</strong></p>",
          ctg_key: "bth",
          ctg_name: "Birthday",
          url: "templates/birthday/candyland-dream",
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
          short_desc: "Bold and nostalgic design with 70s-80s retro charm.",
          desc: "<h1 style=\"text-align: center;\">Retro Vibes: Bold Nostalgia for Timeless Celebrations</h1><p style=\"text-align: left;\">Step back in time with <strong>Retro Vibes</strong>. Inspired by the energy of the 70s and 80s, this template combines bold typography, funky colors, and nostalgic graphics. Perfect for birthdays that want to add a classic yet cool twist.</p><h2 style=\"text-align: left;\">Highlights:</h2><ul><li>Retro-inspired typography and layouts</li><li>Bright neon and pastel color combinations</li><li>Dynamic animations for digital invites</li><li>Custom sections for music and moodboard</li></ul><h3 style=\"text-align: left;\">Perfect For:</h3><ol><li>70s or 80s-themed birthdays</li><li>Retro lovers and nostalgic parties</li><li>Celebrations with disco or funk vibes</li></ol><p style=\"text-align: center;\"><em>“It brought the retro party vibe alive—we felt like rockstars!”</em> — <strong>Michael D.</strong></p>",
          ctg_key: "bth",
          ctg_name: "Birthday",
          url: "templates/birthday/retro-vibes",
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
          short_desc: "Neon lights and electric vibes for a glowing celebration.",
          desc: "<h1 style=\"text-align: center;\">Glow Party: Neon Lights &amp; Electrifying Energy</h1><p style=\"text-align: left;\">Light up the night with the <strong>Glow Party</strong> template. Featuring neon designs, glowing borders, and futuristic graphics, it delivers an electrifying mood for unforgettable birthday nights.</p><h2 style=\"text-align: left;\">Why You'll Love It:</h2><ul><li>High-impact neon designs</li><li>Dynamic animations for digital invitations</li><li>Customizable party schedule and RSVP</li><li>Perfectly suited for night-time celebrations</li></ul><h3 style=\"text-align: left;\">Ideal For:</h3><ol><li>Glow-in-the-dark parties</li><li>Clubbing or night-themed birthdays</li><li>Celebrations that thrive with lights and music</li></ol><p style=\"text-align: center;\"><em>“The neon lights made our birthday feel like a club party!”</em> — <strong>Vanessa K.</strong></p>",
          ctg_key: "bth",
          ctg_name: "Birthday",
          url: "templates/birthday/glow-party",
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
          short_desc: "Sunny, beachy design perfect for tropical parties.",
          desc: "<h1 style=\"text-align: center;\">Summer Bliss: Tropical Sunshine for Unforgettable Parties</h1><p style=\"text-align: left;\">Celebrate under the sun with the <strong>Summer Bliss</strong> template. Filled with beachy vibes, palm accents, and vibrant sunny tones, this design sets the stage for a refreshing tropical getaway.</p><h2 style=\"text-align: left;\">Features:</h2><ul><li>Bright summer-inspired palette</li><li>Fun beach icons and patterns</li><li>Interactive RSVP and map integration</li><li>Perfect for outdoor and seaside events</li></ul><h3 style=\"text-align: left;\">Great For:</h3><ol><li>Beach and pool parties</li><li>Summer festivals</li><li>Tropical-inspired events</li></ol><p style=\"text-align: center;\"><em>“It turned our summer party into a mini vacation.”</em> — <strong>Liam &amp; Friends</strong></p>",
          ctg_key: "pts",
          ctg_name: "Parties",
          url: "templates/parties/summer-bliss",
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
          short_desc: "Luxurious and mysterious with elegant mask elements.",
          desc: "<h1 style=\"text-align: center;\">Masquerade Magic: Mysterious Elegance Meets Glamour</h1><p style=\"text-align: left;\">Step into a world of mystery with <strong>Masquerade Magic</strong>. Designed with luxurious patterns, dark tones, and elegant masks, this template brings sophistication and intrigue to any celebration.</p><h2 style=\"text-align: left;\">Advantages:</h2><ul><li>Rich, luxurious patterns</li><li>Mystical mask illustrations</li><li>Gold and black accented designs</li><li>Perfect for upscale parties</li></ul><h3 style=\"text-align: left;\">Best For:</h3><ol><li>Masquerade-themed parties</li><li>Luxury gala events</li><li>Formal yet mysterious celebrations</li></ol><p style=\"text-align: center;\"><em>“The masks and colors created such a classy vibe.”</em> — <strong>Isabella M.</strong></p>",
          ctg_key: "pts",
          ctg_name: "Parties",
          url: "templates/parties/masquerade-magic",
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
          short_desc: "Classic celebration with vintage tones and style.",
          desc: "<h1 style=\"text-align: center;\">Vintage Night: Timeless Celebrations with Classic Style</h1><p style=\"text-align: left;\">The <strong>Vintage Night</strong> template revives old-world charm with muted tones, classic patterns, and nostalgic typography. It's the perfect choice for those who love elegance wrapped in history.</p><h2 style=\"text-align: left;\">Highlights:</h2><ul><li>Classic vintage layouts</li><li>Elegant retro typography</li><li>Customizable photo sections</li><li>Perfect blend of nostalgia and elegance</li></ul><h3 style=\"text-align: left;\">Best Suited For:</h3><ol><li>Vintage-themed parties</li><li>Classic evening celebrations</li><li>Retro-inspired events</li></ol><p style=\"text-align: center;\"><em>“It felt like stepping into a glamorous past.”</em> — <strong>George &amp; Emma</strong></p>",
          ctg_key: "pts",
          ctg_name: "Parties",
          url: "templates/parties/vintage-night",
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
          short_desc: "Professional and sleek layout for formal events.",
          desc: "<h1 style=\"text-align: center;\">Corporate Clean: Professional Layout for Modern Meetings</h1><p style=\"text-align: left;\">The <strong>Corporate Clean</strong> template offers a sleek and efficient design for businesses and formal gatherings. With sharp lines, modern typography, and a polished layout, it delivers professionalism at its finest.</p><h2 style=\"text-align: left;\">Advantages:</h2><ul><li>Clean and sharp layouts</li><li>Business-focused color palette</li><li>Easy customization for agendas and speakers</li><li>Optimized for corporate presentations</li></ul><h3 style=\"text-align: left;\">Perfect For:</h3><ol><li>Corporate meetings</li><li>Seminars and conferences</li><li>Professional networking events</li></ol><p style=\"text-align: center;\"><em>“It made our company event look so professional and modern.”</em> — <strong>Corporate Client</strong></p>",
          ctg_key: "mti",
          ctg_name: "Meeting",
          url: "templates/meeting/corporate-clean",
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
          short_desc: "Modern, techy look with gradients and clean lines.",
          desc: "<h1 style=\"text-align: center;\">Tech Connect: Modern Design for Innovative Events</h1><p style=\"text-align: left;\">The <strong>Tech Connect</strong> template is built for the digital era. With futuristic gradients, minimal layouts, and interactive sections, it is ideal for events that emphasize technology and innovation.</p><h2 style=\"text-align: left;\">Highlights:</h2><ul><li>Modern, futuristic gradients</li><li>Clean lines and geometric accents</li><li>Interactive sections for agenda and speakers</li><li>Fully responsive across devices</li></ul><h3 style=\"text-align: left;\">Perfect For:</h3><ol><li>Tech conferences</li><li>Startup pitch events</li><li>Innovation-focused meetings</li></ol><p style=\"text-align: center;\"><em>“It reflected our innovative spirit perfectly.”</em> — <strong>Tech Event Organizer</strong></p>",
          ctg_key: "mti",
          ctg_name: "Meeting",
          url: "templates/meeting/tech-connect",
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
          short_desc: "Clean and elegant for business-focused invitations.",
          desc: "<h1 style=\"text-align: center;\">Minimal Pro: Sleek &amp; Elegant Invitations for Business</h1><p style=\"text-align: left;\">Designed with simplicity and professionalism, the <strong>Minimal Pro</strong> template is perfect for business invitations. Its clean layouts, elegant fonts, and subtle tones make communication professional yet stylish.</p><h2 style=\"text-align: left;\">Key Features:</h2><ul><li>Minimalist yet elegant design</li><li>Customizable agenda and RSVP</li><li>Responsive and easy to share</li><li>Focus on clarity and simplicity</li></ul><h3 style=\"text-align: left;\">Best For:</h3><ol><li>Business meetings</li><li>Corporate invitations</li><li>Formal announcements</li></ol><p style=\"text-align: center;\"><em>“It gave our meeting invitations a polished and elegant look.”</em> — <strong>Business Host</strong></p>",
          ctg_key: "mti",
          ctg_name: "Meeting",
          url: "templates/meeting/minimal-pro",
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
          short_desc: "Friendly and fun, perfect for family get-togethers.",
          desc: "<h1 style=\"text-align: center;\">Family Day: Togetherness and Joy in Every Design</h1><p style=\"text-align: left;\">The <strong>Family Day</strong> template is designed to celebrate bonds of love and togetherness. With cheerful colors, playful icons, and a welcoming layout, it is the perfect choice for family gatherings of all sizes.</p><h2 style=\"text-align: left;\">Why You'll Love It:</h2><ul><li>Friendly and welcoming visuals</li><li>Playful, family-oriented layouts</li><li>Customizable sections for schedules and activities</li><li>Optimized for digital and print sharing</li></ul><h3 style=\"text-align: left;\">Perfect For:</h3><ol><li>Family reunions</li><li>Holiday gatherings</li><li>Community-based family events</li></ol><p style=\"text-align: center;\"><em>“It made our reunion feel warm and connected.”</em> — <strong>The Johnson Family</strong></p>",
          ctg_key: "gth",
          ctg_name: "Gathering",
          url: "templates/gathering/family-day",
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
          short_desc: "Inclusive design for local or community events.",
          desc: "<h1 style=\"text-align: center;\">Community Bond: Celebrating Unity &amp; Togetherness</h1><p style=\"text-align: left;\">With <strong>Community Bond</strong>, highlight inclusivity and togetherness in your gatherings. Its design focuses on diverse colors, collaborative layouts, and friendly tones to bring communities closer.</p><h2 style=\"text-align: left;\">Features:</h2><ul><li>Inclusive, diverse design elements</li><li>Bright, welcoming colors</li><li>Sections for community highlights</li><li>Easy customization for local needs</li></ul><h3 style=\"text-align: left;\">Ideal For:</h3><ol><li>Community events</li><li>Neighborhood gatherings</li><li>Local celebrations</li></ol><p style=\"text-align: center;\"><em>“It truly reflected the unity of our community.”</em> — <strong>Community Leader</strong></p>",
          ctg_key: "gth",
          ctg_name: "Gathering",
          url: "templates/gathering/community-bond",
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
          short_desc: "Cozy and relaxed for outdoor picnics and casual hangs.",
          desc: "<h1 style=\"text-align: center;\">Picnic Chill: Cozy Design for Relaxed Gatherings</h1><p style=\"text-align: left;\">The <strong>Picnic Chill</strong> template is all about comfort and ease. Inspired by outdoor leisure, it features warm colors, picnic motifs, and a casual layout that perfectly sets the tone for laid-back events.</p><h2 style=\"text-align: left;\">Advantages:</h2><ul><li>Relaxed, cozy layouts</li><li>Nature-inspired picnic accents</li><li>Customizable food and activity sections</li><li>Perfect for casual outdoor sharing</li></ul><h3 style=\"text-align: left;\">Best For:</h3><ol><li>Picnic gatherings</li><li>Outdoor casual hangouts</li><li>Weekend family or friend events</li></ol><p style=\"text-align: center;\"><em>“It matched our picnic vibe perfectly.”</em> — <strong>Emily &amp; Friends</strong></p>",
          ctg_key: "gth",
          ctg_name: "Gathering",
          url: "templates/gathering/picnic-chill",
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