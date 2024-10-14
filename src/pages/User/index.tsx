// import styles from './index.less'
import request from '@/utils/request';
import type { TableProps } from 'antd';
import { Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
// import tools from '@/utils/tools'
interface DataType {
  id: string;
  account: string;
  username: number;
  role: string;
}

const App: React.FC = () => {
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
    },
    // {
    //     title: '角色',
    //     key: 'role',
    //     dataIndex: 'role',
    //     render: (_, { tags }) => (
    //         <>
    //             {tags.map((tag) => {
    //                 let color = tag.length > 5 ? 'geekblue' : 'green';
    //                 if (tag === 'loser') {
    //                     color = 'volcano';
    //                 }
    //                 return (
    //                     <Tag color={color} key={tag}>
    //                         {tag.toUpperCase()}
    //                     </Tag>
    //                 );
    //             })}
    //         </>
    //     ),
    // },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    const init = () => {
      let url = `/api/user/findAll`;
      request(url, {
        method: 'GET',
      }).then((res) => {
        setData(res.data.records); // 更新状态
      });
      console.log(data);
    };

    init();
  }, []); // 只在组件首次挂载时运行

  return <Table<DataType> columns={columns} dataSource={data} />;
};

export default App;
