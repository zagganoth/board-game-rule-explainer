import Chat from "@/components/chat";
import { Header } from "@/components/header";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; description?: string }>;
}) {
  // Await the searchParams
  const params = await searchParams;
  const title = params.title || 'Default Title';
  const description = params.description || 'Default Description';

  return (
    <>
      <Header />
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden pb-10 flex-col">
        <Chat title={title} description={description} />
      </div>
    </>
  );
}
