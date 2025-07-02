"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "../components/ui/button";
import {
  Play,
  Heart,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMusic } from "../contexts/MusicContext";
import { useAuth } from "../contexts/AuthContext";
import { LoginModal } from "../components/LoginModal";
import { getSongs, getAlbums, type Song, type Album } from "../lib/data";

const SkeletonLoader = ({ type }: { type: "song" | "album" }) => {
  if (type === "song") {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg bg-white/5 animate-pulse"
          >
            <div className="w-4 text-center text-gray-500"> </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded"></div>
            <div className="flex-1 space-y-1 min-w-0">
              <div className="h-3 sm:h-4 bg-gray-600 rounded w-3/4 sm:w-1/2"></div>
              <div className="h-2 sm:h-3 bg-gray-500 rounded w-1/2 sm:w-1/3"></div>
            </div>
            <div className="hidden lg:block w-1/4 h-3 bg-gray-600 rounded"></div>
            <div className="flex gap-1 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full"></div>
              <div className="w-8 sm:w-12 h-2 sm:h-3 bg-gray-500 rounded"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full hidden sm:block"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 sm:gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="min-w-[120px] sm:min-w-[160px] lg:min-w-[180px] bg-white/5 border-0 rounded-lg p-3 sm:p-4 animate-pulse"
        >
          <div className="w-full aspect-square bg-gray-700 rounded-lg mb-2 sm:mb-3"></div>
          <div className="h-3 sm:h-4 bg-gray-600 rounded w-3/4 mb-1 sm:mb-2"></div>
          <div className="h-2 sm:h-3 bg-gray-500 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

const AlbumSlider = ({
  albums,
  songs,
  onPlayTrack,
}: {
  albums: Album[];
  songs: Song[];
  onPlayTrack: (song: Song) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 140 : 200;
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount * 2
          : currentScroll + scrollAmount * 2;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8 sm:h-10 sm:w-10"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </Button>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {albums.map((album) => (
          <div
            key={album.id}
            className="min-w-[120px] sm:min-w-[140px] lg:min-w-[160px] bg-white/5 border border-white/10 rounded-md p-1 sm:p-1.5 hover:bg-white/10 transition-all duration-200 cursor-pointer group/card flex-shrink-0"
          >
            <div className="relative mb-1 sm:mb-1.5">
              <img
                src={album.cover || "/placeholder.svg"}
                alt={album.title}
                className="w-full aspect-square object-cover rounded shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <Button
                size="icon"
                className="absolute bottom-1 right-1 bg-green-500 hover:bg-green-600 text-black opacity-0 group-hover/card:opacity-100 transition-all duration-200 shadow-md rounded-full h-6 w-6 sm:h-8 sm:w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  const albumSongs = songs.filter((song) =>
                    album.songs.includes(song.id)
                  );
                  if (albumSongs.length > 0) {
                    onPlayTrack(albumSongs[0]);
                  }
                }}
              >
                <Play className="w-2 h-2 sm:w-3 sm:h-3 fill-current ml-0.5" />
              </Button>
            </div>
            <h3 className="font-medium truncate text-white mb-0.5 text-xs leading-tight">
              {album.title}
            </h3>
            <p className="text-xs text-gray-400 truncate leading-tight">
              {album.artist}
            </p>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8 sm:h-10 sm:w-10"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </Button>
    </div>
  );
};

export default function HomePage() {
  const { playTrack } = useMusic();
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showAllSongs, setShowAllSongs] = useState(false);

  const [musicData, setMusicData] = useState<{
    songs: Song[];
    albums: Album[];
    isLoading: boolean;
    error: string | null;
  }>({
    songs: [],
    albums: [],
    isLoading: false,
    error: null,
  });

  const loadMusicData = useCallback(async () => {
    try {
      setMusicData((prev) => ({ ...prev, isLoading: true, error: null }));
      const [songs, albums] = await Promise.all([getSongs(), getAlbums()]);
      setMusicData({ songs, albums, isLoading: false, error: null });
    } catch (error) {
      console.error("Error loading music data:", error);
      setMusicData((prev) => ({
        ...prev,
        isLoading: false,
        error: "Error al cargar la música. Intenta recargar la página.",
      }));
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      loadMusicData();
      const interval = setInterval(() => {
        loadMusicData();
      }, 300);

      return () => clearInterval(interval);
    }
  }, [loading, loadMusicData]);

  const { songs, albums, isLoading, error } = musicData;

  const displayedSongs = showAllSongs ? songs : songs.slice(0, 10);

  const featuredAlbums = albums;

  const handlePlayTrack = (song: Song) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    playTrack(song, songs);
  };

  const handleReload = () => {
    loadMusicData();
  };

  const ErrorMessage = () => (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12">
      <p className="text-red-400 mb-4 text-center px-4">{error}</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleReload} variant="outline" size="sm">
          Reintentar
        </Button>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
        >
          Recargar página
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-3 sm:p-6 mt-[20%] sm:mt-0">
        <SkeletonLoader type="song" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-6 sm:space-y-8 max-w-full overflow-x-hidden mt-[20%] sm:mt-0">
      <section className="relative bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4 leading-tight">
            {user ? `¡Hola, ${user.name}!` : "Bienvenido a Kodigo Music"}
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl mb-4 sm:mb-6 opacity-90 leading-relaxed">
            {user
              ? "Disfruta de tu música favorita"
              : "Descubre millones de canciones y podcasts gratis"}
          </p>
          {!user && (
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-black font-semibold text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-3"
              onClick={() => setShowLogin(true)}
            >
              Comenzar a escuchar
            </Button>
          )}
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-green-500/20 rounded-full blur-2xl"></div>
      </section>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">
            Canciones Populares
            {songs.length > 0 && (
              <span className="text-xs sm:text-sm font-normal text-gray-400 ml-2 block sm:inline">
                ({songs.length} canciones)
              </span>
            )}
          </h2>
          {!isLoading && !error && songs.length === 0 && (
            <Button onClick={handleReload} variant="outline" size="sm">
              Cargar música
            </Button>
          )}
        </div>

        {isLoading ? (
          <SkeletonLoader type="song" />
        ) : error ? (
          <ErrorMessage />
        ) : displayedSongs.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 mb-4">No hay canciones disponibles</p>
            <Button onClick={handleReload} variant="outline">
              Cargar canciones
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-1 sm:space-y-2">
              {displayedSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer min-w-0"
                  onClick={() => handlePlayTrack(song)}
                >
                  <div className="w-6 sm:w-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs sm:text-sm group-hover:hidden">
                      {index + 1}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6 sm:w-8 sm:h-8 hidden group-hover:flex bg-green-500 hover:bg-green-600 text-black rounded-full p-0"
                    >
                      <Play className="w-2 h-2 sm:w-3 sm:h-3 fill-current ml-0.5" />
                    </Button>
                  </div>
                  <img
                    src={song.cover || "/placeholder.svg"}
                    alt={song.title}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover shadow-sm flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-white text-sm sm:text-base">
                      {song.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 truncate">
                      {song.artist}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 hidden lg:block min-w-0 truncate max-w-[150px] lg:max-w-[200px]">
                    {song.album}
                  </p>
                  <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6 sm:w-8 sm:h-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white hidden sm:flex"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <span className="text-xs sm:text-sm text-gray-400 w-8 sm:w-12 text-right">
                      {song.duration}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6 sm:w-8 sm:h-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white hidden sm:flex"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {songs.length > 10 && (
              <div className="text-center mt-4 sm:mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAllSongs(!showAllSongs)}
                  size="sm"
                >
                  {showAllSongs
                    ? `Mostrar menos`
                    : `Mostrar todas (${songs.length - 10} más)`}
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">
            Álbumes Destacados
            {albums.length > 0 && (
              <span className="text-xs sm:text-sm font-normal text-gray-400 ml-2 block sm:inline">
                ({albums.length} álbumes)
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <SkeletonLoader type="album" />
        ) : error ? (
          <ErrorMessage />
        ) : featuredAlbums.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 mb-4">No hay álbumes disponibles</p>
            <Button onClick={handleReload} variant="outline">
              Cargar álbumes
            </Button>
          </div>
        ) : (
          <AlbumSlider
            albums={featuredAlbums}
            songs={songs}
            onPlayTrack={handlePlayTrack}
          />
        )}
      </section>

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}
