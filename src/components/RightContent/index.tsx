import { BellOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { history, SelectLang as UmiSelectLang } from '@umijs/max';
import React from 'react';

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
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
