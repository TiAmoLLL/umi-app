import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';
// import request from '@/utils/request';
// import { encrypt } from '@/utils/index';
import request from '@/utils/request';
import tools from '@/utils/tools';
import styles from './index.less';

type FieldType = {
  user?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
  console.log('Success:', values);
  let params = {
    // account: encrypt(values.user),
    account: values.user,
    // password: encrypt(values.password),
    password: values.password,
  };
  // let url = `/api/manager/auth/login`
  let url = `/api/auth/login`;

  request(url, {
    method: 'POST', // 指定请求方法为 POST
    data: params,
    headers: {
      'Content-Type': 'application/json', // 明确指定 JSON 格式
    },
  }).then((resp) => {
    console.log(resp);
    if (resp.code === 200) {
      tools.data.set('user', {
        token: resp.data.access_token,
        name: resp.data.user.account,
      });
      window.location.href = '/home';
    }
  });
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = async (
  errorInfo,
) => {
  console.log('Failed:', errorInfo);
  // const data = await fetch('/api/auth/login', {
  //     method: 'POST', // 指定请求方法为 POST
};

const App: React.FC = () => (
  <div className={styles.login}>
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Username"
        name="user"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </div>
);

export default App;
