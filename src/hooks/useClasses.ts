import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type ClassType = Tables<"class_types">;
export type ClassSchedule = Tables<"class_schedules"> & { class_types?: ClassType };
export type ClassReservation = Tables<"class_reservations"> & { class_schedules?: ClassSchedule & { class_types?: ClassType } };
export type ClassTypeWithSchedules = ClassType & { class_schedules: Tables<"class_schedules">[] };

// ── Class Types ──

export const useClassTypes = (activeOnly = true) =>
  useQuery({
    queryKey: ["class_types", activeOnly],
    queryFn: async () => {
      let q = supabase.from("class_types").select("*").order("title");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data as ClassType[];
    },
  });

// Class types with their schedules embedded, for splitting the Clases page into
// destacados / próximas / pasadas without an extra round-trip per card.
export const useClassTypesWithSchedules = (activeOnly = true) =>
  useQuery({
    queryKey: ["class_types_with_schedules", activeOnly],
    queryFn: async () => {
      let q = supabase.from("class_types").select("*, class_schedules(*)").order("title");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data as ClassTypeWithSchedules[];
    },
  });

export const useUpsertClassType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Partial<TablesInsert<"class_types">> & { id?: string; title: string }) => {
      const { id, ...rest } = values;
      if (id) {
        const { error } = await supabase.from("class_types").update(rest as TablesUpdate<"class_types">).eq("id", id);
        if (error) throw error;
        return { id };
      } else {
        const { data, error } = await supabase.from("class_types").insert(rest as TablesInsert<"class_types">).select().single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["class_types"] }),
  });
};

export async function uploadClassImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("class-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("class-images").getPublicUrl(path);
  return data.publicUrl;
}

export const useDeleteClassType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("class_types").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["class_types"] }),
  });
};

// ── Schedules ──

export const useClassSchedules = (classTypeId?: string) =>
  useQuery({
    queryKey: ["class_schedules", classTypeId],
    queryFn: async () => {
      let q = supabase
        .from("class_schedules")
        .select("*, class_types(*)")
        .order("scheduled_date", { ascending: true })
        .order("start_time", { ascending: true });
      if (classTypeId) q = q.eq("class_type_id", classTypeId);
      const { data, error } = await q;
      if (error) throw error;
      return data as ClassSchedule[];
    },
  });

export const useUpsertSchedule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Partial<TablesInsert<"class_schedules">> & { id?: string; class_type_id: string; scheduled_date: string; start_time: string; end_time: string }) => {
      const { id, ...rest } = values;
      if (id) {
        const { error } = await supabase.from("class_schedules").update(rest as TablesUpdate<"class_schedules">).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("class_schedules").insert(rest as TablesInsert<"class_schedules">);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["class_schedules"] }),
  });
};

export const useDeleteSchedule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("class_schedules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["class_schedules"] }),
  });
};

// ── Reservations ──

export const useReservations = (scheduleId?: string) =>
  useQuery({
    queryKey: ["class_reservations", scheduleId],
    queryFn: async () => {
      let q = supabase
        .from("class_reservations")
        .select("*, class_schedules(*, class_types(*))")
        .order("created_at", { ascending: false });
      if (scheduleId) q = q.eq("schedule_id", scheduleId);
      const { data, error } = await q;
      if (error) throw error;
      return data as ClassReservation[];
    },
  });

export const useCreateReservation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: TablesInsert<"class_reservations">) => {
      const { data, error } = await supabase.from("class_reservations").insert(values).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["class_reservations"] });
      qc.invalidateQueries({ queryKey: ["class_schedules"] });
    },
  });
};

export const useUpdateReservationStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("class_reservations")
        .update({ payment_status: status as any })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["class_reservations"] });
      qc.invalidateQueries({ queryKey: ["class_schedules"] });
    },
  });
};
