import React, { useState, useRef } from "react";
import { message } from "antd";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import * as Components from "./Component";

function ChangePassword({ onSuccess }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!oldPassword || !newPassword) {
      message.error("Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới.");
      setLoading(false);
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        message.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      // Placeholder for API call (to be implemented later)
      // For now, simulate a successful response
      message.success("Thay đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      onSuccess(); // Gọi hàm onSuccess để đóng modal
    } catch (err) {
      console.error("Change password error:", err);
      message.error("Đã xảy ra lỗi khi thay đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleOldPasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      newPasswordRef.current.focus();
    }
  };

  const handleNewPasswordKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleChangePassword(e);
    }
  };

  return (
    <Components.Form onSubmit={handleChangePassword}>
      <div style={{ position: "relative", width: "100%", marginBottom: "16px" }}>
        <Components.Input
          type={showOldPassword ? "text" : "password"}
          placeholder="Mật khẩu cũ"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          onKeyDown={handleOldPasswordKeyDown}
          ref={oldPasswordRef}
          style={{ width: "100%" }}
        />
        <span
          onClick={toggleOldPasswordVisibility}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#888",
            fontSize: "0.75rem",
            zIndex: 1,
          }}
        >
          {showOldPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>
      </div>

      <div style={{ position: "relative", width: "100%", marginBottom: "16px" }}>
        <Components.Input
          type={showNewPassword ? "text" : "password"}
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onKeyDown={handleNewPasswordKeyDown}
          ref={newPasswordRef}
          style={{ width: "100%" }}
        />
        <span
          onClick={toggleNewPasswordVisibility}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#888",
            fontSize: "0.75rem",
            zIndex: 1,
          }}
        >
          {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>
      </div>

      <Components.Button type="submit" disabled={loading}>
        {loading ? "Đang xử lý..." : "Thay đổi mật khẩu"}
      </Components.Button>
    </Components.Form>
  );
}

export default ChangePassword;