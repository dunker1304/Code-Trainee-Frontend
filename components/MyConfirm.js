import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ConfirmModal = (handleOk)=>{
  const { confirm } = Modal;

  return (
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        handleOk()
      },
      onCancel() {
      
      },
    })
   )
}

export default ConfirmModal;