export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
  playlists: string[];
  favorites: number[];
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem("kodigo_users");
  if (!users) {
    const defaultUsers: User[] = [
      {
        id: "1",
        name: "Usuario Demo",
        email: "demo@kodigo.com",
        password: "123456",
        created_at: new Date().toISOString(),
        playlists: ["1", "2"],
        favorites: [1, 3, 5],
      },
    ];
    localStorage.setItem("kodigo_users", JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(users);
};

const saveUsers = (users: User[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("kodigo_users", JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userSession = localStorage.getItem("kodigo_session");
  if (!userSession) return null;

  const { userId } = JSON.parse(userSession);
  const users = getUsers();
  return users.find((user) => user.id === userId) || null;
};

export const login = async (
  credentials: LoginCredentials
): Promise<{ user?: User; error?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const users = getUsers();
  const user = users.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    return { error: "Email o contraseña incorrectos" };
  }

  localStorage.setItem("kodigo_session", JSON.stringify({ userId: user.id }));

  return { user };
};

export const register = async (
  data: RegisterData
): Promise<{ user?: User; error?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const users = getUsers();

  if (users.find((u) => u.email === data.email)) {
    return { error: "Este email ya está registrado" };
  }

  const newUser: User = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    password: data.password,
    created_at: new Date().toISOString(),
    playlists: [],
    favorites: [],
  };

  users.push(newUser);
  saveUsers(users);

  localStorage.setItem(
    "kodigo_session",
    JSON.stringify({ userId: newUser.id })
  );

  return { user: newUser };
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("kodigo_session");
};

export const addToFavorites = (songId: number) => {
  const user = getCurrentUser();
  if (!user) return;

  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === user.id);

  if (userIndex !== -1 && !users[userIndex].favorites.includes(songId)) {
    users[userIndex].favorites.push(songId);
    saveUsers(users);
  }
};

export const removeFromFavorites = (songId: number) => {
  const user = getCurrentUser();
  if (!user) return;

  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === user.id);

  if (userIndex !== -1) {
    users[userIndex].favorites = users[userIndex].favorites.filter(
      (id) => id !== songId
    );
    saveUsers(users);
  }
};
