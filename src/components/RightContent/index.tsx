import { BellOutlined, QuestionCircleOutlined, GlobalOutlined } from '@ant-design/icons';
import { history, useIntl, setLocale, getLocale } from '@umijs/max';
import { Dropdown, Menu } from 'antd';
import React from 'react';

export type SiderTheme = 'light' | 'dark';

// 语言选择组件
export const SelectLang = () => {
  const intl = useIntl();
  const currentLocale = getLocale();
  
  const changeLang = ({ key }: { key: string }) => {
    setLocale(key, false);
  };
  
  const langMenu = (
    <Menu
      selectedKeys={[currentLocale]}
      onClick={changeLang}
      items={[
        {
          key: 'zh-CN',
          label: '简体中文',
        },
        {
          key: 'en-US',
          label: 'English',
        },
      ]}
    />
  );

  return (
    <Dropdown menu={{ items: langMenu.props.items, selectedKeys: langMenu.props.selectedKeys, onClick: changeLang }} placement="bottomRight">
      <span style={{ cursor: 'pointer', padding: '12px' }}>
        <GlobalOutlined title={intl.formatMessage({ id: 'navBar.lang' })} />
      </span>
    </Dropdown>
  );
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};

export const NotificationBell: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 26,
        cursor: 'pointer',
        padding: 4,
        marginLeft: 10,
        marginRight: -10,
      }}
      onClick={() => {
        history.push('/message');
      }}
      title="Messages"
      aria-label="Messages"
    >
      <BellOutlined />
    </div>
  );
};
