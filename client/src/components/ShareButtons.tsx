import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  url: string;
  title: string;
  description?: string;
}

/**
 * Compact social share buttons for a sketch.
 * 3 buttons: WhatsApp, Telegram, Copy Link.
 *
 * Designed to be small and unobtrusive — fits in a single inline row,
 * doesn't dominate the SketchDetail page.
 */
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
        emoji="💬"
        color="#25d366"
        title={t("share.whatsapp", "Compartir en WhatsApp")}
      />
      <IconButton
        onClick={handleTelegram}
        emoji="✈️"
        color="#26a5e4"
        title={t("share.telegram", "Compartir en Telegram")}
      />
      <IconButton
        onClick={handleCopy}
        emoji={copied ? "✓" : "🔗"}
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
  emoji: string;
  color: string;
  title: string;
}

const IconButton = ({ onClick, emoji, color, title }: IconButtonProps) => (
  <button
    onClick={onClick}
    title={title}
    aria-label={title}
    style={{
      width: "2rem",
      height: "2rem",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      border: `1.5px solid ${color}`,
      borderRadius: "0.25rem",
      cursor: "pointer",
      fontSize: "1rem",
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
    {emoji}
  </button>
);

export default ShareButtons;
