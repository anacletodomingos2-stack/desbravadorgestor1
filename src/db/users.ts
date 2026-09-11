import { db } from './index';
import { users } from './schema';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoURL?: string) {
  try {
    const result = await db.insert(users)
      .values({
        id: uid,
        email,
        displayName: displayName || null,
        photoURL: photoURL || null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email,
          displayName: displayName || null,
          photoURL: photoURL || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to get or create user:', error);
    throw new Error('Database operation failed: ' + String(error));
  }
}
