"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Search, Play, Mic, Music } from "lucide-react";
import { useMusic } from "../contexts/MusicContext";
import { useAuth } from "../contexts/AuthContext";
import { LoginModal } from "../components/LoginModal";
import { searchSongs, getSongsByGenre, getSongs } from "../lib/data";

const genres = [
  { name: "Pop", color: "bg-pink-500", icon: Music },
  { name: "Rock", color: "bg-red-500", icon: Music },
  { name: "Hip Hop", color: "bg-yellow-500", icon: Mic },
  { name: "Electronic", color: "bg-blue-500", icon: Music },
  { name: "Jazz", color: "bg-purple-500", icon: Music },
  { name: "Classical", color: "bg-green-500", icon: Music },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { playTrack } = useMusic();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchSongs(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    }
  };

  const handlePlayTrack = (song: any) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    playTrack(song, getSongs());
  };

  const handleGenreClick = (genreName: string) => {
    const results = getSongsByGenre(genreName);
    setSearchResults(results);
    setSearchQuery(genreName);
    setShowResults(true);
  };

  return (
    <div className="p-6 space-y-8 mt-[20%] sm:mt-0">
      <div className="max-w-md">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="¿Qué quieres escuchar?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-0 text-white placeholder:text-gray-400 h-12 text-lg"
          />
        </form>
      </div>

      {!showResults ? (
        <>
          <section>
            <h2 className="text-2xl font-bold mb-6">Explorar por género</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {genres.map((genre) => {
                const IconComponent = genre.icon;
                return (
                  <Card
                    key={genre.name}
                    className={`${genre.color} border-0 cursor-pointer hover:scale-105 transition-transform`}
                    onClick={() => handleGenreClick(genre.name)}
                  >
                    <CardContent className="p-6 relative overflow-hidden">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {genre.name}
                      </h3>
                      <IconComponent className="absolute bottom-2 right-2 w-16 h-16 text-white/20 rotate-12" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">
              Recientemente reproducido
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card
                  key={i}
                  className="bg-white/5 border-0 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={`https://picsum.photos/150/150?random=${i + 50}`}
                        alt="Album"
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <Button
                        size="icon"
                        className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-black opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                    <h3 className="font-medium text-sm truncate">
                      Playlist {i}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Resultados para "{searchQuery}" ({searchResults.length})
          </h2>
          {searchResults.length === 0 ? (
            <p className="text-gray-400">No se encontraron resultados</p>
          ) : (
            <div className="space-y-2">
              {searchResults.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                  onClick={() => handlePlayTrack(song)}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-10 h-10 bg-green-500 hover:bg-green-600 text-black opacity-0 group-hover:opacity-100"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </Button>
                  <img
                    src={song.cover || "/placeholder.svg"}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {song.artist}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 hidden md:block">
                    {song.album}
                  </p>
                  <span className="text-sm text-gray-400">{song.duration}</span>
                </div>
              ))}
            </div>
          )}
          <Button
            variant="ghost"
            onClick={() => {
              setShowResults(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
            className="mt-4"
          >
            ← Volver a explorar
          </Button>
        </section>
      )}

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}
