import Link from "next/link";
import songs from "../data/songs.json";

export default function Home() {
  const sortedSongs = [...songs].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <main className="container py-4">
      <h1
        className="mb-4"
        style={{ color: "black", textAlign: "center" }} /*center h1 header*/
      >
        Uyghur Guitar Nahxa
      </h1>

      <div className="list-group">
        {sortedSongs.map((song) => (
          <Link
            key={song.id}
            href={`/songs/${song.id}`}
            className="list-group-item list-group-item-action"
          >
            <span>{song.title}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
