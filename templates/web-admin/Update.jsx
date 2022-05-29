import React, { useRef, useState } from 'react';
import { Modal, Form, Divider, message } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';

import { useIntl, FormattedMessage } from 'umi';
import MediaImageSelect from '@/components/MediaStoreSelect';

const UpdateForm = (props) => {
  const intl = useIntl();
  const originImage = props.values.logo;
  //const originImage = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
  const [imageUrl, setImageUrl] = useState(originImage);

  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{
              padding: '32px 40px 48px',
            }}
            destroyOnClose
            title={intl.formatMessage({
              id: 'pages.table.update',
              defaultMessage: '配置修改',
            })}
            visible={props.updateModalVisible}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={(values) => {
        values.logo = imageUrl;
        console.log(values);
        props.onSubmit(values);
        message.success('提交成功');
      }}
    >
      <StepsForm.StepForm
        request={async () => ({
          id: props.values.id,
          name: props.values.name,
          logo: props.values.logo,
          description: props.values.description,
        })}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.basicConfig',
          defaultMessage: '基本信息',
        })}
      >
        <div>
          <Form.Item name="id" noStyle="true" />
          <ProFormText
            label="名称"
            width="md"
            name="name"
            required={false}
            rules={[
              {
                required: true,
                message: '需要一个标题',
              },
            ]}
          />
          <ProFormTextArea label="描述说明" width="md" name="description" required={false} />

          <Divider
            style={{
              margin: '24px 0',
            }}
          />

          <MediaImageSelect
            bizType="engineerlevel"
            originFile={originImage}
            onResult={(response) => setImageUrl(response)}
          />
        </div>
      </StepsForm.StepForm>

      <StepsForm.StepForm
        request={async () => ({
          categoryId: props.values.categoryId,
          sideType: props.values.sideType,
        })}
        title={intl.formatMessage({
          id: 'pages.permissionTable.titleConfigDetail',
          defaultMessage: '分类管理',
        })}
      >

        <ProFormSelect
          label="基本类别"
          width="md"
          name="sideType"
          valueEnum={{
            "wechat": '微信应用',
            "mobile": '移动端',
            "web": 'Web/H5站点',
            "server": '后端服务'
          }}
        />

      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
