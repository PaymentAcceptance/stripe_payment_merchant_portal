import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useRef } from 'react';

type DisputeRecord = {
  id: string;
  paymentOrderId: string;
  disputeId: string;
  type: string;
  initiationTime: string;
  resolutionDeadline: string;
  currency: string;
  amount: number;
  status: string;
  reason: string;
};

const DisputesPage: React.FC = () => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();

  const columns: ProColumns<DisputeRecord>[] = [
    // Search-only fields
    { title: intl.formatMessage({ id: 'pages.common.from' }), dataIndex: 'from', valueType: 'date', hideInTable: true },
    { title: intl.formatMessage({ id: 'pages.common.to' }), dataIndex: 'to', valueType: 'date', hideInTable: true },
    { title: intl.formatMessage({ id: 'pages.disputes.paymentOrderId' }), dataIndex: 'paymentOrderId', hideInTable: true },
    { title: intl.formatMessage({ id: 'pages.disputes.disputeId' }), dataIndex: 'disputeId', hideInTable: true },
    { title: intl.formatMessage({ id: 'pages.disputes.type' }), dataIndex: 'type', valueType: 'select', hideInTable: true, valueEnum: {} },
    // Table fields
    { title: intl.formatMessage({ id: 'pages.disputes.paymentOrderId' }), dataIndex: 'paymentOrderId' },
    { title: intl.formatMessage({ id: 'pages.disputes.disputeId' }), dataIndex: 'disputeId', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.disputes.type' }), dataIndex: 'type', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.disputes.initiationTime' }), dataIndex: 'initiationTime', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.disputes.resolutionDeadline' }), dataIndex: 'resolutionDeadline', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.disputes.currency' }), dataIndex: 'currency', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.disputes.amount' }), dataIndex: 'amount', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.disputes.status' }), dataIndex: 'status', hideInSearch: true },
    { title: intl.formatMessage({ id: 'pages.disputes.reason' }), dataIndex: 'reason', hideInSearch: true },
    {
      title: intl.formatMessage({ id: 'pages.common.actions' }),
      valueType: 'option',
      render: () => [<a key="view">View</a>],
    },
  ];

  return (
    <PageContainer>
      <ProTable<DisputeRecord>
        rowKey="id"
        formRef={formRef}
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
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

export default DisputesPage;

