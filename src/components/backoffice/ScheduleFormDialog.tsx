import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useClassTypes, useUpsertSchedule, type ClassSchedule } from "@/hooks/useClasses";
import { toast } from "sonner";

const schema = z.object({
  class_type_id: z.string().min(1, "Seleccioná un tipo"),
  scheduled_date: z.date({ required_error: "Seleccioná fecha" }),
  start_time: z.string().min(1, "Requerido"),
  end_time: z.string().min(1, "Requerido"),
  spots_available: z.coerce.number().min(0),
  is_cancelled: z.boolean(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: ClassSchedule | null;
}

const ScheduleFormDialog = ({ open, onOpenChange, schedule }: Props) => {
  const upsert = useUpsertSchedule();
  const { data: classTypes } = useClassTypes(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      class_type_id: "", scheduled_date: new Date(), start_time: "10:00", end_time: "12:00",
      spots_available: 8, is_cancelled: false, notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        schedule
          ? {
              class_type_id: schedule.class_type_id,
              scheduled_date: new Date(schedule.scheduled_date + "T00:00:00"),
              start_time: schedule.start_time.slice(0, 5),
              end_time: schedule.end_time.slice(0, 5),
              spots_available: schedule.spots_available,
              is_cancelled: schedule.is_cancelled,
              notes: schedule.notes || "",
            }
          : {
              class_type_id: classTypes?.[0]?.id || "", scheduled_date: new Date(),
              start_time: "10:00", end_time: "12:00", spots_available: 8, is_cancelled: false, notes: "",
            }
      );
    }
  }, [open, schedule, classTypes]);

  const onSubmit = async (values: FormValues) => {
    try {
      await upsert.mutateAsync({
        class_type_id: values.class_type_id,
        scheduled_date: format(values.scheduled_date, "yyyy-MM-dd"),
        start_time: values.start_time,
        end_time: values.end_time,
        spots_available: values.spots_available,
        is_cancelled: values.is_cancelled,
        notes: values.notes,
        id: schedule?.id,
      });
      toast.success(schedule ? "Horario actualizado" : "Horario creado");
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">{schedule ? "Editar horario" : "Nuevo horario"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="class_type_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de clase</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger></FormControl>
                  <SelectContent>
                    {classTypes?.map((ct) => (
                      <SelectItem key={ct.id} value={ct.id}>{ct.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="scheduled_date" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? format(field.value, "PPP") : "Seleccionar fecha"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="start_time" render={({ field }) => (
                <FormItem><FormLabel>Hora inicio</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="end_time" render={({ field }) => (
                <FormItem><FormLabel>Hora fin</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="spots_available" render={({ field }) => (
              <FormItem><FormLabel>Vacantes</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem><FormLabel>Notas</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl></FormItem>
            )} />

            <FormField control={form.control} name="is_cancelled" render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="!mt-0">Cancelado</FormLabel>
              </FormItem>
            )} />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={upsert.isPending}>{upsert.isPending ? "Guardando..." : "Guardar"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleFormDialog;
