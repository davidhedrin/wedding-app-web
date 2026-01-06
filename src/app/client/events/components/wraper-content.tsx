import { CategoryKeys } from "@/lib/config";
import TabContentWedding from "./wedding/tab-content";

type EventType = typeof CategoryKeys[number]["key"];

export default function TabContentWraper({event_type}: { event_type: EventType }) {
  if(event_type === "wed") return <TabContentWedding />;
  return null;
}
