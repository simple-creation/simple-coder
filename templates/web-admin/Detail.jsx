import { PageContainer } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import { Button, Badge, message, Card, Descriptions, Divider, Dropdown, Menu } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import Model from '@/models/<%=data.moduleClassName%>Model';


const ButtonGroup = Button.Group;

const handleUpdate = async (fields) => {
  const hide = message.loading('Configuring');

  try {
    await Model.update({
      ...fields,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};
const handleRemoveRow = async (index) => {
  const hide = message.loading('正在删除');
  if (!index) return true;

  try {
    // await ApplicationModel.removeById({
    //   id: index,
    // });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};


const Basic = (props) => {

  if(!props.location.query.id){
    console.log('current detailId==> -1')
    message.error('有效参数为空，无法获取有效数据!');
    return (<></>);
  }
  const detailId = props.location.query.id;
  console.log('current detailId==>', detailId)
  const actionRef = useRef();
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState();

  const [dataSource, setDataSource] = useState({});
  const getApplicationById = (deviceId) => {
    Model.findById({ id: deviceId }).then((response) => setDataSource(response.data));
  }

  useEffect(() => {
    getApplicationById(props.location.query.id);
  }, {});

  console.log("current data--->", dataSource);
  return (
    <PageContainer
      actionRef={actionRef}

      extra={(<Button
        type="primary"
        onClick={() => {
          let configPath = "/demo/home";
          history.push({ pathname: configPath });
        }}
      >返回</Button>)}
    >
      <Card >
        <Card>
          <Descriptions
            title="基本信息"
          >

            <Descriptions.Item label="编号">{dataSource.id}</Descriptions.Item>
            <Descriptions.Item label="名称">{dataSource.name}</Descriptions.Item>
            <Descriptions.Item label="描述">{dataSource.description}</Descriptions.Item>


          </Descriptions>

        </Card>
        <Divider
          style={{
            marginBottom: 32,
          }}
        />

        <Card>
          <Descriptions title="业务信息" >
            <Descriptions.Item label="业务信息">{dataSource.description}</Descriptions.Item>

          </Descriptions>

        </Card>
        <Divider
            style={{
              marginBottom: 32,
            }}
          />
          <Card title="状态信息">
          <Descriptions title="时间与状态" >
            <Descriptions.Item label="当前状态">当前状态</Descriptions.Item>
            <Descriptions.Item label="创建时间">{dataSource.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{dataSource.updateTime}</Descriptions.Item>
          </Descriptions>
          <Divider
            style={{
              marginBottom: 32,
            }}
          />

        </Card>
      </Card>
      <Card>

        <Button
          type="primary"
          onClick={() => {
            let configPath = "/demo/home";
            history.push({ pathname: configPath });
          }}
        >返回</Button>


      </Card>
    </PageContainer>
  );
};

export default Basic;
