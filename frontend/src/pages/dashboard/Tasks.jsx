import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const columns = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"];

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

  const res = await API.get(`/organizations/my`);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-slate-500 mt-1">
          Manage your project tasks with Kanban workflow.
        </p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
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

        <div>
          <label className="block text-sm font-semibold mb-2">
            Select Project
          </label>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none"
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
    className="bg-white rounded-2xl border shadow-sm p-6 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4"
  >
    <input
      placeholder="Task title"
      value={form.title}
      onChange={(e) =>
        setForm({ ...form, title: e.target.value })
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
      value={form.priority}
      onChange={(e) =>
        setForm({ ...form, priority: e.target.value })
      }
      className="border rounded-xl px-4 py-3 outline-none"
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
      className="border rounded-xl px-4 py-3 outline-none"
    >
      <option value="">Unassigned</option>

      {members.map((member) => (
        <option key={member.id} value={member.userId}>
          {member.user?.name || member.user?.email}
        </option>
      ))}
    </select>

    <button className="bg-slate-900 text-white rounded-xl font-semibold">
      Create Task
    </button>
  </form>
)}

{!canManage && (
  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-2xl p-4 mb-8">
    You have member access. You can view and update assigned tasks, but you cannot create tasks.
  </div>
)}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map((status) => (
          <div
            key={status}
            className="bg-white/90 rounded-2xl border border-slate-200 shadow-sm p-4 min-h-[240px]"
          >
            {/* <h2 className="font-bold mb-5">{status}</h2> */}
            <h2 className="text-sm font-bold mb-4 text-slate-600 uppercase tracking-wide">
              {status.replace("_", " ")}
            </h2>

            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="font-semibold">{task.title}</h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {task.description || "No description"}
                    </p>

                    <p className="text-xs mt-3">
                      Priority:{" "}
                      <span className="font-semibold">
                        {task.priority}
                      </span>
                    </p>

                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(task.id, e.target.value)
                      }
                      className="mt-4 w-full border rounded-lg px-3 py-2 text-sm"
                    >
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}