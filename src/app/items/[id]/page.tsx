import { ItemDetailPage } from "@/features/items";

interface ItemDetailRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ItemDetailRoute({ params }: ItemDetailRouteProps) {
  const { id } = await params;

  return <ItemDetailPage id={id} />;
}
