import React, { useRef, useState } from 'react';
import { Modal, message, Divider, Alert } from 'antd';

import ProForm, {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-form';



import MediaImageSelect from '@/components/MediaStoreSelect';
import { useIntl, FormattedMessage } from 'umi';

const AddNewForm = (props) => {
  const intl = useIntl();
  const [imageUrl, setImageUrl] = useState('');

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
        values.logo = imageUrl;
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

          {/* <UploadImage onResult={(response)=>setImageUrl(response)} /> */}
          <MediaImageSelect
            bizType="engineerlevel"
            onResult={(response) => setImageUrl(response)}
          />
        </div>
      </StepsForm.StepForm>

      <StepsForm.StepForm title="完成">
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

export default AddNewForm;
