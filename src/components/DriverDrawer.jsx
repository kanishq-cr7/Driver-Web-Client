import { Drawer, TextInput, Button, Stack, Group, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState, useEffect } from "react";
import api from "../services/api";
import { IconTrash } from "@tabler/icons-react";

export default function DriverDrawer({ id, opened, onClose, onSaved }) {
  const [loading, setLoading] = useState(true);
  const form = useForm({
    initialValues: { first_name: "", last_name: "", licence_number: "" },
    validate: {
      first_name: (v) => (v ? null : "Required"),
      last_name: (v) => (v ? null : "Required"),
    },
  });

  // fetch driver on open
  useEffect(() => {
    if (!opened || !id) return;
    (async () => {
      setLoading(true);
      const { data } = await api.get(`/drivers/${id}`);
      form.setValues(data);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, id]);

  const submit = form.onSubmit(async (values) => {
    try {
      await api.put(`/drivers/${id}`, values);
      showNotification({ color: "green", message: "Driver updated" });
      onSaved();
      onClose();
    } catch (e) {
      showNotification({ color: "red", message: e.response?.data?.error });
    }
  });

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Driver details"
      padding="xl"
      size="md"
    >
      {loading ? (
        <Loader mt="lg" />
      ) : (
        <form onSubmit={submit}>
          <Stack>
            <TextInput
              label="First name"
              {...form.getInputProps("first_name")}
            />
            <TextInput label="Last name" {...form.getInputProps("last_name")} />
            <TextInput
              label="Licence number"
              disabled
              {...form.getInputProps("licence_number")}
            />
            <Group position="right" mt="md">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </Group>
            <Group position="apart" mt="xl">
              <Button
                color="red"
                variant="light"
                leftIcon={<IconTrash size={14} />}
                onClick={async () => {
                  if (!window.confirm("Delete this driver?")) return;
                  try {
                    await api.delete(`/drivers/${id}`);
                    showNotification({ color: "green", message: "Deleted" });
                    onSaved();
                    onClose();
                  } catch (e) {
                    showNotification({
                      color: "red",
                      message: e.response?.data?.error || "Delete failed",
                    });
                  }
                }}
              >
                Delete
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Drawer>
  );
}
