import { createContext } from "react";
// Контекст позволяет передавать данные по всему приложению, а не по древовидной структуре от родителя к потомку. Здесь хранится информация о сессии авторизации (статус пользователя и его некоторые данные)
export const AuthContext = createContext(null);
