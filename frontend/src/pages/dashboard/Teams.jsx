import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api/axios";

export default function Teams() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [teams, setTeams] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const fetchOrganizations = async () => {
    const res = await API.get("/organizations/my");
    const orgs = res.data.organizations || [];

    setOrganizations(orgs);

    if (orgs.length > 0) {
      setSelectedOrgId(orgs[0].id);
    }
  };

  const fetchTeams = async (organizationId) => {
    if (!organizationId) return;

    const res = await API.get(`/teams/organization/${organizationId}`);
    setTeams(res.data.teams || []);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    fetchTeams(selectedOrgId);
  }, [selectedOrgId]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    if (!selectedOrgId) {
      alert("Please select organization first");
      return;
    }

    await API.post(`/teams/organization/${selectedOrgId}`, form);

    setForm({
      name: "",
      description: "",
    });

    fetchTeams(selectedOrgId);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Teams</h1>
        <p className="text-slate-500 mt-1">
          Create and manage teams inside your organizations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
        <label className="block text-sm font-semibold mb-2">
          Select Organization
        </label>

        <select
          value={selectedOrgId}
          onChange={(e) => setSelectedOrgId(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 outline-none"
        >
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={handleCreateTeam}
        className="bg-white rounded-2xl border shadow-sm p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          placeholder="Team name"
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
          Create Team
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-2xl border shadow-sm p-6"
          >
            <h2 className="text-xl font-bold">{team.name}</h2>

            <p className="text-slate-500 mt-2">
              {team.description || "No description"}
            </p>

            <p className="text-sm text-slate-600 mt-5">
              Members: {team.members?.length || 0}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}