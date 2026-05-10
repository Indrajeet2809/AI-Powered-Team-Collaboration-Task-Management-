import { useEffect, useState } from "react";
import {
  Building2,
  FolderKanban,
  Layers3,
  PlusCircle,
  Users,
} from "lucide-react";
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

  const totalTasks = projects.reduce(
    (total, project) => total + (project.tasks?.length || 0),
    0
  );

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
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <FolderKanban size={28} />
          </div>

          <div>
            <h1 className="text-4xl font-black">Projects</h1>
            <p className="mt-2 text-blue-100">
              Create, organize and track projects inside your organization.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Total Projects
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">
            {projects.length}
          </h2>
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Total Tasks
          </p>
          <h2 className="mt-2 text-4xl font-black text-blue-600">
            {totalTasks}
          </h2>
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Selected Organization
          </p>
          <h2 className="mt-2 text-2xl font-black text-emerald-600">
            {selectedOrg?.name || "No Organization"}
          </h2>
        </div>
      </div>

      <div className="mb-8 rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Select Organization
        </label>

        <select
          value={selectedOrgId}
          onChange={(e) => setSelectedOrgId(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
          className="mb-8 rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <PlusCircle size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Create Project
              </h2>
              <p className="text-sm text-slate-500">
                Add a new project and optionally assign it to a team.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <input
              placeholder="Project name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <select
              value={form.teamId}
              onChange={(e) =>
                setForm({ ...form, teamId: e.target.value })
              }
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">No team</option>

              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>

            <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white shadow-lg hover:opacity-95">
              Create Project
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Layers3 size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Project Directory
            </h2>
            <p className="text-sm text-slate-500">
              All projects under the selected organization.
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FolderKanban size={28} />
            </div>

            <h3 className="mt-4 text-xl font-black text-slate-900">
              No projects created yet
            </h3>

            <p className="mt-2 text-slate-500">
              Projects created inside this organization will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <FolderKanban size={22} />
                </div>

                <h2 className="text-xl font-black text-slate-900">
                  {project.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {project.description || "No description"}
                </p>

                <div className="mt-5 space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-bold text-purple-600">
                    <Users size={15} />
                    Team: {project.team?.name || "No team"}
                  </div>

                  <div className="block">
                    <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
                      Tasks: {project.tasks?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}