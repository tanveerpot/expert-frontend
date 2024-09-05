"use client";
import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, theme, Input } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
const { Header, Sider, Content } = Layout;
interface LayOutProps {
  role: "admin" | "dealer" | "customer";
}

const LayOut: React.FC<LayOutProps> = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUsers, setShowUsers] = useState(true);
  const [addUsers, setAddUsers] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customer, setCustomer] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    const dealerEmail = localStorage.getItem("Email");
    const postData = {
      name: name,
      email: email,
      dealer: dealerEmail,
    };

    try {
      if (role === "admin") {
        const response = await axios.post(
          "http://localhost:5000/api/dealer",
          postData
        );
      } else if (role === "dealer") {
        const response = await axios.post(
          "http://localhost:5000/api/customer",
          postData
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setShowUsers(true);
    setAddUsers(false);
    setName("");
    setEmail("");
  };
  const addUser = () => {
    setShowUsers(false);
    setAddUsers(true);
  };
  const editUser = () => {
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
  async function userdelete(dealerEmail) {
    const data = { email: dealerEmail };
    if (role === "admin") {
      try {
        const response = await axios.delete(
          "http://localhost:5000/api/dealer/delete",
          { data }
        );
      } catch (error) {
        console.error("Error deleting dealer:", error);
      }
    } else if (role === "dealer") {
      try {
        const response = await axios.delete(
          "http://localhost:5000/api/customer/delete",
          { data }
        );
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  }
  function deleteUser(event) {
    event.preventDefault();
    const dealerEmail = event.target.id;
    userdelete(dealerEmail);

    setIsDelete(true);
  }

  const handleResponse = (data) => {
    if (data && data.length > 0) {
      return data.map((customer, index) => (
        <div key={index}>
          <p className="inline">{customer.name}</p>
          <Button>Subscriptions</Button>
          <button
            className="border border-gray rounded-md py-1 px-5 mx-3"
            id={customer.email}
            onClick={editUser}
          >
            Edit
          </button>
          <button
            className="border border-gray rounded-md py-1 px-5 mx-3"
            id={customer.email}
            onClick={() => deleteUser(event)}
          >
            Delete
          </button>
        </div>
      ));
    } else {
      return <p>No customers found.</p>;
    }
  };
  useEffect(() => {
    setIsDelete(false);
    setName("");
    setEmail("");
    if (role == "customer") {
      setAddUsers(false);
      setShowUsers(false);
      setCustomer(true);
    }
    const fetchData = async () => {
      try {
        if (role === "admin") {
          const response = await axios.get("http://localhost:5000/api/dealer");
        } else if (role === "dealer") {
          const dealerEmail = localStorage.getItem("Email");
          const dealer = { dealer: dealerEmail };
          const response = await axios.post(
            "http://localhost:5000/api/customer/specific",
            dealer
          );

          setData(response.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showUsers, role, isDelete]);
  const handleSave = async () => {
    const postData = {
      newName: name,
      email: email,
    };
    try {
      if (role === "admin") {
        const response = await axios.put(
          "http://localhost:5000/api/dealer/update",
          postData
        );
      } else if (role === "dealer") {
        const response = await axios.put(
          "http://localhost:5000/api/customer/update",
          postData
        );
      }

      setIsEdit(false);
      setShowUsers(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
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
              label: role === "admin" ? "Dealers" : "Customers",
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
          <h1 className="m-3 font-bold text-lg">
            {role === "admin" ? "Admin" : "Dealer"}
          </h1>
          <Button className="m-5" onClick={addUser}>
            Add {role === "admin" ? "Dealer" : "Customer"}
          </Button>
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
              <div>
                {/* {data.map((item, index) => (
                  <div key={index}>
                    <p className="inline">{item}</p>
                    <Button>Subscriptions</Button>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                  </div>
                ))} */}
                {handleResponse(data)}
              </div>
            ))}
          {addUsers && (
            <div>
              <Input
                placeholder={role === "admin" ? "Dealer Name" : "Customer Name"}
                onChange={handleName}
                value={name}
              />
              <Input
                placeholder={
                  role === "admin" ? "Dealer Email" : "Customer Email"
                }
                onChange={handleEmail}
                value={email}
              />
              <div>
                <Button onClick={handleSubmit}>Submit</Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </div>
            </div>
          )}
          {customer && <h1>Customer</h1>}
          {isEdit && (
            <div>
              <Input
                placeholder={role === "admin" ? "Dealer Name" : "Customer Name"}
                onChange={handleName}
                value={name}
              />
              <Input
                placeholder={
                  role === "admin" ? "Dealer Email" : "Customer Email"
                }
                onChange={handleEmail}
                value={email}
              />
              <div>
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </div>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayOut;
