import { useIntl } from "@/.umi/plugin-locale/localeExports";
import {  ModalForm,  ProFormSelect,  ProFormText } from "@ant-design/pro-form";
import React from 'react';
import { UserItem } from "../data";
export type UpdateUserProps = {
    onSubmit: (values: UserItem) => Promise<void>;
    onCancel: () => void;
    updateModalVisible: boolean;
    value: UserItem | undefined ;
    setValue: React.Dispatch<React.SetStateAction<UserItem | undefined>>
  };
const UpdateForm : React.FC<UpdateUserProps> = (props)=>{
    const intl = useIntl();

    return (
    <ModalForm 
    width="400px"
    title="编辑用户"
    initialValues={props.value}
    visible={props.updateModalVisible}
    modalProps={
      {
        onCancel: ()=>{
          props.onCancel();
        }
      }
    }
     onFinish={
       props.onSubmit
    }
    >
    <ProFormText
          label= "id"
          name="id" 
          hidden={true}
          readonly={true}
        />
   <ProFormText
          label= "用户名"
          name="userName" 
          readonly={true}
        />
 
       <ProFormText
          label= "团队"
          name="team" 
        />
    <ProFormSelect
        rules={[
          {
            required: true,
          },
        ]}
        label="角色"
        name="userRoles"
        mode="multiple" 
        options = {[
          {
            value: 1,
            label: '管理员',
          },
          {
            value: 2,
            label: '普通用户',
          }
        ]}
      >
        </ProFormSelect> 
    </ModalForm>
    );
}

export default UpdateForm;
