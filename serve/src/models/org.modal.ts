import { organizer as org } from '../configs/mysql/schema';
import { DrizzleDB } from './../configs/type/index';

export const getOrg = async (db: DrizzleDB) => {
  try {
    const organizations = await db
      .select({
        id: org.id,
        name: org.name,
      })
      .from(org);
    return { data: organizations, error: null };

  } catch (err) {
    console.error("Error fetching organizations:", err);
    return { data: null, error: "Failed to fetch data from the database." };
  }
};