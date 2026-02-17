import { CategoryKeys } from "@/lib/config";
import TabContentWedding from "./wedding/tab-content";
import { Events } from "@/generated/prisma";

export default function TabContentWraper({ dataEvent, url }: { dataEvent: Events, url: string }) {
  if(dataEvent.tmp_ctg_key === "wed") return <TabContentWedding dataEvent={dataEvent} url={url} />;
  return null;
}
