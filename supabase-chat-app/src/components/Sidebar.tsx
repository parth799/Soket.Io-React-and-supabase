/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Layout, Avatar, Typography } from "antd";
import useAuth from "../hooks/useAuth";

const { Sider } = Layout;
const { Text } = Typography;

interface ContactUser {
  id: string;
  username: string;
  lastOnline: string;
}

const Sidebar = ({ onSelectContact }: { onSelectContact: (contactUser: ContactUser) => void }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [contactUsers, setContactUsers] = useState<ContactUser[]>([]);
  const { getLoginUser, getAllUsers } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getLoginUser();
        if (userData) {
          setUsername(userData.username); 
        }

        const allUsers = await getAllUsers();
        if (allUsers) {
          const otherUsers: ContactUser[] = allUsers
            .filter((user: ContactUser) => user.username !== userData.username)
            .map((user: ContactUser) => ({
              ...user,
              lastOnline: user.lastOnline || new Date().toISOString(),
            }));
          setContactUsers(otherUsers);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [getLoginUser, getAllUsers]);

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const options:any = { 
      timeZone: 'Asia/Kolkata', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    };
    return date.toLocaleTimeString("en-US", options).replace(/ AM| PM/, '');
  };

  return (
    <Sider
      width={250}
      style={{
        background: `${username ? `#001529` : `#FAF3EA`}`,
        padding: "20px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: "64px",
        bottom: 0,
        zIndex: 999,
      }}
    >
      <div className="flex flex-col items-center mb-5">
        {username ? <Avatar src="../../public/avatar3.png" size={35} className="mb-2" /> : <></> }
        
        <Text style={{ color: "white", fontSize: "20px" }}>{username}</Text>
      </div>
      
      <div className="mt-5 text-white">
        {contactUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3 p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700"
            onClick={() => onSelectContact(user)}
          >
            <div className="">
              <Avatar src="../../public/avatar3.png" size={30} />
              <Text className="text-white text-[15px] ml-1">{user.username}</Text>
            </div>
            <div className="text-[10px]">
              {/* {formatTime(user.lastOnline)} */}
            </div>
          </div>
        ))}
      </div>
    </Sider>
  );
};

export default Sidebar;
