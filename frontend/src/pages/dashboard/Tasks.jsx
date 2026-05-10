import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  ListTodo,
  PlusCircle,
  UserCheck,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const columns = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"];

const statusStyles = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  REVIEW: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

const priorityStyles = {
  LOW: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-red-100 text-red-700",
};

export default function Tasks() {
  const { user } = useAuth();

  const [organizations, setOrganizations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assignedToId: "",
  });

  const fetchOrganizations = async () => {
    const res = await API.get("/organizations/my");
    const orgs = res.data.organizations || [];

    setOrganizations(orgs);

    if (orgs.length > 0) {
      setSelectedOrgId(orgs[0].id);
    }
  };

  const fetchProjects = async (organizationId) => {
    if (!organizationId) return;

    const res = await API.get(`/projects/organization/${organizationId}`);
    const projectList = res.data.projects || [];

    setProjects(projectList);

    if (projectList.length > 0) {
      setSelectedProjectId(projectList[0].id);
    } else {
      setSelectedProjectId("");
      setTasks([]);
    }
  };

  const fetchTasks = async (projectId) => {
    if (!projectId) return;

    const res = await API.get(`/projects/${projectId}/tasks`);
    setTasks(res.data.tasks || []);
  };

  const fetchMembers = async (organizationId) => {
    if (!organizationId) return;

    const res = await API.get("/organizations/my");
    const orgs = res.data.organizations || [];
    const selectedOrg = orgs.find((org) => org.id === organizationId);

    setMembers(selectedOrg?.members || []);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    fetchProjects(selectedOrgId);
    fetchMembers(selectedOrgId);
  }, [selectedOrgId]);

  useEffect(() => {
    fetchTasks(selectedProjectId);
  }, [selectedProjectId]);

  const selectedOrg = organizations.find(
    (org) => org.id === selectedOrgId
  );

  const selectedMembership = selectedOrg?.members?.find(
    (member) => member.userId === user?.id
  );

  const canManage =
    selectedMembership?.role === "ORG_ADMIN" ||
    selectedMembership?.role === "MANAGER";

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!selectedProjectId) {
      alert("Please select project first");
      return;
    }

    await API.post(`/projects/${selectedProjectId}/tasks`, {
      title: form.title,
      description: form.description,
      priority: form.priority,
      assignedToId: form.assignedToId || null,
    });

    setForm({
      title: "",
      description: "",
      priority: "MEDIUM",
      assignedToId: "",
    });

    fetchTasks(selectedProjectId);
  };

  const updateStatus = async (taskId, status) => {
    await API.patch(`/projects/tasks/${taskId}/status`, {
      status,
    });

    fetchTasks(selectedProjectId);
  };

  return (
    <DashboardLayout>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <ClipboardList size={28} />
          </div>

          <div>
            <h1 className="text-4xl font-black">Tasks</h1>
            <p className="mt-2 text-blue-100">
              Manage assigned work with a clean Kanban workflow.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Total Tasks
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">
            {tasks.length}
          </h2>
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Completed
          </p>
          <h2 className="mt-2 text-4xl font-black text-emerald-600">
            {completedTasks}
          </h2>
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Your Role
          </p>
          <h2 className="mt-2 text-2xl font-black text-blue-600">
            {selectedMembership?.role || "USER"}
          </h2>
        </div>
      </div>

      <div className="mb-8 rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
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

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Select Project
          </label>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {canManage && (
        <form
          onSubmit={handleCreateTask}
          className="mb-8 rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <PlusCircle size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Create Task
              </h2>
              <p className="text-sm text-slate-500">
                Assign work to a member and track progress.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <input
              placeholder="Task title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
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
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

            <select
              value={form.assignedToId}
              onChange={(e) =>
                setForm({ ...form, assignedToId: e.target.value })
              }
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Unassigned</option>

              {members.map((member) => (
                <option key={member.id} value={member.userId}>
                  {member.user?.name || member.user?.email}
                </option>
              ))}
            </select>

            <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white shadow-lg hover:opacity-95">
              Create Task
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <FolderKanban size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Kanban Board
            </h2>
            <p className="text-sm text-slate-500">
              Move tasks across workflow stages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
          {columns.map((status) => (
            <div
              key={status}
              className="min-h-[260px] rounded-3xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    statusStyles[status]
                  }`}
                >
                  {status.replace("_", " ")}
                </span>

                <span className="text-xs font-bold text-slate-400">
                  {tasks.filter((task) => task.status === status).length}
                </span>
              </div>

              <div className="space-y-4">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="font-black text-slate-900">
                          {task.title}
                        </h3>

                        {task.status === "COMPLETED" && (
                          <CheckCircle2
                            size={18}
                            className="text-emerald-600"
                          />
                        )}
                      </div>

                      <p className="text-sm text-slate-500">
                        {task.description || "No description"}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            priorityStyles[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>

                        {task.assignedTo && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                            <UserCheck size={13} />
                            {task.assignedTo.name ||
                              task.assignedTo.email}
                          </span>
                        )}
                      </div>

                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateStatus(task.id, e.target.value)
                        }
                        className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      >
                        {columns.map((col) => (
                          <option key={col} value={col}>
                            {col.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}