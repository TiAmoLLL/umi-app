import tools from '@/utils/tools';
import { PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Image, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
interface UploadComponentProps {
  onFileListChange: (fileList: UploadFile[]) => void; // 父组件回调
  data: any; // 表单数据
}
const App: React.FC<UploadComponentProps> = (props) => {
  const { onFileListChange, data } = props;
  const user = tools.data.get('user');
  const headers = { 'x-Token': `Bearer ${user.token}` };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const baseURL = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    console.log(baseURL);

    if (data && data.goods_image && data.goods_image.length > 0) {
      console.log(data);
      let result = data.goods_image.map((item: any) => {
        return {
          uid: item.id,
          name: item.originalName,
          originalName: item.originalName,
          // fileName: item.fileName,
          mimetype: item.mimetype,
          status: 'done',
          url: baseURL + item.path,
          path: baseURL + item.path,
        };
      });
      setFileList(result); // 初始化表单数据
    }
  }, [data]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    console.log(file);

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    console.log(newFileList);

    setFileList(newFileList);
    // 过滤出上传完成的文件，提取有用信息同步给父组件
    const uploadedFiles = newFileList.filter((file) => file.status === 'done'); // 仅保留上传完成的文件

    // 同步到父组件
    onFileListChange(uploadedFiles);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <>
      <Upload
        action="/api/file/upload"
        listType="picture-card"
        headers={headers}
        withCredentials={true}
        fileList={fileList}
        maxCount={5}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default App;
