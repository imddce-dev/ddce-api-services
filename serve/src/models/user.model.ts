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
  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        code: "USERNAME_TAKEN",
        message: `ชื่อผู้ใช้ ${data.username} ถูกใช้ไปแล้ว`,
      };
    }
    const saltRounds = 12;
    const pepper = process.env.PASSWORD_PEPPER;
    if (!pepper) {
      return {
        success: false,
        code: "CONFIG_ERROR",
        message: "ระบบยังไม่พร้อมใช้งาน (security config หายไป)",
      };
    }

    const passwordWithPepper = data.password + pepper;
    const hashedPassword = await bcrypt.hash(passwordWithPepper, saltRounds);
    const newUser = {
      ...data,
      password: hashedPassword,
    };

    const result = await db.insert(users).values(newUser);
    const newUserId = result[0]?.insertId;

    if (!newUserId) {
      return {
        success: false,
        code: "INSERT_FAILED",
        message: "สร้างผู้ใช้ไม่สำเร็จ กรุณาลองใหม่",
      };
    }
    return {
      success: true,
      code: "USER_CREATED",
      message: "กรุณารอผลอนุมัติภายใน 7 วันทำการ",
    };
  } catch (err: any) {
    console.error("Error creating user:", err);
    return {
      success: false,
      code: "UNKNOWN_ERROR",
      message: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่",
      detail: process.env.NODE_ENV === "development" ? err.message : undefined, // dev เท่านั้น
    };
  }
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

