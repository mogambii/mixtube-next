"use server"

import getDb from "@/util/db";

// export async function Delete(){
//   const db = await getDb()
//   const res = await db.collection("users").deleteOne({username : "Frank "})
// }

export async function GetMixtapes() {
  try {
    const db = await getDb()
    const collection = db.collection("mixtapes")
    const results = await collection.find({}).project({_id: 0, time:1, unique: 1}).toArray()
    return results;
  } catch (error) {
    console.log(error)
  }
}

export async function GetDjs() {
  try {
    const db = await getDb()
    const collection = db.collection("users")
    const result = await collection.find({type: "DJ"}).project({_id: 0, username: 1}).toArray()
    return result
  } catch (error) {
    console.log(error)
  }
}
