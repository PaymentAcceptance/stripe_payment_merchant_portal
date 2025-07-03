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
          key: 'Powered by Tech Mart',
          title: 'Powered by Tech Mart',
          href: 'https://www.tech-mart.xyz',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
