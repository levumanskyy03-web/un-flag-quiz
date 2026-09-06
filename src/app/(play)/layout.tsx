import PlayApp from "@/features/play/PlayApp";

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PlayApp />
      {children}
    </>
  );
}
