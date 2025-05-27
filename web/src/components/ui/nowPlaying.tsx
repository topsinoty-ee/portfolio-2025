import { useNowPlaying } from "@/hooks/nowPlaying";
import { SiSpotify } from "@icons-pack/react-simple-icons";
import { cn } from "@/lib/utils.ts";

export const NowPlaying = () => {
  const { track, loading } = useNowPlaying();

  if (loading) return <div className="bg-muted/10 p-4 rounded-b-lg text-xs flex items-center gap-2.5" />;

  return (
    <div className="bg-muted/10 p-4 rounded-b-lg text-xs flex items-center gap-2.5">
      <SiSpotify size={12} className={cn({ "animate-[spin_1.85s_linear_infinite]": !!track })} />
      {track ? (
        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-accent hover:text-primary"
        >
          {track.artist["#text"]} — {track.name}
        </a>
      ) : (
        <span className="text-muted-foreground">Not playing anything rn</span>
      )}
    </div>
  );
};
