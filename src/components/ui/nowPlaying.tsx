import { useNowPlaying } from "@/hooks/nowPlaying";
import { SiSpotify } from "@icons-pack/react-simple-icons";

export const NowPlaying = () => {
  const { track, loading } = useNowPlaying();

  if (loading) return null;

  return (
    <div className="bg-muted/10 p-4 rounded-lg text-xs flex items-center gap-2.5">
      <SiSpotify size={12} className="animate-[spin_1.85s_linear_infinite]" />
      {track ? (
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-accent"
        >
          {track.artist["#text"]} — {track.name}
        </a>
      ) : (
        <span className="text-muted-foreground">Not playing anything rn</span>
      )}
    </div>
  );
};
