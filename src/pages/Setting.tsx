import React, { useState } from 'react';
import { Card, Form, Input, Button, Upload, Avatar, Space, Typography, message } from 'antd';
import { UploadOutlined, UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;

const Setting: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [editingMerchantName, setEditingMerchantName] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png');
  const [merchantName, setMerchantName] = useState('示例商户');
  const [tempMerchantName, setTempMerchantName] = useState(merchantName);

  // 头像上传配置
  const uploadProps: UploadProps = {
    name: 'avatar',
    listType: 'picture',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error(intl.formatMessage({ id: 'pages.setting.uploadFormatError', defaultMessage: '只能上传 JPG/PNG 格式的图片!' }));
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(intl.formatMessage({ id: 'pages.setting.uploadSizeError', defaultMessage: '图片大小不能超过 2MB!' }));
        return false;
      }
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarUrl(e.target.result as string);
          message.success(intl.formatMessage({ id: 'pages.setting.uploadSuccess', defaultMessage: '头像上传成功!' }));
        }
      };
      reader.readAsDataURL(file);
      
      return false; // 阻止自动上传
    },
  };

  // 保存商户名
  const handleSaveMerchantName = () => {
    if (tempMerchantName.trim() === '') {
      message.error(intl.formatMessage({ id: 'pages.setting.merchantNameRequired', defaultMessage: '商户名不能为空' }));
      return;
    }
    setMerchantName(tempMerchantName);
    setEditingMerchantName(false);
    message.success(intl.formatMessage({ id: 'pages.setting.merchantNameUpdateSuccess', defaultMessage: '商户名更新成功' }));
  };

  // 取消编辑商户名
  const handleCancelEdit = () => {
    setTempMerchantName(merchantName);
    setEditingMerchantName(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>{intl.formatMessage({ id: 'pages.setting.title', defaultMessage: '设置' })}</Title>
        
        <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
          {/* 头像设置 */}
          <Form.Item label={intl.formatMessage({ id: 'pages.setting.avatar', defaultMessage: '头像' })}>
            <Space direction="vertical" align="center">
              <Avatar 
                size={120} 
                src={avatarUrl} 
                icon={<UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>{intl.formatMessage({ id: 'pages.setting.uploadAvatar', defaultMessage: '上传头像' })}</Button>
              </Upload>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {intl.formatMessage({ id: 'pages.setting.uploadTip', defaultMessage: '支持 JPG、PNG 格式，文件大小不超过 2MB' })}
              </Text>
            </Space>
          </Form.Item>

          {/* 商户名设置 */}
          <Form.Item label={intl.formatMessage({ id: 'pages.setting.merchantName', defaultMessage: '商户名' })}>
            {editingMerchantName ? (
              <Space style={{ width: '100%' }}>
                <Input 
                  value={tempMerchantName}
                  onChange={(e) => setTempMerchantName(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'pages.setting.merchantNamePlaceholder', defaultMessage: '请输入商户名' })}
                  style={{ flex: 1 }}
                  onPressEnter={handleSaveMerchantName}
                />
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />}
                  onClick={handleSaveMerchantName}
                >
                  {intl.formatMessage({ id: 'pages.setting.save', defaultMessage: '保存' })}
                </Button>
                <Button onClick={handleCancelEdit}>
                  {intl.formatMessage({ id: 'pages.setting.cancel', defaultMessage: '取消' })}
                </Button>
              </Space>
            ) : (
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Input value={merchantName} readOnly style={{ flex: 1 }} />
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => {
                    setTempMerchantName(merchantName);
                    setEditingMerchantName(true);
                  }}
                >
                  {intl.formatMessage({ id: 'pages.setting.edit', defaultMessage: '修改' })}
                </Button>
              </Space>
            )}
          </Form.Item>

          {/* 其他设置项可以在这里添加 */}
          <Form.Item>
            <Space>
              <Button type="primary" size="large">
                {intl.formatMessage({ id: 'pages.setting.saveAll', defaultMessage: '保存所有设置' })}
              </Button>
              <Button size="large">
                {intl.formatMessage({ id: 'pages.setting.reset', defaultMessage: '重置' })}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Setting;