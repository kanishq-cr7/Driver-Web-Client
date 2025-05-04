import { Group, Title } from "@mantine/core";

export default function TableToolbar({ title, children }) {
  return (
    <Group position="apart" mb="md">
      <Title order={3}>{title}</Title>
      <Group>{children}</Group>
    </Group>
  );
}
