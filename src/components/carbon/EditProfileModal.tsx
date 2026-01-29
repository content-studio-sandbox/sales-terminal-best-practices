// src/components/EditProfileModal.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  TextInput,
  ComboBox,
  MultiSelect,
  TextArea,
  NumberInput,
  InlineLoading,
  ToastNotification,
} from "@carbon/react";

type Option = { id: string; label: string };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void | Promise<void>;
}

// helper to coerce backend rows into UI options
const asOption = (row: any): Option => ({
  id: String(row.id ?? row.role_id ?? row.skill_id ?? row.product_id ?? ""),
  label: String(row.label ?? row.name ?? row.text ?? ""),
});

export default function EditProfileModal({ open, onOpenChange, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notify, setNotify] = useState<
      | null
      | {
    kind: "success" | "error" | "warning" | "info";
    title: string;
    subtitle?: string;
  }
  >(null);

  // form state
  const [displayName, setDisplayName] = useState("");
  const [roleId, setRoleId] = useState<string | null>(null);
  const [interestText, setInterestText] = useState("");
  const [weeklyAvailability, setWeeklyAvailability] = useState<number>(40);

  // selected (by id) — we derive actual items from options arrays
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // dropdown data
  const [roleOptions, setRoleOptions] = useState<Option[]>([]);
  const [skillOptions, setSkillOptions] = useState<Option[]>([]);
  const [productOptions, setProductOptions] = useState<Option[]>([]);

  // derive selected item objects from ids (must be from SAME array Carbon renders)
  const selectedRole = useMemo(
      () => roleOptions.find((r) => r.id === roleId) || null,
      [roleOptions, roleId]
  );
  const selectedSkillItems = useMemo(
      () => skillOptions.filter((o) => selectedSkillIds.includes(o.id)),
      [skillOptions, selectedSkillIds]
  );
  const selectedProductItems = useMemo(
      () => productOptions.filter((o) => selectedProductIds.includes(o.id)),
      [productOptions, selectedProductIds]
  );

  // load when opened
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoading(true);
        console.log("📝 [EditProfileModal] Loading profile data...");

        // reference lists
        try {
          const r = await fetch("/api/refs/roles", { credentials: "include" });
          if (r.ok) {
            const roles = (await r.json()).map(asOption);
            setRoleOptions(roles);
            console.log("✅ [EditProfileModal] Loaded roles:", roles.length);
          }
        } catch (err) {
          console.error("❌ [EditProfileModal] Error loading roles:", err);
        }
        try {
          const r = await fetch("/api/refs/skills", { credentials: "include" });
          if (r.ok) {
            const skills = (await r.json()).map(asOption);
            setSkillOptions(skills);
            console.log("✅ [EditProfileModal] Loaded skills:", skills.length);
          }
        } catch (err) {
          console.error("❌ [EditProfileModal] Error loading skills:", err);
        }
        try {
          const r = await fetch("/api/refs/products", {
            credentials: "include",
          });
          if (r.ok) {
            const products = (await r.json()).map(asOption);
            setProductOptions(products);
            console.log("✅ [EditProfileModal] Loaded products:", products.length);
          }
        } catch (err) {
          console.error("❌ [EditProfileModal] Error loading products:", err);
        }

        // profile payload
        const pr = await fetch("/api/profile", { credentials: "include" });
        if (!pr.ok) {
          const e = await pr.json().catch(() => ({}));
          throw new Error(e.error || `Profile load failed (HTTP ${pr.status})`);
        }
        const payload = await pr.json();
        const u = payload?.user || {};

        setDisplayName(u.display_name || "");
        setRoleId(u.role_id || null);
        setInterestText(
            Array.isArray(u.interests)
                ? u.interests[0] ?? ""
                : u.interests ?? ""
        );
        setWeeklyAvailability(u.weekly_availability ?? 40);

        // store selected ids; UI will map them to items using options arrays
        const skillIds: string[] = (payload?.skills || [])
            .map((s: any) => s.id ?? s.skill_id)
            .filter(Boolean)
            .map(String);
        const productIds: string[] = (payload?.products || [])
            .map((p: any) => p.id ?? p.product_id)
            .filter(Boolean)
            .map(String);
        setSelectedSkillIds(skillIds);
        setSelectedProductIds(productIds);
        
        console.log("✅ [EditProfileModal] Profile loaded successfully:", {
          displayName: u.display_name || "",
          roleId: u.role_id || null,
          skillsCount: skillIds.length,
          productsCount: productIds.length
        });
      } catch (e: any) {
        console.error("❌ [EditProfileModal] Error loading profile:", e);
        setNotify({
          kind: "error",
          title: "Failed to load profile",
          subtitle: e?.message,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  const onSave = async () => {
    try {
      setSaving(true);
      console.log("💾 [EditProfileModal] Saving profile...", {
        displayName,
        roleId,
        skillsCount: selectedSkillIds.length,
        productsCount: selectedProductIds.length
      });

      // Convert selected ids back to { name } objects for server’s name-based resolver
      const skillsToSave = skillOptions
          .filter((o) => selectedSkillIds.includes(o.id))
          .map((o) => ({ name: o.label }));
      const productsToSave = productOptions
          .filter((o) => selectedProductIds.includes(o.id))
          .map((o) => ({ name: o.label }));

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          display_name: displayName || null,
          role_id: roleId, // saved directly
          interests: interestText || null,
          weekly_availability: weeklyAvailability ?? 40,
          skills: skillsToSave,
          products: productsToSave,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `Save failed (HTTP ${res.status})`);
      }

      console.log("✅ [EditProfileModal] Profile saved successfully");
      
      // Call parent callback if provided
      if (onSaved) {
        await onSaved();
      }
      
      onOpenChange(false);
    } catch (e: any) {
      console.error("❌ [EditProfileModal] Error saving profile:", e);
      setNotify({
        kind: "error",
        title: "Could not save profile",
        subtitle: e?.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
      <>
        <Modal
            open={open}
            onRequestClose={() => onOpenChange(false)}
            modalHeading="Edit Profile"
            primaryButtonText={saving ? "Saving..." : "Save Changes"}
            secondaryButtonText="Cancel"
            onRequestSubmit={onSave}
            primaryButtonDisabled={saving || loading}
        >
          {loading ? (
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <InlineLoading description="Loading profile..." />
              </div>
          ) : (
              <div style={{ display: "grid", gap: 16 }}>
                <TextInput
                    id="display-name"
                    labelText="Full Name"
                    placeholder="Enter your full name"
                    value={displayName}
                    onChange={(e: any) => setDisplayName(e.target.value)}
                />

                <ComboBox
                    id="user-role"
                    titleText="Role"
                    placeholder="Select a role"
                    items={roleOptions}
                    selectedItem={selectedRole ?? undefined}
                    itemToString={(item: any) => item?.label ?? ""}
                    onChange={({ selectedItem }) =>
                        setRoleId(((selectedItem as Option | null)?.id) ?? null)
                    }
                />

                <MultiSelect
                    id="skills"
                    titleText="Skills"
                    label="Select skills"
                    items={skillOptions}
                    selectedItems={selectedSkillItems}
                    itemToString={(item: any) => item?.label ?? ""}
                    onChange={({ selectedItems }) =>
                        setSelectedSkillIds(
                            ((selectedItems as Option[]) ?? []).map((i) => i.id)
                        )
                    }
                />

                <MultiSelect
                    id="products"
                    titleText="IBM Product Expertise"
                    label="Select products"
                    items={productOptions}
                    selectedItems={selectedProductItems}
                    itemToString={(item: any) => item?.label ?? ""}
                    onChange={({ selectedItems }) =>
                        setSelectedProductIds(
                            ((selectedItems as Option[]) ?? []).map((i) => i.id)
                        )
                    }
                />

                <TextArea
                    id="interests"
                    labelText="Interests & Career Goals"
                    placeholder="Describe your interests and career goals"
                    value={interestText}
                    onChange={(e: any) => setInterestText(e.target.value)}
                />

                <NumberInput
                    id="weekly-availability"
                    label="Weekly Availability (hours)"
                    min={0}
                    max={80}
                    step={1}
                    value={weeklyAvailability}
                    onChange={({ value }: any) =>
                        setWeeklyAvailability(Number(value ?? 40))
                    }
                />
              </div>
          )}
        </Modal>

        {notify && (
            <ToastNotification
                kind={notify.kind}
                title={notify.title}
                subtitle={notify.subtitle}
                timeout={5000}
                onClose={() => setNotify(null)}
            />
        )}
      </>
  );
}
