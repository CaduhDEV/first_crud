import { Modal, Button } from 'antd';

const DeleteUserModal = ({ visible, onCancel, onConfirm }: any) => {
  return (
    <Modal
      open={visible}
      title="Tem certeza que deseja deletar?"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="delete" type="primary" onClick={onConfirm}>
          Deletar
        </Button>,
      ]}
    >
      <p>Esta ação é irreversível. Tem certeza que deseja continuar?</p>
    </Modal>
  );
};

export default DeleteUserModal;