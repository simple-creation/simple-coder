// @ts-ignore
/* eslint-disable */
import BaseModel from './BaseModel';

class DefaultModel extends BaseModel{
  constructor(props){
    super(props);
  }

  
  queryAllAsOptions= async (options)=> {
    let result =  await this.fetch_get('/queryAll', {}, options);
    console.log(result);
    let items = result.data.items;
    items.forEach((element) => {
      element.key = element.value = element.code;
      element.label= element.name;
    });
    return items;
  }


}
const bizPath = SERVICE_PATH + '/<%=data.moduleName%> ';
export default new DefaultModel({bizPath:bizPath});
