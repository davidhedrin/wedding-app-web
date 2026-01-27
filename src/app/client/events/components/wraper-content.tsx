import { CategoryKeys } from "@/lib/config";
import TabContentWedding from "./wedding/tab-content";

type EventType = typeof CategoryKeys[number]["key"];

export default function TabContentWraper({event_type, event_id}: { event_type: EventType, event_id: number }) {
  if(event_type === "wed") return <TabContentWedding event_id={event_id} />;
  return null;
}
