import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MusicProvider } from "./contexts/MusicContext";
import { Sidebar } from "./components/sidebar";
import { MusicPlayer } from "./components/music-player";
import { appRoutes } from "./routes/app.routes";
function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <Router>
          <div className="flex h-screen bg-black text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto pb-24">
                <Routes>
                  {appRoutes.map(({ path, element: Element }) => (
                    <Route key={path} path={path} element={<Element />} />
                  ))}
                </Routes>
              </div>
              <MusicPlayer />
            </main>
          </div>
        </Router>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;
