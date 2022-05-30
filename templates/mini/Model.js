// @ts-ignore
/* eslint-disable */
import BaseModel from './BaseModel';

class DefaultModel extends BaseModel{
  constructor(props){
    super(props);
  }

  queryAll = (options) =>{
    let result =  await this.fetch_get('/queryAll', {}, options).then(
      console.log(result);
      let items = result.data.items;
      items.forEach((element) => {
        element.key = element.id;
        if (!element.description){
          element.description = element.subTitle;
        }
        if(element.applicationType){
           element.applicationTypeName = element.applicationType.name;
        }
      });
      return { data: result.data.items };

  }
}
//const bizPath = '/release-service/application';
const bizPath =  config.servicePath + '/<%=data.moduleName%>';
export default new DefaultModel({bizPath:bizPath});

