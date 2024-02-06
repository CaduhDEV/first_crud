import { useState } from 'react';
import './App.css';
import { Table, Button, Flex, DatePicker, Modal, Form, Input  } from 'antd';
import type { TableProps  } from 'antd';
import Search from 'antd/es/input/Search';
import Header from './components/Header';
import DeleteUserModal from './components/DeleteModal';
import UserModal from './components/UserModal';

const { RangePicker } = DatePicker;

function App() {

  interface UserTypes {
    id: number;
    name: string;
    mail: string;
    phone: string;
    created_at: any;
    updated_at: any;
    deleted_at: any;
  }
  
  const formatJsDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
  
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
  
  const columns: TableProps<UserTypes>['columns'] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'mail',
      key: 'mail',
      sorter: (a, b) => a.mail.localeCompare(b.mail),
    },
    {
      title: 'Telefone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Criado em',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        console.log(dateA.getTime() - dateB.getTime())
        return dateA.getTime() - dateB.getTime();
      },
      render: (text) => formatJsDate(text),
    },
    {
      title: 'Atualizado em',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: (a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        console.log(dateA.getTime() - dateB.getTime())
        return dateA.getTime() - dateB.getTime();
      },
      render: (text) => formatJsDate(text),
    },
    {
      title: 'Deletado em',
      dataIndex: 'deleted_at',
      key: 'deleted_at',
      render: (text) => (text ? formatJsDate(text) : 'N/A'),
    },
    {
      title: "Ações",
      render: (value: any, record: UserTypes) => <div style={{display: 'flex', flexDirection: 'row', gap: 5}}>
        <Button type="primary" onClick={ () => showModalForEdit(record)}>Editar</Button>
        <Button onClick={ () => setDeleteModalVisible(true)}>Deletar</Button>
      </div>
    }
  
  ]
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDatePickerChange = (date: any, dateString: any) => {
    setSelectedDate(dateString);
    console.log(date,dateString);
  };

  const [form] = Form.useForm();
  
  const showModalForCreate = () => {
    setIsModalVisible(true);
    setIsEditMode(false);
    form.resetFields();
  };

  const showModalForEdit = (user: UserTypes) => {
    setIsModalVisible(true);
    setIsEditMode(true);
    setEditingUser(user); 
    form.setFieldsValue(user);
  };

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDelete = () => {
    console.log('Usuário deletado!');
    setDeleteModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      form.resetFields();
      setIsModalVisible(false);
      if (isEditMode) {
        // Lógica para edição de usuário
        console.log('Dados do usuário editado:', values);
      } else {
        // Lógica para criação de usuário
        console.log('Dados do novo usuário:', values);
      }
    }).catch(errorInfo => {
      console.log('Erro ao validar campos:', errorInfo);
    });
  };

  function onChangeInputName(value: string) {
    console.log(value);
  }

  const data: UserTypes[] = [
    {
      id: 1,
      name: 'John Brown',
      phone: '(43) 984244218',
      mail: 'contato.caduh@hotmail.com',
      created_at: 1634443345000,
      updated_at: 163333346000,
      deleted_at: null,
    },
    {
      id: 2,
      name: 'Alice Johnson',
      phone: '(52) 987654321',
      mail: 'alice.j@example.com',
      created_at: 163311345000,
      updated_at: 1633545346000,
      deleted_at: null,
    },
    {
      id: 3,
      name: 'Bob Smith',
      phone: '(11) 555555555',
      mail: 'bob.smith@example.com',
      created_at: 1633340000,
      updated_at: 1633341000,
      deleted_at: null,
    },
    
  ]

  return (
    <div className="App">
      <Header></Header>
      <div style={{ display: 'flex', flexDirection: 'column', margin: 50, gap: 25}}>
        <Flex style={{ justifyContent: 'space-between'}} gap="small" wrap="wrap">
          <Button onClick={showModalForCreate} type="primary">Criar Usuário</Button>
          <Flex style={{justifyContent: 'center'}} gap="small" wrap="wrap">
            <Search style={{ width: 300 }} size="middle" placeholder="Pesquisar Usuário" onChange={ (e) => onChangeInputName(e.target.value)} />
            <RangePicker
              format="DD/MM/YYYY"
              onChange={(date, dateString) => handleDatePickerChange(date, dateString)}
              placeholder={['Data Inicial', 'Data Final']}
              allowEmpty={[true, true]}
            />
          </Flex>
        </Flex>
        <Table columns={columns} dataSource={data} />
      </div>

      <UserModal
        isEditMode={isEditMode}
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        form={form}
      />

      <DeleteUserModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDelete}
      />
    </div>

  );
}

export default App;

