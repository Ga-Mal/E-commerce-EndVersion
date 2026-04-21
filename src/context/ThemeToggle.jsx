// ThemeToggle.jsx
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";


export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <p className="text-[30px] cursor-pointer hover:scale-120 transition" onClick={toggleTheme}>
      {theme === "dark" ? "☀️" : "🌙"}
    </p>
  );
}
