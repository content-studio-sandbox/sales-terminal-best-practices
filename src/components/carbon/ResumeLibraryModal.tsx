import { useState } from "react";
import {
    ComposedModal, ModalHeader, ModalBody, ModalFooter,
    Button, TableToolbarSearch, Dropdown, Tag, Loading
} from "@carbon/react";
import { View, DocumentPdf } from "@carbon/icons-react";

interface ResumeRow {
    id: string;
    user_id: string | null;
    candidate_name: string | null;
    role: string | null;
    notes: string | null;
    file_path: string;
    created_at: string;
    uploaded_by: string | null;
    users?: { id: string; email: string | null; display_name: string | null } | null;
}

interface ResumeLibraryModalProps {
    open: boolean;
    onClose: () => void;
    libraryItems: ResumeRow[];
    libraryLoading: boolean;
    librarySearch: string;
    setLibrarySearch: (value: string) => void;
    libraryAssigned: "all" | "0" | "1";
    setLibraryAssigned: (value: "all" | "0" | "1") => void;
    loadLibrary: () => void;
    openResume: (id: string, name: string) => void;
    openMap: (id: string, email?: string) => void;
    unassignResume: (id: string) => void;
    deleteResumeById: (id: string, callback?: () => void) => void;
    fetchLibraryCount: () => void;
}

export default function ResumeLibraryModal({
    open,
    onClose,
    libraryItems,
    libraryLoading,
    librarySearch,
    setLibrarySearch,
    libraryAssigned,
    setLibraryAssigned,
    loadLibrary,
    openResume,
    openMap,
    unassignResume,
    deleteResumeById,
    fetchLibraryCount
}: ResumeLibraryModalProps) {
    const safeLibraryItems: ResumeRow[] = Array.isArray(libraryItems)
        ? libraryItems.filter((x: any) => x && typeof x === "object" && x.id)
        : [];

    return (
        <ComposedModal open={open} onClose={onClose} size="lg">
            <ModalHeader title="Resume Library" />
            <ModalBody hasForm>
                {/* Enhanced Search Bar */}
                <div style={{ 
                    display: "flex", 
                    gap: "0.75rem", 
                    alignItems: "flex-end", 
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "var(--cds-layer-01)",
                    borderRadius: "4px"
                }}>
                    <div style={{ flex: 1 }}>
                        <TableToolbarSearch
                            persistent
                            placeholder="Search candidate, role, notes or file name"
                            onChange={(e: any) => setLibrarySearch(e?.target?.value || "")}
                            value={librarySearch}
                        />
                    </div>
                    <Dropdown
                        id="lib-assign-filter"
                        titleText=""
                        label="All"
                        size="sm"
                        items={[
                            { id: "all", text: "All" },
                            { id: "1", text: "Assigned" },
                            { id: "0", text: "Unassigned" },
                        ]}
                        selectedItem={{ id: libraryAssigned, text: libraryAssigned === "all" ? "All" : libraryAssigned === "1" ? "Assigned" : "Unassigned" }}
                        onChange={(e: any) => setLibraryAssigned(e.selectedItem.id)}
                    />
                    <Button size="sm" onClick={loadLibrary} disabled={libraryLoading}>
                        Refresh
                    </Button>
                </div>

                {/* Library Stats */}
                {!libraryLoading && safeLibraryItems.length > 0 && (
                    <div style={{ 
                        display: "flex", 
                        gap: "0.75rem", 
                        marginBottom: "1.5rem",
                        flexWrap: "wrap"
                    }}>
                        <Tag type="blue" size="md">{safeLibraryItems.length} total</Tag>
                        <Tag type="green" size="md">
                            {safeLibraryItems.filter(r => r.users?.email).length} assigned
                        </Tag>
                        <Tag type="gray" size="md">
                            {safeLibraryItems.filter(r => !r.users?.email).length} unassigned
                        </Tag>
                    </div>
                )}

                {/* Card-based Resume List */}
                {libraryLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4rem 0" }}>
                        <Loading withOverlay={false} description="Loading resume library..." />
                    </div>
                ) : safeLibraryItems.length === 0 ? (
                    <div style={{
                        padding: "4rem 2rem",
                        textAlign: "center",
                        backgroundColor: "var(--cds-layer-01)",
                        borderRadius: "4px",
                        border: "1px dashed var(--cds-border-subtle-01)"
                    }}>
                        <DocumentPdf size={48} style={{ color: "var(--cds-icon-secondary)", marginBottom: "1rem" }} />
                        <h4 className="cds--productive-heading-02" style={{ marginBottom: "0.5rem" }}>
                            No resumes found
                        </h4>
                        <p className="cds--body-long-01" style={{ color: "var(--cds-text-secondary)" }}>
                            {librarySearch ? "Try adjusting your search or filters" : "Import resumes to get started"}
                        </p>
                    </div>
                ) : (
                    <div style={{ 
                        display: "grid", 
                        gap: "1rem",
                        maxHeight: "60vh",
                        overflowY: "auto",
                        padding: "0.25rem"
                    }}>
                        {safeLibraryItems.map((r) => {
                            const fileName = r?.file_path?.split("/").pop() || "(file)";
                            const fileExt = fileName.split(".").pop()?.toUpperCase() || "FILE";
                            const mapped = r?.users?.email || null;
                            const guess = (fileName || "").match(/[a-z0-9._%+-]+@ibm\.com/i)?.[0] || null;
                            const candidateName = r?.candidate_name || "Candidate";
                            const uploadDate = r?.created_at ? new Date(r.created_at) : null;
                            const dateStr = uploadDate ? uploadDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "—";
                            
                            return (
                                <div
                                    key={r.id}
                                    style={{
                                        padding: "1.25rem",
                                        backgroundColor: "var(--cds-layer-01)",
                                        border: "1px solid var(--cds-border-subtle-01)",
                                        borderRadius: "4px",
                                        transition: "all 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                                        e.currentTarget.style.borderColor = "var(--cds-border-interactive)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                        e.currentTarget.style.borderColor = "var(--cds-border-subtle-01)";
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                                        {/* Left: Candidate Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                                <div style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    backgroundColor: "var(--cds-layer-accent-01)",
                                                    borderRadius: "4px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: 600,
                                                    fontSize: "0.75rem",
                                                    color: "var(--cds-text-primary)",
                                                    flexShrink: 0
                                                }}>
                                                    {fileExt}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div className="cds--productive-heading-01" style={{ 
                                                        marginBottom: "0.25rem",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap"
                                                    }}>
                                                        {candidateName}
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                                        {r.role && (
                                                            <Tag type="cool-gray" size="sm">{r.role}</Tag>
                                                        )}
                                                        {mapped ? (
                                                            <Tag type="green" size="sm">✓ {mapped}</Tag>
                                                        ) : guess ? (
                                                            <Tag type="outline" size="sm">→ {guess}</Tag>
                                                        ) : (
                                                            <Tag type="outline" size="sm">Unassigned</Tag>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* File name and date */}
                                            <div style={{ 
                                                display: "flex", 
                                                alignItems: "center", 
                                                gap: "0.5rem",
                                                marginBottom: r.notes ? "0.5rem" : 0
                                            }}>
                                                <DocumentPdf size={16} style={{ color: "var(--cds-icon-secondary)", flexShrink: 0 }} />
                                                <button
                                                    style={{ 
                                                        background: "none", 
                                                        border: 0, 
                                                        color: "var(--cds-link-primary)", 
                                                        cursor: "pointer",
                                                        textDecoration: "underline",
                                                        fontSize: "0.75rem",
                                                        padding: 0,
                                                        textAlign: "left",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: "350px"
                                                    }}
                                                    onClick={() => openResume(r.id, candidateName)}
                                                    title={fileName}
                                                >
                                                    {fileName}
                                                </button>
                                                <span className="cds--helper-text-01" style={{ color: "var(--cds-text-secondary)", flexShrink: 0 }}>
                                                    • {dateStr}
                                                </span>
                                            </div>

                                            {/* Notes if present */}
                                            {r.notes && (
                                                <div className="cds--helper-text-01" style={{ 
                                                    color: "var(--cds-text-secondary)",
                                                    fontStyle: "italic",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap"
                                                }}>
                                                    "{r.notes}"
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Actions */}
                                        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                            <Button 
                                                size="sm" 
                                                kind="ghost" 
                                                renderIcon={View}
                                                iconDescription="View resume"
                                                hasIconOnly
                                                onClick={() => openResume(r.id, candidateName)}
                                            />
                                            <Button
                                                size="sm"
                                                kind={mapped ? "secondary" : "primary"}
                                                onClick={() => openMap(r.id, mapped || guess || undefined)}
                                            >
                                                {mapped ? "Reassign" : "Assign"}
                                            </Button>
                                            {mapped && (
                                                <Button 
                                                    size="sm" 
                                                    kind="ghost" 
                                                    onClick={() => unassignResume(r.id)}
                                                >
                                                    Unassign
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                kind="danger--ghost"
                                                onClick={() => {
                                                    if (!window.confirm("Delete this resume? This cannot be undone.")) return;
                                                    deleteResumeById(r.id, async () => { await loadLibrary(); fetchLibraryCount(); });
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ModalBody>
            <ModalFooter
                secondaryButtonText="Close"
                primaryButtonText="Reload"
                onRequestClose={onClose}
                onRequestSubmit={loadLibrary}
            >
                <></>
            </ModalFooter>
        </ComposedModal>
    );
}

// Made with Bob
