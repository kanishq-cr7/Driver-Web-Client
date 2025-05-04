import { Center, Stack, Title, Text, Button, Group } from "@mantine/core";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <Center mih="70vh">
      <Stack align="center" spacing="md">
        <Title order={2}>🎉 Welcome to the Vehicle‑Driver Dashboard!</Title>

        <Text align="center" maw={520}>
          Use the sidebar to manage drivers &amp; vehicles. Data is live from
          your MongoDB via the REST API. Click a driver row for quick edit.
        </Text>

        <Group>
          <Button component={Link} to="/drivers">
            Drivers
          </Button>
          <Button component={Link} to="/vehicles" variant="outline">
            Vehicles
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}
