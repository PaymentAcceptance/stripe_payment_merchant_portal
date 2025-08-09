import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Typography, Modal, message } from 'antd';
import { EditOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

const { Title, Text } = Typography;

const Security: React.FC = () => {
  const intl = useIntl();
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showTradePassword, setShowTradePassword] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [loginPasswordModalVisible, setLoginPasswordModalVisible] = useState(false);
  const [tradePasswordModalVisible, setTradePasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [loginPasswordForm] = Form.useForm();
  const [tradePasswordForm] = Form.useForm();

  // Mock user data
  const [userInfo, setUserInfo] = useState({
    username: 'merchant_user_001',
    email: 'merchant@example.com',
    loginPassword: '••••••••',
    tradePassword: '••••••••'
  });

  const handleEmailUpdate = () => {
    emailForm.validateFields().then(values => {
      setUserInfo({ ...userInfo, email: values.email });
      setEmailModalVisible(false);
      message.success(intl.formatMessage({ id: 'pages.security.emailUpdateSuccess', defaultMessage: '邮箱更新成功' }));
      emailForm.resetFields();
    });
  };

  const handleLoginPasswordUpdate = () => {
    loginPasswordForm.validateFields().then(values => {
      if (values.newPassword !== values.confirmPassword) {
        message.error(intl.formatMessage({ id: 'pages.security.passwordMismatch', defaultMessage: '两次输入的密码不一致' }));
        return;
      }
      setLoginPasswordModalVisible(false);
      message.success(intl.formatMessage({ id: 'pages.security.passwordUpdateSuccess', defaultMessage: '登录密码更新成功' }));
      loginPasswordForm.resetFields();
    });
  };

  const handleTradePasswordUpdate = () => {
    tradePasswordForm.validateFields().then(values => {
      if (values.newPassword !== values.confirmPassword) {
        message.error(intl.formatMessage({ id: 'pages.security.passwordMismatch', defaultMessage: '两次输入的密码不一致' }));
        return;
      }
      setTradePasswordModalVisible(false);
      message.success(intl.formatMessage({ id: 'pages.security.tradePasswordUpdateSuccess', defaultMessage: '交易密码更新成功' }));
      tradePasswordForm.resetFields();
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>{intl.formatMessage({ id: 'pages.security.title', defaultMessage: '安全设置' })}</Title>
        
        <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
          {/* 账户名 */}
          <Form.Item label={intl.formatMessage({ id: 'pages.security.accountName', defaultMessage: '账户名' })}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Input value={userInfo.username} readOnly style={{ flex: 1 }} />
              <Text type="secondary">{intl.formatMessage({ id: 'pages.security.readonly', defaultMessage: '只读' })}</Text>
            </Space>
          </Form.Item>

          {/* 邮箱 */}
          <Form.Item label={intl.formatMessage({ id: 'pages.security.email', defaultMessage: '邮箱' })}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Input value={userInfo.email} readOnly style={{ flex: 1 }} />
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => {
                  emailForm.setFieldsValue({ email: userInfo.email });
                  setEmailModalVisible(true);
                }}
              >
                {intl.formatMessage({ id: 'pages.security.modify', defaultMessage: '修改' })}
              </Button>
            </Space>
          </Form.Item>

          {/* 登录密码 */}
          <Form.Item label={intl.formatMessage({ id: 'pages.security.loginPassword', defaultMessage: '登录密码' })}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Input.Password 
                value={userInfo.loginPassword} 
                readOnly 
                style={{ flex: 1 }}
                visibilityToggle={{
                  visible: showLoginPassword,
                  onVisibleChange: setShowLoginPassword,
                }}
              />
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => setLoginPasswordModalVisible(true)}
              >
                {intl.formatMessage({ id: 'pages.security.modify', defaultMessage: '修改' })}
              </Button>
            </Space>
          </Form.Item>

          {/* 交易密码 */}
          <Form.Item label={intl.formatMessage({ id: 'pages.security.transactionPassword', defaultMessage: '交易密码' })}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Input.Password 
                value={userInfo.tradePassword} 
                readOnly 
                style={{ flex: 1 }}
                visibilityToggle={{
                  visible: showTradePassword,
                  onVisibleChange: setShowTradePassword,
                }}
              />
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => setTradePasswordModalVisible(true)}
              >
                {intl.formatMessage({ id: 'pages.security.modify', defaultMessage: '修改' })}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 修改邮箱弹窗 */}
      <Modal
        title={intl.formatMessage({ id: 'pages.security.modifyEmail', defaultMessage: '修改邮箱' })}
        open={emailModalVisible}
        onOk={handleEmailUpdate}
        onCancel={() => {
          setEmailModalVisible(false);
          emailForm.resetFields();
        }}
      >
        <Form form={emailForm} layout="vertical">
          <Form.Item
            label={intl.formatMessage({ id: 'pages.security.newEmail', defaultMessage: '新邮箱' })}
            name="email"
            rules={[
              { required: true, message: intl.formatMessage({ id: 'pages.security.pleaseEnterEmail', defaultMessage: '请输入邮箱' }) },
              { type: 'email', message: intl.formatMessage({ id: 'pages.security.pleaseEnterValidEmail', defaultMessage: '请输入有效的邮箱地址' }) }
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.security.pleaseEnterNewEmail', defaultMessage: '请输入新邮箱' })} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改登录密码弹窗 */}
      <Modal
        title={intl.formatMessage({ id: 'pages.security.modifyLoginPassword', defaultMessage: '修改登录密码' })}
        open={loginPasswordModalVisible}
        onOk={handleLoginPasswordUpdate}
        onCancel={() => {
          setLoginPasswordModalVisible(false);
          loginPasswordForm.resetFields();
        }}
      >
        <Form form={loginPasswordForm} layout="vertical">
          <Form.Item
            label={intl.formatMessage({ id: 'pages.security.currentPassword', defaultMessage: '当前密码' })}
            name="currentPassword"
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.security.pleaseEnterCurrentPassword', defaultMessage: '请输入当前密码' }) }]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'pages.security.pleaseEnterCurrentPassword', defaultMessage: '请输入当前密码' })} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'pages.security.newPassword', defaultMessage: '新密码' })}
            name="newPassword"
            rules={[
              { required: true, message: intl.formatMessage({ id: 'pages.security.pleaseEnterNewPassword', defaultMessage: '请输入新密码' }) },
              { min: 6, message: intl.formatMessage({ id: 'pages.security.passwordMinLength', defaultMessage: '密码至少6位' }) }
            ]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'pages.security.pleaseEnterNewPassword', defaultMessage: '请输入新密码' })} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'pages.security.confirmNewPassword', defaultMessage: '确认新密码' })}
            name="confirmPassword"
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.security.pleaseConfirmNewPassword', defaultMessage: '请确认新密码' }) }]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'pages.security.pleaseEnterNewPasswordAgain', defaultMessage: '请再次输入新密码' })} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改交易密码弹窗 */}
      <Modal
        title={intl.formatMessage({ id: 'pages.security.modifyTransactionPassword', defaultMessage: '修改交易密码' })}
        open={tradePasswordModalVisible}
        onOk={handleTradePasswordUpdate}
        onCancel={() => {
          setTradePasswordModalVisible(false);
          tradePasswordForm.resetFields();
        }}
      >
        <Form form={tradePasswordForm} layout="vertical">
          <Form.Item
            label={intl.formatMessage({ id: 'pages.security.currentTransactionPassword', defaultMessage: '当前交易密码' })}
            name="currentPassword"
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.security.pleaseEnterCurrentTransactionPassword', defaultMessage: '请输入当前交易密码' }) }]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'pages.security.pleaseEnterCurrentTransactionPassword', defaultMessage: '请输入当前交易密码' })} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'pages.security.newTransactionPassword', defaultMessage: '新交易密码' })}
            name="newPassword"
            rules={[
              { required: true, message: intl.formatMessage({ id: 'pages.security.pleaseEnterNewTransactionPassword', defaultMessage: '请输入新交易密码' }) },
              { min: 6, message: intl.formatMessage({ id: 'pages.security.passwordMinLength', defaultMessage: '密码至少6位' }) }
            ]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'pages.security.pleaseEnterNewTransactionPassword', defaultMessage: '请输入新交易密码' })} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'pages.security.confirmNewTransactionPassword', defaultMessage: '确认新交易密码' })}
            name="confirmPassword"
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.security.pleaseConfirmNewTransactionPassword', defaultMessage: '请确认新交易密码' }) }]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'pages.security.pleaseEnterNewTransactionPasswordAgain', defaultMessage: '请再次输入新交易密码' })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Security;