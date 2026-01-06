import { CategoryKeys } from "@/lib/config";
import TabListWedding from "./wedding/tab-list";

type EventType = typeof CategoryKeys[number]["key"];
export default function TabListWraper({event_type}: { event_type: EventType }) {
  if(event_type === "wed") return <TabListWedding />;
  return null;
}
