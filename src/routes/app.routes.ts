export type AppRoute = {
  path: string;
  element: React.ComponentType;
  protected?: boolean;
  name?: string;
};

import HomePage from "../pages/HomePage";
import LibraryPage from "../pages/LibraryPage";
import SearchPage from "../pages/SearchPage";

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    element: HomePage,
    name: "Inicio",
  },
  {
    path: "/library",
    element: LibraryPage,
    name: "Biblioteca",
  },
  {
    path: "/search",
    element: SearchPage,
    name: "Buscar",
  },
];
