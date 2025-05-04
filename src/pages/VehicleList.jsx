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
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import api from "../services/api";
import TableToolbar from "../components/TableToolbar";

export default function VehicleList() {
  /* ---------------- state ---------------- */
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modelSearch, setModelSearch] = useState("");
  const [debouncedModel] = useDebouncedValue(modelSearch, 400); // ⬅️ debounce 400 ms

  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("plate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  /* re‑fetch when dependencies change */
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  /* ---------------- rows ---------------- */
  const rows =
    vehicles.length > 0 ? (
      vehicles.map((v) => (
        <tr key={v._id}>
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
    );

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
            onChange={(value) => {
              setPage(1);
              setTypeFilter(value);
            }}
            clearable
            data={[
              { value: "Sedan", label: "Sedan" },
              { value: "SUV", label: "SUV" },
              { value: "Van", label: "Van" },
              { value: "Minivan", label: "Minivan" },
            ]}
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

          {/* manual trigger if user prefers */}
          <Button
            onClick={() => {
              setPage(1);
              fetchVehicles();
            }}
          >
            Search
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
            sx={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr>
                <th style={{ width: "18%" }}>Plate</th>
                <th style={{ width: "34%" }}>Model</th>
                <th style={{ width: "24%" }}>Type</th>
                <th style={{ width: "24%" }}>Driver&nbsp;Licence</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length > 0 ? (
                vehicles.map((v) => (
                  <tr key={v._id}>
                    <td style={{ width: "18%" }}>{v.plate}</td>
                    <td style={{ width: "34%" }}>{v.model}</td>
                    <td style={{ width: "24%" }}>{v.type}</td>
                    <td style={{ width: "24%" }}>
                      {v.driver?.licence_number ?? "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
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
    </>
  );
}
