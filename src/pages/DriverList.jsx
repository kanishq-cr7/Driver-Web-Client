import { useEffect, useState } from "react";
import {
  Table,
  TextInput,
  Button,
  Pagination,
  Loader,
  Group,
} from "@mantine/core";
import { useDisclosure, useDebouncedValue } from "@mantine/hooks";
import api from "../services/api";
import TableToolbar from "../components/TableToolbar";
import AddDriverModal from "../components/AddDriverModal";
import DriverDrawer from "../components/DriverDrawer";

export default function DriverList() {
  /* ---------------- state ---------------- */
  const [drivers, setDrivers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 400); // ⬅️ debounce 400 ms
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [drawerId, setDrawerId] = useState(null);

  /* ---------------- fetch ---------------- */
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/drivers", {
        params: {
          first_name: debouncedSearch || undefined, // ⬅️ use debounced value
          sortBy: "last_name",
          sortOrder: "asc",
          page,
          limit: 10,
        },
      });

      const items = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.items)
        ? res.data.items
        : [];

      setDrivers(items);
      setTotal(res.data.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      setDrivers([]);
      setTotal(1);
    } finally {
      setLoading(false);
    }
  };

  /* Re‑fetch when page OR debouncedSearch changes */
  useEffect(() => {
    fetchDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  /* ---------------- rows ---------------- */
  const rows =
    drivers.length > 0 ? (
      drivers.map((d) => (
        <tr
          key={d._id}
          style={{ cursor: "pointer" }}
          onClick={() => setDrawerId(d._id)}
        >
          <td>{d.licence_number}</td>
          <td>{d.first_name}</td>
          <td>{d.last_name}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={3} style={{ textAlign: "center", padding: "1rem" }}>
          No results
        </td>
      </tr>
    );

  /* ---------------- UI ---------------- */
  return (
    <>
      <TableToolbar title="Drivers">
        <Group>
          <TextInput
            placeholder="Search first name"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          {/* optional manual trigger */}
          <Button
            onClick={() => {
              setPage(1);
              fetchDrivers();
            }}
          >
            Search
          </Button>
          <Button variant="outline" onClick={open}>
            Add
          </Button>
        </Group>
      </TableToolbar>

      {loading ? (
        <Loader mx="auto" mt="xl" />
      ) : (
        <Table
          striped
          highlightOnHover
          withBorder
          withColumnBorders
          verticalSpacing="sm"
          sx={{ tableLayout: "fixed", width: "100%" }} // full width
        >
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Licence</th>
              <th style={{ width: "37.5%" }}>First</th>
              <th style={{ width: "37.5%" }}>Last</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length > 0 ? (
              drivers.map((d) => (
                <tr
                  key={d._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setDrawerId(d._id)}
                >
                  <td style={{ width: "25%" }}>{d.licence_number}</td>
                  <td style={{ width: "37.5%" }}>{d.first_name}</td>
                  <td style={{ width: "37.5%" }}>{d.last_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Pagination mt="md" total={total} value={page} onChange={setPage} />

      <AddDriverModal
        opened={opened}
        onClose={close}
        onCreated={fetchDrivers}
      />

      <DriverDrawer
        id={drawerId}
        opened={Boolean(drawerId)}
        onClose={() => setDrawerId(null)}
        onSaved={fetchDrivers}
      />
    </>
  );
}
