import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function Projects() {
  const { user } = useAuth();

  const [organizations, setOrganizations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedOrgId, setSelectedOrgId] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    teamId: "",
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

  const fetchProjects = async (organizationId) => {
    if (!organizationId) return;

    const res = await API.get(`/projects/organization/${organizationId}`);
    setProjects(res.data.projects || []);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrgId) {
      fetchTeams(selectedOrgId);
      fetchProjects(selectedOrgId);
    }
  }, [selectedOrgId]);

  const selectedOrg = organizations.find(
    (org) => org.id === selectedOrgId
  );

  const selectedMembership = selectedOrg?.members?.find(
    (member) => member.userId === user?.id
  );

  const canManage =
    selectedMembership?.role === "ORG_ADMIN" ||
    selectedMembership?.role === "MANAGER";

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!selectedOrgId) {
      alert("Please select organization first");
      return;
    }

    await API.post(`/projects/organization/${selectedOrgId}`, {
      name: form.name,
      description: form.description,
      teamId: form.teamId || null,
    });

    setForm({
      name: "",
      description: "",
      teamId: "",
    });

    fetchProjects(selectedOrgId);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-slate-500 mt-1">
          Create and manage projects inside your organization.
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

      {canManage && (
        <form
          onSubmit={handleCreateProject}
          className="bg-white rounded-2xl border shadow-sm p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            placeholder="Project name"
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

          <select
            value={form.teamId}
            onChange={(e) =>
              setForm({ ...form, teamId: e.target.value })
            }
            className="border rounded-xl px-4 py-3 outline-none"
          >
            <option value="">No team</option>

            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <button className="bg-slate-900 text-white rounded-xl font-semibold">
            Create Project
          </button>
        </form>
      )}

      {!canManage && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-2xl p-4 mb-8">
          You have member access. You can view projects, but you cannot create new projects.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border shadow-sm p-6"
          >
            <h2 className="text-xl font-bold">{project.name}</h2>

            <p className="text-slate-500 mt-2">
              {project.description || "No description"}
            </p>

            <div className="mt-5 space-y-2 text-sm text-slate-600">
              <p>Team: {project.team?.name || "No team assigned"}</p>
              <p>Tasks: {project.tasks?.length || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}