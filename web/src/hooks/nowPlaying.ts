import { useEffect, useState } from "react";

type Track = {
  artist: { "#text": string };
  name: string;
  url: string;
  "@attr"?: { nowplaying: string };
};

export const useNowPlaying = () => {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch(
          "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=topsinoty&api_key=5567c519fb22b5203bdff414099a48ae&format=json&limit=1",
        );
        const data = await res.json();
        const latest = data.recenttracks.track?.[0];

        if (latest?.["@attr"]?.nowplaying === "true") {
          setTrack(latest);
        } else {
          setTrack(null);
        }
      } catch (err) {
        console.error("NowPlaying error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 60 * 1000); // every 1 min

    return () => clearInterval(interval); // clean up
  }, []);

  return { track, loading };
};
