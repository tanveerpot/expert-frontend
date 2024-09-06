"use client";
import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, theme, Input } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
const { Header, Sider, Content } = Layout;
interface LayOutProps {
  userRole: "admin" | "dealer" | "customer";
}

const LayOut: React.FC<LayOutProps> = () => {
  const baseURL = "baseURL";
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUsers, setShowUsers] = useState(true);
  const [addUsers, setAddUsers] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [userRole, setUseruserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [customer, setCustomer] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("Email");
    if (user == null) {
      router.push("/Login");
    }
    const data = { email: user };
    const getUser = async () => {
      const response = await axios.post(`${baseURL}/login/user`, data);
      setUseruserRole(response.data.role);
      setUserEmail(response.data.email);
    };
    getUser();
    setIsDelete(false);
    setName("");
    setEmail("");
    if (userRole == "customer") {
      setAddUsers(false);
      setShowUsers(false);
      setCustomer(true);
    }
    const fetchData = async () => {
      try {
        if (userRole === "admin") {
          const response = await axios.get(`${baseURL}/dealer`, {
            headers: {
              email: userEmail,
            },
          });
          setData(response.data);
        } else if (userRole === "dealer") {
          const dealer = { dealer: userEmail };

          const response = await axios.get(`${baseURL}/customer`, {
            headers: {
              email: userEmail,
            },
          });

          setData(response.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showUsers, userRole, isDelete, loading]);
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleFocus = () => {
    setEmail(currentUser);
  };
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    const dealerEmail = localStorage.getItem("Email");
    const postData = {
      name: name,
      email: email,
      creator: userEmail,
    };
    try {
      if (userRole === "admin") {
        const response = await axios.post(`${baseURL}/dealer`, postData, {
          headers: {
            email: userEmail,
          },
        });
      } else if (userRole === "dealer") {
        const response = await axios.post(`${baseURL}/customer`, postData, {
          headers: {
            email: userEmail,
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(true);
    setShowUsers(true);
    setAddUsers(false);
    setName("");
    setEmail("");
  };
  const addUser = () => {
    setShowUsers(false);
    setAddUsers(true);
  };
  const editUser = (useridentity) => {
    setCurrentUser(useridentity);
    setShowUsers(false);
    setIsEdit(true);
  };

  const handleCancel = () => {
    setShowUsers(true);
    setAddUsers(false);
    setIsEdit(false);
    setName("");
    setEmail("");
  };
  async function deleteUser(useridentity: String) {
    setCurrentUser(useridentity);
    const data = { email: useridentity };
    if (userRole === "admin") {
      try {
        const response = await axios.delete(`${baseURL}/dealer/delete`, {
          data,
          headers: {
            email: userEmail,
          },
        });
        if (response.data.message === "Deleted dealer") {
          setIsDelete(true);
          setLoading(true);
        }
      } catch (error) {
        console.error("Error deleting dealer:", error);
      }
    } else if (userRole === "dealer") {
      try {
        const response = await axios.delete(`${baseURL}/customer/delete`, {
          data,
          headers: {
            email: userEmail,
          },
        });
      } catch (error) {
        console.error("Error in deleting:", error);
      }
    }
    setIsDelete(true);
    setLoading(true);
  }

  const handleResponse = (data) => {
    if (data && data.length > 0) {
      return data.map((customer, index) => (
        <div key={index} className="mb-3">
          <p className="inline">{customer.name}</p>
          <Button className="border border-gray rounded-md py-1 px-5 mx-3">
            Subscriptions
          </Button>
          <button
            className="border border-gray rounded-md py-1 px-5 mx-3 bg-blue-500 hover:text-white"
            id={customer.email}
            onClick={() => {
              editUser(customer.email);
            }}
          >
            Edit
          </button>
          <button
            className="border border-gray rounded-md py-1 px-5 mx-3 bg-red-500 hover:text-white"
            id={customer.email}
            onClick={() => deleteUser(customer.email)}
          >
            Delete
          </button>
        </div>
      ));
    } else {
      return <p>No data found.</p>;
    }
  };
  const logout = () => {
    localStorage.removeItem("Email");
    router.push("/Login");
  };
  const handleSave = async () => {
    const postData = {
      oldEmail: currentUser,
      newName: name,
      email: email,
    };
    try {
      if (userRole === "admin") {
        const response = await axios.put(`${baseURL}/dealer/update`, postData, {
          headers: {
            email: userEmail,
          },
        });
      } else if (userRole === "dealer") {
        const response = await axios.put(
          `${baseURL}/customer/update`,
          postData,
          {
            headers: {
              email: userEmail,
            },
          }
        );
      }

      setIsEdit(false);
      setShowUsers(true);
      setLoading(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Layout className="h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                label: userRole === "admin" ? "Dealers" : "Customers",
              },
              {
                key: "2",
                label: "Settings",
              },
              {
                key: "3",
                label: "Users",
              },
              {
                key: "4",
                label: "Plans",
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            className="flex justify-between"
            style={{ padding: 0, background: colorBgContainer }}
          >
            <h1 className="m-3 mt-4 font-bold text-lg capitalize ">
              {userRole}
            </h1>
            <div>
              <Button className="my-5 mr-3" onClick={logout}>
                Logout
              </Button>
              <Button
                className="my-5 mr-5 bg-blue-500 hover:text-white"
                onClick={addUser}
              >
                Add {userRole === "admin" ? "Dealer" : "Customer"}
              </Button>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {showUsers &&
              (loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                <div>{handleResponse(data)}</div>
              ))}
            {addUsers && (
              <div>
                <h1 className="text-center text-xl mb-5">
                  Add {userRole === "admin" ? "Dealer" : "Customer"}
                </h1>
                <Input
                  className="mb-3"
                  placeholder={
                    userRole === "admin" ? "Dealer Name" : "Customer Name"
                  }
                  onChange={handleName}
                  value={name}
                />
                <Input
                  placeholder={
                    userRole === "admin" ? "Dealer Email" : "Customer Email"
                  }
                  onChange={handleEmail}
                  value={email}
                />
                <div className="mt-5">
                  <Button
                    className="bg-blue-500 hover:text-white"
                    onClick={handleSubmit}
                  >
                    Add {userRole === "admin" ? "Dealer" : "Customer"}
                  </Button>
                  <Button className="ml-3" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {customer && <h1>Customer</h1>}
            {isEdit && (
              <div>
                <h1 className="text-center text-xl mb-5">
                  Edit {userRole === "admin" ? "Dealer" : "Customer"}
                </h1>
                <Input
                  className="mb-3"
                  placeholder={
                    userRole === "admin" ? "Dealer Name" : "Customer Name"
                  }
                  onChange={handleName}
                  value={name}
                />
                <Input
                  placeholder={currentUser}
                  onFocus={handleFocus}
                  onChange={handleEmail}
                  value={email}
                />
                <div className="mt-5">
                  <Button
                    className="bg-blue-500 hover:text-white"
                    onClick={handleSave}
                  >
                    Save {userRole === "admin" ? "Dealer" : "Customer"}
                  </Button>
                  <Button className="ml-3" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default LayOut;
