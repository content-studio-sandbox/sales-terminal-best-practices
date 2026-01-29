// src/components/carbon/AssignTeamMembersModal.tsx
import { useState, useEffect } from "react";
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Loading,
  InlineNotification,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Checkbox,
  Tag,
  Search,
} from "@carbon/react";
import { supabase } from "@/integrations/supabase/client";

interface AssignTeamMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onTeamMembersAssigned: () => void;
}

interface TeamMember {
  id: string;
  display_name: string;
  email: string;
  access_role: string;
}

export default function AssignTeamMembersModal({
  open,
  onOpenChange,
  project,
  onTeamMembersAssigned,
}: AssignTeamMembersModalProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open && project?.id) {
      fetchAvailableTeamMembers();
    } else {
      // Reset state when modal closes
      setTeamMembers([]);
      setSelectedMembers(new Set());
      setSearchTerm("");
      setError("");
      setSuccess("");
    }
  }, [open, project?.id]);

  const fetchAvailableTeamMembers = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all users except leaders and managers
      const { data: allUsers, error: usersError } = await supabase
        .from("users")
        .select("id, display_name, email, access_role")
        .order("display_name")
        .limit(1000); // Fetch up to 1000 users

      if (usersError) throw usersError;

      // Filter out leaders and managers (keep interns, contributors, and null roles)
      const users = allUsers?.filter(u =>
        !u.access_role || !['leader', 'manager'].includes(u.access_role.toLowerCase())
      ) || [];

      // Fetch users already assigned to this project
      const { data: assignedStaff, error: staffError } = await supabase
        .from("project_staff")
        .select("user_id")
        .eq("project_id", project.id);

      if (staffError) throw staffError;

      const assignedUserIds = new Set(assignedStaff?.map((s) => s.user_id) || []);

      // Filter out already assigned users
      const availableMembers = users
        .filter((u) => !assignedUserIds.has(u.id))
        .map((u) => ({
          id: u.id,
          display_name: u.display_name || u.email,
          email: u.email,
          access_role: u.access_role || 'user',
        }));

      setTeamMembers(availableMembers);
    } catch (err: any) {
      console.error("Error fetching team members:", err);
      setError(err.message || "Failed to load available team members");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    const newSelected = new Set(selectedMembers);
    if (checked) {
      newSelected.add(memberId);
    } else {
      newSelected.delete(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const filtered = getFilteredMembers();
      setSelectedMembers(new Set(filtered.map((m) => m.id)));
    } else {
      setSelectedMembers(new Set());
    }
  };

  const handleAssignTeamMembers = async () => {
    if (selectedMembers.size === 0) {
      setError("Please select at least one team member");
      return;
    }

    try {
      setAssigning(true);
      setError("");
      setSuccess("");

      // Use the database function to assign team members (bypasses RLS)
      const assignments = Array.from(selectedMembers);
      
      for (const userId of assignments) {
        const { error: assignError } = await supabase.rpc('assign_team_member' as any, {
          p_project_id: project.id,
          p_user_id: userId,
          p_project_role: null
        });
        
        if (assignError) throw assignError;
      }

      setSuccess(`Successfully assigned ${assignments.length} team member(s)!`);
      setSelectedMembers(new Set());
      
      // Refresh team members list
      await fetchAvailableTeamMembers();
      
      // Notify parent component
      onTeamMembersAssigned();

      // Close modal after a short delay
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (err: any) {
      console.error("Error assigning team members:", err);
      setError(err.message || "Failed to assign team members");
    } finally {
      setAssigning(false);
    }
  };

  const getFilteredMembers = () => {
    if (!searchTerm.trim()) return teamMembers;
    
    const term = searchTerm.toLowerCase();
    return teamMembers.filter(
      (m) =>
        m.display_name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term)
    );
  };

  const filteredMembers = getFilteredMembers();

  const headers = [
    { key: "select", header: "" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
  ];

  const rows = filteredMembers.map((member) => ({
    id: member.id,
    select: (
      <Checkbox
        id={`member-${member.id}`}
        checked={selectedMembers.has(member.id)}
        onChange={(e: any) => handleSelectMember(member.id, e.target.checked)}
        labelText=""
      />
    ),
    name: member.display_name,
    email: member.email,
    role: (
      <Tag type={member.access_role === 'intern' ? 'purple' : member.access_role === 'contributor' ? 'blue' : 'gray'} size="sm">
        {member.access_role}
      </Tag>
    ),
  }));

  return (
    <ComposedModal open={open} onClose={() => onOpenChange(false)} size="lg">
      <ModalHeader>
        <h3>Assign Team Members to {project?.name}</h3>
      </ModalHeader>
      <ModalBody>
        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            onClose={() => setError("")}
            style={{ marginBottom: "16px" }}
          />
        )}
        {success && (
          <InlineNotification
            kind="success"
            title="Success"
            subtitle={success}
            onClose={() => setSuccess("")}
            style={{ marginBottom: "16px" }}
          />
        )}

        {loading ? (
          <Loading withOverlay={false} description="Loading available team members..." />
        ) : (
          <>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "var(--cds-text-secondary)", marginBottom: "12px" }}>
                Select team members to assign to this project. They will be able to view and work on project tasks.
              </p>
              <Search
                labelText="Search team members"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                size="md"
              />
            </div>

            {filteredMembers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ color: "var(--cds-text-secondary)" }}>
                  {teamMembers.length === 0
                    ? "No available team members found. All interns/contributors may already be assigned to this project."
                    : "No team members match your search criteria."}
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <Checkbox
                    id="select-all"
                    checked={
                      filteredMembers.length > 0 &&
                      filteredMembers.every((m) => selectedMembers.has(m.id))
                    }
                    indeterminate={
                      selectedMembers.size > 0 &&
                      selectedMembers.size < filteredMembers.length
                    }
                    onChange={(e: any) => handleSelectAll(e.target.checked)}
                    labelText={`Select all (${selectedMembers.size} selected)`}
                  />
                </div>

                <DataTable rows={rows} headers={headers}>
                  {({ rows, headers, getTableProps, getHeaderProps, getRowProps }: any) => (
                    <TableContainer>
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header: any) => (
                              <TableHeader key={header.key} {...getHeaderProps({ header })}>
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row: any) => (
                            <TableRow key={row.id} {...getRowProps({ row })}>
                              {row.cells.map((cell: any) => (
                                <TableCell key={cell.id}>{cell.value}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </DataTable>
              </>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={() => onOpenChange(false)} disabled={assigning}>
          Cancel
        </Button>
        <Button
          kind="primary"
          onClick={handleAssignTeamMembers}
          disabled={loading || assigning || selectedMembers.size === 0}
        >
          {assigning
            ? "Assigning..."
            : `Assign ${selectedMembers.size} Team Member${selectedMembers.size !== 1 ? "s" : ""}`}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
}

// Made with Bob