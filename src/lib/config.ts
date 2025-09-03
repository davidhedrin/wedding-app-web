import { CategoryKeyProps } from "./model-types";
import categoryKeys from "@/json/template-key.json";

const Configs = {
  app_name: "Wedlyvite",
  base_url: "http://localhost:3005",

  resend_from: "no-replay@resend.dev",
  
  valid_reset_pass: 5, // Minute
  valid_email_verify: 5, // Minute

  maxSizePictureInMB: 2,
  nameBtnSubmit: "submitType",
  nameBtnSaveVal: "save",
  nameBtnSaveCloseVal: "saveClose",

  tryDays: 3,
  toastDuration: 4000 // In second
};
export default Configs;

export const CategoryKeys: CategoryKeyProps[] = categoryKeys;