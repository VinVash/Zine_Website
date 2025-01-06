import React, { useState } from "react";
import Image from "next/image";
import ZineLogo from "../../images/zinelogo.png";
import { ToastContainer, toast } from "react-toastify";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  getCountFromServer,
  updateDoc,
} from "firebase/firestore";
// import { db } from "../../firebase";
import { useForm } from "react-hook-form";
// import { getUser } from "../../apis/users";

const branches = [
  "Architecture",
  "Artificial Intelligence and Data Engineering",
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
  email: string;
  phoneno: string;
  branch: string;
  gender: string;
  platform: string;
}

const validateEmail = (email: string) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

const AptitudeForm = () => {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IRegistrationData>({});

  const addRegistration = async (data: IRegistrationData) => {
    // console.log(data);
    // if (!data.email.startsWith("2023")) return toast.error("Registration is open for first years only")

    // const regRef = collection(db, "aptitudeRegs");

    reset({ name: "", email: "", phoneno: "" });
    // let querySnapshot = await getUser(data.email.trim());
    // if (querySnapshot.empty)
    //   return toast.error(
    //     "Email address is not registered with Zine. Please signup first"
    //   );

    // const user = querySnapshot.docs[0];
    // const isAptReg = query(regRef, where("email", "==", data.email.trim()));
    // const snapshot = await getCountFromServer(isAptReg);

    // if (snapshot.data().count > 0) return toast.error("Already registered for the Aptitude Test");

    // const promise = addDoc(regRef, data).then(() => updateDoc(user.ref, { registered: true }));
    // await toast.promise(promise, {
    //   pending: "Registering user",
    //   success: "Successfully registered for the Aptitude Test",
    //   error: "Registration unsuccessfull",
    // });
  };
  return (
    <div
      className="flex flex-col w-full h-full items-center"
      style={{
        background: "linear-gradient(to right, #003D63, #0C72B0)",
      }}
    >
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div
        className="bg-white shadow-md rounded-xl px-8 pb-8 md:px-16 my-16 w-11/12 md:w-1/2"
        style={{ maxWidth: 651 }}
      >
        <div className="flex justify-center">
          <Image src={ZineLogo} width={150} height={150} />
        </div>
        <p
          className="text-center -mt-8 font-semibold"
          style={{ color: "#0C72B0" }}
        >
          Robotics and Research Group
        </p>
        <div
          className="font-poppins text-2xl font-bold text-center"
          style={{ color: "#0C72B0" }}
        >
          Workshop Registration 2024
        </div>
        <div className="mt-8">
          <label className="block text-gray-600">
            Full Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            className="block w-full focus:outline-none bottom-border pt-2"
            placeholder="John Doe"
            {...register("name", { required: true })}
          />

          {errors.name && (
            <p className="text-red-500 text-sm" role="alert">
              Full name is required
            </p>
          )}
        </div>
        <div className="mt-6">
          <label className="block text-gray-600">
            College Email Address
            <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            className="block w-full focus:outline-none bottom-border pt-2"
            placeholder="2023abc1234@mnit.ac.in"
            {...register("email", { required: true, validate: validateEmail })}
          />

          {errors.email?.type === "required" && (
            <p className="text-red-500 text-sm" role="alert">
              Email is required
            </p>
          )}
        </div>
        <div className="mt-6">
          <label className="block text-gray-600">
            Phone Number
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="phone"
            className="block w-full focus:outline-none bottom-border pt-2"
            placeholder="123456789"
            {...register("phoneno", { required: true, valueAsNumber: true })}
          />
          {errors.phoneno && (
            <p className="text-red-500 text-sm" role="alert">
              Phone number is required
            </p>
          )}
        </div>
        <div className="mt-6">
          <label className="block text-gray-600">
            Branch
            <span className="text-red-500">*</span>
          </label>
          <select
            id="name"
            className="block w-full focus:outline-none bottom-border pt-2 indent-0"
            {...register("branch", { required: true })}
          >
            {branches.map((branch) => (
              <option key={branch}>{branch}</option>
            ))}
          </select>
        </div>
        <div className="mt-8">
          <label className="block text-gray-600">
            Gender
            <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            className="block w-full focus:outline-none bottom-border pt-2"
            {...register("gender", { required: true })}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="mt-8">
          <label className="block text-gray-600">
            Platform
            <span className="text-red-500">*</span>
          </label>
          <select
            id="branch"
            className="block w-full focus:outline-none bottom-border pt-2"
            {...register("platform", { required: true })}
          >
            <option>Android</option>
            <option>IOS</option>
          </select>
        </div>

        <button
          className="mt-8 p-4 block w-full rounded-3xl text-white opacity-90 hover:opacity-100"
          style={{ background: "#0C72B0" }}
          onClick={handleSubmit(addRegistration)}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default AptitudeForm;
