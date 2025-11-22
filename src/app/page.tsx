"use client";

import { useEffect, useState } from "react";

// ⭐ Toast Component Function
function showToast(message: string, type: "success" | "error" = "success") {
  const toast = document.createElement("div");

  toast.className = `
    fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded
    text-white shadow-lg text-sm z-[9999] animate-slide-up
    ${type === "success" ? "bg-green-600" : "bg-red-600"}
  `;

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0", "transition");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function shorten(e: any) {
    e.preventDefault();

    if (!url.trim()) {
      showToast("URL is required", "error");
      return;
    }

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, code }),
    });

    const data = await res.json();

    if (data.error) {
      showToast(data.error, "error");
      return;
    }

    showToast("Short link created!", "success");

    setUrl("");
    setCode("");
    await loadLinks();
  }

  async function loadLinks() {
    setLoading(true);
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  }

  async function deleteLink(code: string) {
    if (!confirm("Delete this link?")) return;

    await fetch(`/api/links/${code}`, { method: "DELETE" });

    showToast("Link deleted", "success");
    await loadLinks();
  }

  function copyLink(code: string) {
    const shortUrl = `${window.location.origin}/r/${code}`;
    navigator.clipboard.writeText(shortUrl);
    showToast("Copied to clipboard!", "success");
  }

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-10">
      <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
        TinyLink
      </h1>

      {/* FORM */}
      <form
        onSubmit={shorten}
        className="bg-white shadow p-6 rounded-md mb-8 space-y-4 text-black"
      >
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-blue-300"
        />

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Custom code (optional)"
          className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-blue-300"
        />

        <button className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Shorten
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Your Links</h2>

      {/* SKELETON */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse p-4 border bg-gray-100 rounded"
            >
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      )}

      {/* LIST */}
      {!loading && (
        <div className="mt-4 space-y-3">
          {links.map((link: any) => (
            <div
              key={link.code}
              className="p-4 border bg-white shadow-sm rounded flex flex-col sm:flex-row sm:justify-between gap-3"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">/{link.code}</p>
                <p className="text-sm text-gray-600 truncate max-w-xs">
                  {link.url}
                </p>
                <p className="text-xs text-gray-500">{link.clicks} clicks</p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`/stats/${link.code}`}
                  className="text-blue-600 underline text-sm hover:text-blue-800"
                >
                  Stats
                </a>

                <button
                  onClick={() => copyLink(link.code)}
                  className="text-sm bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
                >
                  Copy
                </button>

                <button
                  onClick={() => deleteLink(link.code)}
                  className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
