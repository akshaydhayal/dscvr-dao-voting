// // src/dbConnect.ts
// import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI || "your-mongodb-uri-here";

// if (!MONGO_URI) {
//   throw new Error("Please define the MONGO_URI environment variable inside .env.local");
// }

// let cached: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null } = global.mongoose;

// if (!cached) {
//     // @ts-ignore
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
//       return mongoose;
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;


// // src/dbConnect.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

//@ts-ignore
let cached:any = global.mongoose;

if (!cached) {
    //@ts-ignore
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise && MONGO_URI) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
