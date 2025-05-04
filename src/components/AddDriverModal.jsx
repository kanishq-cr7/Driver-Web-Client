import {
    Modal,
    Button,
    TextInput,
    Group,
    Stack,
  } from "@mantine/core";
  import { useForm } from "@mantine/form";
  import { showNotification } from "@mantine/notifications";
  import api from "../services/api";
  import { useAuth } from "../context/AuthContext";           
  
  export default function AddDriverModal({ opened, onClose, onCreated }) {
    const { user } = useAuth(); 
    const form = useForm({
      initialValues: {
        first_name: "",
        last_name: "",
        licence_number: "",
      },
      validate: {
        first_name: v => (v ? null : "First name required"),
        last_name:  v => (v ? null : "Last name required"),
        licence_number: v =>
          v.length >= 3 ? null : "Licence number ≥ 3 chars",
      },
    });
  
    const handleSubmit = async (values) => {
      try {
        await api.post("/drivers", {
         ...values,
         createdBy: user.userId || user._id,  // whichever your JWT contains
        });
            
        showNotification({ color: "green", message: "Driver created" });
        onCreated();          // refresh list
        onClose();            // close modal
        form.reset();
      } catch (e) {
        showNotification({ color: "red", message: e.response?.data?.error });
      }
    };
  
    return (
      <Modal opened={opened} onClose={onClose} title="Add Driver" centered>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="First name"
              {...form.getInputProps("first_name")}
            />
            <TextInput
              label="Last name"
              {...form.getInputProps("last_name")}
            />
            <TextInput
              label="Licence number"
              {...form.getInputProps("licence_number")}
            />
  
            <Group position="right" mt="md">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    );
  }