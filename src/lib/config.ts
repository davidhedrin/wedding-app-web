import { CategoryKeyProps, MusicGroupProps } from "./model-types";
import categoryKeys from "@/json/template-key.json";
import musicThemeKeys from "@/json/music-theme.json";

const Configs = {
  app_name: "Wedlyvite",
  base_url: "http://localhost:3005",

  resend_from: "no-replay@resend.dev",
  
  valid_reset_pass: 5, // Minute
  valid_email_verify: 5, // Minute

  maxSizePictureInMB: 5,
  nameBtnSubmit: "submitType",
  nameBtnSaveVal: "save",
  nameBtnSaveCloseVal: "saveClose",
  priceAddOn1: 49000,

  tryDays: 3,
  toastDuration: 4000, // In second

  s3_bucket: "wedlyvite",
  p_limit: 25
};
export default Configs;

export const CategoryKeys: CategoryKeyProps[] = categoryKeys;
export const MusicThemeKeys: MusicGroupProps[] = musicThemeKeys;