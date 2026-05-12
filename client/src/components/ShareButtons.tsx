import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  url: string;
  title: string;
  description?: string;
}

/* =============================================================================
   Inline SVG icons — official brand artwork, simplified to fit inside small
   buttons. No external icon library needed.
   ========================================================================== */

const WhatsAppIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const TelegramIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.464.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const LinkIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ========================================================================== */

const ShareButtons = ({ url, title, description }: Props) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const shareText = description
    ? `${title} — ${description.slice(0, 100)}`
    : title;

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const handleWhatsApp = () =>
    window.open(
      `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );

  const handleTelegram = () =>
    window.open(
      `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      "_blank",
      "noopener,noreferrer"
    );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for non-https / older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        alert(t("share.copyError", "No se pudo copiar el enlace"));
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.3rem 0.5rem",
      }}
    >
      <span
        style={{
          fontSize: "0.8rem",
          color: "#aaa",
          marginRight: "0.2rem",
        }}
      >
        📤 {t("share.title", "Compartir")}:
      </span>
      <IconButton
        onClick={handleWhatsApp}
        icon={<WhatsAppIcon />}
        color="#25d366"
        title={t("share.whatsapp", "Compartir en WhatsApp")}
      />
      <IconButton
        onClick={handleTelegram}
        icon={<TelegramIcon />}
        color="#26a5e4"
        title={t("share.telegram", "Compartir en Telegram")}
      />
      <IconButton
        onClick={handleCopy}
        icon={copied ? <CheckIcon /> : <LinkIcon />}
        color={copied ? "#39ff14" : "#ffcc00"}
        title={
          copied
            ? t("share.copied", "¡Copiado!")
            : t("share.copyLinkTooltip", "Copiar enlace")
        }
      />
    </div>
  );
};

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  color: string;
  title: string;
}

const IconButton = ({ onClick, icon, color, title }: IconButtonProps) => (
  <button
    onClick={onClick}
    title={title}
    aria-label={title}
    style={{
      width: "2.2rem",
      height: "2.2rem",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      color: color,
      border: `1.5px solid ${color}`,
      borderRadius: "0.25rem",
      cursor: "pointer",
      padding: 0,
      transition: "all 0.15s ease",
      touchAction: "manipulation",
      WebkitTapHighlightColor: "transparent",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = `${color}25`;
      e.currentTarget.style.boxShadow = `0 0 6px ${color}50`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    {icon}
  </button>
);

export default ShareButtons;
