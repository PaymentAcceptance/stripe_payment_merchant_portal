import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'Powered by GoGoPay',
          title: 'Powered by GoGoPay',
          href: 'https://api.gogopay.site',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
