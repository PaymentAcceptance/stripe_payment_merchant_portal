import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { Alert, Card, Typography, theme, Row, Col, Statistic, Tag, Progress } from 'antd';
import React, { useState, useEffect } from 'react';
import { Line, Gauge } from '@ant-design/plots';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://testpay.tech-mart.xyz';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        了解更多 {'>'}
      </a>
    </div>
  );
};

// 余额展示组件
const BalanceDisplay: React.FC<{
  balanceInfo: string;
  loading?: boolean;
}> = ({ balanceInfo, loading = false }) => {
  const { token } = theme.useToken();
  const intl = useIntl();

  // 解析余额信息
  const parseBalanceInfo = (info: string) => {
    if (!info || info === '-') return [];
    
    return info.split('|').map(item => {
      const trimmed = item.trim();
      // 匹配币种符号和金额 - 支持格式: "HK $259,152.94", "KR ₩59,511.97" 等
      const match = trimmed.match(/^([A-Z]{2})\s+([¥$€₩£])\s*([\d,]+\.?\d*)$/);
      if (match) {
        return {
          currency: match[1],
          symbol: match[2],
          amount: match[3]
        };
      }
      return null;
    }).filter(Boolean);
  };

  const balanceItems = parseBalanceInfo(balanceInfo);

  if (loading) {
    return (
      <Card
        style={{
          backgroundColor: token.colorBgContainer,
          boxShadow: token.boxShadow,
          borderRadius: '8px',
          textAlign: 'center',
        }}
        loading={true}
      />
    );
  }

  return (
    <Card
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '24px 16px',
      }}
    >
      <div style={{ 
        fontSize: '14px', 
        color: token.colorTextSecondary, 
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        {intl.formatMessage({ id: 'pages.welcome.balanceAfterFees' })}
      </div>
      
      {balanceItems.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {balanceItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                backgroundColor: token.colorBgLayout,
                borderRadius: '6px',
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* 币种图标 */}
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor: getCurrencyColor(item?.currency || ''),
                  }}
                >
                  {getCurrencyIcon(item?.currency || '')}
                </div>
                
                {/* 币种名称 */}
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '500',
                  color: token.colorText 
                }}>
                  {item?.currency}
                </span>
              </div>
              
              {/* 余额金额 */}
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'bold',
                color: token.colorPrimary 
              }}>
                {item?.symbol} {item?.amount}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          color: token.colorTextSecondary,
          fontSize: '14px'
        }}>
          No balance information available
        </div>
      )}
    </Card>
  );
};

// 获取币种颜色
const getCurrencyColor = (currency: string): string => {
  const colors: { [key: string]: string } = {
    'HK': '#1890ff', // 蓝色
    'KR': '#52c41a', // 绿色
    'EU': '#722ed1', // 紫色
    'US': '#fa8c16', // 橙色
    'CN': '#f5222d', // 红色
  };
  return colors[currency] || '#8c8c8c';
};

// 获取币种图标
const getCurrencyIcon = (currency: string): string => {
  const icons: { [key: string]: string } = {
    'HK': 'HK',
    'KR': 'KR',
    'EU': '€',
    'US': '$',
    'CN': '¥',
  };
  return icons[currency] || currency;
};

// 统计卡片组件
const SummaryCard: React.FC<{
  title: string;
  value?: string | number;
  loading?: boolean;
  children?: React.ReactNode;
}> = ({ title, value, loading = false, children }) => {
  const { token } = theme.useToken();
  
  return (
    <Card
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        textAlign: 'center',
        height: '100%',
      }}
      loading={loading}
    >
      {children ? (
        children
      ) : (
        <Statistic
          title={title}
          value={value}
          valueStyle={{ color: token.colorPrimary, fontSize: '24px', fontWeight: 'bold' }}
        />
      )}
    </Card>
  );
};

// 商户信息项组件
const InfoItem: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  const { token } = theme.useToken();
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ 
        fontSize: '14px', 
        color: token.colorTextSecondary, 
        marginBottom: '4px' 
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: '16px', 
        color: token.colorText, 
        fontWeight: '500' 
      }}>
        {value}
      </div>
    </div>
  );
};

// 订单走势图组件
const OrderTrendChart: React.FC = () => {
  const { token } = theme.useToken();
  const intl = useIntl();
  
  // 硬编码的过去7天数据
  const data = [
    { date: '2024-01-01', orders: 100 },
    { date: '2024-01-02', orders: 135 },
    { date: '2024-01-03', orders: 150 },
    { date: '2024-01-04', orders: 200 },
    { date: '2024-01-05', orders: 180 },
    { date: '2024-01-06', orders: 160 },
    { date: '2024-01-07', orders: 230 },
  ];

  const config = {
    data,
    xField: 'date',
    yField: 'orders',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    point: {
      size: 3,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: token.colorPrimary,
        lineWidth: 1,
      },
    },
    line: {
      style: {
        stroke: token.colorPrimary,
        lineWidth: 2,
      },
    },
    area: {
      style: {
        fill: `l(270) 0:#ffffff 0.5:${token.colorPrimary}15 1:${token.colorPrimary}30`,
      },
    },
    xAxis: {
      label: {
        formatter: (v: string) => {
          const date = new Date(v);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        },
        style: {
          fontSize: 10,
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}`,
        style: {
          fontSize: 10,
        },
      },
    },
    tooltip: {
      showCrosshairs: true,
      shared: true,
      formatter: (datum: any) => {
        return {
          name: 'Orders',
          value: datum.orders,
        };
      },
    },
    grid: {
      line: {
        style: {
          stroke: token.colorBorderSecondary,
          lineWidth: 1,
        },
      },
    },
  };

  return (
    <Card
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        marginTop: '16px',
      }}
      bodyStyle={{ padding: '12px' }}
    >
      <div style={{ 
        fontSize: '12px', 
        color: token.colorTextSecondary, 
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        {intl.formatMessage({ id: 'pages.welcome.ordersTrend' })}
      </div>
      <div style={{ height: '150px' }}>
        <Line {...config} />
      </div>
    </Card>
  );
};

// 支付成功率图表组件
const SuccessRateChart: React.FC<{
  totalOrderNumber: number;
  succeededOrderNumber: number;
}> = ({ totalOrderNumber, succeededOrderNumber }) => {
  const { token } = theme.useToken();
  const intl = useIntl();
  
  // 计算成功率
  const successRate = totalOrderNumber > 0 ? (succeededOrderNumber / totalOrderNumber * 100) : 0;
  const formattedSuccessRate = Number(successRate.toFixed(2));
  
  // 调试信息
  console.log('SuccessRateChart props:', { totalOrderNumber, succeededOrderNumber, formattedSuccessRate });

  const config = {
    percent: formattedSuccessRate / 100,
    range: {
      color: ['#ff4d4f', '#faad14', '#52c41a'],
      width: 16,
    },
    indicator: {
      pointer: {
        style: {
          stroke: token.colorPrimary,
          strokeWidth: 3,
        },
      },
      pin: {
        style: {
          stroke: token.colorPrimary,
          strokeWidth: 2,
        },
      },
    },
    statistic: {
      content: {
        style: {
          fontSize: '28px',
          lineHeight: '28px',
          color: token.colorText,
          fontWeight: 'bold',
        },
        formatter: () => `${formattedSuccessRate}%`,
      },
      title: {
        style: {
          fontSize: '12px',
          color: token.colorTextSecondary,
        },
        formatter: () => 'Success Rate',
      },
    },
    axis: {
      label: {
        formatter: (v: string) => `${Number(v) * 100}%`,
        style: {
          fontSize: 10,
          color: token.colorTextSecondary,
        },
      },
      subTickLine: {
        count: 4,
        length: 4,
        style: {
          stroke: token.colorBorderSecondary,
          strokeWidth: 1,
        },
      },
      tickLine: {
        length: 8,
        style: {
          stroke: token.colorBorderSecondary,
          strokeWidth: 1,
        },
      },
      line: {
        style: {
          stroke: token.colorBorderSecondary,
          strokeWidth: 1,
        },
      },
    },
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 1500,
      },
    },
  };

  return (
    <Card
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        marginTop: '16px',
      }}
      bodyStyle={{ padding: '12px' }}
    >
      <div style={{ 
        fontSize: '12px', 
        color: token.colorTextSecondary, 
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        {intl.formatMessage({ id: 'pages.welcome.currentSuccessRate' })}
      </div>
      <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ marginBottom: '8px', fontSize: '12px', color: token.colorTextSecondary }}>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Progress
            type="circle"
            percent={formattedSuccessRate}
            format={(percent) => `${percent}%`}
            strokeColor={{
              '0%': '#ff4d4f',
              '50%': '#faad14',
              '100%': '#52c41a',
            }}
            size={120}
            strokeWidth={8}
          />
        </div>
      </div>
    </Card>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const intl = useIntl();
  const currentUserName = initialState?.currentUser?.name || 'User';
  const merchantId = initialState?.currentUser?.mid;
  
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 从 cookie 获取 authorization
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return '';
  };

  // 获取 summary 数据
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/merchant/summary?merchantId=${merchantId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getCookie('authorization')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSummaryData(data);
      } else {
        console.error('Failed to fetch summary data');
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    if (merchantId) {
      fetchSummary();
    }
  }, [merchantId]);

  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
              marginBottom: '32px',
            }}
          >
            {intl.formatMessage({ id: 'pages.welcome.title' })}, <b>{currentUserName}</b>!
          </div>

          {/* Merchant Portal Header */}
          <div style={{ marginBottom: '32px' }}>
            
            {/* Merchant Info Grid */}
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={6}>
                <InfoItem 
                  label={intl.formatMessage({ id: 'pages.welcome.merchantId' })} 
                  value={summaryData?.merchantId || '-'} 
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <InfoItem 
                  label={intl.formatMessage({ id: 'pages.welcome.feeStructure' })} 
                  value="Fixed Rate" 
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <InfoItem 
                  label={intl.formatMessage({ id: 'pages.welcome.feeRate' })} 
                  value={summaryData?.feeRate || '-'} 
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <InfoItem 
                  label={intl.formatMessage({ id: 'pages.welcome.supportedCurrencies' })} 
                  value={summaryData?.supportedCurrencies || '-'} 
                />
              </Col>
            </Row>
          </div>

          {/* Summary Cards */}
          <div style={{ marginTop: '32px' }}>
            <Row gutter={[24, 16]} style={{ alignItems: 'stretch' }}>
              <Col xs={24} sm={8}>
                <div>
                  <SummaryCard
                    title={intl.formatMessage({ id: 'pages.welcome.totalOrders' })}
                    value={summaryData?.totalOrderNumber || 0}
                    loading={loading}
                  />
                  <OrderTrendChart />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div>
                  <SummaryCard
                    title={intl.formatMessage({ id: 'pages.welcome.succeededOrders' })}
                    value={summaryData?.succeededOrderNumber || 0}
                    loading={loading}
                  />
                  <SuccessRateChart 
                    totalOrderNumber={summaryData?.totalOrderNumber || 0}
                    succeededOrderNumber={summaryData?.succeededOrderNumber || 0}
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <BalanceDisplay
                  balanceInfo={summaryData?.balanceInfo || '-'}
                  loading={loading}
                />
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
