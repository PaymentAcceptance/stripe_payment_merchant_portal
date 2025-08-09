import React, { useState } from 'react';
import { Tabs, Card, Input, Button, Table, Tag, Space, Typography, Tooltip, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, CopyOutlined, CheckOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';

const { TabPane } = Tabs;
const { Text } = Typography;

const Developer: React.FC = () => {
  const intl = useIntl();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Mock API Key
  const apiKey = 'sk_test_51NXwGbCRgJgDVbVnwXWLGzPciPDCnkgGBhY7dkjfhsdkjfh';
  
  // Mock webhooks data
  const webhooksData = [
    {
      key: '1',
      url: 'https://example.com/webhook1',
      secret: 'whsec_1234567890abcdef',
      description: 'Payment webhook',
      status: 'active',
    },
    {
      key: '2',
      url: 'https://example.com/webhook2',
      secret: 'whsec_abcdef1234567890',
      description: 'Refund webhook',
      status: 'inactive',
    },
  ];
  
  const webhooksColumns = [
    {
      title: intl.formatMessage({ id: 'pages.developer.url', defaultMessage: 'URL' }),
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: intl.formatMessage({ id: 'pages.developer.secret', defaultMessage: 'Secret' }),
      dataIndex: 'secret',
      key: 'secret',
      render: (text: string) => (
        <Text style={{ fontFamily: 'monospace' }}>
          {text.substring(0, 6)}...{text.substring(text.length - 4)}
        </Text>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.developer.description', defaultMessage: 'Description' }),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: intl.formatMessage({ id: 'pages.developer.status', defaultMessage: 'Status' }),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.developer.actions', defaultMessage: 'Actions' }),
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];
  
  // Handle copy API key
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    message.success(intl.formatMessage({ id: 'pages.developer.copied', defaultMessage: 'API Key copied to clipboard' }));
    setTimeout(() => setCopied(false), 3000);
  };
  
  // Toggle API key visibility
  const toggleKeyVisibility = () => {
    setShowKey(!showKey);
  };
  
  return (
    <PageContainer title={intl.formatMessage({ id: 'pages.developer.title', defaultMessage: '开发者' })}>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab={intl.formatMessage({ id: 'pages.developer.apiKeys', defaultMessage: 'API Keys' })} key="1">
            <Card>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Text strong>{intl.formatMessage({ id: 'pages.developer.secretKey', defaultMessage: 'Secret key' })}</Text>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <Input.Password 
                      value={showKey ? apiKey : '•'.repeat(20)} 
                      readOnly 
                      visibilityToggle={false}
                      style={{ fontFamily: 'monospace' }}
                    />
                    <Tooltip title={showKey ? intl.formatMessage({ id: 'pages.developer.hide', defaultMessage: 'Hide' }) : intl.formatMessage({ id: 'pages.developer.show', defaultMessage: 'Show' })}>
                      <Button 
                        icon={showKey ? <EyeInvisibleOutlined /> : <EyeOutlined />} 
                        onClick={toggleKeyVisibility}
                        style={{ marginLeft: 8 }}
                      />
                    </Tooltip>
                    <Tooltip title={copied ? intl.formatMessage({ id: 'pages.developer.copied', defaultMessage: 'Copied!' }) : intl.formatMessage({ id: 'pages.developer.copy', defaultMessage: 'Copy' })}>
                      <Button 
                        icon={copied ? <CheckOutlined /> : <CopyOutlined />} 
                        onClick={handleCopyApiKey}
                        style={{ marginLeft: 8 }}
                      />
                    </Tooltip>
                  </div>
                </div>
              </Space>
            </Card>
          </TabPane>
          <TabPane tab={intl.formatMessage({ id: 'pages.developer.webhooks', defaultMessage: 'Webhooks' })} key="2">
            <Card>
              <Table 
                columns={webhooksColumns} 
                dataSource={webhooksData} 
                pagination={false}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default Developer;