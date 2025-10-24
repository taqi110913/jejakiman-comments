"use client";
import { useEffect, useState } from "react";

export default function Embed() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postUrl, setPostUrl] = useState<string | null>(null);

  useEffect(() => {
    // only runs in browser
    const urlParam = new URLSearchParams(window.location.search).get("post");
    setPostUrl(urlParam);
  }, []);

  useEffect(() => {
    if (!postUrl) return;

    fetch(`/api/comments?post=${encodeURIComponent(postUrl)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load comments");
        const data = await res.json();
        setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load comments");
        setLoading(false);
      });
  }, [postUrl]);

  if (!postUrl) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Loading post...</h3>
      </div>
    );
  }

  if (loading) return <p style={{ padding: 20 }}>Loading comments...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h3>Comments for: {postUrl}</h3>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((c, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{c.author}</strong>
            <p>{c.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
