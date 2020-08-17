import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ConfirmModal = (handleOk)=>{
  const { confirm } = Modal;

  return (
    confirm({
      title: 'Do you want to delete this items?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        handleOk()
      },
      onCancel() {
      
      },
    })
   )
}

export default ConfirmModal;