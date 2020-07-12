import { useState } from 'react';

const { Modal, Button } = require('antd');

const ConfirmModal = ({
  title = 'Title',
  visible = false,
  okText = 'OK',
  cancelText = 'Cancel',
  content = '',
  okType = 'primary',
  maskClosable = false,
  bodyStyle = {},
  showXbutton = true,
  onOk = () => {},
  onCancelX = () => {},
  onCancel = () => {},
}) => {
  let [loading, setLoading] = useState(false);
  const handleOk = async () => {
    setLoading(true);
    onOk();
    setLoading(false);
  };
  return (
    <>
      <Modal
        title={title}
        visible={visible}
        bodyStyle={bodyStyle}
        closable={showXbutton}
        maskClosable={maskClosable}
        onCancel={onCancelX}
        footer={
          <React.Fragment>
            <Button type='primary' danger onClick={onCancel} disabled={loading}>
              {cancelText}
            </Button>
            <Button type={okType} onClick={handleOk} loading={loading}>
              {okText}
            </Button>
          </React.Fragment>
        }>
        {content}
      </Modal>
    </>
  );
};

export default ConfirmModal;
