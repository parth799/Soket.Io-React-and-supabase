/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

type ON_SUBMIT = {
  email: string;
  password: string;
  username: string;
};

type SIGNUP_MODAL = {
  isModalOpen: boolean;
  onClose: () => void;
};

const SignUpModal = ({ isModalOpen = false, onClose }: SIGNUP_MODAL) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const onFinish = async ({ email, password, username }: ON_SUBMIT) => {
    setLoading(true);
    try {
      const response = await signUp(email, password, username);
      setLoading(false);
      if (response.user) {
        onClose();
      } else if (response.error) {
        setError(response.error.message);
      }
    } catch (err:any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Sign Up"
      visible={isModalOpen}
      onCancel={onClose}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      centered
    >
      <Form
        layout="vertical"
        initialValues={{ username: "", email: "", password: "" }}
        wrapperCol={{ style: { textAlign: "center" } }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ message: "Please input your username!" }]}
        >
          <Input onFocus={() => setError("")} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ message: "Please input your email!" }]}
        >
          <Input onFocus={() => setError("")} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ message: "Please input your password!" }]}
        >
          <Input.Password onFocus={() => setError("")} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sign Up
          </Button>
        </Form.Item>
        {error && <Alert message={error} type="error" />}
      </Form>
    </Modal>
  );
};

export default SignUpModal;
