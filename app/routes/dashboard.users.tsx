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
import { cn } from "../lib/utils";

export default function UsersPage() {
  const { profiles, loading, error, updateProfileRole } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

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
    </div>
  );
}
