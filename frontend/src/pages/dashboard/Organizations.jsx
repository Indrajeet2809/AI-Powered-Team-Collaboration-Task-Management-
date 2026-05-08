import { useEffect, useState } from "react";
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

  const canManage =
    selectedMembership?.role === "ORG_ADMIN" ||
    selectedMembership?.role === "MANAGER";

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <p className="text-slate-500 mt-1">
          Manage your workspaces, members and roles.
        </p>
      </div>

      {/* Logged-in user can create organization.
          Later you can restrict this to SUPER_ADMIN only. */}
      {canManage &&  (
        <form
          onSubmit={handleCreateOrganization}
          className="bg-white rounded-2xl border shadow-sm p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            placeholder="Organization name"
            value={orgForm.name}
            onChange={(e) =>
              setOrgForm({ ...orgForm, name: e.target.value })
            }
            className="border rounded-xl px-4 py-3 outline-none"
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
            className="border rounded-xl px-4 py-3 outline-none"
          />

          <button className="bg-slate-900 text-white rounded-xl font-semibold">
            Create Organization
          </button>
        </form>
      )}

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
          onSubmit={handleAddMember}
          className="bg-white rounded-2xl border shadow-sm p-6 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <input
            placeholder="Member name"
            value={memberForm.name}
            onChange={(e) =>
              setMemberForm({
                ...memberForm,
                name: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3 outline-none"
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
            className="border rounded-xl px-4 py-3 outline-none"
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
            className="border rounded-xl px-4 py-3 outline-none"
          />

          <select
            value={memberForm.role}
            onChange={(e) =>
              setMemberForm({
                ...memberForm,
                role: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3 outline-none"
          >
            <option value="MEMBER">MEMBER</option>
            <option value="MANAGER">MANAGER</option>
            <option value="ORG_ADMIN">ORG_ADMIN</option>
          </select>

          <button className="bg-slate-900 text-white rounded-xl font-semibold">
            Add Member
          </button>
        </form>
      )}

      {!canManage && selectedOrg && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-2xl p-4 mb-8">
          You have member access. You can view organizations and members, but
          you cannot add new members.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-5">
            Organizations
          </h2>

          <div className="space-y-4">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="border rounded-xl p-4 bg-slate-50"
              >
                <h3 className="font-bold">{org.name}</h3>
                <p className="text-slate-500 mt-1">
                  {org.description || "No description"}
                </p>
                <p className="text-sm text-slate-600 mt-3">
                  Members: {org.members?.length || 0}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-5">
            Members of {selectedOrg?.name || "Organization"}
          </h2>

          {!selectedOrg?.members?.length ? (
            <p className="text-slate-500">No members found.</p>
          ) : (
            <div className="space-y-4">
              {selectedOrg.members.map((member) => (
                <div
                  key={member.id}
                  className="border rounded-xl p-4 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold">
                      {member.user?.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {member.user?.email}
                    </p>
                  </div>

                  <span className="text-xs font-semibold bg-slate-900 text-white px-3 py-1 rounded-full">
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