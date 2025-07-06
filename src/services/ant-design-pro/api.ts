// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export async function currentUser(options?: { [key: string]: any }) {
  const mid = options?.mid
  console.log('mid::>> ', mid);

  return request<{
    data: API.CurrentUser;
  }>(API_BASE_URL +'/merchant/' + mid, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>(API_BASE_URL +'/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  console.log('API_BASE_URL==>>', API_BASE_URL);
  return request<API.LoginResult>(API_BASE_URL +'/merchant/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>(API_BASE_URL +'/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function queryPaymentOrder(
  params: {
    paymentOrderId?: string;
    status?: string;
    date?: string;
    merchantId?: string;
    currentPage?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  console.log('params::>> ', params);
  // 处理 status 为 all 时，传空字符串
  const status = params.status === 'all' ? '' : params.status;

  // 从 cookie 读取 Authorization
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return '';
  }
  const authorization = getCookie('authorization');

  return request<API.PaymentOrderList>(API_BASE_URL +'/merchant/orders', {
    method: 'GET',
    params: {
      paymentOrderId: params.paymentOrderId,
      status,
      date: params.date,
      merchantId: params.merchantId,
      currentPage: params.currentPage ?? 0,
      pageSize: params.pageSize ?? 10,
    },
    headers: {
      Authorization: authorization ? `Bearer ${authorization}` : '',
      ...options?.headers,
    },
    ...(options || {}),
  });
}

// /** 更新规则 PUT /api/rule */
// export async function updateRule(options?: { [key: string]: any }) {
//   return request<API.RuleListItem>('/api/rule', {
//     method: 'POST',
//     data:{
//       method: 'update',
//       ...(options || {}),
//     }
//   });
// }

// /** 新建规则 POST /api/rule */
// export async function addRule(options?: { [key: string]: any }) {
//   return request<API.RuleListItem>('/api/rule', {
//     method: 'POST',
//     data:{
//       method: 'post',
//       ...(options || {}),
//     }
//   });
// }

// /** 删除规则 DELETE /api/rule */
// export async function removeRule(options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/rule', {
//     method: 'POST',
//     data:{
//       method: 'delete',
//       ...(options || {}),
//     }
//   });
// }
