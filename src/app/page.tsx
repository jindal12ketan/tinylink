"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState([]);

  async function shorten(e: any) {
    e.preventDefault();

    if (!url.trim()) {
      alert("URL is required");
      return;
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code })
      });

      console.log("frontend response:", res);

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setUrl("");
      setCode("");
      await loadLinks();

    } catch (err) {
      alert("Network error");
    }
  }

  async function loadLinks() {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  }

  useEffect(() => { loadLinks(); }, []);

  return (
    <main className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">TinyLink</h1>

      <form
        onSubmit={shorten}
        className="bg-white shadow p-5 rounded-md mb-8 space-y-4 text-black"
      >
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full border p-2 rounded"
        />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Custom code (optional)"
          className="w-full border p-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Shorten
        </button>
      </form>

      <h2 className="text-xl font-semibold">Your Links</h2>
      <div className="mt-4 space-y-3">
        {links.map((link: any) => (
          <div key={link.code} className="p-4 border bg-white rounded flex justify-between">
            <div>
              <p className="font-medium text-gray-900">{link.code}</p>
              <p className="text-sm text-gray-600 truncate max-w-xs">{link.url}</p>
              <p className="text-xs text-gray-500">
                {link.clicks} clicks
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={`/stats/${link.code}`}
                className="text-blue-500 underline text-sm"
              >
                Stats
              </a>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/r/${link.code}`
                  )
                }
                className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
              >
                Copy
              </button>
            </div>

          </div>
        ))}
      </div>
    </main>
  );
}
