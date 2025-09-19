import { users } from '../configs/mysql/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { DrizzleDB } from '../configs/type';


export const findAll = async (db: DrizzleDB) => {
  return await db.query.users.findMany();
};


export const create = async (
  db: DrizzleDB,
  data: {
    username: string;
    password: string;
    fullname: string;
    organizer: string;
    phone: string;
    email: string;
    policy: boolean;
  }
) => {
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, data.username))
    .limit(1);
  if (existingUser.length > 0) {
    throw new Error(`Username '${data.username}' is already taken.`);
  }
  const saltRounds = 12;
  const pepper = process.env.PASSWORD_PEPPER;
  if (!pepper) {
    throw new Error("Application security configuration is incomplete.");
  }
  const passwordWithPepper = data.password + pepper;
  const hashedPassword = await bcrypt.hash(passwordWithPepper, saltRounds);

  const newUser = {
    ...data,
    password: hashedPassword,
  };
  const result = await db.insert(users).values(newUser);
  const newUserId = result[0].insertId;
  if (!newUserId) {
    throw new Error("Failed to create user, insertId was not returned.");
  }
  console.log(`Created user successfully with ID: ${newUserId}`);
  return {message: 'Created User Successfully'};
};

export const findByUsername = async (db: DrizzleDB, username: string) => {
  return await db
    .select().from(users)
    .where(eq(users.username, username))
    .limit(1)
    .then((res) => res[0]);
}


export const RemoveUser = async (db: DrizzleDB, id: number) => {
  return await db
    .delete(users)
    .where(eq(users.id, id))
    .then(() => ({ id })); 
}


// export const EditUser = async (db: DrizzleDB, id: number,
//   data: {
//     prename: string;
//     surname: string;
//     organizer: number;
//     email: string;
//   }
// ) => {
//   await db
//     .update(users)
//     .set({...data})
//     .where(eq(users.id, id));
//   return { id, ...data };
// }

