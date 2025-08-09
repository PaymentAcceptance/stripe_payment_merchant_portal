import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';

type BalanceRow = {
  currency: string;
  available: number;
  pending: number;
  reserve: number;
};

type WithdrawalRow = {
  id: string;
  createdAt: string;
  status: string;
  withdrawalAmount: number;
  fee: number;
  receiver: string;
  receivedAmount: number;
  txid: string;
  network: string;
  address: string;
  remark?: string;
};

const BalancesPage: React.FC = () => {
  const intl = useIntl();

  const balanceColumns: ProColumns<BalanceRow>[] = [
    { title: intl.formatMessage({ id: 'pages.balances.currency' }), dataIndex: 'currency' },
    { title: intl.formatMessage({ id: 'pages.balances.available' }), dataIndex: 'available' },
    { title: intl.formatMessage({ id: 'pages.balances.pending' }), dataIndex: 'pending' },
    { title: intl.formatMessage({ id: 'pages.balances.reserve' }), dataIndex: 'reserve' },
    { title: intl.formatMessage({ id: 'pages.common.actions' }), valueType: 'option', render: () => [<a key="withdraw">Withdraw</a>] },
  ];

  const balanceData: BalanceRow[] = [
    { currency: 'HKD', available: 0, pending: 0, reserve: 0 },
    { currency: 'EUR', available: 0, pending: 0, reserve: 0 },
    { currency: 'KRW', available: 0, pending: 0, reserve: 0 },
    { currency: 'CNY', available: 0, pending: 0, reserve: 0 },
    { currency: 'USD', available: 0, pending: 0, reserve: 0 },
  ];

  const withdrawalColumns: ProColumns<WithdrawalRow>[] = [
    { title: intl.formatMessage({ id: 'pages.withdrawals.createdAt' }), dataIndex: 'createdAt' },
    { title: intl.formatMessage({ id: 'pages.withdrawals.status' }), dataIndex: 'status' },
    { title: intl.formatMessage({ id: 'pages.withdrawals.withdrawalAmount' }), dataIndex: 'withdrawalAmount' },
    { title: intl.formatMessage({ id: 'pages.withdrawals.fee' }), dataIndex: 'fee' },
    { title: intl.formatMessage({ id: 'pages.withdrawals.receiver' }), dataIndex: 'receiver' },
    { title: intl.formatMessage({ id: 'pages.withdrawals.receivedAmount' }), dataIndex: 'receivedAmount' },
    { title: intl.formatMessage({ id: 'pages.withdrawals.txid' }), dataIndex: 'txid' },
    { title: intl.formatMessage({ id: 'pages.withdrawals.network' }), dataIndex: 'network' },
    { title: intl.formatMessage({ id: 'pages.withdrawals.address' }), dataIndex: 'address' },
    { title: intl.formatMessage({ id: 'pages.withdrawals.remark' }), dataIndex: 'remark' },
  ];

  return (
    <PageContainer>
      <Tabs
        defaultActiveKey="balances"
        items={[
          {
            key: 'balances',
            label: intl.formatMessage({ id: 'pages.balances.tab.balances' }),
            children: (
              <ProTable<BalanceRow>
                rowKey={(r) => r.currency}
                search={false}
                options={false}
                columns={balanceColumns}
                dataSource={balanceData}
                pagination={{ pageSize: 10 }}
              />
            ),
          },
          {
            key: 'withdrawals',
            label: intl.formatMessage({ id: 'pages.balances.tab.withdrawals' }),
            children: (
              <ProTable<WithdrawalRow>
                rowKey={(r) => r.id}
                search={false}
                options={false}
                columns={withdrawalColumns}
                request={async () => ({ data: [], success: true, total: 0 })}
                pagination={{ pageSize: 10 }}
              />
            ),
          },
        ]}
      />
    </PageContainer>
  );
};

export default BalancesPage;

