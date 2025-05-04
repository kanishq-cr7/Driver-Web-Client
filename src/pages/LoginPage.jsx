import { useForm } from "@mantine/form";
import { TextInput, PasswordInput, Button, Paper } from "@mantine/core";
import { useAuth } from "../context/AuthContext";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const form = useForm({
    initialValues: { username: "", password: "" },
    validate: {
      username: (v) => (v ? null : "Username required"),
      password: (v) => (v.length >= 6 ? null : "Min 6 chars"),
    },
  });

  const onSubmit = async (values) => {
    try {
      await login(values.username, values.password);
      nav("/");
    } catch (e) {
      showNotification({ color: "red", title: "Login failed", message: e.response?.data?.error });
    }
  };

  return (
    <Paper maw={400} mx="auto" mt="lg" p="lg" shadow="md" withBorder>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput label="Username" {...form.getInputProps("username")} />
        <PasswordInput label="Password" mt="sm" {...form.getInputProps("password")} />
        <Button fullWidth mt="lg" type="submit">Login</Button>
      </form>
    </Paper>
  );
}
