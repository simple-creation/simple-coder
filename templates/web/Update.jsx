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
import ReactWEditor from '@/components/RichTextEditor';

const UpdateForm = (props) => {
  const intl = useIntl();
  let originImage = props.values.image;
  let defaultContent = props.values.content;
  //const originImage = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
  const [imageUrl, setImageUrl] = useState(originImage);
  const [contentText, setContentText] = useState(defaultContent);

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
        values.image = imageUrl;
        values.contentText = contentText;
        props.onSubmit(values);
        message.success('提交成功');
      }}
    >
      <StepsForm.StepForm
        request={async () => ({
          id: props.values.id,
          name: props.values.name,
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
        </div>
      </StepsForm.StepForm>
      <StepsForm.StepForm
        request={async () => ({
          bizInfo: props.values.bizInfo,
          bizInfo2: props.values.bizInfo2,
        })}
        title="业务信息">
         <div>
          <ProFormText
            label="业务信息"
            width="md"
            name="bizInfo"
          />
          <ProFormText
            label="业务信息2"
            width="md"
            name="bizInfo2"
          />

        </div>
      </StepsForm.StepForm>
      <StepsForm.StepForm title="图片设置">
        <MediaImageSelect
          originFile={originImage}
          bizType="news"
          onResult={(response) => setImageUrl(response)}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        request={async () => ({
          content: props.values.content,
        })}
        title={intl.formatMessage({
          id: 'pages.crud.titleDetail',
          defaultMessage: '详情',
        })}
      >
        <ReactWEditor
          defaultValue={defaultContent}
          onChange={(html) => {
            setContentText(html);
          }}
        />
      </StepsForm.StepForm>

      <StepsForm.StepForm
        request={async () => ({
          type: props.values.type,
        })}
        title={intl.formatMessage({
          id: 'pages.permissionTable.titleConfigDetail',
          defaultMessage: '分类',
        })}
      >

        <ProFormSelect
          label="分类"
          width="md"
          name="type"
          request={async () => { return TypeModel.queryByTypeAsOptions("iot-solution"); }}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
