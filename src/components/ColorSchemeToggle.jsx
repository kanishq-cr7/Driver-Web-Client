import { ActionIcon, Tooltip } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { useColorCtx } from "../context/ColorSchemeContext";

export default function ColorSchemeToggle() {
  const { scheme, toggleScheme } = useColorCtx();
  const dark = scheme === "dark";

  return (
    <Tooltip label={dark ? "Switch to light" : "Switch to dark"}>
      <ActionIcon
        variant="default"
        onClick={toggleScheme}
        size="lg"
        radius="xl"
      >
        {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
      </ActionIcon>
    </Tooltip>
  );
}
