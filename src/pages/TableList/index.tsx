import { queryPaymentOrder } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Space } from 'antd';
import React, { useRef } from 'react';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const mid = initialState?.currentUser?.mid;

  // 搜索区域的列（hideInTable: true）
  const searchColumns: ProColumns<API.PaymentOrderItem>[] = [
    {
      title: 'Status',
      dataIndex: 'status',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        all: { text: 'All Status' },
        succeeded: { text: 'Succeeded' },
        failed: { text: 'Failed' },
        pending: { text: 'Pending' },
        refunded: { text: 'Refunded' }
      },
      initialValue: 'all',
    },
    {
      title: 'Transaction Date',
      dataIndex: 'date',
      hideInTable: true,
      valueType: 'date',
    },
    {
      title: 'Order ID',
      dataIndex: 'paymentOrderId',
      hideInTable: true,
      valueType: 'text',
    },
  ];

  // 结果区域的所有字段（不带 hideInTable）
  const resultColumns: ProColumns<API.PaymentOrderItem>[] = [
    { title: 'Order ID', dataIndex: 'paymentOrderId', hideInSearch: true },
    { title: 'Status', dataIndex: 'status', hideInSearch: true },
    { title: 'Payment Amount', dataIndex: 'paymentAmount', hideInSearch: true },
    { title: 'Transaction Time', dataIndex: 'transactionTime', hideInSearch: true },
    { title: 'Customer Email', dataIndex: 'customerEmail', hideInSearch: true },
    { title: 'Fee', dataIndex: 'fee', hideInSearch: true },
    { title: 'Refuned Amount', dataIndex: 'refunedAmount', hideInSearch: true },
    { title: 'Merchant Reference', dataIndex: 'merchantReference', hideInSearch: true },
    { 
      title: 'Actions', 
      dataIndex: 'actions', 
      hideInSearch: true,
      render: (_, record) => {
        const isSucceeded = record.status?.toLowerCase() === 'succeeded';
        return (
          <Space>
            <Button type="link" size="small">
              View
            </Button>
            {isSucceeded && (
              <Button type="link" size="small">
                Refund
              </Button>
            )}
          </Space>
        );
      }
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.PaymentOrderItem, API.PageParams>
        actionRef={actionRef}
        rowKey="paymentOrderId"
        search={{
          labelWidth: 120,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom,
          ],
        }}
        form={{
          syncToUrl: true,
        }}
        request={async (params) => {
          console.log('params::>> ', params);
          console.log('mid::>> ', mid);
          return queryPaymentOrder({
            ...params,
            merchantId: mid,
            currentPage: (params.current || 1) - 1,
          });
        }}
        columns={[...searchColumns, ...resultColumns]}
        options={false}
      />
    </PageContainer>
  );
};

export default TableList;
