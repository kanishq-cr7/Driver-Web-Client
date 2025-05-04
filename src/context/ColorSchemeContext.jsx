import { createContext, useState, useContext } from "react";
import { MantineProvider } from "@mantine/core";

export const ColorCtx = createContext();

export default function ColorSchemeContext({ children }) {
  const [scheme, setScheme] = useState(
    localStorage.getItem("color-scheme") || "light"
  );

  const toggleScheme = () => {
    const next = scheme === "light" ? "dark" : "light";
    setScheme(next);
    localStorage.setItem("color-scheme", next);
  };

  return (
    <ColorCtx.Provider value={{ scheme, toggleScheme }}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: scheme }}
      >
        {children}
      </MantineProvider>
    </ColorCtx.Provider>
  );
}

/* Helper hook for convenience */
export const useColorCtx = () => useContext(ColorCtx);
