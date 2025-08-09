import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useRef } from 'react';

type SettlementRecord = {
  id: string;
  period: string;
  settleDate: string;
  succeededCount: number;
  succeededAmount: number;
  fee: number;
  refundedAmount: number;
  disputeAmount: number;
  adjustmentAmount: number;
  reserveBalance: number;
  netAmount: number;
};

const SettlementsPage: React.FC = () => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();

  const columns: ProColumns<SettlementRecord>[] = [
    // Search-only fields
    {
      title: intl.formatMessage({ id: 'pages.common.from' }),
      dataIndex: 'from',
      valueType: 'date',
      hideInTable: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.common.to' }),
      dataIndex: 'to',
      valueType: 'date',
      hideInTable: true,
    },
    // Table fields
    { title: intl.formatMessage({ id: 'pages.settlements.period' }), dataIndex: 'period', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.settlements.settleDate' }), dataIndex: 'settleDate', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.settlements.succeededCount' }), dataIndex: 'succeededCount', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.settlements.succeededAmount' }), dataIndex: 'succeededAmount', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.settlements.fee' }), dataIndex: 'fee', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.settlements.refundedAmount' }), dataIndex: 'refundedAmount', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.settlements.disputeAmount' }), dataIndex: 'disputeAmount', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.settlements.adjustmentAmount' }), dataIndex: 'adjustmentAmount', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.settlements.reserveBalance' }), dataIndex: 'reserveBalance', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.settlements.netAmount' }), dataIndex: 'netAmount', hideInSearch: true },
    {
      title: intl.formatMessage({ id: 'pages.common.actions' }),
      valueType: 'option',
      render: () => [<a key="view">View</a>],
    },
  ];

  return (
    <PageContainer>
      <ProTable<SettlementRecord>
        rowKey="id"
        formRef={formRef}
        search={{ 
          labelWidth: 'auto', 
          defaultCollapsed: false,
          span: 8,
          layout: 'horizontal'
        }}
        columns={columns}
        request={async () => {
          return {
            data: [],
            success: true,
            total: 0,
          };
        }}
        pagination={{ pageSize: 10 }}
      />
    </PageContainer>
  );
};

export default SettlementsPage;

