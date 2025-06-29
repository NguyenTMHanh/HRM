import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import * as Components from './Component';

// Configure axios base URL and interceptor
axios.defaults.baseURL = 'https://localhost:7239';
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post('/api/account/refresh-token', { refreshToken });
        const { code, data } = response.data;

        if (code === 0 && data?.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axios(originalRequest);
        } else {
          throw new Error('Không thể làm mới token.');
        }
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError);
        message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

function Login() {
  const [signIn, setSignIn] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const emailRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/account/SignIn', { username, password });
      const { code, message: msg, data, errors } = response.data;

      if (code === 0 && data) {
        message.success('Đăng nhập thành công!');
        const { accessToken, userId, refreshToken } = data;
        if (!accessToken || !userId || !refreshToken) {
          message.error('Không thể lấy token, userId hoặc refreshToken, vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('refreshToken', refreshToken);

        try {
          const roleResponse = await axios.get(`/api/Role/RoleUser/${userId}`);
          const roleData = roleResponse.data.data;

          if (roleData) {
            const permissions = roleData;
            localStorage.setItem('permissions', JSON.stringify(permissions));
            navigate('/dashboard');
          } else {
            localStorage.setItem('permissions', JSON.stringify([]));
            navigate('/dashboard');
          }
        } catch (roleError) {
          console.error("Role API error:", {
            message: roleError.message,
            response: roleError.response?.data,
            status: roleError.response?.status,
          });
          if (roleError.response?.status === 401) {
            return;
          } else {
            localStorage.setItem('permissions', JSON.stringify([]));
            navigate('/dashboard');
          }
        }
      } else {
        throw new Error(errors?.[0] || 'Login failed');
      }
    } catch (err) {
      console.error("Login error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'An error occurred';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    message.info("Tính năng lấy lại mật khẩu chưa được triển khai.");
    console.log("Forgot password attempt:", { username, email });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (signIn) {
        passwordRef.current.focus();
      } else {
        emailRef.current.focus();
      }
    }
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleForgotPassword(e);
    }
  };

  return (
    <Components.PageWrapper>
      <Components.Wrapper>
        <Components.LogoContainer>
          <div style={{ textAlign: 'center' }}>
            <img
              src="/Logo.png"
              alt=""
              style={{ width: '120px', marginBottom: '20px' }}
            />
            <span>HRFlow</span>
          </div>
        </Components.LogoContainer>

        <Components.Container>
          <Components.SignUpContainer signinIn={signIn}>
            <Components.Form onSubmit={handleForgotPassword}>
              <Components.Title>Quên mật khẩu?</Components.Title>
              <Components.Input
                type='text'
                placeholder='Tài khoản'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleUsernameKeyDown}
              />
              <Components.Input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleEmailKeyDown}
                ref={emailRef}
              />
              <Components.Button type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'LẤY LẠI MẬT KHẨU'}
              </Components.Button>
            </Components.Form>
          </Components.SignUpContainer>

          <Components.SignInContainer signinIn={signIn}>
            <Components.Form onSubmit={handleLogin}>
              <Components.Title>Đăng nhập</Components.Title>
              <Components.Input
                type='text'
                placeholder='Tài khoản'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleUsernameKeyDown}
              />
              <div style={{ position: 'relative', width: '100%' }}>
                <Components.Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Mật khẩu'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  ref={passwordRef}
                  style={{ width: '100%' }}
                />
                <span
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#888',
                    fontSize: '0.75rem',
                    zIndex: 1
                  }}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
              <Components.Button type="submit" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Components.Button>
            </Components.Form>
          </Components.SignInContainer>

          <Components.OverlayContainer signinIn={signIn}>
            <Components.Overlay signinIn={signIn}>
              <Components.LeftOverlayPanel signinIn={signIn}>
                <Components.Title>Xin chào</Components.Title>
                <Components.Paragraph>
                  Để tiếp tục kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn.
                </Components.Paragraph>
                <Components.GhostButton onClick={() => setSignIn(true)}>
                  Đăng nhập
                </Components.GhostButton>
              </Components.LeftOverlayPanel>

              <Components.RightOverlayPanel signinIn={signIn}>
                <Components.Title>Quên mật khẩu?</Components.Title>
                <Components.Paragraph>
                  Nhấn vào đây nếu bạn quên mật khẩu, chúng tôi sẽ giúp bạn lấy lại.
                </Components.Paragraph>
                <Components.GhostButton onClick={() => setSignIn(false)}>
                  Lấy lại mật khẩu
                </Components.GhostButton>
              </Components.RightOverlayPanel>
            </Components.Overlay>
          </Components.OverlayContainer>
        </Components.Container>
      </Components.Wrapper>
    </Components.PageWrapper>
  );
}

export default Login;