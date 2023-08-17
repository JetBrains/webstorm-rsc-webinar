import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

export const cardsTable = sqliteTable('cards', {
  id: text('id').notNull(),
  name: text('name').notNull(),
  imageUri: text('image_uris.normal').notNull()
});

export const collectionTable = sqliteTable('collection', {
  id: text('id').notNull().primaryKey(),
  quantity: integer('quantity').notNull()
});

const sqlite = new Database('./data/oracle.db');
export const db = drizzle(sqlite);
