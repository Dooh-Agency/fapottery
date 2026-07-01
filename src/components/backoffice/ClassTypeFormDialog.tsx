import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useUpsertClassType, useUpsertSchedule, useClassSchedules, useDeleteSchedule, type ClassType } from "@/hooks/useClasses";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";

const CLASS_CATEGORIES = [
  { value: "regulares", label: "Clases regulares" },
  { value: "workshops", label: "Workshops" },
  { value: "personalizadas", label: "Clases personalizadas" },
] as const;

const schema = z.object({
  title: z.string().min(1, "Requerido"),
  description: z.string().optional(),
  category: z.enum(["regulares", "workshops", "personalizadas"]),
  location_text: z.string().optional(),
  location_map_url: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  image_url: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  price: z.coerce.number().min(0),
  duration_minutes: z.coerce.number().min(15),
  max_students: z.coerce.number().min(1),
  is_active: z.boolean(),
  faq: z.array(z.object({
    question: z.string().min(1, "La pregunta es requerida"),
    answer: z.string().min(1, "La respuesta es requerida"),
  })),
  new_schedules: z.array(z.object({
    scheduled_date: z.date({ required_error: "Seleccioná fecha" }),
    start_time: z.string().min(1, "Requerido"),
    end_time: z.string().min(1, "Requerido"),
    spots_available: z.coerce.number().min(0),
    notes: z.string().optional(),
  })),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classType: ClassType | null;
}

const emptyDefaults: FormValues = {
  title: "",
  description: "",
  category: "regulares",
  location_text: "",
  location_map_url: "",
  image_url: "",
  price: 0,
  duration_minutes: 120,
  max_students: 8,
  is_active: true,
  faq: [],
  new_schedules: [],
};

const ClassTypeFormDialog = ({ open, onOpenChange, classType }: Props) => {
  const upsert = useUpsertClassType();
  const upsertSchedule = useUpsertSchedule();
  const deleteSchedule = useDeleteSchedule();
  const { data: existingSchedules } = useClassSchedules(classType?.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyDefaults,
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: "faq",
  });

  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({
    control: form.control,
    name: "new_schedules",
  });

  useEffect(() => {
    if (open) {
      const ct = classType as any;
      form.reset(
        ct ? {
          title: ct.title,
          description: ct.description || "",
          category: ct.category || "regulares",
          location_text: ct.location_text || "",
          location_map_url: ct.location_map_url || "",
          image_url: ct.image_url || "",
          price: Number(ct.price),
          duration_minutes: ct.duration_minutes,
          max_students: ct.max_students,
          is_active: ct.is_active,
          faq: Array.isArray(ct.faq) ? ct.faq : [],
          new_schedules: [],
        } : emptyDefaults
      );
    }
  }, [open, classType]);

  const onSubmit = async (values: FormValues) => {
    try {
      // 1. Guardar tipo de clase
      const { new_schedules, ...classTypeData } = values;
      const result = await upsert.mutateAsync({
        id: classType?.id,
        ...classTypeData,
        location_text: classTypeData.location_text || null,
        location_map_url: classTypeData.location_map_url || null,
        image_url: classTypeData.image_url || null,
      } as any);

      // 2. Guardar nuevas fechas si hay
      if (new_schedules.length > 0) {
        const classTypeId = classType?.id || (result as any)?.id;
        if (classTypeId) {
          for (const s of new_schedules) {
            await upsertSchedule.mutateAsync({
              class_type_id: classTypeId,
              scheduled_date: format(s.scheduled_date, "yyyy-MM-dd"),
              start_time: s.start_time,
              end_time: s.end_time,
              spots_available: s.spots_available,
              notes: s.notes || "",
            });
          }
        }
      }

      toast.success(classType ? "Clase actualizada" : "Clase creada");
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await deleteSchedule.mutateAsync(id);
      toast.success("Fecha eliminada");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const upcomingSchedules = existingSchedules?.filter(
    (s) => !s.is_cancelled && new Date(s.scheduled_date + "T23:59:59") >= new Date()
  ) || [];

  const isPending = upsert.isPending || upsertSchedule.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{classType ? "Editar clase" : "Nueva clase"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* Info básica */}
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Título</FormLabel><FormControl><Input placeholder="Ej: Workshop Ceramic & Wine" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo / Categoría</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Seleccioná un grupo" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CLASS_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl><Textarea rows={5} placeholder="Describí la clase o workshop en detalle..." {...field} /></FormControl>
                <p className="text-xs text-muted-foreground">Podés usar saltos de línea para separar párrafos.</p>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="image_url" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    label="Imagen del evento"
                    value={field.value || ""}
                    onChange={field.onChange}
                    bucket="class-images"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">Medida recomendada: 1080 x 1350 px (relación 4:5), para que se vea completa en el listado de clases.</p>
                <FormMessage />
              </FormItem>
            )} />

            <Separator />

            {/* Locación */}
            <p className="text-sm font-semibold text-foreground">Locación</p>
            <FormField control={form.control} name="location_text" render={({ field }) => (
              <FormItem><FormLabel>Nombre del lugar</FormLabel><FormControl><Input placeholder="Ej: MAUI, Málaga (a pasos de la playa)" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="location_map_url" render={({ field }) => (
              <FormItem>
                <FormLabel>Link de Google Maps</FormLabel>
                <FormControl><Input placeholder="https://maps.google.com/..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Separator />

            {/* Fechas */}
            <p className="text-sm font-semibold text-foreground">Fechas del evento</p>

            {/* Fechas existentes */}
            {upcomingSchedules.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Fechas ya cargadas:</p>
                {upcomingSchedules.map((s) => (
                  <div key={s.id} className="flex items-center justify-between border border-border rounded px-3 py-2 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium capitalize">
                        {format(new Date(s.scheduled_date + "T00:00:00"), "EEEE d 'de' MMMM yyyy", { locale: es })}
                      </span>
                      <span className="text-xs text-muted-foreground">{s.start_time.slice(0,5)} – {s.end_time.slice(0,5)}</span>
                      <Badge variant="secondary" className="text-[10px]">{s.spots_available} vacantes</Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSchedule(s.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Nuevas fechas */}
            {scheduleFields.map((scheduleField, index) => (
              <div key={scheduleField.id} className="border border-border rounded p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nueva fecha {index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSchedule(index)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>

                {/* Fecha con calendario */}
                <FormField control={form.control} name={`new_schedules.${index}.scheduled_date`} render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value
                              ? format(field.value, "EEEE d 'de' MMMM yyyy", { locale: es })
                              : "Seleccionar fecha"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          locale={es}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Horarios */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={form.control} name={`new_schedules.${index}.start_time`} render={({ field }) => (
                    <FormItem><FormLabel>Hora inicio</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`new_schedules.${index}.end_time`} render={({ field }) => (
                    <FormItem><FormLabel>Hora fin</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                {/* Vacantes y notas */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={form.control} name={`new_schedules.${index}.spots_available`} render={({ field }) => (
                    <FormItem><FormLabel>Vacantes</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`new_schedules.${index}.notes`} render={({ field }) => (
                    <FormItem><FormLabel>Notas</FormLabel><FormControl><Input placeholder="Opcional..." {...field} /></FormControl></FormItem>
                  )} />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => appendSchedule({
                scheduled_date: new Date(),
                start_time: "10:00",
                end_time: "12:00",
                spots_available: form.getValues("max_students") || 8,
                notes: "",
              })}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Agregar fecha
            </Button>

            <Separator />

            {/* Detalles operativos */}
            <p className="text-sm font-semibold text-foreground">Detalles operativos</p>
            <div className="grid grid-cols-3 gap-3">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Precio (€)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="duration_minutes" render={({ field }) => (
                <FormItem><FormLabel>Duración (min)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="max_students" render={({ field }) => (
                <FormItem><FormLabel>Máx. alumnos</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <Separator />

            {/* FAQ */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Preguntas frecuentes</p>
              <Button type="button" variant="outline" size="sm" onClick={() => appendFaq({ question: "", answer: "" })}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Agregar pregunta
              </Button>
            </div>

            {faqFields.length === 0 && (
              <p className="text-xs text-muted-foreground">No hay preguntas frecuentes cargadas.</p>
            )}

            {faqFields.map((faqField, index) => (
              <div key={faqField.id} className="border border-border rounded p-3 space-y-2 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Pregunta {index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(index)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
                <FormField control={form.control} name={`faq.${index}.question`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Pregunta</FormLabel>
                    <FormControl><Input placeholder="¿Necesito experiencia previa?" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`faq.${index}.answer`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Respuesta</FormLabel>
                    <FormControl><Textarea rows={2} placeholder="No, te guiamos desde cero..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            ))}

            <Separator />

            <FormField control={form.control} name="is_active" render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="!mt-0">Activo (visible en el sitio)</FormLabel>
              </FormItem>
            )} />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Guardar"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassTypeFormDialog;
