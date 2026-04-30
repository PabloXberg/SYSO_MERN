import { useTranslation } from "react-i18next";
import "../index.css";

/**
 * Contact page — fully static.
 *
 * To update contact info: edit the constants right below this comment.
 * No backend required, no form submissions, just info cards with links.
 */

const CONTACT_EMAIL = "info@shareyoursketch.com";
const INSTAGRAM_URL = "https://instagram.com/shareyoursketch";
const INSTAGRAM_HANDLE = "@shareyoursketch";
const TELEGRAM_URL = ""; // leave empty to hide the Telegram card
const WHATSAPP_URL = ""; // leave empty to hide the WhatsApp card
const CITY = "Valencia, España";
// Optional Google Maps embed — leave empty to hide the map section
const GOOGLE_MAPS_EMBED = "";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-container">
      <div className="contact-content">
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
          {t("contact.pageTitle", "Contacto")}
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
            "contact.pageDescription",
            "Querés colaborar, ser sponsor, o simplemente saludar? Te leemos."
          )}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* EMAIL */}
          <ContactCard
            icon="📧"
            title={t("contact.email", "Email")}
            href={`mailto:${CONTACT_EMAIL}`}
            value={CONTACT_EMAIL}
            description={t(
              "contact.emailDescription",
              "Para cualquier consulta, propuesta o colaboración"
            )}
            accentColor="#ffcc00"
          />

          {/* INSTAGRAM */}
          <ContactCard
            icon="📷"
            title="Instagram"
            href={INSTAGRAM_URL}
            value={INSTAGRAM_HANDLE}
            description={t(
              "contact.instagramDescription",
              "Seguinos para no perderte nada de lo que pasa"
            )}
            accentColor="#e1306c"
            external
          />

          {/* TELEGRAM (only if set) */}
          {TELEGRAM_URL && (
            <ContactCard
              icon="✈️"
              title="Telegram"
              href={TELEGRAM_URL}
              value={t("contact.joinChannel", "Unirse al canal")}
              description={t(
                "contact.telegramDescription",
                "Avisos rápidos sobre eventos y batallas"
              )}
              accentColor="#26a5e4"
              external
            />
          )}

          {/* WHATSAPP (only if set) */}
          {WHATSAPP_URL && (
            <ContactCard
              icon="💬"
              title="WhatsApp"
              href={WHATSAPP_URL}
              value={t("contact.sendMessage", "Enviá un mensaje")}
              description={t(
                "contact.whatsappDescription",
                "Para temas más rápidos o personales"
              )}
              accentColor="#25d366"
              external
            />
          )}

          {/* LOCATION */}
          <ContactCard
            icon="📍"
            title={t("contact.location", "Ubicación")}
            value={CITY}
            description={t(
              "contact.locationDescription",
              "Nuestra base. Los eventos suelen ser acá."
            )}
            accentColor="#39ff14"
          />
        </div>

        {/* OPTIONAL EMBEDDED MAP */}
        {GOOGLE_MAPS_EMBED && (
          <div
            style={{
              marginTop: "2rem",
              border: "2px solid #ffcc00",
              borderRadius: "0.4rem",
              overflow: "hidden",
              boxShadow: "3px 3px 0 rgba(0,0,0,0.6)",
            }}
          >
            <iframe
              src={GOOGLE_MAPS_EMBED}
              width="100%"
              height="400"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación"
            />
          </div>
        )}

        {/* CLOSING NOTE */}
        <div
          style={{
            textAlign: "center",
            marginTop: "3rem",
            padding: "2rem 1rem",
            borderTop: "1px solid #333",
          }}
        >
          <p
            style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: "1.3rem",
              color: "#ffcc00",
              textShadow: "2px 2px 0 rgba(0,0,0,0.7)",
              marginBottom: "0.5rem",
            }}
          >
            {t("contact.responseTime", "Respondemos lo más rápido que podemos 🤘")}
          </p>
          <p
            style={{
              color: "#aaa",
              fontSize: "0.9rem",
            }}
          >
            {t(
              "contact.responseDisclaimer",
              "Generalmente entre 24 y 48 horas. Si es urgente, IG es lo más rápido."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

interface ContactCardProps {
  icon: string;
  title: string;
  href?: string;
  value: string;
  description: string;
  accentColor: string;
  external?: boolean;
}

/**
 * Individual contact method card. Becomes a clickable <a> when href is set,
 * a plain div otherwise (for things like "ubicación").
 */
const ContactCard = ({
  icon,
  title,
  href,
  value,
  description,
  accentColor,
  external = false,
}: ContactCardProps) => {
  const content = (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        border: `2px solid ${accentColor}`,
        borderRadius: "0.4rem",
        padding: "1.5rem",
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
        cursor: href ? "pointer" : "default",
      }}
    >
      <div style={{ fontSize: "3rem", lineHeight: 1 }}>{icon}</div>
      <h3
        style={{
          margin: 0,
          fontFamily: "'Permanent Marker', cursive",
          fontSize: "1.4rem",
          color: accentColor,
          letterSpacing: "0.04em",
          textShadow: "1px 1px 0 rgba(0,0,0,0.7)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: "1rem",
          color: "#fff",
          fontWeight: "bold",
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "0.85rem",
          color: "#aaa",
          lineHeight: 1.4,
        }}
      >
        {description}
      </p>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        style={{ textDecoration: "none", display: "block" }}
      >
        {content}
      </a>
    );
  }
  return content;
};

export default Contact;
