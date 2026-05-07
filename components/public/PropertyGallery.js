"use client";

import { useState } from "react";
import Image from "next/image";
import { HiOutlineX } from "react-icons/hi";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiFileText,
  FiExternalLink,
  FiVideo,
  FiCompass,
} from "react-icons/fi";

function detectVideoType(url) {
  if (!url) return null;
  const u = String(url).toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("vimeo.com")) return "vimeo";
  if (u.match(/\.(mp4|webm|mov|m4v)(\?|$)/)) return "file";
  return "external";
}

function getYouTubeId(url) {
  const m = String(url).match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  );
  return m ? m[1] : null;
}

function getVimeoId(url) {
  const m = String(url).match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function getEmbedUrl(url) {
  const type = detectVideoType(url);
  if (type === "youtube") {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
  }
  if (type === "vimeo") {
    const id = getVimeoId(url);
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
  }
  return null;
}

function getYouTubeThumb(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

function normalize(item) {
  if (!item) return null;
  if (typeof item === "string") return item;
  return item.url || null;
}

function fileName(url) {
  if (!url) return "Document";
  return (
    decodeURIComponent(String(url).split("/").pop().split("?")[0]) || "Document"
  );
}

export default function PropertyGallery({
  images = [],
  videos = [],
  pdfs = [],
  videoTourUrl,
  virtualTourUrl,
  propertyName = "",
}) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [videoLightbox, setVideoLightbox] = useState(null);

  const cleanImages = images.map(normalize).filter(Boolean);
  const cleanVideos = [
    ...videos.map(normalize).filter(Boolean),
    ...(videoTourUrl ? [videoTourUrl] : []),
  ];
  const cleanPdfs = pdfs.map(normalize).filter(Boolean);

  const hasImages = cleanImages.length > 0;
  const hasVideos = cleanVideos.length > 0;
  const hasVirtualTour = !!virtualTourUrl;
  const hasPdfs = cleanPdfs.length > 0;

  const posterImage = cleanImages[0] || null;

  if (!hasImages && !hasVideos && !hasVirtualTour && !hasPdfs) return null;

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const next = () => setLightboxIndex((i) => (i + 1) % cleanImages.length);
  const prev = () =>
    setLightboxIndex((i) => (i - 1 + cleanImages.length) % cleanImages.length);

  return (
    <>
      {hasImages && (
        <div className="grid grid-cols-4 gap-2 h-[420px] lg:h-[500px] rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="img-zoom relative col-span-4 lg:col-span-3 row-span-2 group"
          >
            <Image
              src={cleanImages[0]}
              alt={`${propertyName} - main`}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 75vw, 100vw"
              unoptimized
            />
          </button>

          {cleanImages.slice(1, 5).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openLightbox(i + 1)}
              className="img-zoom relative hidden lg:block group"
            >
              <Image
                src={src}
                alt={`${propertyName} - ${i + 2}`}
                fill
                className="object-cover"
                sizes="25vw"
                unoptimized
              />
              {i === 3 && cleanImages.length > 5 && (
                <div className="absolute inset-0 bg-[var(--color-ink-900)]/70 grid place-items-center text-white text-sm font-medium">
                  +{cleanImages.length - 5} more
                </div>
              )}
            </button>
          ))}

          {Array.from({
            length: Math.max(0, 4 - cleanImages.slice(1, 5).length),
          }).map((_, i) => (
            <div
              key={`pad-${i}`}
              className="hidden lg:block bg-[var(--color-bg-soft)]"
            />
          ))}
        </div>
      )}

      {(hasVirtualTour || hasVideos) && (
        <div className="mt-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px flex-1 bg-[var(--color-ink-100)]" />
            <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium">
              Tours & Videos
            </span>
            <span className="h-px flex-1 bg-[var(--color-ink-100)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hasVirtualTour && (
              <a
                href={virtualTourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-video rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-700)] via-[var(--color-brand-800)] to-[var(--color-ink-900)]" />
                <div
                  className="absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 80%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)",
                  }}
                />
                <div className="relative h-full flex flex-col items-center justify-center text-white p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm grid place-items-center mb-3 group-hover:scale-110 group-hover:bg-white/25 transition-all">
                    <FiCompass className="text-2xl" />
                  </div>
                  <p className="text-[10px] tracking-[0.22em] uppercase font-bold mb-1">
                    360° Virtual Tour
                  </p>
                  <p className="text-xs opacity-90">Explore in 3D</p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-lg bg-white/15 backdrop-blur-sm">
                  <FiExternalLink className="text-sm text-white" />
                </div>
              </a>
            )}

            {cleanVideos.map((v, i) => {
              const type = detectVideoType(v);
              const ytThumb = getYouTubeThumb(v);
              const canEmbed =
                type === "youtube" || type === "vimeo" || type === "file";
              const label =
                type === "youtube"
                  ? "YouTube"
                  : type === "vimeo"
                    ? "Vimeo"
                    : type === "file"
                      ? "Property Video"
                      : "Watch";

              const cardInner = (
                <div className="relative w-full h-full">
                  {ytThumb ? (
                    <Image
                      src={ytThumb}
                      alt={`Video ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : type === "file" && posterImage ? (
                    <Image
                      src={posterImage}
                      alt="Video poster"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : type === "file" ? (
                    <video
                      src={v}
                      className="w-full h-full object-cover pointer-events-none"
                      muted
                      preload="metadata"
                      playsInline
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-ink-700)] via-[var(--color-ink-800)] to-[var(--color-ink-900)] grid place-items-center">
                      <FiVideo className="text-5xl text-white/20" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40 group-hover:from-black/80 group-hover:via-black/40 transition-all" />

                  <div className="absolute inset-0 grid place-items-center">
                    <div className="w-16 h-16 rounded-full bg-white grid place-items-center group-hover:scale-110 transition-transform shadow-2xl">
                      <FiPlay
                        className="text-2xl text-[var(--color-ink-900)] ml-1"
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between text-white">
                    <span className="text-[10px] tracking-[0.22em] uppercase font-bold">
                      {label}
                    </span>
                    <span className="text-[10px] opacity-80">
                      Click to play
                    </span>
                  </div>
                </div>
              );

              if (canEmbed) {
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setVideoLightbox(v)}
                    className="block w-full aspect-video rounded-xl overflow-hidden bg-black group shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {cardInner}
                  </button>
                );
              }

              return (
                <a
                  key={i}
                  href={v}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full aspect-video rounded-xl overflow-hidden bg-black group shadow-sm hover:shadow-lg transition-shadow"
                >
                  {cardInner}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {hasPdfs && (
        <div className="mt-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px flex-1 bg-[var(--color-ink-100)]" />
            <span className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-500)] font-medium">
              Documents
            </span>
            <span className="h-px flex-1 bg-[var(--color-ink-100)]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cleanPdfs.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-ink-100)] bg-white hover:border-[var(--color-brand-600)] hover:shadow-sm transition-all group"
              >
                <div className="w-11 h-11 rounded-lg bg-red-50 grid place-items-center flex-shrink-0">
                  <FiFileText className="text-xl text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--color-ink-900)] truncate">
                    {fileName(url)}
                  </p>
                  <p className="text-[11px] text-[var(--color-ink-500)] mt-0.5">
                    PDF · Tap to view
                  </p>
                </div>
                <FiChevronRight className="text-[var(--color-ink-400)] flex-shrink-0 group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-700)] transition-all" />
              </a>
            ))}
          </div>
        </div>
      )}

      {lightboxIndex !== null && hasImages && (
        <div
          className="fixed inset-0 z-[70] bg-black/95 grid place-items-center animate-overlay-in"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-11 h-11 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="Close"
          >
            <HiOutlineX size={22} />
          </button>

          {cleanImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white"
                aria-label="Previous"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white"
                aria-label="Next"
              >
                <FiChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="relative w-[90vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={cleanImages[lightboxIndex]}
              alt=""
              fill
              className="object-contain"
              sizes="90vw"
              unoptimized
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm numeral">
            {lightboxIndex + 1} / {cleanImages.length}
          </div>
        </div>
      )}

      {videoLightbox && (
        <div
          className="fixed inset-0 z-[70] bg-black/95 grid place-items-center p-4"
          onClick={() => setVideoLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setVideoLightbox(null)}
            className="absolute top-6 right-6 w-11 h-11 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
            aria-label="Close"
          >
            <HiOutlineX size={22} />
          </button>

          <div
            className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {detectVideoType(videoLightbox) === "file" ? (
              <video
                src={videoLightbox}
                controls
                autoPlay
                className="w-full h-full"
              />
            ) : getEmbedUrl(videoLightbox) ? (
              <iframe
                src={getEmbedUrl(videoLightbox)}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-white">
                <a
                  href={videoLightbox}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-white text-[var(--color-ink-900)] text-sm font-medium"
                >
                  Open in new tab
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
