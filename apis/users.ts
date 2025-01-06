// import { db } from "../firebase";
import axios from "../api/axios";
// import { QueryFilterConstraint, and, arrayUnion, collection, doc, getDocs, or, query, setDoc, updateDoc, where } from "firebase/firestore";

// const usersCollection = collection(db, "users");
// export interface IUser {
//   name: string;
//   email: string;
//   type: "user" | "admin" | "alumni";
//   uid: string;
//   roomids: any;
//   roles?: string[];
// }
export interface IUser {
  name: string;
  dp: string | null;
  email: string;
  emailVerified: boolean;
  id: number;
  registered: boolean;
  type: "user" | "admin" | "alumni";
}

// export const getUser = async (email: string) => {
//   return getDocs(query(usersCollection, where("email", "==", email)));
// };

// export const getUserEmailIn = async (emailList: string[]) => {
//   return getDocs(query(usersCollection, where("email", "in", emailList)));
// };

export const getUserByEmailIn = async (emailList: string[]):Promise<IUser[]|undefined> => {
  try {
    const response = await axios.get(`/user/emailList`, {
      params: {
        emailList: emailList
      }
    });
    if(response.status === 200) return response.data;
    else{
      // console.log("Error code:", response.status);
      return undefined;
    }
  }
  catch (error) {
    console.error("Error fetching user by email list:", error);
    return undefined;
  }
}

// export const getUsersByRoles = async (roleList: string[]) => {
//   if (!roleList) return null;
//   const constraints = roleList
//     .map((r) => {
//       if (r.toLowerCase() === "admin") return where("type", "==", "admin");
//       if (r.toLowerCase() === "alumni") return where("type", "==", "alumni");
//       if (r.toLowerCase() === "2024") return and(where("email", ">=", "2024"), where("email", "<=", "2024~"));
//       if (r.toLowerCase() === "2023") return and(where("email", ">=", "2023"), where("email", "<=", "2023~"));
//       if (r.toLowerCase() === "2022") return and(where("email", ">=", "2022"), where("email", "<=", "2022~"));
//       return null;
//     })
//     .filter((r) => r) as QueryFilterConstraint[];

//   if (!constraints) return null;
//   return getDocs(query(usersCollection, or(...constraints)));
// };

interface ICreateUser {
  uid: string;
  name: string;
  email: string;
}
9
export const checkHackathonRegistration = async () => {
  try {
    const token = localStorage.getItem("token");
    if(!token) return;
    const response = await axios.get("/user/register/hackathon", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if(response.status === 200) return response.data;
    else{
      // console.log("Error code:", response.status);
      return undefined;
    }
  } catch (err) {
    throw err;
  }
  
}

export const registerHackathon = async () => {
  try {
    const token = localStorage.getItem("token");
    if(!token) return false;
    const response = await axios.post("/user/register/hackathon", {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    // .then((res) => {
    //   console.log(res);
    //   if(res.status === 200) return true;
    //   else return false;
    // }).catch((err) => {
    //   console.log(err);
    //   return false;
    // })
    if(response.status === 200) return true;
    else{
      console.log("Error code:", response.status);
      return false
    }
    // console.log(response)
  } catch (err) {
    return false;
  }
}


//not used
// export const createUser = async ({ uid, name, email }: ICreateUser) => {
//   const roles = [];
//   if (email.endsWith("@mnit.ac.in") || email.endsWith("@iiitkota.ac.in")) roles.push("mnit");
//   return setDoc(doc(usersCollection, uid), {
//     name,
//     email,
//     uid,
//     type: "user",
//     dp: Math.floor(Math.random() * 27),
//     registered: false,
//     roomids: [],
//     rooms: [],
//     roles: [],
//   });
// };

// export const addUserRoom = async (
//   user: IUser,
//   roomnames: string[],
//   roomids: string[]
// ) => {
//   // console.log(roomnames, roomids);
//   await Promise.all(
//     roomids.map(async (id) => {
//       await updateDoc(doc(db, "rooms", id), {
//         members: arrayUnion(user.email),
//       });
//     })
//   );
//   return updateDoc(
//     doc(usersCollection, user.uid),
//     {
//       rooms: arrayUnion(...roomnames),
//       roomids: arrayUnion(...roomids),
//     }
//   );
// };