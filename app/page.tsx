import { cardsTable, collectionTable, db } from '@/database';
import { eq, like } from 'drizzle-orm';
import { AnimatedCardWithQuantity, Search } from '@/app/components.client';
import { revalidatePath } from 'next/cache';

async function addCardToCollection(id: string) {
  'use server';

  db.insert(collectionTable)
    .values({ id, quantity: 0 })
    .onConflictDoNothing({ target: collectionTable.id })
    .run();
  const currentQuantity = db
    .select({ quantity: collectionTable.quantity })
    .from(collectionTable)
    .where(eq(collectionTable.id, id))
    .all();
  db.update(collectionTable)
    .set({ quantity: currentQuantity[0].quantity + 1 })
    .where(eq(collectionTable.id, id))
    .run();

  revalidatePath('/');
}

async function removeCardFromCollection(id: string) {
  'use server';

  const currentQuantity = db
    .select({ quantity: collectionTable.quantity })
    .from(collectionTable)
    .where(eq(collectionTable.id, id))
    .all();
  if (
    currentQuantity[0]?.quantity === undefined ||
    currentQuantity[0].quantity === 0
  )
    return;
  db.update(collectionTable)
    .set({ quantity: currentQuantity[0].quantity - 1 })
    .where(eq(collectionTable.id, id))
    .run();

  revalidatePath('/');
}

async function CardCount() {
  const response = await fetch('https://api.scryfall.com/sets');
  const body = await response.json();
  // @ts-expect-error
  const totalCards = body.data.reduce((acc, el) => acc + el.card_count, 0);
  return <div>{totalCards.toLocaleString()} cards in total</div>;
}

export default async function Home({
  searchParams
}: {
  searchParams: { name?: string };
}) {
  const cards = db
    .select({
      id: cardsTable.id,
      name: cardsTable.name,
      imageUri: cardsTable.imageUri,
      quantity: collectionTable.quantity
    })
    .from(cardsTable)
    .leftJoin(collectionTable, eq(cardsTable.id, collectionTable.id))
    // For an actual MySQL fulltext index you'd use the following instead:
    // MATCH (name) AGAINST ('*${searchParams.name}*' IN BOOLEAN MODE)
    .where(like(cardsTable.name, `%${searchParams.name ?? ''}%`))
    .limit(20)
    .all();

  return (
    <main className="min-h-screen p-8 flex flex-col gap-y-8">
      <div className="flex gap-2">
        <div className="flex-1">
          <Search />
        </div>
        <CardCount />
      </div>
      <div className="grid grid-cols-4 gap-2 justify-items-center">
        {cards.map((card) => (
          <AnimatedCardWithQuantity
            key={card.id}
            id={card.id}
            imageUri={card.imageUri}
            name={card.name}
            quantity={card.quantity ?? 0}
            onClickPlus={addCardToCollection}
            onClickMinus={removeCardFromCollection}
          />
        ))}
      </div>
    </main>
  );
}
