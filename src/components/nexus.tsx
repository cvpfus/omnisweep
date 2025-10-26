import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NexusSweep from "./sweep";

export default function Nexus() {
  return (
    <div className="flex items-center justify-center w-full max-w-xl flex-col gap-6 z-10">
      <Tabs defaultValue="balance" className="w-full items-center">
        <TabsList>
          <TabsTrigger value="sweep">Sweep</TabsTrigger>
        </TabsList>
        <TabsContent
          value="sweep"
          className="w-full items-center bg-transparent"
        >
          <NexusSweep />
        </TabsContent>
      </Tabs>
    </div>
  );
}
