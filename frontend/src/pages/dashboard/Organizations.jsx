import { useEffect, useState } from "react";
import {
  Building2,
  Crown,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function Organizations() {
  const { user } = useAuth();

  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");

  const [orgForm, setOrgForm] = useState({
    name: "",
    description: "",
  });

  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });

  const fetchOrganizations = async () => {
    const res = await API.get("/organizations/my");
    const orgs = res.data.organizations || [];

    setOrganizations(orgs);

    if (!selectedOrgId && orgs.length > 0) {
      setSelectedOrgId(orgs[0].id);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const selectedOrg = organizations.find(
    (org) => org.id === selectedOrgId
  );

  const selectedMembership = selectedOrg?.members?.find(
    (member) => member.userId === user?.id
  );

  const isSuperAdmin = user?.platformRole === "SUPER_ADMIN";

  const canCreateOrganization = true;

  const canManageMembers =
    isSuperAdmin ||
    selectedMembership?.role === "ORG_ADMIN" ||
    selectedMembership?.role === "MANAGER";

  const totalMembers = organizations.reduce(
    (total, org) => total + (org.members?.length || 0),
    0
  );

  const handleCreateOrganization = async (e) => {
    e.preventDefault();

    await API.post("/organizations", orgForm);

    setOrgForm({
      name: "",
      description: "",
    });

    fetchOrganizations();
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!selectedOrgId) {
      alert("Please select organization first");
      return;
    }

    await API.post(
      `/organizations/${selectedOrgId}/members`,
      memberForm
    );

    setMemberForm({
      name: "",
      email: "",
      password: "",
      role: "MEMBER",
    });

    fetchOrganizations();
  };

  return (
    <DashboardLayout>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Building2 size={28} />
          </div>

          <div>
            <h1 className="text-4xl font-black">Organizations</h1>
            <p className="mt-2 text-blue-100">
              Manage workspaces, members and organization-level roles.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Total Organizations
          </p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">
            {organizations.length}
          </h2>
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Total Members
          </p>
          <h2 className="mt-2 text-4xl font-black text-blue-600">
            {totalMembers}
          </h2>
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <p className="text-sm font-semibold text-slate-500">
            Your Role
          </p>
          <h2 className="mt-2 text-2xl font-black text-emerald-600">
            {isSuperAdmin
              ? "SUPER_ADMIN"
              : selectedMembership?.role || "USER"}
          </h2>
        </div>
      </div>

      <div
        className={`mb-8 grid grid-cols-1 gap-6 ${
          canManageMembers ? "xl:grid-cols-2" : "xl:grid-cols-1"
        }`}
      >
        {canCreateOrganization && (
          <form
            onSubmit={handleCreateOrganization}
            className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Building2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Create Organization
                </h2>
                <p className="text-sm text-slate-500">
                  Start a new workspace.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Organization name"
                value={orgForm.name}
                onChange={(e) =>
                  setOrgForm({ ...orgForm, name: e.target.value })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <input
                placeholder="Description"
                value={orgForm.description}
                onChange={(e) =>
                  setOrgForm({
                    ...orgForm,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white shadow-lg hover:opacity-95">
                Create Organization
              </button>
            </div>
          </form>
        )}

        {canManageMembers && (
          <form
            onSubmit={handleAddMember}
            className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <UserPlus size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Add Member
                </h2>
                <p className="text-sm text-slate-500">
                  Create member account and assign role.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                placeholder="Member name"
                value={memberForm.name}
                onChange={(e) =>
                  setMemberForm({
                    ...memberForm,
                    name: e.target.value,
                  })
                }
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <input
                placeholder="Member email"
                value={memberForm.email}
                onChange={(e) =>
                  setMemberForm({
                    ...memberForm,
                    email: e.target.value,
                  })
                }
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <input
                placeholder="Password"
                type="password"
                value={memberForm.password}
                onChange={(e) =>
                  setMemberForm({
                    ...memberForm,
                    password: e.target.value,
                  })
                }
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <select
                value={memberForm.role}
                onChange={(e) =>
                  setMemberForm({
                    ...memberForm,
                    role: e.target.value,
                  })
                }
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="MANAGER">MANAGER</option>
                <option value="ORG_ADMIN">ORG_ADMIN</option>
              </select>

              <button className="md:col-span-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-4 font-bold text-white shadow-lg hover:opacity-95">
                Add Member
              </button>
            </div>
          </form>
        )}
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
          {organizations.length === 0 ? (
            <option value="">No organization found</option>
          ) : (
            organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Building2 size={22} />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Organization List
            </h2>
          </div>

          {organizations.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-slate-500">
              No organizations found. Create your first organization above.
            </p>
          ) : (
            <div className="space-y-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                >
                  <h3 className="font-black text-slate-900">
                    {org.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {org.description || "No description"}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <Users size={16} />
                    Members: {org.members?.length || 0}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white/90 p-6 shadow-lg border border-white/70">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Users size={22} />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Members of {selectedOrg?.name || "Organization"}
            </h2>
          </div>

          {!selectedOrg?.members?.length ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-slate-500">
              No members found.
            </p>
          ) : (
            <div className="space-y-4">
              {selectedOrg.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5"
                >
                  <div>
                    <h3 className="font-black text-slate-900">
                      {member.user?.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {member.user?.email}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black text-white ${
                      member.role === "ORG_ADMIN"
                        ? "bg-blue-600"
                        : member.role === "MANAGER"
                        ? "bg-purple-600"
                        : "bg-slate-700"
                    }`}
                  >
                    {member.role === "ORG_ADMIN" ? (
                      <Crown size={13} />
                    ) : (
                      <ShieldCheck size={13} />
                    )}
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}