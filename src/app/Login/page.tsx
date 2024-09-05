"use client";
import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import { useSearchParams } from "next/navigation";
import { Select } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";
import LayOut from "../Layout/layout";
interface LayOutProps {
  role: "admin" | "dealer" | "customer";
}
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<LayOutProps>();
  const [showlogin, setShowlogin] = useState(true);
  const [showlayout, setShowlayout] = useState(false);
  useEffect(() => {
    // localStorage.removeItem("Email");
  }, [showlayout, showlogin]);
  const handelpassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handelemail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChange = (value: string) => {
    setRole(value);
  };
  const login = async () => {
    const postData = {
      email: email,
      password: password,
      role: role,
    };

    const response = await axios.post(
      "http://localhost:5000/api/login",
      postData
    );
    if (response.data.message == "User signed in successfully") {
      localStorage.setItem("Email", email);
      setShowlayout(true);
      setShowlogin(false);
    }
  };
  return (
    <>
      {showlogin && (
        <div className="h-screen justify-center bg-white">
          <h1 className="text-center text-black text-xl p-9">Login</h1>
          <div className="w-[50%] mx-[25%] py-[3%]">
            <Input
              onChange={handelemail}
              value={email}
              className="border-1"
              placeholder="Enter Email"
            />
          </div>
          <div className="w-[50%] mx-[25%] py-[1%]">
            <Input
              onChange={handelpassword}
              value={password}
              placeholder="Enter Password"
            />
          </div>
          <div className="w-[50%] mx-[25%] py-[1%]">
            <Select
              className="w-[100%]"
              onChange={handleChange}
              options={[
                { value: "admin", label: <span>Admin</span> },
                { value: "dealer", label: <span>Dealer</span> },
                { value: "customer", label: <span>Customer</span> },
              ]}
            />
            ;
          </div>
          <div className="w-[50%] mx-[47%] py-4">
            <Button onClick={login}>Login</Button>
          </div>
        </div>
      )}
      {showlayout && <LayOut role={role} />}
    </>
  );
};

export default Login;
