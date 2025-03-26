import React from "react";
import * as Components from './Component';

function Login() {
    const [signIn, setSignIn] = React.useState(true);

    return (
        <Components.Wrapper>
            {/* Logo công ty */}
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

            {/* Form login + quên mật khẩu */}
            <Components.Container>
                {/* Form Quên mật khẩu */}
                <Components.SignUpContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Quên mật khẩu?</Components.Title>
                        <Components.Input type='text' placeholder='Tài khoản' />
                        <Components.Button>LẤY LẠI MẬT KHẨU</Components.Button>
                    </Components.Form>
                </Components.SignUpContainer>

                {/* Form Đăng nhập */}
                <Components.SignInContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Đăng nhập</Components.Title>
                        <Components.Input type='email' placeholder='Tài khoản' />
                        <Components.Input type='password' placeholder='Mật khẩu' />
                        <Components.Button>Đăng nhập</Components.Button>
                    </Components.Form>
                </Components.SignInContainer>

                {/* Overlay chuyển đổi */}
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
    );
}

export default Login;
