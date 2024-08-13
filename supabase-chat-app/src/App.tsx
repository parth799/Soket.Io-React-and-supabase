import { useEffect, useState } from "react";
import { Layout } from "antd";
import { supabaseClient } from "./service/supabase";
import { User } from "@supabase/supabase-js";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((auth, session) => {
      switch (auth) {
        case "SIGNED_IN":
          session?.user && setUser(session.user);
          break;
        case "SIGNED_OUT":
          setUser(null);
          break;
        case "USER_UPDATED":
          session?.user && setUser(session.user);
          break;
      }
    }); 
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#FAF3EA" }}>
      <Header user={user} />
      <Layout style={{ marginTop: "64px" }}>
        <Sidebar
          onSelectContact={(contactUser) => setSelectedContact(contactUser)}
        />
        <Content style={{ backgroundColor: "#FAF3EA", marginLeft: "232px" }}>
          {/* <Outlet /> */}
          <MessageList user={user} recipientId={selectedContact?.id || ''} recipientName={selectedContact?.username || ''} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;