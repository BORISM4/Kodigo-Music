export type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  audioUrl: string;
  genre: string;
  year: number;
};

export type Album = {
  id: number;
  title: string;
  artist: string;
  cover: string;
  year: number;
  songs: number[];
};

export type Playlist = {
  id: string;
  name: string;
  description: string;
  cover: string;
  songs: number[];
  created_at: string;
};

const USE_JSONP_PROXY = true;
const USE_ALTERNATIVE_API = false;
const USE_MOCK_DATA = false;

let songsData: {
  songs: Song[];
  albums: Album[];
  playlists: Playlist[];
} = {
  songs: [],
  albums: [],
  playlists: [],
};

const formatDuration = (duration: any): string => {
  if (!duration) return "3:30";
  let seconds = typeof duration === "string" ? parseInt(duration) : duration;
  if (seconds > 1000) seconds = Math.floor(seconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const generateAlbums = (songs: Song[]): Album[] => {
  const albumMap = new Map<string, Album>();

  songs.forEach((song) => {
    const albumKey = `${song.album}-${song.artist}`;
    if (!albumMap.has(albumKey) && song.album !== "Unknown Album") {
      albumMap.set(albumKey, {
        id: albumMap.size + 1,
        title: song.album,
        artist: song.artist,
        cover: song.cover,
        year: song.year,
        songs: [],
      });
    }
    albumMap.get(albumKey)?.songs.push(song.id);
  });

  return Array.from(albumMap.values());
};

const generatePlaylists = (songs: Song[]): Playlist[] => {
  const genres = [...new Set(songs.map((s) => s.genre))];
  const playlists: Playlist[] = [
    {
      id: "1",
      name: "Top Hits",
      description: "Las canciones más populares del momento",
      cover: songs[0]?.cover || "",
      songs: songs.slice(0, 15).map((s) => s.id),
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Chill Vibes",
      description: "Música relajante para cualquier momento",
      cover: songs[10]?.cover || "",
      songs: songs.slice(5, 20).map((s) => s.id),
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Party Mix",
      description: "Música perfecta para fiestas",
      cover: songs[20]?.cover || "",
      songs: songs.slice(10, 25).map((s) => s.id),
      created_at: new Date().toISOString(),
    },
  ];

  if (genres.length > 0) {
    const mainGenre = genres[0];
    const genreSongs = songs.filter((s) => s.genre === mainGenre);
    if (genreSongs.length > 5) {
      playlists.push({
        id: "4",
        name: `Best of ${mainGenre}`,
        description: `Lo mejor del género ${mainGenre}`,
        cover: genreSongs[0].cover,
        songs: genreSongs.slice(0, 12).map((s) => s.id),
        created_at: new Date().toISOString(),
      });
    }
  }

  return playlists;
};

const fetchWithCorsProxy = async (url: string) => {
  const corsProxies = [
    "https://cors-anywhere.herokuapp.com/",
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
  ];

  for (const proxy of corsProxies) {
    try {
      const response = await fetch(proxy + encodeURIComponent(url));
      if (response.ok) {
        return await response.json();
      }
    } catch {
      continue;
    }
  }
  throw new Error("All CORS proxies failed");
};

const fetchDeezerWithJSONP = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const callbackName = "deezerCallback" + Date.now();

    (window as any)[callbackName] = (data: any) => {
      document.head.removeChild(script);
      delete (window as any)[callbackName];
      resolve(data);
    };

    script.src = `https://api.deezer.com/chart/0/tracks?limit=50&output=jsonp&callback=${callbackName}`;
    script.onerror = () => {
      document.head.removeChild(script);
      delete (window as any)[callbackName];
      reject(new Error("JSONP request failed"));
    };

    document.head.appendChild(script);

    setTimeout(() => {
      if ((window as any)[callbackName]) {
        document.head.removeChild(script);
        delete (window as any)[callbackName];
        reject(new Error("JSONP request timeout"));
      }
    }, 10000);
  });
};

const getExampleSongs = (): Song[] => [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    cover: "https://i.scdn.co/image/ab67616d0000b273ef6f49ddd560d08eb3bb5f20",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    genre: "Pop",
    year: 2020,
  },
  {
    id: 2,
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: "3:53",
    cover: "https://i.scdn.co/image/ab67616d0000b273ba5db46f838ef6027e6f96be",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    genre: "Pop",
    year: 2017,
  },
  {
    id: 3,
    title: "Tití Me Preguntó",
    artist: "Bad Bunny",
    album: "Un Verano Sin Ti",
    duration: "4:02",
    cover: "https://i.scdn.co/image/ab67616d0000b273f7a248a3cc182b06b0112b3b",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    genre: "Reggaeton",
    year: 2022,
  },
  {
    id: 4,
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: "2:47",
    cover: "https://i.scdn.co/image/ab67616d0000b273be45d5c8fd48b2b7b5fb81503e",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    genre: "Pop",
    year: 2022,
  },
  {
    id: 5,
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: "3:58",
    cover: "https://i.scdn.co/image/ab67616d0000b27393b2e5e0b89c83b52e60e8e8",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    genre: "Alternative",
    year: 2020,
  },
  {
    id: 6,
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    cover: "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    genre: "Pop Rock",
    year: 2021,
  },
  {
    id: 7,
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3: OVER YOU",
    duration: "2:21",
    cover: "https://i.scdn.co/image/ab67616d0000b2735ba9e1dd02bdaac28e6b9df0",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    genre: "Pop",
    year: 2021,
  },
  {
    id: 8,
    title: "Industry Baby",
    artist: "Lil Nas X & Jack Harlow",
    album: "MONTERO",
    duration: "3:32",
    cover: "https://i.scdn.co/image/ab67616d0000b273be82673b5f79d9658ec0a9fd",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    genre: "Hip Hop",
    year: 2021,
  },
  {
    id: 9,
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    cover: "https://i.scdn.co/image/ab67616d0000b273ef6f49ddd560d08eb3bb5f20",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    genre: "Pop",
    year: 2020,
  },
  {
    id: 10,
    title: "Peaches",
    artist: "Justin Bieber ft. Daniel Caesar & Giveon",
    album: "Justice",
    duration: "3:18",
    cover: "https://i.scdn.co/image/ab67616d0000b273564ce6c94297f426ccc14f7e",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    genre: "R&B",
    year: 2021,
  },
];

const loadSongsData = async (): Promise<void> => {
  try {
    let apiSongs: Song[] = [];

    if (USE_JSONP_PROXY) {
      try {
        const data = await fetchDeezerWithJSONP();
        if (data && data.data) {
          apiSongs = data.data.map((song: any, index: number) => ({
            id: index + 1,
            title: song.title,
            artist: song.artist.name,
            album: song.album.title,
            duration: formatDuration(song.duration),
            cover: song.album.cover_medium || song.artist.picture_medium,
            audioUrl:
              song.preview ||
              `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${
                (index % 10) + 1
              }.mp3`,
            genre: "Pop",
            year: song.album.release_date
              ? new Date(song.album.release_date).getFullYear()
              : 2024,
          }));
        }
      } catch {
        try {
          const data = await fetchWithCorsProxy(
            "https://api.deezer.com/chart/0/tracks?limit=200"
          );
          if (data && data.data) {
            apiSongs = data.data.map((song: any, index: number) => ({
              id: index + 1,
              title: song.title,
              artist: song.artist.name,
              album: song.album.title,
              duration: formatDuration(song.duration),
              cover: song.album.cover_medium || song.artist.picture_medium,
              audioUrl:
                song.preview ||
                `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${
                  (index % 10) + 1
                }.mp3`,
              genre: "Pop",
              year: song.album.release_date
                ? new Date(song.album.release_date).getFullYear()
                : 2024,
            }));
          }
        } catch {
          console.error("Failed to fetch from primary API, using mock data.");
        }
      }
    }

    if (USE_ALTERNATIVE_API && apiSongs.length === 0) {
      try {
        const response = await fetch(
          "https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=YOUR_API_KEY&format=json&limit=50"
        );
        await response.json();
      } catch {
        console.error("Failed to fetch from alternative API, using mock data.");
      }
    }

    if (apiSongs.length === 0 || USE_MOCK_DATA) {
      apiSongs = getExampleSongs();
    }

    songsData = {
      songs: apiSongs,
      albums: generateAlbums(apiSongs),
      playlists: generatePlaylists(apiSongs),
    };
  } catch {
    const exampleSongs = getExampleSongs();
    songsData = {
      songs: exampleSongs,
      albums: generateAlbums(exampleSongs),
      playlists: generatePlaylists(exampleSongs),
    };
  }
};

loadSongsData();

export const getSongs = (): Song[] => songsData.songs;
export const getAlbums = (): Album[] => songsData.albums;
export const getPlaylists = (): Playlist[] => songsData.playlists;
export const getSongById = (id: number): Song | undefined =>
  songsData.songs.find((song) => song.id === id);
export const getAlbumById = (id: number): Album | undefined =>
  songsData.albums.find((album) => album.id === id);
export const getPlaylistById = (id: string): Playlist | undefined =>
  songsData.playlists.find((playlist) => playlist.id === id);
export const searchSongs = (query: string): Song[] => {
  const q = query.toLowerCase();
  return songsData.songs.filter(
    (song) =>
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      song.album.toLowerCase().includes(q)
  );
};
export const getSongsByGenre = (genre: string): Song[] =>
  songsData.songs.filter((song) => song.genre === genre);
export const reloadSongs = async (): Promise<void> => {
  await loadSongsData();
};
export const isDataLoaded = (): boolean => songsData.songs.length > 0;
