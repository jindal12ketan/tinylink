"use client";

import { useEffect, useState } from "react";

export default function StatsPage({ params }: { params: Promise<{ code: string }> }) {
  const [code, setCode] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function unwrap() {
      const p = await params;
      setCode(p.code);
    }
    unwrap();
  }, [params]);

  useEffect(() => {
    if (!code) return;

    async function load() {
      const res = await fetch(`/api/links/${code}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    }

    load();
  }, [code]);

  async function handleDelete() {
    if (!code) return;

    if (!confirm("Are you sure you want to delete this link?")) return;

    await fetch(`/api/links/${code}`, { method: "DELETE" });

    alert("Link deleted.");
    window.location.href = "/";
  }

  if (!code || loading)
    return <p className="p-6 text-gray-700 text-center">Loading...</p>;

  if (data?.error)
    return <p className="p-6 text-red-500 text-center">Stats not found.</p>;

  const shortUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/r/${code}`;

  function copyLink() {
    navigator.clipboard.writeText(shortUrl);
    alert("Short link copied!");
  }

  return (
    <main className="max-w-xl mx-auto p-4 sm:p-8 text-black">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Link Statistics
      </h1>

      {/* Shortened Link Card */}
      <div className="bg-blue-50 border border-blue-200 p-5 rounded-md mb-6">
        <p className="text-sm text-gray-700">Short Link</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1 gap-2">
          <a
            href={shortUrl}
            target="_blank"
            className="text-blue-600 underline font-medium break-all"
          >
            {shortUrl}
          </a>

          <button
            onClick={copyLink}
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white shadow p-6 rounded space-y-4">

        <div>
          <p className="text-gray-600 text-sm">Original URL</p>
          <a href={data.url} target="_blank" className="text-blue-600 underline break-all">
            {data.url}
          </a>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Total Clicks</p>
          <p className="text-lg font-semibold">{data.clicks}</p>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Last Clicked</p>
          <p>{data.last_clicked || "Never"}</p>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Created On</p>
          <p>{new Date(data.created_at).toLocaleString()}</p>
        </div>

        {/* DELETE BUTTON */}
        <button
          onClick={handleDelete}
          className="w-full bg-red-600 text-white py-2 rounded mt-4 hover:bg-red-700"
        >
          Delete Link
        </button>

        <a
          href="/"
          className="block text-center text-gray-600 underline text-sm mt-3"
        >
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
