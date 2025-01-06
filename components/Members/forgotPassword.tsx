import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ZineLogo from "../../images/zinelogo.png";
import { useForm } from "react-hook-form";
import Link from "next/link";
// import { sendPasswordResetEmail } from "firebase/auth";
// import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "../../context/authContext";
import { ToastContainer, toast } from "react-toastify";

interface IForgotPasswordData {
  email: string;
}

const ForgotPassword = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IForgotPasswordData>();
  const router = useRouter();
  const [buttonColor, setButtonColor] = useState("#0C72B0");

  const onSubmit = ({ email }: IForgotPasswordData) => {
    setButtonColor("#053C5E");
    sendPasswordResetEmail(email)
      .then(() => {
        toast.success("Password reset email sent!");
        setTimeout(() => router.push("/login"), 5000);
      })
      .catch((error) => {
        // console.log(error);
        if (error.status === 400) toast.error("Email not found");
        else if (error.status === 500)
          toast.error("Error validating email. Please try again");
      })
      .finally(() => {
        setButtonColor("#0C72B0");
      });
  };

  return (
    <div
      className="flex flex-col items-center"
      style={{ background: "linear-gradient(to right, #003D63, #0C72B0)" }}
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
        className="bg-white rounded-xl px-8 pb-8 md:px-16 my-16 w-11/12 md:w-1/2"
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
        <form>
          <div className="mt-8">
            <label className="block text-gray-600">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="block w-full focus:outline-none bottom-border pt-2"
              placeholder="xyz@abc.com"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm" role="alert">
                Email ID is required
              </p>
            )}
          </div>

          <button
            className="mt-8 p-4 block w-full rounded-3xl text-white"
            onClick={handleSubmit(onSubmit)}
            style={{ background: buttonColor }}
          >
            Forgot Password
          </button>
          <p className="mt-8 text-sm text-center">
            <Link href="/login">
              <a className="text-blue-500 underline">Back to login</a>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
