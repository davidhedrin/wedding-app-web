import { CategoryKeys } from "@/lib/config";
import TabContentWedding from "./wedding/tab-content";
import { Events } from "@/generated/prisma";

export default function TabContentWraper({dataEvent}: { dataEvent: Events}) {
  if(dataEvent.tmp_ctg_key === "wed") return <TabContentWedding dataEvent={dataEvent} />;
  return null;
}
