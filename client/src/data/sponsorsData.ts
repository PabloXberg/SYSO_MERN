/**
 * Sponsors data — edit this file when you have real info.
 *
 * Each sponsor object needs:
 *   - name:        Display name (string, required)
 *   - logoUrl:     URL to the logo (any image URL — Cloudinary, /public/images, etc)
 *   - websiteUrl:  Where clicking the logo takes the user (optional)
 *   - description: Short text about the sponsor (optional, English/Spanish)
 *
 * To add a sponsor: copy one of the {} blocks and fill it in.
 * To remove one: delete the whole {} block.
 * To re-categorize: move the block to a different category array below.
 *
 * For logos, the easiest path:
 *   1. Save logo as PNG/JPG in client/src/images/sponsors/
 *   2. Import it at the top of this file:
 *        import logoXyz from "../images/sponsors/xyz.png";
 *   3. Use it as logoUrl: logoXyz
 *
 * Or use a remote URL directly (Cloudinary, sponsor's own site, etc).
 */

export interface Sponsor {
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
}

export interface SponsorCategory {
  /** i18n key for the category title — add the translation in es.json/en.json */
  titleKey: string;
  /** Fallback title if i18n key is missing */
  fallbackTitle: string;
  /** Short description shown under the title */
  descriptionKey: string;
  fallbackDescription: string;
  sponsors: Sponsor[];
}

// Generic placeholder image — replace with real logos when you have them
const PLACEHOLDER_LOGO =
  "https://via.placeholder.com/300x200/1a1a1a/ffcc00?text=LOGO";

export const SPONSOR_CATEGORIES: SponsorCategory[] = [
  {
    titleKey: "sponsors.mainSponsorsTitle",
    fallbackTitle: "Sponsors Principales",
    descriptionKey: "sponsors.mainSponsorsDescription",
    fallbackDescription:
      "Marcas que hacen posible cada edición de Share Your Sketch",
    sponsors: [
      {
        name: "Sponsor Principal 1",
        logoUrl: PLACEHOLDER_LOGO,
        websiteUrl: "https://example.com",
        description: "Ejemplo: Montana Colors — proveedor oficial de aerosoles",
      },
      {
        name: "Sponsor Principal 2",
        logoUrl: PLACEHOLDER_LOGO,
        websiteUrl: "https://example.com",
        description: "Otro sponsor principal",
      },
      {
        name: "Sponsor Principal 3",
        logoUrl: PLACEHOLDER_LOGO,
        websiteUrl: "https://example.com",
      },
    ],
  },
  {
    titleKey: "sponsors.localsTitle",
    fallbackTitle: "Locales que nos apoyan",
    descriptionKey: "sponsors.localsDescription",
    fallbackDescription:
      "Bares, espacios y comercios de Valencia que nos abren sus puertas",
    sponsors: [
      {
        name: "Local 1",
        logoUrl: PLACEHOLDER_LOGO,
        websiteUrl: "https://example.com",
        description: "Pulso Pub — sede de eventos",
      },
      {
        name: "Local 2",
        logoUrl: PLACEHOLDER_LOGO,
        websiteUrl: "https://example.com",
        description: "Kaf Café",
      },
      {
        name: "Local 3",
        logoUrl: PLACEHOLDER_LOGO,
        description: "La Finestra",
      },
      {
        name: "Local 4",
        logoUrl: PLACEHOLDER_LOGO,
        description: "London — est. 2010",
      },
    ],
  },
  {
    titleKey: "sponsors.brandsTitle",
    fallbackTitle: "Marcas Colaboradoras",
    descriptionKey: "sponsors.brandsDescription",
    fallbackDescription:
      "Marcas que aportan productos para premios y experiencias",
    sponsors: [
      {
        name: "Marca 1",
        logoUrl: PLACEHOLDER_LOGO,
        websiteUrl: "https://example.com",
        description: "Jameson Irish Whiskey",
      },
      {
        name: "Marca 2",
        logoUrl: PLACEHOLDER_LOGO,
        websiteUrl: "https://example.com",
        description: "Zeta Beer Co.",
      },
      {
        name: "Marca 3",
        logoUrl: PLACEHOLDER_LOGO,
        description: "Garbo",
      },
      {
        name: "Marca 4",
        logoUrl: PLACEHOLDER_LOGO,
        description: "Black Hat",
      },
    ],
  },
  {
    titleKey: "sponsors.mediaTitle",
    fallbackTitle: "Medios y Difusión",
    descriptionKey: "sponsors.mediaDescription",
    fallbackDescription:
      "Plataformas que nos ayudan a llegar a más artistas",
    sponsors: [
      {
        name: "Medio 1",
        logoUrl: PLACEHOLDER_LOGO,
        websiteUrl: "https://example.com",
        description: "Hip Hop Kultura",
      },
      {
        name: "Medio 2",
        logoUrl: PLACEHOLDER_LOGO,
        description: "Free Style 130",
      },
    ],
  },
];
