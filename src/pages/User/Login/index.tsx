import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, message, Tabs, Button } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => ({
  action: {
    marginLeft: '8px',
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
    transition: 'color 0.3s',
    '&:hover': {
      color: token.colorPrimaryActive,
    },
  },
  lang: {
    width: 42,
    height: 42,
    lineHeight: '42px',
    position: 'fixed',
    right: 16,
    top: 16,
    borderRadius: token.borderRadius,
    zIndex: 1000,
    ':hover': {
      backgroundColor: token.colorBgTextHover,
    },
  },
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: 'white',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
    },
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  brandContainer: {
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    '@media (max-width: 768px)': {
      flex: 'none',
      width: '100%',
    },
  },
  loginContainer: {
    width: '100%',
    maxWidth: '600px',
    padding: '40px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
}));

const ActionIcons = () => {
  const { styles } = useStyles();

  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.action} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />
    </>
  );
};

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      <SelectLang />
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();

  const fetchUserInfo = async (mid: string) => {
    const userInfo = await initialState?.fetchUserInfo?.(mid);
    //console.log('userInfo:：>>', userInfo);
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo?.data,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values, type });
      if (msg.status === 'ok') {
        // 由于mock数据中没有token字段，我们使用用户名作为临时token
        const token = msg.token || `temp_token_${values.username}_${Date.now()}`;
        console.log('token::>> ', token);
        // 存储 token 到 cookie，过期时间为 1 天
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `authorization=${token}; expires=${expires}; path=/`;
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        //set username in LoginParams to initialState
        message.success(defaultLoginSuccessMessage);

        // 直接设置用户信息，使用登录的用户名作为商户ID
        const mockUserInfo = {
          mid: values.username,
          name: `Merchant ${values.username}`,
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          currencies: ['USD', 'EUR'],
          webhook: '',
          feePercentage: 2.9,
          access: 'admin'
        };
        
        flushSync(() => {
          setInitialState((s) => ({
            ...s,
            currentUser: mockUserInfo,
          }));
        });
        
        // 确保用户信息设置完成后再跳转
        setTimeout(() => {
          const urlParams = new URL(window.location.href).searchParams;
          history.push(urlParams.get('redirect') || '/');
        }, 100);
        return;
      }
      //console.log(msg);
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <Lang />
      
      {/* 左侧品牌展示区域 */}
      <div className={styles.leftPanel}>
        <div className={styles.brandContainer}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            margin: '0 auto 30px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img 
              src="/logo.png"
              alt="GoGoPay Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '15px',
            color: 'white'
          }}>
            GoGoPay
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '40px',
            lineHeight: 1.6
          }}>
            Secure, Fast & Reliable Payment Gateway
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              padding: '20px 15px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <SafetyOutlined style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Secure</div>
            </div>
            
            <div style={{
              padding: '20px 15px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <ThunderboltOutlined style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Fast</div>
            </div>
            
            <div style={{
              padding: '20px 15px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <GlobalOutlined style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Global</div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
          </div>
        </div>
      </div>
      
      {/* 右侧登录表单区域 */}
      <div className={styles.rightPanel}>
        <div className={styles.loginContainer}>
          <LoginForm
            contentStyle={{
              padding: 0,
            }}
            title={
              <span style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: '#333',
                display: 'block',
                textAlign: 'center',
                marginBottom: '30px'
              }}>
                {intl.formatMessage({
                  id: 'pages.login.loginTitle',
                  defaultMessage: 'Merchant Login',
                })}
              </span>
            }
            initialValues={{
              autoLogin: true,
            }}
            actions={[]}
            onFinish={async (values) => {
              await handleSubmit(values as API.LoginParams);
            }}
          >
            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: 'Invalid Merchant ID or Password',
                })}
              />
            )}
            
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: 'Merchant ID',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="Merchant ID is required"
                    />
                  ),
                },
              ]}
            />
            
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: 'Password',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="Password is required"
                    />
                  ),
                },
              ]}
            />
            
            <div style={{ marginBottom: 24 }}>
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
              </ProFormCheckbox>
            </div>
          </LoginForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
