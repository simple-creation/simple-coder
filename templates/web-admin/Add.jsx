import React, { useRef, useState } from 'react';
import { Modal, message, Divider, Alert } from 'antd';

import ProForm, {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-form';

import ReactWEditor from '@/components/RichTextEditor';

import MediaImageSelect from '@/components/MediaStoreSelect';
import { useIntl, FormattedMessage } from 'umi';

const AddNewForm = (props) => {
  const intl = useIntl();
  const [imageUrl, setImageUrl] = useState('');
  const [contentText, setContentText] = useState("");

  return (
    <StepsForm
      stepsProps={{
        size: 'large',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={1024}
            bodyStyle={{
              padding: '32px 40px 48px',
            }}
            destroyOnClose
            title={intl.formatMessage({
              id: 'pages.table.addNew',
              defaultMessage: '新增',
            })}
            visible={props.createModalVisible}
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
        console.log(values);
        values.image = imageUrl;
        values.content = contentText;
        props.onSubmit(values);
        message.success('提交成功');
      }}
    >
      <StepsForm.StepForm title="基本信息">
        <div>
          <ProFormText
            label="名称"
            width="md"
            name="name"
            required={false}
            rules={[
              {
                required: true,
                message: '需要一个名称',
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
      <StepsForm.StepForm title="业务信息">
        <div>
          <ProFormText
            label="ProductID"
            width="md"
            name="productId"
            rules={[
              {
                required: true,
                message: '需要一个产品ID',
              },
            ]}
          />
          <ProFormText
            label="MasterKey"
            width="md"
            name="masterKey"
          />

          <ProFormText
            label="AppKey"
            width="md"
            name="appKey"
          />
          <ProFormText
            label="AppSecret"
            width="md"
            name="appSecret"
          />
          <Divider
            style={{
              margin: '24px 0',
            }}
          />


        </div>
      </StepsForm.StepForm>

      <StepsForm.StepForm title="图片设置">
        <MediaImageSelect
          bizType="news"
          onResult={(response) => setImageUrl(response)}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        title="详情信息">

        <ReactWEditor
          defaultValue={'标题'}
          onChange={(html) => {
            setContentText(html);
          }}
        />

      </StepsForm.StepForm>

      <StepsForm.StepForm title="完成">
        <ProFormSelect
          label="平台通道类别"
          width="md"
          name="channel"
          initialValue="telecom"
          valueEnum={{
            "mobile": '移动IOT平台',
            "telecom": '电信IOT平台',
            "unicom": '联通IOT平台'
          }}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default AddNewForm;
