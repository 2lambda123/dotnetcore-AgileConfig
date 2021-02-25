import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, FormInstance, message, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { queryApps } from '../Apps/service';
import UpdateForm from './comps/updateForm';
import { ConfigListItem } from './data';
import { queryConfigs, onlineConfig, offlineConfig, delConfig, addConfig,editConfig } from './service';
const { confirm } = Modal;

const handleOnline = async (fields: ConfigListItem) => {
  const hide = message.loading('正在上线');
  try {
    const result = await onlineConfig({ ...fields });
    hide();
    const success = result.success;
    if (success) {
      message.success('上线成功');
    } else {
      message.error('上线失败请重试！');
    }
    return success;
  } catch (error) {
    hide();
    message.error('上线失败请重试！');
    return false;
  }
};

const handleOffline = async (fields: ConfigListItem) => {
  const hide = message.loading('正在下线');
  try {
    const result = await offlineConfig({ ...fields });
    hide();
    const success = result.success;
    if (success) {
      message.success('下线成功');
    } else {
      message.error('下线失败请重试！');
    }
    return success;
  } catch (error) {
    hide();
    message.error('下线失败请重试！');
    return false;
  }
};

const handleDel = async (fields: ConfigListItem) => {
  const hide = message.loading('正在删除');
  try {
    const result = await delConfig({ ...fields });
    hide();
    const success = result.success;
    if (success) {
      message.success('删除成功');
    } else {
      message.error('删除失败请重试！');
    }
    return success;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};
const handleAdd = async (fields: ConfigListItem) => {
  const hide = message.loading('正在保存');
  try {
    const result = await addConfig({ ...fields });
    hide();
    const success = result.success;
    if (success) {
      message.success('新建成功');
    } else {
      message.error(result.message);
    }
    return success;
  } catch (error) {
    hide();
    message.error('新建失败请重试！');
    return false;
  }
};
const handleEdit = async (config: ConfigListItem) => {
  const hide = message.loading('正在保存');
  try {
    const result = await editConfig({ ...config });
    hide();
    const success = result.success;
    if (success) {
      message.success('保存成功');
    } else {
      message.error(result.message);
    }
    return success;
  } catch (error) {
    hide();
    message.error('保存失败请重试！');
    return false;
  }
};
const configs:React.FC = (props:any) => {
  const appId = props.match.params.app_id;
  const appName = props.match.params.app_name;
  const [appEnums, setAppEnums] = useState<any>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ConfigListItem>();
  const [selectedRowsState, setSelectedRows] = useState<ConfigListItem[]>([]);

  const actionRef = useRef<ActionType>();
  const addFormRef = useRef<FormInstance>();
  const getAppEnums = async () =>
  {
    const result = await queryApps({})
    const obj = {};
    result.data.forEach((x)=>{
      obj[x.id] = {
        text: x.name
      }
    });

    return obj;
  }
  useEffect(()=>{
    getAppEnums().then(x=> {
      console.log('app enums ', x);
      setAppEnums({...x});
    });
  }, []);
  const online = (config: ConfigListItem) => {
    confirm({
      content:`确定上线配置【${config.key}】？`,
      onOk: ()=>{
        const result = handleOnline(config);
        if (result) {
          actionRef.current?.reload();
        }
      }
    });
  }
  const offline = (config: ConfigListItem) => {
    confirm({
      content:`确定下线配置【${config.key}】？`,
      onOk: ()=>{
        const result = handleOffline(config);
        if (result) {
          actionRef.current?.reload();
        }
      }
    });
  }
  const delConfig = (config: ConfigListItem) => {
    confirm({
      content:`确定删除配置【${config.key}】？`,
      onOk: ()=>{
        const result = handleDel(config);
        if (result) {
          actionRef.current?.reload();
        }
      }
    });
  }

  const columns: ProColumns<ConfigListItem>[] = [
    {
      title: '组',
      dataIndex: 'group',
    },
    {
      title: '键',
      dataIndex: 'key',
    },
    {
      title: '值',
      dataIndex: 'value',
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'dateTime'
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      hideInSearch: true,
      valueType: 'dateTime'
    },
    {
      title: '状态',
      dataIndex: 'onlineStatus',
      hideInSearch: true,
      valueEnum: {
        0: {
          text:'待上线',
          status: 'warning'
        },
        1: {
          text:'已上线',
          status: 'Success'
        }
      }
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        record.onlineStatus? <a onClick={ ()=>{ offline(record)} }>下线</a>:<a onClick={ ()=>{ online(record)} }>上线</a>,
        <a
        onClick={ ()=>{
          setCurrentRow(record);
          setUpdateModalVisible(true)
        } }
        >
          编辑
        </a>,
        <a>版本历史</a>,
        <Button type="link" danger onClick={
          ()=>{
            delConfig(record);
          }
        }>
          删除
        </Button>
      ]
    },
  ];
  return (
    <PageContainer>
      <ProTable   
        headerTitle={appName}
        actionRef={actionRef}  
        rowKey="id"
        options={
          false
        }
        columns = {columns}
        search={{
          labelWidth: 'auto',
        }}
        request = { (params, sorter, filter) => queryConfigs() }
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={()=>{ setCreateModalVisible(true); }}>
            新建
          </Button>,
          <Button key="button" type="primary" hidden={selectedRowsState.length == 0}>
          上线
        </Button>,
         <Button key="button" type="primary" danger hidden={selectedRowsState.length == 0}>
         下线
       </Button>,
          <Button key="button" type="primary">
            从json文件导入
          </Button>
        ]}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      <ModalForm
        formRef={addFormRef}
        title="新建配置"
        visible={createModalVisible}
        onVisibleChange={setCreateModalVisible}
        onFinish={
          async (value) => {
            const success = await handleAdd(value as ConfigListItem);
            if (success) {
              setCreateModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
            addFormRef.current?.resetFields();
          }
        }
      >
        <ProFormText
          initialValue={appName}
          rules={[
            {
            },
          ]}
          readonly={true}
          label="应用"
          name="appName"
        />
        <ProFormText
          initialValue={appId}
          rules={[
            {
            },
          ]}
          readonly={true}
          label="appId"
          name="appId"
          hidden={true}
        />
        <ProFormText
          rules={[
            {
            },
          ]}
          label="组"
          name="group"
        />
        <ProFormText
          rules={[
            {
              required: true,
            },
          ]}
          label="键"
          name="key"
        />
        <ProFormTextArea
          rules={[
            {
              required: true,
            },
          ]}
          label="值"
          name="value"
          fieldProps={
            {
              autoSize:{
                minRows: 3, maxRows: 8
              }
            }
          }
        />
        <ProFormTextArea
          rules={[
            {
            },
          ]}
          label="描述"
          name="description"
        />
      </ModalForm>
      {
        updateModalVisible &&
        <UpdateForm
          appId={appId}
          appName={appName}
          value={currentRow}
          setValue={setCurrentRow}
          updateModalVisible={updateModalVisible}
          onCancel={
            () => {
              setCurrentRow(undefined);
              setUpdateModalVisible(false);
              console.log('set currentrow undefined');
            }
          }
          onSubmit={
            async (value) => {
              setCurrentRow(undefined);
              const success = await handleEdit(value);
              if (success) {
                setUpdateModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
              addFormRef.current?.resetFields();
            }
          }/>
      }
    </PageContainer>
  );
}
export default configs;
