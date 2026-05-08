import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api/axios";

export default function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const fetchOrganizations = async () => {
    const res = await API.get("/organizations/my");
    setOrganizations(res.data.organizations || []);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    await API.post("/organizations", form);

    setForm({
      name: "",
      description: "",
    });

    fetchOrganizations();
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-slate-500 mt-1">
            Manage your workspaces and teams.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl border shadow-sm p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          placeholder="Organization name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border rounded-xl px-4 py-3 outline-none"
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="border rounded-xl px-4 py-3 outline-none"
        />

        <button className="bg-slate-900 text-white rounded-xl font-semibold">
          Create Organization
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="bg-white rounded-2xl border shadow-sm p-6"
          >
            <h2 className="text-xl font-bold">{org.name}</h2>
            <p className="text-slate-500 mt-2">
              {org.description || "No description"}
            </p>

            <div className="mt-5 text-sm text-slate-600">
              Members: {org.members?.length || 0}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}