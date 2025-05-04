import {
    Modal,
    TextInput,
    Button,
    Stack,
    Select,
    Group,
  } from "@mantine/core";
  import { useForm } from "@mantine/form";
  import { showNotification } from "@mantine/notifications";
  import api from "../services/api";
  
  export default function AddVehicleModal({ opened, onClose, onCreated }) {
    const form = useForm({
      initialValues: { plate: "", model: "", type: "" },
      validate: {
        plate: (v) => (v ? null : "Required"),
        model: (v) => (v ? null : "Required"),
        type: (v) => (v ? null : "Required"),
      },
    });
  
    const submit = form.onSubmit(async (vals) => {
      try {
        await api.post("/vehicles", vals);
        showNotification({ color: "green", message: "Vehicle created" });
        onCreated();
        onClose();
      } catch (e) {
        showNotification({ color: "red", message: e.response?.data?.error });
      }
    });
  
    return (
      <Modal opened={opened} onClose={onClose} title="Add vehicle">
        <form onSubmit={submit}>
          <Stack>
            <TextInput label="Plate" {...form.getInputProps("plate")} />
            <TextInput label="Model" {...form.getInputProps("model")} />
  
            <Select
              label="Type"
              data={["Sedan", "SUV", "Van", "Minivan"]}
              {...form.getInputProps("type")}
            />
  
            <Group position="right" mt="md">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    );
  }
  