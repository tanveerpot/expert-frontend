"use client";
import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
interface LayOutProps {
  role: "admin" | "dealer" | "customer";
}
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("Email");
    if (user != null) {
      router.push("/dashboard");
    }
  });
  const handelpassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handelemail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const login = async () => {
    const postData = {
      email: email,
      password: password,
    };

    const response = await axios.post(
      "http://localhost:5000/api/login",
      postData
    );
    if (response.data.message == "User signed in successfully") {
      localStorage.removeItem("Email");
      localStorage.setItem("Email", email);
      router.push("/dashboard");
    }
  };
  return (
    <>
      <div className="h-screen justify-center bg-white">
        <h1 className="text-center text-black text-xl p-9">Login</h1>
        <div className="w-[50%] mx-[25%] py-[3%]">
          <Input
            className="placeholder-black-500 border-1"
            onChange={handelemail}
            value={email}
            placeholder="Enter Email"
          />
        </div>
        <div className="w-[50%] mx-[25%] py-[1%]">
          <Input
            className="placeholder-black-500"
            onChange={handelpassword}
            value={password}
            placeholder="Enter Password 123456"
          />
        </div>
        <div className="w-[50%] mx-[25%] py-[1%]"></div>
        <div className="w-[50%] mx-[47%] py-4">
          <Button onClick={login}>Login</Button>
        </div>
      </div>
    </>
  );
};

export default Login;
