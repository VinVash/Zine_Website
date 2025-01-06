import React from "react";
import { useRouter } from "next/router";
// import { db } from '../../firebase';
// import {
//   collection,
//   where,
//   query,
//   addDoc,
//   getDocs,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
import { useForm } from "react-hook-form";

const branches = [
  "Architecture",
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Science & Engineering",
  "Electrical Engineering",
  "Electronics and Communication Engineering",
  "Metallurgical Engineering",
  "Mechanical Engineering",
] as const;

interface IRegistrationData {
  name: string;
  college: string;
  email: string;
  branch: (typeof branches)[number];
  phone: string;
  gender: string;
  platform: string;
}

const validateEmail = (email: string) => {
  return /^20\d\d((kucp)|(kuec)|(uar)|(ucp)|(uec)|(uee)|(uch)|(ume)|(uce)|(umt))\d{4}@((mnit)|(iiitkota)).ac.in$/g.test(
    email
  );
};

const Registration = () => {
  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<IRegistrationData>({
    defaultValues: { gender: "Male", platform: "Android" },
  });
  const router = useRouter();
  // const regCollection = collection(db, "registrations");
  // const usersCollection = collection(db, "users");

  const onSubmit = async (data: IRegistrationData) => {
    if (!data.email.startsWith("2022"))
      return setError("root.firstYear", { message: "" });
    // console.log(data)

    // const q = query(regCollection, where("email", "==", data.email))

    try {
      //   const docExists = await getDocs(q);
      // console.log(docExists.size, docExists.docs)
      //   if (docExists.size >= 1) {
      //     return setError("root.duplicate", {
      //       message: "You have already registered with this email ID",
      //     });
      //   }

      // const docRef = await addDoc(regCollection, data)
      // const usersQuery = query(usersCollection, where("email", "==", data.email))
      // const users = await getDocs(usersQuery)
      // if (!users.empty) await updateDoc(doc(db, "users", users.docs[0].data().uid), { registered: true })

      localStorage.setItem(
        "message",
        "Registered for the workshop successfully!"
      );
      // console.log("Document written with ID: ", docRef.id);
      router.push("/workshops");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div
      className="flex flex-col items-center"
      style={{
        background: "linear-gradient(to right, #003D63, #0C72B0)",
        marginBottom: -35,
      }}
    >
      <div className="text-white font-bold">
        <h1 className="text-2xl mt-12 lg:text-3xl">WORKSHOP REGISTRATION</h1>
      </div>
      <div
        className="bg-white rounded-xl p-8 md:p-16 mt-8 mb-16 w-11/12 md:w-1/2"
        style={{ maxWidth: 651 }}
      >
        <form>
          <div>
            <label className="block text-gray-600">Full Name</label>
            <input
              type="text"
              id="name"
              className="block w-full focus:outline-none bottom-border text-lg pt-2"
              placeholder="Enter name"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm" role="alert">
                Full name is required
              </p>
            )}
          </div>
          <div className="mt-6">
            <label className="block text-gray-600">College Name</label>
            <select
              id="college"
              className="block w-full focus:outline-none bottom-border text-lg pt-2 indent-0"
              {...register("college")}
            >
              <option>MNIT Jaipur</option>
              <option>IIIT Kota</option>
            </select>
          </div>
          <div className="mt-6">
            <label className="block text-gray-600">College Email Address</label>
            <input
              type="email"
              id="email"
              className="block w-full focus:outline-none bottom-border text-lg pt-2"
              placeholder="abc@mnit.ac.in"
              {...register("email", {
                required: true,
                validate: validateEmail,
              })}
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500 text-sm" role="alert">
                Email is required
              </p>
            )}
            {errors.email?.type === "validate" && (
              <p className="text-red-500 text-sm" role="alert">
                Enter a valid college email id
              </p>
            )}
          </div>
          <div className="mt-6">
            <label className="block text-gray-600">Branch</label>
            <select
              id="name"
              className="block w-full focus:outline-none bottom-border text-lg pt-2 indent-0"
              {...register("branch", { required: true })}
            >
              {branches.map((branch) => (
                <option key={branch}>{branch}</option>
              ))}
            </select>
          </div>
          <div className="mt-6">
            <label className="block text-gray-600">Phone Number</label>
            <input
              type="number"
              id="phone"
              className="block w-full focus:outline-none bottom-border text-lg pt-2"
              placeholder="123456789"
              {...register("phone", { required: true })}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm" role="alert">
                Phone number is required
              </p>
            )}
          </div>

          <div className="mt-6">
            <p>Gender</p>
            <div className="inline-block">
              <input
                className="mr-2"
                type="radio"
                {...register("gender")}
                value="male"
                checked
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input
                className="mr-2"
                type="radio"
                {...register("gender")}
                value="female"
              />
              <label htmlFor="female">Female</label>
            </div>
          </div>
          <div className="mt-6">
            <p>Platform</p>
            <div>
              <input
                className="mr-2"
                type="radio"
                {...register("platform")}
                value="android"
                checked
              />
              <label htmlFor="android">Android</label>
            </div>
            <div>
              <input
                className="mr-2"
                type="radio"
                {...register("platform")}
                value="ios"
              />
              <label htmlFor="ios">IOS</label>
            </div>
          </div>

          <button
            className="mt-6 p-4 block w-full rounded-3xl text-white"
            onClick={handleSubmit(onSubmit)}
            style={{ background: "#0C72B0" }}
          >
            Register
          </button>
          {errors.root?.duplicate && (
            <p className="text-sm mt-4 text-red-500">
              You have already registered with this email ID
            </p>
          )}
          {errors.root?.firstYear && (
            <p className="text-sm mt-4 text-red-500">
              Registration is open for first years only
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Registration;
