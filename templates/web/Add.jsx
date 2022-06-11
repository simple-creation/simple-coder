import React, { useRef, useState } from 'react';
import { Modal, message, Divider, Alert } from 'antd';

import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-form';
import { useIntl} from 'umi';

import ReactWEditor from '@/components/RichTextEditor';

import MediaImageSelect from '@/components/MediaStoreSelect';
import TypeModel from '@/models/DictionaryModel';


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
          label="分类"
          width="md"
          name="type"
          request={ async()=>{return TypeModel.queryByTypeAsOptions("iot-solution");}}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default AddNewForm;
