import OrderSuccess from "@/components/OrderSuccess";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  return <OrderSuccess locale="en" sessionId={session_id} />;
}
