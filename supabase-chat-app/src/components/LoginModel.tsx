import { useState } from "react";
import { Alert, Button, Form, Input, Modal } from "antd";
import { supabaseClient } from "../service/supabase";
import { useNavigate } from "react-router-dom";

type ON_SUBMIT = {
  email: string;
  password: string;
};

type LOGIN_MODAL = {
  isModalOpen: boolean;
  onClose: () => void;
};

const LoginModal = ({ isModalOpen = false, onClose }: LOGIN_MODAL) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const onFinish = ({ email, password }: ON_SUBMIT) => {
    setLoading(true);
    supabaseClient.auth.signInWithPassword({ email, password })
      .then((data:any) => {
        setLoading(false);
        if (!data.error && data.data.user.aud === "authenticated") {
          onClose();
          navigate("/messageList");
        } else if (data.error) {
          setError(data.error.message);
        }
      })
      .catch((err:any) => {
        setError(err.message || "An error occurred during login");
        setLoading(false);
      });
  };

  return (
    <Modal
      title="Login"
      visible={isModalOpen}
      onCancel={onClose}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      centered
    >
      <Form
        layout="vertical"
        initialValues={{ email: "", password: "" }}
        wrapperCol={{ style: { textAlign: "center" } }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {  message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" }
          ]}
        >
          <Input onFocus={() => setError("")} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {  message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters long!" }
          ]}
        >
          <Input.Password onFocus={() => setError("")} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
        {error && <Alert message={error} type="error" />}
      </Form>
    </Modal>
  );
};

export default LoginModal;
