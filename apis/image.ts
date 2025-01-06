// import { db, storage } from "../firebase"
// import { deleteObject, getDownloadURL, ref,uploadBytes } from "firebase/storage"

//returns the downloadURL for the image
// export const uploadImage = async(file: any, path: string)=>{
//     const storageRef = ref(storage, path)
//     const uploadTask = await uploadBytes(storageRef, file)

//     return getDownloadURL(uploadTask.ref)
// }

// export const deleteImage = async(path: string)=>{
//     const storageRef = ref(storage, path)
//     deleteObject(storageRef).catch((e)=>{
//         // console.log(e)
//     })
// }