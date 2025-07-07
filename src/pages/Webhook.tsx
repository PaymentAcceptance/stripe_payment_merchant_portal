import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Alert, Card, Typography, Input, Button, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useModel } from '@umijs/max';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://testpay.tech-mart.xyz';

const Webhook: React.FC = () => {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [editingUrl, setEditingUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const merchantId = initialState?.currentUser?.mid;

  // 获取当前 webhook URL
  const fetchWebhook = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/merchant/webhook?merchantId=${merchantId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getCookie('authorization')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWebhookUrl(data.webhookUrl || '');
        setEditingUrl(data.webhookUrl || '');
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText);
        setShowErrorAlert(true);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch webhook URL');
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 从 cookie 获取 authorization
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return '';
  };

  // 保存 webhook URL
  const saveWebhook = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('${API_BASE_URL}/merchant/updateWebhook', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie('authorization')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: merchantId,
          webhookUrl: editingUrl,
        }),
      });

      if (response.ok) {
        setWebhookUrl(editingUrl);
        setIsEditing(false);
        setShowSuccessAlert(true);
        setShowErrorAlert(false);
        // 3秒后隐藏成功提示
        setTimeout(() => setShowSuccessAlert(false), 3000);
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText);
        setShowErrorAlert(true);
        setShowSuccessAlert(false);
      }
    } catch (error) {
      setErrorMessage('Failed to save webhook URL');
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingUrl(webhookUrl);
    setIsEditing(false);
    setShowErrorAlert(false);
  };

  // 开始编辑
  const startEdit = () => {
    setIsEditing(true);
    setShowErrorAlert(false);
  };

  // 检查是否有修改
  const hasChanges = editingUrl !== webhookUrl;

  // 页面加载时获取 webhook URL
  useEffect(() => {
    if (merchantId) {
      fetchWebhook();
    }
  }, [merchantId]);

  return (
    <PageContainer>
      <Card>
        {showSuccessAlert && (
          <Alert
            message="Webhook URL has been updated successfully!"
            type="success"
            showIcon
            banner
            style={{
              margin: -12,
              marginBottom: 24,
            }}
          />
        )}
        
        {showErrorAlert && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            banner
            style={{
              margin: -12,
              marginBottom: 24,
            }}
          />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <Input
                value={editingUrl}
                onChange={(e) => setEditingUrl(e.target.value)}
                disabled={!isEditing}
                placeholder="Enter webhook URL"
                style={{ marginTop: 8 }}
              />
            </div>
            
            {!isEditing && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={startEdit}
                disabled={isLoading}
                style={{ height: 32, marginBottom: 0 }}
              >
                Edit
              </Button>
            )}
          </div>
          
          {isEditing && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={saveWebhook}
                disabled={!hasChanges || isLoading}
                loading={isLoading}
              >
                Save
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={cancelEdit}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};

export default Webhook;
