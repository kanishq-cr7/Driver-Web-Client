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
    /* ---------------- form ---------------- */
    const form = useForm({
      initialValues: { plate: "", model: "", type: "", driverLicence: "" },
      validate: {
        plate: (v) => (v ? null : "Required"),
        model: (v) => (v ? null : "Required"),
        type:  (v) => (v ? null : "Required"),
      },
    });
  
    /* helper: licence → driver _id */
    const licenceToId = async (lic) => {
      if (!lic) return null;
      try {
        const { data } = await api.get(`/drivers/${lic}`);
        return data?._id || null;
      } catch {
        return null;
      }
    };
  
    /* ---------------- submit ---------------- */
    const submit = form.onSubmit(async (vals) => {
      try {
        const driverId = await licenceToId(vals.driverLicence);
  
        if (vals.driverLicence && !driverId) {
          showNotification({ color: "red", message: "Driver not found" });
          return;
        }
  
        /* build payload, omit driver if none */
        const payload = {
          plate: vals.plate,
          model: vals.model,
          type:  vals.type,
        };
        if (driverId) payload.driver = driverId;
  
        await api.post("/vehicles", payload);
  
        showNotification({ color: "green", message: "Vehicle created" });
        onCreated();
        onClose();
        form.reset();
      } catch (e) {
        showNotification({
          color: "red",
          message: e.response?.data?.error || "Create failed",
        });
      }
    });
  
    /* ---------------- UI ---------------- */
    return (
      <Modal opened={opened} onClose={onClose} title="Add vehicle">
        <form onSubmit={submit}>
          <Stack>
            <TextInput label="Plate"  {...form.getInputProps("plate")} />
            <TextInput label="Model"  {...form.getInputProps("model")} />
            <Select
              label="Type"
              data={["Sedan", "SUV", "Van", "Minivan"]}
              {...form.getInputProps("type")}
            />
            <TextInput
              label="Driver licence (optional)"
              {...form.getInputProps("driverLicence")}
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
  