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

  if (!code || loading) return <p>Loading...</p>;
  if (data?.error) return <p className="text-red-500">Stats not found.</p>;

  return (
    <main className="max-w-lg mx-auto p-10 text-black">
      <h1 className="text-3xl font-bold mb-4">Stats for {code}</h1>
      <div className="bg-white shadow p-6 rounded space-y-3">
        <p><strong>Short Code:</strong> {data.code}</p>
        <p><strong>Original URL:</strong> {data.url}</p>
        <p><strong>Total Clicks:</strong> {data.clicks}</p>
        <p><strong>Last Clicked:</strong> {data.last_clicked || "Never"}</p>
        <p><strong>Created:</strong> {data.created_at}</p>
      </div>
    </main>
  );
}
