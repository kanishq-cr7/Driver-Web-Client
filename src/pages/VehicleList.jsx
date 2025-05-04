import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TextInput,
  Select,
  Button,
  Pagination,
  Group,
  Loader,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import api from "../services/api";
import TableToolbar from "../components/TableToolbar";
import AddVehicleModal from "../components/AddVehicleModal";
import VehicleDrawer from "../components/VehicleDrawer";

export default function VehicleList() {
  /* ---------------- state ---------------- */
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modelSearch, setModelSearch] = useState("");
  const [debouncedModel] = useDebouncedValue(modelSearch, 400);

  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("plate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [addOpen, addHandlers] = useDisclosure(false);
  const [drawerId, setDrawerId] = useState(null);

  /* ---------------- fetch ---------------- */
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/vehicles", {
        params: {
          model: debouncedModel || undefined,
          type: typeFilter || undefined,
          sortBy,
          sortOrder,
          page,
          limit: 10,
        },
      });

      const items = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.items)
        ? res.data.items
        : [];

      setVehicles(items);
      setTotalPages(res.data.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      setVehicles([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [debouncedModel, typeFilter, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  /* ---------------- UI ---------------- */
  return (
    <>
      <TableToolbar title="Vehicles">
        <Group spacing="xs">
          <TextInput
            icon={<IconSearch size={16} />}
            placeholder="Model"
            value={modelSearch}
            onChange={(e) => {
              setPage(1);
              setModelSearch(e.currentTarget.value);
            }}
          />

          <Select
            placeholder="Type"
            value={typeFilter}
            onChange={(v) => { setPage(1); setTypeFilter(v); }}
            clearable
            data={["Sedan", "SUV", "Van", "Minivan"]}
          />

          <Select
            placeholder="Sort by"
            value={sortBy}
            onChange={setSortBy}
            data={[
              { value: "plate", label: "Plate" },
              { value: "model", label: "Model" },
              { value: "type", label: "Type" },
            ]}
          />

          <Select
            placeholder="Order"
            value={sortOrder}
            onChange={setSortOrder}
            data={[
              { value: "asc", label: "Asc" },
              { value: "desc", label: "Desc" },
            ]}
          />

          <Button onClick={() => { setPage(1); fetchVehicles(); }}>
            Search
          </Button>
          <Button variant="outline" onClick={addHandlers.open}>
            Add
          </Button>
        </Group>
      </TableToolbar>

      {loading ? (
        <Loader mx="auto" mt="xl" />
      ) : (
        <>
          <Table
            striped
            highlightOnHover
            withBorder
            withColumnBorders
            verticalSpacing="sm"
            sx={{ width: "100%", tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: "18%" }} />
              <col style={{ width: "34%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "24%" }} />
            </colgroup>

            <thead>
              <tr>
                <th>Plate</th>
                <th>Model</th>
                <th>Type</th>
                <th>Driver&nbsp;Licence</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.length ? (
                vehicles.map((v) => (
                  <tr
                    key={v._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setDrawerId(v._id)}
                  >
                    <td>{v.plate}</td>
                    <td>{v.model}</td>
                    <td>{v.type}</td>
                    <td>{v.driver?.licence_number ?? "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "1rem" }}>
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            mt="md"
            position="center"
          />
        </>
      )}

      <AddVehicleModal
        opened={addOpen}
        onClose={addHandlers.close}
        onCreated={fetchVehicles}
      />
      <VehicleDrawer
        id={drawerId}
        opened={Boolean(drawerId)}
        onClose={() => setDrawerId(null)}
        onSaved={fetchVehicles}
      />
    </>
  );
}
