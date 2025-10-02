import { organizer, users } from '../configs/mysql/schema';
import { desc, eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { DrizzleDB } from '../configs/type';


export const findAll = async (db: DrizzleDB) => {
  try{
    const existingUserAll = await db
       .select({
        id: users.id,
        fullname: users.fullname,
        username: users.username,
        email: users.email,
        phone: users.phone, 
        organizeId: users.organizer,
        organizeName: organizer.name,
        appove: users.appove,
        appoveAt: users.appoveAt,
        createAt: users.createdAt,
        status: users.status
       })
       .from(users)
       .innerJoin(organizer, eq(users.organizer,organizer.id))
       .orderBy(desc(users.id));
    
    if( existingUserAll.length === 0 ){
      return {
        success: false,
        code: 'NO DATA',
        message: "ไม่มีข้อมูล หรืออาจเกิดข้อผิดพลาด !",
      }
    }
    return {
      success: true,
      data: existingUserAll
    }
  }catch(error){
    console.error("Error fetching users:", error);
    return {
      success: false,
      code: "UNKNOWN_ERROR",
      message: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่", 
    };
};
}


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
    console.log("Error creating user:", err);
    return {
      success: false,
      code: "UNKNOWN_ERROR",
      message: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่",
      detail: process.env.NODE_ENV === "development" ? err.message : undefined, 
    };
  }
};


export const appoveUser = async (db: DrizzleDB , userId : number , appove: boolean) => {
    const checkUser = await db.query.users.findFirst({
      where: eq(users.id, userId)
     })
    if (!checkUser) {
      console.log("ไม่พบผู้ใช้");
      return {
        success: false,
        code: "NOT_FOUND",
        message: `ไม่พบผู้ใช้ที่มี id = ${userId}`,
      };
    } 
    await db
      .update(users)
      .set({
        appove:appove,
        appoveAt: new Date(),
        status: appove ? "active" : "pending",
      })
      .where(eq(users.id, userId))

    return {
      success: true,
      status : appove,
      data: {email:checkUser.email, username: checkUser.username}
    };
}

export const updateUser = async (
  db: DrizzleDB,
  data: {
    userId: number;
    fullname: string;
    phone: string;
    email: string;
  }
) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, data.userId),
    });

    if (!user) {
      return {
        success: false,
        code: "NOT_FOUND",
        message: `ไม่พบผู้ใช้ที่มี id = ${data.userId}`,
      };
    }

    await db
      .update(users)
      .set({
        fullname: data.fullname,
        phone: data.phone,
        email: data.email,
      })
      .where(eq(users.id, data.userId));

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, data.userId),
    });

    return {
      success: true,
      message: "Update Data Success!",
      data: updatedUser,
    };
  } catch (err) {
    console.error("Update user error:", err);
    return {
      success: false,
      code: "DB_ERROR",
      message: "เกิดข้อผิดพลาดระหว่างอัพเดตข้อมูล",
    };
  }
};

export const removeUser =  async (db: DrizzleDB , userId: number)  => {
    try{
       
      const checkUser = await db.query.users.findFirst({
        where: eq(users.id, userId)
      })

      if(!checkUser) {
        console.log("ไม่พบผู้ใช้งาน")
        return {
          success: false,
          code: "NOT_FOUND",
          message: `ไม่พบผู้ใช้ที่มี id = ${userId}`,
        }
      }

      if(checkUser.appove === true || checkUser.status === 'active'){
        console.log("ไม่สามารถลบได้ เนื่องจาก ผู้ใช้ยัง Active")
        return {
          success: false,
          code:"USER IN ACTIVE",
          message:"User Active !"
        }
      }

      await db
        .delete(users)
        .where(eq(users.id,userId))

      return{
        success:true,
        message: "Delete User Success !"
      }

    }catch (err){
      console.error("Delete user error", err);
      return {
        success: false,
        code: "DB_ERROR",
        message: "เกิดข้อผิดพลาดระหว่างลบข้อมูล"
      }
    }
}








