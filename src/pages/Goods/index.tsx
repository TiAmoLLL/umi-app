import request from '@/utils/request';
import {
  Button,
  Image,
  Input,
  message,
  Popconfirm,
  PopconfirmProps,
  Space,
  Table,
  TableProps,
  Tag,
} from 'antd';

import React, { useEffect, useState } from 'react';
import CreateForm from './components/CreateForm';
interface FormattedFile {
  uid: string; // 上传图片的唯一 id
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
}
interface DataType {
  goods_id?: number; //id
  goods_name?: string; //商品名称
  goods_price?: number; //price
  goods_description?: string; //描述-简介
  goods_image?: Array<FormattedFile>; //图片
  goods_quantity?: number; //数量
  goods_category?: string; //分类
  goods_status?: string; //状态
  goods_created_at?: string; //创建时间
}

const App: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  // const [confirmLoading, setConfirmLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState(''); // 搜索框输入值
  // const actionRef = useRef<ActionType>();
  // const formRef = useRef<any>(); // 用于表单引用
  const [currentRow, setCurrentRow] = useState<DataType | null>(null); // 当前选中行的用户信息
  const [isEditing, setIsEditing] = useState<boolean>(false); // 用于标记是否处于编辑模式
  const baseURL = process.env.REACT_APP_BASE_URL;
  const cancel: PopconfirmProps['onCancel'] = () => {
    message.error('已取消');
  };

  const init = (value: any = null) => {
    let url = `/api/goods/findAll`;
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
    console.log(isEditing);

    setCurrentRow(record); // 设置当前选中的行数据
    setIsEditing(true); // 进入编辑模式
    handleModalVisible(true); // 打开弹框
  };
  const closeCreateModal = () => {
    handleModalVisible(false);
    init();
  };
  /**
   * 删除节点
   */
  const handleDelete = (value: any) => {
    let url = `/api/admin/goods/delete/${value}`;
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
  // const handleAdd = async (fields: API.UserInfo) => {
  //   const hide = message.loading('正在添加');
  //   let url = `/api/admin/user/create`;
  //   request(url, {
  //     method: 'POST',
  //     data: fields,
  //   })
  //     .then((resp: any) => {
  //       hide(); // 关闭加载提示
  //       if (resp.code === 200) {
  //         message.success('添加成功');
  //         handleModalVisible(false);
  //         init();
  //       } else {
  //         new Error(resp.message);
  //       }
  //     })
  //     .catch((error: any) => {
  //       message.error('添加失败请重试！', error);
  //       handleModalVisible(false);
  //     });
  // };
  /**
   * 修改节点 placeholder
   */
  // const handleUpdate = async (fields: API.UserInfo) => {
  //   const hide = message.loading('正在修改');
  //   let url = `/api/admin/goods/update`; // 假设修改商品的 API 地址

  //   request(url, {
  //     method: 'PUT', // 修改使用 PUT 请求
  //     data: { ...fields, id: currentRow?.goods_id }, // 将 ID 也传递给后端
  //   })
  //     .then((resp: any) => {
  //       hide(); // 关闭加载提示
  //       if (resp.code === 200) {
  //         message.success('修改成功');
  //         init();
  //         handleModalVisible(false);
  //         return true;
  //       } else {
  //         message.error(resp.message);
  //         return false;
  //       }
  //     })
  //     .catch((error: any) => {
  //       hide(); // 关闭加载提示
  //       message.error('修改失败，请重试！', error);
  //       return false;
  //     })
  //     .finally(() => {
  //       hide(); // 关闭加载提示
  //       setCurrentRow(null); // 清空当前行数据
  //     });
  // };
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
      title: '名称',
      dataIndex: 'goods_name',
      key: 'goods_name',
      render: (text) => <a>{text}</a>,
      align: 'center', // 居中
    },
    {
      title: '价格',
      dataIndex: 'goods_price',
      key: 'goods_price',
      align: 'center', // 居中
    },
    {
      title: '库存',
      dataIndex: 'goods_quantity',
      key: 'goods_quantity',
      align: 'center', // 居中
    },
    {
      title: '时间',
      dataIndex: 'goods_created_at',
      key: 'goods_created_at',
      render: (text) => <>{text.substr(0, 10)}</>,
      align: 'center', // 居中
    },
    {
      title: '品牌',
      dataIndex: 'goods_category',
      key: 'goods_category',
      align: 'center', // 居中
    },
    {
      title: '状态',
      dataIndex: 'goods_status',
      key: 'goods_status',
      render: (text) => {
        if (text === 'available') return <Tag color="green">正常</Tag>;
        else if (text === 'unavailable') return <Tag color="red">停用</Tag>;
        else if (text === 'out_of_stock')
          return <Tag color="orange">库存不足</Tag>;
        else if (text === 'discontinued') return <Tag color="orange">停产</Tag>;
      },
      align: 'center', // 居中
    },
    {
      title: '图片',
      dataIndex: 'goods_image',
      key: 'goods_image',
      align: 'center', // 居中
      render: (images: { path: string }[] | undefined) => {
        if (!images || images.length === 0) {
          return <span>暂无图片</span>; // 无图片时的占位文本
        }

        // 只显示第一张图片
        const firstImage = images[0];

        return (
          <Image
            width={50} // 缩略图的宽度
            src={baseURL + firstImage.path}
            alt="预览图"
            preview={{ src: baseURL + firstImage.path }} // 点击时预览的图片
          />
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'goods_description',
      key: 'goods_description',
      align: 'center', // 居中
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a> {/* 编辑按钮 */}
          <Popconfirm
            title="删除警告"
            description="删除操作不可撤回"
            onConfirm={() => handleDelete(record.goods_id)}
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
          placeholder="搜索名称"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={onSearch}>
          搜索
        </Button>
        <Button type="primary" onClick={() => handleModalVisible(true)}>
          添加商品
        </Button>
      </Space>
      {/* 表格 */}
      <Table columns={columns} dataSource={data} rowKey="goods_id" />
      {/* 弹框 */}
      <CreateForm
        onCancel={handleCancel}
        modalVisible={createModalVisible}
        data={currentRow}
        closeCreateModal={closeCreateModal}
      ></CreateForm>
    </div>
  );
};

export default App;
