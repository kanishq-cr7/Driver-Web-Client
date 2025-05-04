import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage     from "./pages/LoginPage";
import DriverList    from "./pages/DriverList";
import VehicleList   from "./pages/VehicleList";
import Welcome       from "./pages/Welcome";        // ⬅️  NEW
import ProtectedRoute from "./components/ProtectedRoute";
import MyAppShell     from "./components/AppShell";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* everything below requires auth */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MyAppShell />}>
            <Route path="/"        element={<Welcome />} />   {/* ⬅️ Welcome */}
            <Route path="/drivers" element={<DriverList />} />
            <Route path="/vehicles" element={<VehicleList />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
