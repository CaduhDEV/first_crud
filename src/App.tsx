import { useEffect, useState } from 'react';
import './App.css';
import { Table, Button, Flex, DatePicker, Form } from 'antd';
import type { TableProps } from 'antd';
import Search from 'antd/es/input/Search';
import Header from './components/Header';
import DeleteUserModal from './components/DeleteModal';
import UserModal from './components/UserModal';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

function App() {

  // tipagem de usuário
  interface UserTypes {
    id: number;
    name: string;
    mail: string;
    phone: string;
    created_at: any;
    updated_at: any;
    deleted_at: any;
  }

  // fomatar data
  const formatJsDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';

    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };


  // EXTRUTURA DA TABELA
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
      title: "Ações",
      render: (value: any, record: UserTypes) => <div style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
        <Button type="primary" onClick={() => showModalForEdit(record)}>Editar</Button>
        <Button onClick={() => tryDeleteUser(record)}>Deletar</Button>
      </div>
    }

  ]

  // STATES para os modals
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(0);
  const [form] = Form.useForm();
  const [inputName, setInputName] = useState('');
  const [inputDate, setInputDate] = useState('');

  // atualizar tabela inicial
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/search');
      setData(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // carregar modal de criação de usuário
  const showModalForCreate = () => {
    setIsModalVisible(true);
    setIsEditMode(false);
    form.resetFields();
  };

  // carregar modal de editar usuário
  const showModalForEdit = (user: UserTypes) => {
    setIsModalVisible(true);
    setIsEditMode(true);
    setUserId(user.id);
    form.setFieldsValue(user);
  };

  // carregar o modal de deletar usuário
  const tryDeleteUser = async (values: UserTypes) => {
    setDeleteModalVisible(true)
    setUserId(values.id)
  }

  // cancelar o modal
  const handleCancel = () => {
    setUserId(0);
    setIsModalVisible(false);
    setIsEditMode(false);
  };

  // criar / update no user
  const handleOk = async (values: UserTypes) => {
    try {
      const values = await form.validateFields(); // Obtenha os valores dos campos do formulário
      form.resetFields();
      setIsModalVisible(false);
      if (isEditMode) {
        if (userId === 0) { return }
        values.id = userId;
        const response = await axios.post('http://localhost:8000/api/update', values);
        console.log('Dados enviados com sucesso:', response.data);
        await fetchUsers();
        console.log('Dados do usuário editado:', values);
      } else {
        const response = await axios.post('http://localhost:8000/api/endpoint', values);
        console.log('Dados enviados com sucesso:', response.data);
        await fetchUsers();
      }
    } catch (error) {
      console.error('Erro ao enviar dados para o backend:', error);
    }
  };

  // deletar usuário
  const handleDelete = async () => {
    const response = await axios.post('http://localhost:8000/api/delete', { id: userId });
    console.log('Dados deletados com sucesso:', response.data);
    setDeleteModalVisible(false);
    fetchUsers();
    setUserId(0);
  };

  const onChangeFilter = async (name?: string, dates?: any) => {
    try {
      setInputName(name?.trim() || '');
      
      let url = `http://localhost:8000/api/search/${encodeURIComponent(name?.trim() || '')}`;
  
      if (dates && Array.isArray(dates) && dates.length === 2) {
        console.log('entrou na date')
        const [startDate, endDate] = dates;
  
        console.log('startDate:', startDate);
        console.log('endDate:', endDate);
        
        // Corrigindo a conversão de data para o formato 'YYYY-MM-DD'
        const startDateMoment = moment(startDate, 'DD/MM/YYYY');
        const endDateMoment = moment(endDate, 'DD/MM/YYYY');
        
        // Verifica se as datas são válidas antes de formatá-las
        const startDateFormatted = startDateMoment.isValid() ? startDateMoment.format('YYYY-MM-DD') : undefined;
        const endDateFormatted = endDateMoment.isValid() ? endDateMoment.format('YYYY-MM-DD') : undefined;
        
        // Construindo a string convertida
        const convert_date = `${startDateFormatted || ''}+${endDateFormatted || ''}`;
        setInputDate(convert_date)
        url += `+${convert_date}`;
      }
  
      console.log(url);
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error('Erro ao enviar solicitação de filtro:', error);
    }
  };  

  return (
    <div className="App">
      {/* Extrutura base */}
      <Header></Header>
      <div style={{ display: 'flex', flexDirection: 'column', margin: 50, gap: 25 }}>
        <Flex style={{ justifyContent: 'space-between' }} gap="small" wrap="wrap">
          <Button onClick={showModalForCreate} type="primary">Criar Usuário</Button>
          <Flex style={{ justifyContent: 'center' }} gap="small" wrap="wrap">
            {/* Filtros */}
            <Search style={{ width: 300 }} size="middle" placeholder="Pesquisar Usuário" onChange={(e) => onChangeFilter(e.target.value, inputDate)} />
            <RangePicker
              format="DD/MM/YYYY"
              onChange={(date, dateString) => onChangeFilter(inputName, dateString)}
              placeholder={['Data Inicial', 'Data Final']}
              allowEmpty={[true, true]}
            />
          </Flex>
        </Flex>
        {/* Carregar tabela de usuários */}
        <Table columns={columns} dataSource={data} />
      </div>

      {/* Criação dos modals, aguardando serem chamados à exibição */}
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

