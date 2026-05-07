"use client";
import { useState, useRef } from "react";
import { LuUpload, LuX, LuFile, LuImage, LuVideo, LuFileText } from "react-icons/lu";

export default function MediaUploader({ folder = "uploads", accept = "image/*", multiple = true, value = [], onChange, label = "Upload files", maxSizeMB = 50 }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState("");

  const list = Array.isArray(value) ? value : (value ? [value] : []);

  async function uploadOne(file) {
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`${file.name}: too large (max ${maxSizeMB}MB)`);
    }
    const presign = await fetch("/api/admin/s3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type, folder }),
    });
    if (!presign.ok) {
      const d = await presign.json().catch(() => ({}));
      throw new Error(d.error || "Failed to get upload URL");
    }
    const { uploadUrl, publicUrl } = await presign.json();

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress((p) => ({ ...p, [file.name]: Math.round((e.loaded / e.total) * 100) }));
        }
      };
      xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed"));
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(file);
    });

    return { url: publicUrl, name: file.name, size: file.size, type: file.type };
  }

  async function handleFiles(files) {
    setError("");
    setUploading(true);
    const arr = Array.from(files);
    const next = [...list];
    try {
      for (const f of arr) {
        const result = await uploadOne(f);
        next.push(result);
      }
      onChange?.(multiple ? next : [next[next.length - 1]]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setProgress({});
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const removeAt = (idx) => {
    const next = list.filter((_, i) => i !== idx);
    onChange?.(next);
  };

  const move = (idx, dir) => {
    const next = [...list];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange?.(next);
  };

  const getIcon = (item) => {
    const url = typeof item === "string" ? item : item?.url || "";
    if (/\.(jpg|jpeg|png|webp|gif|avif)$/i.test(url) || item?.type?.startsWith("image/")) return <LuImage/>;
    if (/\.(mp4|webm|mov|avi)$/i.test(url) || item?.type?.startsWith("video/")) return <LuVideo/>;
    if (/\.pdf$/i.test(url) || item?.type === "application/pdf") return <LuFileText/>;
    return <LuFile/>;
  };

  const getUrl = (item) => typeof item === "string" ? item : item?.url || "";
  const getName = (item) => typeof item === "string" ? item.split("/").pop() : item?.name || "file";

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5">{label}</label>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}/>
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="w-full px-4 py-6 border-2 border-dashed border-[var(--color-ink-200)] rounded-lg hover:border-[var(--color-brand-600)] disabled:opacity-60 transition-colors flex flex-col items-center gap-1.5"
      >
        <LuUpload className="text-2xl text-[var(--color-ink-500)]"/>
        <span className="text-sm text-[var(--color-ink-700)]">{uploading ? "Uploading..." : "Click or drag to upload"}</span>
        <span className="text-[11px] text-[var(--color-ink-500)]">{multiple ? "Multiple files allowed" : "Single file"} · Max {maxSizeMB}MB each</span>
      </button>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      {Object.keys(progress).length > 0 && (
        <div className="mt-3 space-y-1.5">
          {Object.entries(progress).map(([name, p]) => (
            <div key={name} className="flex items-center gap-2 text-xs">
              <span className="truncate flex-1">{name}</span>
              <div className="w-24 h-1.5 bg-[var(--color-ink-100)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-brand-600)]" style={{ width: `${p}%` }}/>
              </div>
              <span className="w-8 text-right">{p}%</span>
            </div>
          ))}
        </div>
      )}

      {list.length > 0 && (
        <div className="mt-3 space-y-2">
          {list.map((item, i) => {
            const url = getUrl(item);
            const isImage = /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(url);
            return (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-[var(--color-bg-soft)] rounded-lg">
                {isImage ? (
                  <img src={url} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0"/>
                ) : (
                  <div className="w-10 h-10 rounded bg-white grid place-items-center flex-shrink-0 text-[var(--color-ink-500)]">{getIcon(item)}</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{getName(item)}</p>
                  <a href={url} target="_blank" rel="noopener" className="text-[11px] text-[var(--color-brand-700)] truncate block">View</a>
                </div>
                {multiple && (
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-xs px-1.5 py-0.5 hover:bg-white rounded disabled:opacity-30">↑</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} className="text-xs px-1.5 py-0.5 hover:bg-white rounded disabled:opacity-30">↓</button>
                  </div>
                )}
                <button type="button" onClick={() => removeAt(i)} className="w-7 h-7 grid place-items-center rounded text-[var(--color-ink-500)] hover:text-red-600 hover:bg-white"><LuX/></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
