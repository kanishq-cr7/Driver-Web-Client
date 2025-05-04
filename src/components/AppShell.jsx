import {
  AppShell,
  Burger,
  Group,
  Title,
  Button,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import { IconTruck, IconUser } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { useAuth } from "../context/AuthContext";

export default function MyAppShell() {
  const theme = useMantineTheme();
  const { logout } = useAuth();
  const nav = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 220,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened }
      }}
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[0],
        },
      }}
    >
      {/* ---------- header ---------- */}
      <AppShell.Header>
        <Group h="100%" px="md" position="apart">
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Title
              order={4}
              sx={{ cursor: "pointer" }}
              onClick={() => nav("/")}
            >
              IFN666 Dashboard
            </Title>
          </Group>
          <Group>
            <ColorSchemeToggle />
            <Button color="red" onClick={logout}>
              Logout
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      {/* ---------- sidebar ---------- */}
      <AppShell.Navbar p="md">
        <ScrollArea>
          <Button
            variant="subtle"
            fullWidth
            leftIcon={<IconUser size={18} />}
            component={Link}
            to="/drivers"
            onClick={toggle}
            mb="xs"
          >
            Drivers
          </Button>
          <Button
            variant="subtle"
            fullWidth
            leftIcon={<IconTruck size={18} />}
            component={Link}
            to="/vehicles"
            onClick={toggle}
          >
            Vehicles
          </Button>
        </ScrollArea>
      </AppShell.Navbar>

      {/* ---------- page body ---------- */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
