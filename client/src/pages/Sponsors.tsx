import { useTranslation } from "react-i18next";
import { SPONSOR_CATEGORIES, Sponsor } from "../data/sponsorsData";
import "../index.css";

/**
 * Sponsors page.
 *
 * Categories and sponsors are defined in src/data/sponsorsData.ts —
 * editing that file is enough to add/remove/recategorize sponsors.
 *
 * The design uses the same dark + yellow border + hover-lift pattern as
 * UserCard / WinnerCard / SketchCard for consistency across the site.
 */
const Sponsors = () => {
  const { t } = useTranslation();

  return (
    <div className="sponsors-container">
      <div className="sponsors-content">
        <h1
          style={{
            fontFamily: "'Permanent Marker', cursive",
            fontSize: "2.5rem",
            color: "#ffcc00",
            textAlign: "center",
            textShadow: "3px 3px 0 rgba(0,0,0,0.7)",
            marginBottom: "0.5rem",
          }}
        >
          {t("sponsors.pageTitle", "Sponsors")}
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#ccc",
            fontSize: "1rem",
            maxWidth: "40rem",
            margin: "0 auto 3rem auto",
            lineHeight: 1.5,
          }}
        >
          {t(
            "sponsors.pageDescription",
            "Las marcas, locales y personas que hacen posible este movimiento. Sin ellos, nada de esto pasa."
          )}
        </p>

        {SPONSOR_CATEGORIES.map((category) => (
          <section
            key={category.titleKey}
            style={{ marginBottom: "3.5rem" }}
          >
            <h2
              style={{
                fontFamily: "'Permanent Marker', cursive",
                fontSize: "1.8rem",
                color: "#ff3b3b",
                textShadow: "2px 2px 0 rgba(0,0,0,0.7)",
                marginBottom: "0.4rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid #ffcc00",
              }}
            >
              {t(category.titleKey, category.fallbackTitle)}
            </h2>
            <p
              style={{
                color: "#aaa",
                fontStyle: "italic",
                marginBottom: "1.5rem",
                fontSize: "0.95rem",
              }}
            >
              {t(category.descriptionKey, category.fallbackDescription)}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(16rem, 1fr))",
                gap: "1.5rem",
              }}
            >
              {category.sponsors.map((sponsor, idx) => (
                <SponsorCard key={`${category.titleKey}-${idx}`} sponsor={sponsor} />
              ))}
            </div>
          </section>
        ))}

        {/* Closing tagline */}
        <div
          style={{
            textAlign: "center",
            marginTop: "4rem",
            padding: "2rem 1rem",
            borderTop: "1px solid #333",
          }}
        >
          <p
            style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: "1.2rem",
              color: "#ffcc00",
              textShadow: "2px 2px 0 rgba(0,0,0,0.7)",
            }}
          >
            {t(
              "sponsors.thanks",
              "¡Gracias a todos por hacer que esto sea posible! 🙌"
            )}
          </p>
          <p
            style={{
              color: "#aaa",
              fontSize: "0.9rem",
              marginTop: "0.5rem",
            }}
          >
            {t(
              "sponsors.becomeOne",
              "¿Te gustaría ser sponsor? Escribinos a través de la página de contacto."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Individual sponsor card. Hover to lift + glow.
 * Wrapped in <a> only when websiteUrl exists, so cards without a link
 * don't get a useless cursor pointer.
 */
const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => {
  const cardContent = (
    <div
      className="sponsor-card"
      style={{
        backgroundColor: "#1a1a1a",
        border: "2px solid #ffcc00",
        borderRadius: "0.4rem",
        padding: "1.25rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
        boxShadow: "3px 3px 0 rgba(0,0,0,0.6)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        textAlign: "center",
        textDecoration: "none",
        color: "#f0f0f0",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "8rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d0d0d",
          borderRadius: "0.3rem",
          padding: "0.5rem",
          overflow: "hidden",
        }}
      >
        <img
          src={sponsor.logoUrl}
          alt={sponsor.name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      <h3
        style={{
          margin: 0,
          fontFamily: "'Permanent Marker', cursive",
          fontSize: "1.1rem",
          color: "#ffcc00",
          letterSpacing: "0.04em",
          textShadow: "1px 1px 0 rgba(0,0,0,0.7)",
        }}
      >
        {sponsor.name}
      </h3>

      {sponsor.description && (
        <p
          style={{
            margin: 0,
            color: "#ccc",
            fontSize: "0.85rem",
            lineHeight: 1.4,
          }}
        >
          {sponsor.description}
        </p>
      )}
    </div>
  );

  if (sponsor.websiteUrl) {
    return (
      <a
        href={sponsor.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "block" }}
        title={`Visitar sitio de ${sponsor.name}`}
      >
        {cardContent}
      </a>
    );
  }
  return cardContent;
};

export default Sponsors;
