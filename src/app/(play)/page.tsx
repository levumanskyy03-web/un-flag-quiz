import { PlayDocument } from "@/components/PlayDocument";
import { requestLang } from "@/i18n/requestLang";

export default async function PlayHomePage() {
  return <PlayDocument lang={await requestLang()} hub="home" />;
}
