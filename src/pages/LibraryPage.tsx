"use client";

import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Play, Heart, Download, MoreHorizontal } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useMusic } from "../contexts/MusicContext";
import { LoginModal } from "../components/LoginModal";
import { getPlaylists, getSongs, getSongById } from "../lib/data";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("playlists");
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();
  const { playTrack } = useMusic();

  const playlists = getPlaylists();
  const songs = getSongs();
  const recentlyPlayed = songs.slice(0, 3);

  const handlePlayTrack = (song: any) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    playTrack(song, songs);
  };

  const handlePlayPlaylist = (playlist: any) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const playlistSongs = playlist.songs
      .map((songId: number) => getSongById(songId))
      .filter(Boolean);
    if (playlistSongs.length > 0) {
      playTrack(playlistSongs[0], playlistSongs);
    }
  };
  if (!user) {
    return (
      <div className="p-3 sm:p-6 flex flex-col sm:flex-row items-center justify-center min-h-[60vh] mt-[20%] sm:mt-0">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Tu Biblioteca
          </h1>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
            Inicia sesión para ver tu biblioteca personal
          </p>
          <Button
            onClick={() => setShowLogin(true)}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-3"
            size="lg"
          >
            Iniciar Sesión
          </Button>
        </div>
        <LoginModal open={showLogin} onOpenChange={setShowLogin} />
      </div>
    );
  }
  return (
    <div className="p-6 space-y-8 mt-[20%] sm:mt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Tu Biblioteca
        </h1>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant={activeTab === "playlists" ? "default" : "ghost"}
            onClick={() => setActiveTab("playlists")}
            className="bg-white/10 hover:bg-white/20 text-sm sm:text-base w-full xs:w-auto"
          >
            Playlists
          </Button>
          <Button
            variant={activeTab === "recent" ? "default" : "ghost"}
            onClick={() => setActiveTab("recent")}
            className="bg-white/10 hover:bg-white/20 text-sm sm:text-base w-full xs:w-auto"
          >
            Recientes
          </Button>
          <Button
            variant={activeTab === "favorites" ? "default" : "ghost"}
            onClick={() => setActiveTab("favorites")}
            className="bg-white/10 hover:bg-white/20 text-sm sm:text-base w-full xs:w-auto"
          >
            Favoritos
          </Button>
        </div>
      </div>

      {activeTab === "playlists" && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="bg-white/5 border-0 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={playlist.cover || "/placeholder.svg"}
                      alt={playlist.name}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-black opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      onClick={() => handlePlayPlaylist(playlist)}
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                  <h3 className="font-semibold mb-1 truncate">
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-1 truncate">
                    {playlist.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {playlist.songs.length} canciones
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {activeTab === "recent" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Reproducido recientemente
          </h2>
          <div className="space-y-2">
            {recentlyPlayed.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                onClick={() => handlePlayTrack(song)}
              >
                <div className="relative">
                  <img
                    src={song.cover || "/placeholder.svg"}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute inset-0 w-12 h-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-4 h-4 fill-white text-white" />
                  </Button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-sm text-gray-400 truncate">
                    {song.artist}
                  </p>
                </div>
                <p className="text-sm text-gray-400 hidden md:block">
                  {song.album}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 opacity-0 group-hover:opacity-100"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 opacity-0 group-hover:opacity-100"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-400 w-12 text-right">
                    {song.duration}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "favorites" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Tus canciones favoritas
          </h2>
          <div className="space-y-2">
            {user.favorites.length === 0 ? (
              <p className="text-gray-400">No tienes canciones favoritas aún</p>
            ) : (
              user.favorites.map((songId) => {
                const song = getSongById(songId);
                if (!song) return null;

                return (
                  <div
                    key={song.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                    onClick={() => handlePlayTrack(song)}
                  >
                    <div className="relative">
                      <img
                        src={song.cover || "/placeholder.svg"}
                        alt={song.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute inset-0 w-12 h-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="w-4 h-4 fill-white text-white" />
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{song.title}</p>
                      <p className="text-sm text-gray-400 truncate">
                        {song.artist}
                      </p>
                    </div>
                    <p className="text-sm text-gray-400 hidden md:block">
                      {song.album}
                    </p>
                    <span className="text-sm text-gray-400">
                      {song.duration}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
}
