import Upload from '@/components/Upload/index';
import request from '@/utils/request';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  UploadFile,
} from 'antd';
import React, { PropsWithChildren, useEffect, useState } from 'react';
interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  data: DataType | null;
  closeCreateModal: () => void;
}
interface FormattedFile {
  uid: string;
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
  goods_image?: Array<FormattedFile> | null; //图片
  goods_quantity?: number; //数量
  goods_category?: string; //分类
  goods_status?: string; //状态
  goods_created_at?: string; //创建时间
}
const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
  const { modalVisible, onCancel, data, closeCreateModal } = props;
  const [form] = Form.useForm(); // 使用 form 实例
  const [fileList, setFileList] = useState<FormattedFile[]>([]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data); // 初始化表单数据
    }
  }, [data, form]);
  console.log('props', props);
  const send = (url: string, params: DataType, method: string) => {
    request(url, {
      method,
      data: { ...params, goods_id: data?.goods_id, goods_image: fileList },
    })
      .then((resp: any) => {
        if (resp.code === 200) {
          message.success(resp.message);
          closeCreateModal();
        } else {
          new Error(resp.message);
        }
      })
      .catch((error: any) => {
        message.error('添加失败请重试！', error);
      });
  };
  const submit = () => {
    console.log('submit', data);
    console.log('submit', form.getFieldsValue());
    let createUrl = `/api/admin/goods/create`;
    let updateUrl = `/api/admin/goods/update`;
    if (data?.goods_id) {
      send(updateUrl, form.getFieldsValue(), 'PUT');
    } else {
      send(createUrl, form.getFieldsValue(), 'POST');
    }
  };
  //文件处理，upload组件调用这个方法，把fileList传给父组件
  const handleFileListChange = (updatedFileList: UploadFile[]) => {
    console.log(updatedFileList);

    const formattedFileList = updatedFileList
      .filter((item) => item.status === 'done')
      .map((item) => ({
        uid: item.response.data.uid, // 上传图片的唯一 id
        originalName: item.response.data.originalName, // 原文件名
        path:
          item.response.data.response?.path || item.response.data.path || '', // 上传成功后后端返回的文件 path 或本地 path
        size: item.response.data.size || 0, // 文件大小
        mimetype: item.response.data.mimetype || '', // 文件类型
      }));
    setFileList(formattedFileList);
    console.log('Updated fileList in parent:', updatedFileList);
  };
  return (
    <Modal
      destroyOnClose
      title="新建"
      width={800}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form
        form={form}
        name="basic"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={data || {}}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item<DataType>
              label="商品名"
              name="goods_name"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<DataType>
              label="价格"
              name="goods_price"
              rules={[{ required: true, message: 'Please input your price!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item<DataType>
              label="数量"
              name="goods_quantity"
              rules={[{ required: true, message: 'Please input your 数量!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<DataType>
              label="简介"
              name="goods_description"
              rules={[{ required: true, message: 'Please input your 简介!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item<DataType>
              label="分类"
              name="goods_category"
              rules={[{ required: true, message: 'Please input your 分类!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<DataType>
              label="状态"
              name="goods_status"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Select
                style={{ width: 120 }}
                options={[
                  { value: 'available', label: '正常' },
                  { value: 'unavailable', label: '停用' },
                  { value: 'out_of_stock', label: '库存不足' },
                  { value: 'discontinued', label: '停产' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item<DataType>
              label="图片"
              name="goods_image"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              {/* <Input /> */}
              <Upload onFileListChange={handleFileListChange} data={data} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" onClick={submit}>
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateForm;
