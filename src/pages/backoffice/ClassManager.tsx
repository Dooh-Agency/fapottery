import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassTypesList from "@/components/backoffice/ClassTypesList";
import SchedulesList from "@/components/backoffice/SchedulesList";
import ReservationsList from "@/components/backoffice/ReservationsList";

const ClassManager = () => {
  const [tab, setTab] = useState("types");

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl">Clases</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="types">Tipos de clase</TabsTrigger>
          <TabsTrigger value="schedules">Horarios</TabsTrigger>
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="mt-4">
          <ClassTypesList />
        </TabsContent>
        <TabsContent value="schedules" className="mt-4">
          <SchedulesList />
        </TabsContent>
        <TabsContent value="reservations" className="mt-4">
          <ReservationsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassManager;
