import type { Metadata } from "next";
import { requestLang } from "@/i18n/requestLang";
import { STRINGS } from "@/i18n/strings";
import { PlayDocument } from "@/components/PlayDocument";
import { publicMetadata } from "@/lib/pageMeta";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const t = STRINGS[lang];
  return publicMetadata(lang, { title: t.playWithFriend, description: t.duelHint, path: "/friend" });
}

export default async function FriendPage() {
  return <PlayDocument lang={await requestLang()} hub="friend" />;
}
