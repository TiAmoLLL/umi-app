import request from '@/utils/request';
import { ActionType, ProTable } from '@ant-design/pro-components'; // 引入 ProFormInstance
import type { PopconfirmProps, TableProps } from 'antd';
import { Button, Input, message, Popconfirm, Space, Table } from 'antd';

import React, { useEffect, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
interface DataType {
  id: string;
  account: string;
  username: number;
  role: string;
}

const App: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState(''); // 搜索框输入值
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>(); // 用于表单引用
  const [currentRow, setCurrentRow] = useState<DataType | null>(null); // 当前选中行的用户信息
  const [isEditing, setIsEditing] = useState<boolean>(false); // 用于标记是否处于编辑模式
  const cancel: PopconfirmProps['onCancel'] = () => {
    message.error('已取消');
  };

  const init = (value: any = null) => {
    let url = `/api/admin_user/findAll`;
    request(url, {
      method: 'GET',
      params: { ...value },
    })
      .then((res) => {
        setData(res.data.records); // 更新状态
      })
      .catch((error) => {
        message.error('获取数据失败！', error);
      });
  };
  useEffect(() => {
    init();
  }, []);

  const handleEdit = (record: DataType) => {
    setCurrentRow(record); // 设置当前选中的行数据
    setIsEditing(true); // 进入编辑模式
    handleModalVisible(true); // 打开弹框
  };

  /**
   * 删除节点
   */
  const handleDelete = (value: any) => {
    let url = `/api/admin_user/delete/${value}`;
    request(url, {
      method: 'Delete',
    })
      .then((resp: any) => {
        if (resp.code === 200) {
          message.success('删除成功');
          init();
          return true;
        } else {
          new Error(resp.message);
        }
      })
      .catch((error: any) => {
        message.error('删除失败请重试！', error);
        return false;
      });
  };
  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.UserInfo) => {
    const hide = message.loading('正在添加');
    let url = `/api/admin_user/create`;
    request(url, {
      method: 'POST',
      data: fields,
    })
      .then((resp: any) => {
        hide(); // 关闭加载提示
        if (resp.code === 200) {
          message.success('添加成功');
          handleModalVisible(false);
          init();
        } else {
          new Error(resp.message);
        }
      })
      .catch((error: any) => {
        message.error('添加失败请重试！', error);
        handleModalVisible(false);
      });
  };
  /**
   * 修改节点 placeholder
   */
  const handleUpdate = async (fields: API.UserInfo) => {
    const hide = message.loading('正在修改');
    let url = `/api/admin_user/update`; // 假设修改用户的 API 地址

    request(url, {
      method: 'PUT', // 修改使用 PUT 请求
      data: { ...fields, id: currentRow?.id }, // 将 ID 也传递给后端
    })
      .then((resp: any) => {
        hide(); // 关闭加载提示
        if (resp.code === 200) {
          message.success('修改成功');
          init();
          handleModalVisible(false);
          return true;
        } else {
          message.error(resp.message);
          return false;
        }
      })
      .catch((error: any) => {
        hide(); // 关闭加载提示
        message.error('修改失败，请重试！', error);
        return false;
      })
      .finally(() => {
        hide(); // 关闭加载提示
        setCurrentRow(null); // 清空当前行数据
      });
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value); // 更新搜索文本
  };
  const onSearch = () => {
    init({ account: searchText });
  };
  const handleCancel = () => {
    handleModalVisible(false);
    setCurrentRow(null); // 重置表单数据
  };
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      render: (text) => <a>{text}</a>,
      align: 'center', // 居中
    },
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
      align: 'center', // 居中
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (text) => <>{text === 'admin' ? '管理员' : '普通用户'}</>,
      align: 'center', // 居中
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center', // 居中
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a> {/* 编辑按钮 */}
          <Popconfirm
            title="删除警告"
            description="删除操作不可撤回"
            onConfirm={() => handleDelete(record.id)}
            onCancel={cancel}
            okText="删除"
            cancelText="取消"
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div>
      {/* 搜索框和添加按钮 */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索账号或姓名"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={onSearch}>
          搜索
        </Button>
        <Button type="primary" onClick={() => handleModalVisible(true)}>
          添加用户
        </Button>
      </Space>
      {/* 表格 */}
      <Table<DataType> columns={columns} dataSource={data} rowKey="id" />

      <CreateForm onCancel={handleCancel} modalVisible={createModalVisible}>
        <ProTable<any, any>
          formRef={formRef} // 引用表单
          onSubmit={async (value) => {
            let success: any;
            success = isEditing
              ? await handleUpdate(value) // 编辑时调用更新逻辑
              : await handleAdd(value); // 添加时调用添加逻辑

            if (success) {
              handleModalVisible(false);
              setCurrentRow(null); // 清空当前行数据
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={[
            {
              title: '账号',
              dataIndex: 'account',
              key: 'account',
              initialValue: currentRow?.account, // 预填充账号
              formItemProps: {
                rules: [{ required: true, message: '请输入账号' }],
              },
            },
            {
              title: '姓名',
              dataIndex: 'username',
              key: 'username',
              initialValue: currentRow?.username, // 预填充姓名
              formItemProps: {
                rules: [{ required: true, message: '请输入姓名' }],
              },
              renderFormItem: () => (
                <Input autoComplete="new-password" placeholder="请输入姓名" />
              ), // 禁用自动填充
            },
            {
              title: '密码',
              dataIndex: 'password',
              key: 'password',
              renderFormItem: () => (
                <Input.Password
                  autoComplete="new-password"
                  placeholder="请输入密码"
                />
              ), // 密码输入框，禁用自动填充
              formItemProps: {
                rules: [{ required: true, message: '请输入密码' }],
              },
            },
            {
              title: '角色',
              dataIndex: 'role',
              key: 'role',
              initialValue: currentRow?.role, // 预填充姓名
              formItemProps: {
                rules: [{ required: true, message: '请输入角色' }],
              },
              renderFormItem: () => (
                <Input autoComplete="new-password" placeholder="请输入角色" />
              ),
            },
          ]}
        />
      </CreateForm>
    </div>
  );
};

export default App;
