import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Empty, Tabs } from 'antd';
import React from 'react';

const MessagePage: React.FC = () => {
  const intl = useIntl();

  const items = [
    {
      key: 'new',
      label: intl.formatMessage({ id: 'pages.message.new' }),
      children: (
        <ProCard bordered>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={intl.formatMessage({ id: 'pages.message.empty' })}
          />
        </ProCard>
      ),
    },
    {
      key: 'history',
      label: intl.formatMessage({ id: 'pages.message.history' }),
      children: (
        <ProCard bordered>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={intl.formatMessage({ id: 'pages.message.empty' })}
          />
        </ProCard>
      ),
    },
  ];

  return (
    <PageContainer header={{ title: intl.formatMessage({ id: 'menu.message' }) }}>
      <Tabs defaultActiveKey="new" items={items} />
    </PageContainer>
  );
};

export default MessagePage;

