import { createContext, useEffect, useState } from "react"

export const ThemeContext = createContext()

function ThemeProvider({children}) {
    const [theme , setTheme] = useState(localStorage.getItem("theme") || "light");

    // Set initial theme based on system preference ONLY if not saved in localStorage
    useEffect(() => {
        if (!localStorage.getItem("theme")) {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            setTheme(systemTheme);
        }
    }, []);

    // Update the data-theme attribute and save to localStorage whenever the theme changes
    useEffect (() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Listen for changes in system theme preference
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e) => {
            setTheme(e.matches ? "dark" : "light");
        };

        // Add event listener for changes in system theme preference
        mediaQuery.addEventListener("change", handleChange);
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    // Function to toggle between light and dark themes
    const toggleTheme = () => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    };

    // Provide the theme and toggle function to the context consumers
  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
        {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
