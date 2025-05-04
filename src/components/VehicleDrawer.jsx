import {
    Drawer,
    TextInput,
    Select,
    Stack,
    Group,
    Button,
    Loader,
    Alert,
  } from "@mantine/core";
  import { IconTrash } from "@tabler/icons-react";
  import { useForm } from "@mantine/form";
  import { useEffect, useState } from "react";
  import { showNotification } from "@mantine/notifications";
  import api from "../services/api";
  
  export default function VehicleDrawer({ id, opened, onClose, onSaved }) {
    const [loading, setLoading] = useState(true);
  
    const form = useForm({
      initialValues: {
        plate: "",
        model: "",
        type: "",
        driverLicence: "", // ← licence string, not _id
      },
    });
  
    /* ---- fetch vehicle ---- */
    useEffect(() => {
      if (!opened || !id) return;
      (async () => {
        setLoading(true);
        const { data } = await api.get(`/vehicles/${id}`);
        form.setValues({
          plate: data.plate,
          model: data.model,
          type: data.type,
          driverLicence: data.driver?.licence_number ?? "",
        });
        setLoading(false);
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, id]);
  
    /* ---- helper to resolve licence → _id ---- */
    const licenceToId = async (lic) => {
      if (!lic) return null;
      try {
        const { data } = await api.get(`/drivers/${lic}`); // licence used as :id
        return data?._id || null;
      } catch {
        return null; // not found
      }
    };
  
    /* ---- Update vehicle ---- */
    const submit = form.onSubmit(async (vals) => {
      try {
        const driverId = await licenceToId(vals.driverLicence);
        await api.put(`/vehicles/${id}`, {
          model: vals.model,
          type: vals.type,
          driver: driverId, // ObjectId or null
        });
        showNotification({ color: "green", message: "Vehicle updated" });
        onSaved();
        onClose();
      } catch (e) {
        showNotification({ color: "red", message: e.response?.data?.error });
      }
    });
  
    /* ---- Delete vehicle ---- */
    const del = async () => {
      if (!window.confirm("Delete this vehicle?")) return;
      try {
        await api.delete(`/vehicles/${id}`);
        showNotification({ color: "green", message: "Deleted" });
        onSaved();
        onClose();
      } catch (e) {
        showNotification({ color: "red", message: e.response?.data?.error });
      }
    };
  
    /* ---- UI ---- */
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        title="Vehicle details"
        padding="xl"
        size="md"
      >
        {loading ? (
          <Loader mt="lg" />
        ) : (
          <>
            <form onSubmit={submit}>
              <Stack>
                <TextInput label="Plate" disabled {...form.getInputProps("plate")} />
                <TextInput label="Model" {...form.getInputProps("model")} />
                <Select
                  label="Type"
                  data={["Sedan", "SUV", "Van", "Minivan"]}
                  {...form.getInputProps("type")}
                />
                <TextInput
                  label="Driver Licence (leave blank for none)"
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
  
            <Alert
              mt="xl"
              icon={<IconTrash size={16} />}
              title="Danger zone"
              color="red"
              withCloseButton={false}
            >
              <Button color="red" leftIcon={<IconTrash size={14} />} onClick={del}>
                Delete vehicle
              </Button>
            </Alert>
          </>
        )}
      </Drawer>
    );
  }
  