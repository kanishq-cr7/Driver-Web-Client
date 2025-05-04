import { Button, Stack } from "@mantine/core";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();
  return (
    <Stack align="center" mt="lg">
      <Button component={Link} to="/drivers">Drivers</Button>
      <Button component={Link} to="/vehicles">Vehicles</Button>
      <Button color="red" onClick={logout}>Logout</Button>
    </Stack>
  );
}
