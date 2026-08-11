import { useEffect, useRef, useState } from "react";
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
import { CalendarIcon, Plus, Trash2, Bold, Upload, X, PanelTop, Pencil, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useUpsertClassType, useUpsertSchedule, useClassSchedules, useDeleteSchedule, uploadClassImage, type ClassSchedule, type ClassType } from "@/hooks/useClasses";
import { useTranslateContent } from "@/hooks/useTranslateContent";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";
import ScheduleFormDialog from "./ScheduleFormDialog";

const CLASS_CATEGORIES = [
  { value: "regulares", label: "Clases regulares" },
  { value: "workshops", label: "Workshops" },
  { value: "personalizadas", label: "Clases personalizadas" },
] as const;

const WEEKDAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
] as const;

const schema = z.object({
  title: z.string().min(1, "Requerido"),
  description: z.string().optional(),
  category: z.enum(["regulares", "workshops", "personalizadas"]),
  location_text: z.string().optional(),
  location_map_url: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  locations: z.array(z.object({
    name: z.string().min(1, "El nombre de la sede es requerido"),
    map_url: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  })),
  image_url: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  price: z.coerce.number().min(0),
  // En el backoffice se trabaja en horas, aunque la base las conserva en minutos.
  // Así 2,5 significa dos horas y media, sin obligar a hacer conversiones mentales.
  duration_hours: z.coerce.number().min(0.25),
  max_students: z.coerce.number().min(1),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  badge_label: z.string().optional(),
  faq: z.array(z.object({
    question: z.string().min(1, "La pregunta es requerida"),
    answer: z.string().min(1, "La respuesta es requerida"),
  })),
  options: z.array(z.object({
    label: z.string().min(1, "El nombre de la opción es requerido"),
    price: z.coerce.number().min(0),
    booking_mode: z.enum(["single", "monthly"]).optional(),
  })),
  recurring_schedules: z.array(z.object({
    weekday: z.coerce.number().int().min(0).max(6),
    start_time: z.string().min(1, "Requerido"),
    end_time: z.string().min(1, "Requerido"),
    spots_available: z.coerce.number().min(1),
    single_price: z.coerce.number().min(0),
    monthly_price: z.coerce.number().min(0),
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
  locations: [],
  image_url: "",
  price: 0,
  duration_hours: 2,
  max_students: 8,
  is_active: true,
  is_featured: false,
  badge_label: "",
  faq: [],
  options: [],
  recurring_schedules: [],
  new_schedules: [],
};

const ClassTypeFormDialog = ({ open, onOpenChange, classType }: Props) => {
  const upsert = useUpsertClassType();
  const upsertSchedule = useUpsertSchedule();
  const deleteSchedule = useDeleteSchedule();
  const translateContent = useTranslateContent("class_types");
  const { data: existingSchedules } = useClassSchedules(classType?.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyDefaults,
  });

  const [images, setImages] = useState<string[]>([]);
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ClassSchedule | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const faqAnswerRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: "faq",
  });

  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const { fields: recurringScheduleFields, append: appendRecurringSchedule, remove: removeRecurringSchedule } = useFieldArray({
    control: form.control,
    name: "recurring_schedules",
  });

  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
    control: form.control,
    name: "locations",
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
          locations: Array.isArray(ct.locations) ? ct.locations : [],
          image_url: ct.image_url || "",
          price: Number(ct.price),
          duration_hours: ct.duration_minutes / 60,
          max_students: ct.max_students,
          is_active: ct.is_active,
          is_featured: ct.is_featured || false,
          badge_label: ct.badge_label || "",
          faq: Array.isArray(ct.faq) ? ct.faq : [],
          options: Array.isArray(ct.options) ? ct.options : [],
          recurring_schedules: Array.isArray(ct.recurring_schedules) ? ct.recurring_schedules.map((schedule: any) => ({ ...schedule, single_price: Number(schedule.single_price ?? 0), monthly_price: Number(schedule.monthly_price ?? 0) })) : [],
          new_schedules: [],
        } : emptyDefaults
      );
      setImages(ct?.images || []);
    }
  }, [open, classType]);

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploadingGallery(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadClassImage(file));
      }
      setImages((prev) => [...prev, ...urls]);
    } catch (e: any) {
      toast.error(e.message || "Error al subir la imagen");
    }
    setUploadingGallery(false);
    if (galleryFileRef.current) galleryFileRef.current.value = "";
  };

  const removeGalleryImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveGalleryImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setImages((prev) => {
      const next = [...prev];
      const [image] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, image);
      return next;
    });
  };

  const wrapSelectionBold = (el: HTMLTextAreaElement | null, fieldName: "description" | `faq.${number}.answer`) => {
    if (!el) return;
    if (el.selectionStart === el.selectionEnd) {
      toast.info("Primero selecciona (marca) el texto que quieres poner en negrita");
      return;
    }
    const { selectionStart, selectionEnd, value } = el;
    const selected = value.slice(selectionStart, selectionEnd);
    const newValue = value.slice(0, selectionStart) + `**${selected}**` + value.slice(selectionEnd);
    form.setValue(fieldName, newValue, { shouldDirty: true });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectionStart + 2, selectionEnd + 2);
    });
  };

  const wrapDescriptionAsCallout = () => {
    const el = descriptionRef.current;
    if (!el || el.selectionStart === el.selectionEnd) {
      toast.info("Primero selecciona el texto que quieres destacar");
      return;
    }
    const { selectionStart, selectionEnd, value } = el;
    const selected = value.slice(selectionStart, selectionEnd);
    const prefix = ":::destacado\n";
    const suffix = "\n:::";
    const newValue = value.slice(0, selectionStart) + prefix + selected + suffix + value.slice(selectionEnd);
    form.setValue("description", newValue, { shouldDirty: true });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectionStart + prefix.length, selectionStart + prefix.length + selected.length);
    });
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // 1. Guardar tipo de clase
      const { new_schedules, recurring_schedules, duration_hours, ...classTypeData } = values;
      const result = await upsert.mutateAsync({
        id: classType?.id,
        ...classTypeData,
        location_text: classTypeData.location_text || null,
        location_map_url: classTypeData.location_map_url || null,
        image_url: classTypeData.image_url || null,
        badge_label: classTypeData.badge_label || null,
        duration_minutes: Math.round(duration_hours * 60),
        price: values.category === "regulares" && recurring_schedules.length > 0 ? Math.min(...recurring_schedules.flatMap((schedule) => [schedule.single_price, schedule.monthly_price])) : classTypeData.price,
        recurring_schedules,
        images,
      } as any);

      const classTypeId = classType?.id || (result as any)?.id;

      // 2. Guardar nuevas fechas si hay
      if (new_schedules.length > 0 && classTypeId) {
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

      toast.success(classType ? "Clase actualizada" : "Clase creada");
      onOpenChange(false);
      if (classTypeId) translateContent.mutate(classTypeId);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "No pudimos guardar la actividad. Probá nuevamente.");
    }
  };

  const onInvalid = () => {
    toast.error("Revisá los campos marcados antes de guardar.");
    // El diálogo es largo: llevar al primer error evita que el botón parezca no responder.
    requestAnimationFrame(() => {
      const firstInvalid = document.querySelector<HTMLElement>("[aria-invalid='true']");
      firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid?.focus();
    });
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

  const isRegularClass = form.watch("category") === "regulares";
  const isPending = upsert.isPending || upsertSchedule.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{classType ? "Editar clase" : "Nueva clase"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-5">

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

            <FormField control={form.control} name="description" render={({ field: { ref, ...field } }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <div className="flex items-center gap-2 mb-1">
                  <Button type="button" variant="outline" size="sm" onClick={() => wrapSelectionBold(descriptionRef.current, "description")}>
                    <Bold className="h-3.5 w-3.5 mr-1" /> Negrita
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={wrapDescriptionAsCallout}>
                    <PanelTop className="h-3.5 w-3.5 mr-1" /> Destacado
                  </Button>
                  <p className="text-xs text-muted-foreground">Selecciona texto y elige un estilo</p>
                </div>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Describí la clase o workshop en detalle..."
                    {...field}
                    ref={(el) => { ref(el); descriptionRef.current = el; }}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">Puedes usar saltos de línea para separar párrafos.</p>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="image_url" render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    label="Imagen de portada (listado de clases)"
                    value={field.value || ""}
                    onChange={field.onChange}
                    bucket="class-images"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">Medida recomendada: 1080 x 1350 px (relación 4:5), para que se vea completa en el listado de clases.</p>
                <FormMessage />
              </FormItem>
            )} />

            {/* Galería de imágenes adicionales (vista de detalle) */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Galería adicional (opcional)</p>
              <p className="text-xs text-muted-foreground">Arrastrá las imágenes para ordenar las miniaturas. La primera será la imagen inicial de la galería.</p>
              <div className="flex flex-wrap gap-2">
                {images.map((url, i) => (
                  <div
                    key={url}
                    draggable
                    onDragStart={(event) => {
                      setDraggedGalleryIndex(i);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", String(i));
                    }}
                    onDragEnd={() => setDraggedGalleryIndex(null)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const sourceIndex = draggedGalleryIndex ?? Number(event.dataTransfer.getData("text/plain"));
                      if (Number.isInteger(sourceIndex)) moveGalleryImage(sourceIndex, i);
                      setDraggedGalleryIndex(null);
                    }}
                    className={`relative w-20 h-20 border border-border overflow-hidden group cursor-grab active:cursor-grabbing ${
                      draggedGalleryIndex === i ? "opacity-50" : ""
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 rounded-sm bg-foreground/75 p-1 text-primary-foreground" aria-hidden="true">
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => galleryFileRef.current?.click()}
                  disabled={uploadingGallery}
                  className="w-20 h-20 border border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Upload className="h-5 w-5" />
                </button>
              </div>
              <input ref={galleryFileRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
            </div>

            <Separator />

            {/* Las regulares pueden tener varias sedes; el resto conserva una ubicación única. */}
            {form.watch("category") === "regulares" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Sedes</p>
                    <p className="text-xs text-muted-foreground">Agregá cada zona donde das esta clase regular.</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendLocation({ name: "", map_url: "" })}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Agregar sede
                  </Button>
                </div>
                {locationFields.length === 0 && <p className="text-xs text-muted-foreground">No hay sedes cargadas.</p>}
                {locationFields.map((locationField, index) => (
                  <div key={locationField.id} className="border border-border rounded p-3 flex items-end gap-2">
                    <FormField control={form.control} name={`locations.${index}.name`} render={({ field }) => (
                      <FormItem className="flex-1"><FormLabel className="text-xs">Nombre o zona</FormLabel><FormControl><Input placeholder="Ej: La Cala de Mijas" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`locations.${index}.map_url`} render={({ field }) => (
                      <FormItem className="flex-1"><FormLabel className="text-xs">Link de Google Maps</FormLabel><FormControl><Input placeholder="https://maps.google.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="sm" aria-label={`Eliminar sede ${index + 1}`} onClick={() => removeLocation(index)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Locación</p>
                <FormField control={form.control} name="location_text" render={({ field }) => (
                  <FormItem><FormLabel>Nombre del lugar</FormLabel><FormControl><Input placeholder="Ej: MAUI, Málaga (a pasos de la playa)" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="location_map_url" render={({ field }) => (
                  <FormItem><FormLabel>Link de Google Maps</FormLabel><FormControl><Input placeholder="https://maps.google.com/..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            )}

            <Separator />

            {form.watch("category") === "regulares" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Turnos y precios</p>
                    <p className="text-xs text-muted-foreground">Una fila por turno: día, horario, precio de clase única y precio del bono mensual. No se usan fechas ni calendario.</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendRecurringSchedule({ weekday: 2, start_time: "17:00", end_time: "19:00", spots_available: form.getValues("max_students") || 8, single_price: 0, monthly_price: 0 })}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Agregar turno
                  </Button>
                </div>
                {recurringScheduleFields.length === 0 && <p className="text-xs text-muted-foreground">No hay horarios semanales cargados.</p>}
                {recurringScheduleFields.map((scheduleField, index) => (
                  <div key={scheduleField.id} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2 border border-border rounded p-3">
                    <FormField control={form.control} name={`recurring_schedules.${index}.weekday`} render={({ field }) => (
                      <FormItem><FormLabel className="text-xs">Día</FormLabel><Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{WEEKDAYS.map((day) => <SelectItem key={day.value} value={String(day.value)}>{day.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`recurring_schedules.${index}.start_time`} render={({ field }) => (
                      <FormItem><FormLabel className="text-xs">Inicio</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`recurring_schedules.${index}.end_time`} render={({ field }) => (
                      <FormItem><FormLabel className="text-xs">Fin</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="sm" aria-label={`Eliminar horario semanal ${index + 1}`} onClick={() => removeRecurringSchedule(index)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    <FormField control={form.control} name={`recurring_schedules.${index}.spots_available`} render={({ field }) => (
                      <FormItem className="col-span-3"><FormLabel className="text-xs">Vacantes por clase</FormLabel><FormControl><Input type="number" min={1} step={1} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`recurring_schedules.${index}.single_price`} render={({ field }) => (
                      <FormItem><FormLabel className="text-xs">Clase única (€)</FormLabel><FormControl><Input type="number" min={0} step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`recurring_schedules.${index}.monthly_price`} render={({ field }) => (
                      <FormItem><FormLabel className="text-xs">Bono mensual · 4 clases (€)</FormLabel><FormControl><Input type="number" min={0} step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                ))}
              </div>
            )}

            {!isRegularClass && <><p className="text-sm font-semibold text-foreground">Fechas del evento</p>

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
                      aria-label={`Editar fecha del ${format(new Date(s.scheduled_date + "T00:00:00"), "d 'de' MMMM", { locale: es })}`}
                      onClick={() => { setEditingSchedule(s); setScheduleDialogOpen(true); }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Eliminar fecha del ${format(new Date(s.scheduled_date + "T00:00:00"), "d 'de' MMMM", { locale: es })}`}
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
                    <FormItem><FormLabel>Vacantes</FormLabel><FormControl><Input type="number" min={0} step={1} {...field} /></FormControl><FormMessage /></FormItem>
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

            </>}
            <Separator />

            {/* Detalles operativos */}
            <p className="text-sm font-semibold text-foreground">Detalles operativos</p>
            <div className="grid grid-cols-3 gap-3">
              {!isRegularClass && <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Precio (€)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />}
              <FormField control={form.control} name="duration_hours" render={({ field }) => (
                <FormItem><FormLabel>Duración (horas)</FormLabel><FormControl><Input type="number" min="0.25" step="0.25" {...field} /></FormControl><p className="text-xs text-muted-foreground">Ej: 1,5 · 2 · 2,5</p><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="max_students" render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad máxima de la actividad</FormLabel>
                  <FormControl><Input type="number" min={1} step={1} {...field} /></FormControl>
                  <p className="text-xs text-muted-foreground">No uses 0 aquí. Para cerrar una fecha ya creada, abrí la pestaña Horarios y editá sus Vacantes.</p>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <Separator />

            {/* Las clases regulares ya tienen los dos precios dentro de cada turno. */}
            {!isRegularClass && <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Opciones con precio</p>
                <p className="text-xs text-muted-foreground">{form.watch("category") === "regulares" ? "Creá, por ejemplo, Clase suelta y Mensual. La clase suelta pedirá una fecha disponible; la mensual conserva el horario semanal." : "Si cargás opciones, en el detalle se muestran para elegir en vez de una fecha (ej. montos de una tarjeta regalo)."}</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => appendOption({ label: "", price: 0, booking_mode: form.getValues("category") === "regulares" ? "single" : undefined })}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Agregar opción
              </Button>
            </div>

            {optionFields.length === 0 && (
              <p className="text-xs text-muted-foreground">No hay opciones cargadas.</p>
            )}

            {optionFields.map((optionField, index) => (
              <div key={optionField.id} className="border border-border rounded p-3 flex items-end gap-2">
                <FormField control={form.control} name={`options.${index}.label`} render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Nombre de la opción</FormLabel>
                    <FormControl><Input placeholder="Ej: Bono €30" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`options.${index}.price`} render={({ field }) => (
                  <FormItem className="w-28">
                    <FormLabel className="text-xs">Precio (€)</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                {form.watch("category") === "regulares" && (
                  <FormField control={form.control} name={`options.${index}.booking_mode`} render={({ field }) => (
                    <FormItem className="w-36">
                      <FormLabel className="text-xs">Modalidad</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "single"}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="single">Clase suelta</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
                <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(index)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            ))}

            </>}
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
                <FormField control={form.control} name={`faq.${index}.answer`} render={({ field: { ref, ...field } }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs">Respuesta</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => wrapSelectionBold(faqAnswerRefs.current[index] || null, `faq.${index}.answer`)}
                      >
                        <Bold className="h-3 w-3 mr-1" /> Negrita
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder="No, te guiamos desde cero..."
                        {...field}
                        ref={(el) => { ref(el); faqAnswerRefs.current[index] = el; }}
                      />
                    </FormControl>
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

            <FormField control={form.control} name="is_featured" render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="!mt-0">Destacado (aparece arriba en la página de Clases)</FormLabel>
              </FormItem>
            )} />

            <FormField control={form.control} name="badge_label" render={({ field }) => (
              <FormItem>
                <FormLabel>Etiqueta en la tarjeta (opcional)</FormLabel>
                <div className="flex flex-wrap gap-2 mb-1">
                  {["Más vendido", "Más popular", "Últimas plazas", "¡Novedad!"].map((preset) => (
                    <Button key={preset} type="button" variant="outline" size="sm" onClick={() => field.onChange(preset)}>
                      {preset}
                    </Button>
                  ))}
                  {field.value && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => field.onChange("")}>
                      <X className="h-3.5 w-3.5 mr-1" /> Quitar
                    </Button>
                  )}
                </div>
                <FormControl><Input placeholder="Ej: Más popular" {...field} /></FormControl>
                <p className="text-xs text-muted-foreground">Aparece arriba a la derecha de la tarjeta en el listado de Clases. Dejar vacío para no mostrar ninguna.</p>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Guardando..." : "Guardar"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      <ScheduleFormDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        schedule={editingSchedule}
      />
    </Dialog>
  );
};

export default ClassTypeFormDialog;
