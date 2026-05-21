import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  Mail, 
  ShieldCheck, 
  ShieldAlert,
  Edit,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import { cn } from "../lib/utils";

export default function UsersPage() {
  const { profiles, loading, error, updateProfileRole, updateProfile } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  // Edit profile states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editRole, setEditRole] = useState<'admin' | 'editor' | 'author'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleOpenEditModal = (member: any) => {
    setSelectedMember(member);
    setEditFullName(member.full_name || "");
    setEditAvatarUrl(member.avatar_url || "");
    setEditRole(member.role || "editor");
    setSaveError(null);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedMember) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateProfile(selectedMember.id, {
        full_name: editFullName,
        avatar_url: editAvatarUrl,
        role: editRole,
      });
      setIsEditModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setSaveError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => 
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleUpdate = async (id: string, newRole: any) => {
    try {
      await updateProfileRole(id, newRole);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && profiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-slate-500">Manage your team and their platform permissions.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center text-sm font-medium border border-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <Card className="border-slate-100 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex-1 max-w-md">
            <Input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="h-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b">
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProfiles.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
                        <img 
                          src={member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{member.full_name || 'Unnamed User'}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {member.role === 'admin' ? (
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-xs font-bold uppercase tracking-tighter text-slate-600">{member.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => handleOpenEditModal(member)}>
                          <Edit className="w-4 h-4" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => handleRoleUpdate(member.id, 'admin')}>
                          <ShieldCheck className="w-4 h-4" /> Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => handleRoleUpdate(member.id, 'editor')}>
                          <Edit className="w-4 h-4" /> Make Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50">
                          <Trash2 className="w-4 h-4" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Profile Pop-up Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Edit Member Profile</DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Update the platform permissions and profile details for {selectedMember?.email}.
            </DialogDescription>
          </DialogHeader>

          {saveError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold flex gap-2 items-center">
              <AlertCircle className="w-4 h-4" />
              {saveError}
            </div>
          )}

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border overflow-hidden shadow-inner shrink-0">
                <img 
                  src={editAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedMember?.email}`} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedMember?.email}`;
                  }}
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">{editFullName || "Unnamed User"}</h4>
                <p className="text-xs text-slate-400">{selectedMember?.email}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Full Name</label>
              <Input 
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Avatar URL</label>
              <Input 
                value={editAvatarUrl}
                onChange={(e) => setEditAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.png"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Role Assignment</label>
              <select 
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as any)}
                className="w-full h-11 px-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="admin">Administrator (Full Access)</option>
                <option value="editor">Editor (Can Publish/Edit)</option>
                <option value="author">Author (Drafts Only)</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="border-slate-200">
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} isLoading={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
