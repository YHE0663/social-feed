import { useEffect } from "react";

type Props = {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function ImageModal({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: Props) {
  // ESC 닫기 + 바디 스크롤 잠금
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    document.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [onClose, onPrev, onNext]);

  const src = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 12,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", maxWidth: "min(92vw, 1000px)" }}
      >
        <img
          src={src}
          alt=""
          style={{
            width: "100%",
            borderRadius: 8,
            objectFit: "contain",
            maxHeight: "82vh",
          }}
          loading="eager"
          decoding="sync"
        />
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          X
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="이전"
              onClick={onPrev}
              style={{
                position: "absolute",
                left: -4,
                top: "50%",
                transform: "translateY(-50%)",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="다음"
              onClick={onNext}
              style={{
                position: "absolute",
                right: -4,
                top: "50%",
                transform: "translateY(-50%)",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
              }}
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}
