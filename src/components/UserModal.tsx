import React from 'react';
import { Modal, Form, Input } from 'antd';

const UserModal = ({ isEditMode, isModalVisible, handleOk, handleCancel, form }: any) => {
  return (
    <Modal
      title={isEditMode ? 'Editar Usuário' : 'Criar Usuário'}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ onClick: handleOk }}
      cancelButtonProps={{ disabled: false }}
      okText={isEditMode ? 'Salvar' : 'Criar'}
      cancelText="Cancelar"
      mask={true}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nome"
          name="name"
          rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
        >
          <Input placeholder="Insira seu nome" />
        </Form.Item>

        <Form.Item
          label="E-mail"
          name="mail"
          rules={[{ required: true, message: 'Por favor, insira seu e-mail!' }]}
        >
          <Input type="email" placeholder="Insira seu e-mail" />
        </Form.Item>

        <Form.Item
          label="Telefone"
          name="phone"
          rules={[{ required: true, message: 'Por favor, insira seu telefone!' }]}
        >
          <Input placeholder="Insira seu telefone" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
