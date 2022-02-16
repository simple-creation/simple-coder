
import BaseModel from './BaseModel';
let bizPath = '/common-service/<%=data.moduleName%>';

const Model = new BaseModel({bizPath});

export default class DefaultModel {
  /*********************************API Section ************************************/
  static  removeBatch(params, options) {
    return  Model.fetch_post('/removeBatch', params, options);
  }
  static removeById(params, options) {
    return  Model.fetch_post('/removeById', params, options);
  }
  static  update(params, options) {
    return  Model.fetch_post('/update', params, options);
  }
  static addNew(params, options) {
    return Model.fetch_post('/addNew', params, options);
  }
  static findById(params, options) {
    return  Model.fetch_post('/findById', params, options);
  }
  static  queryAll(options) {
    return Model.fetch_get('/queryAll', {})
    .then((data)=>{
      if(data.items){
        data.items.forEach((element) => {
          element.key = element.id;
          if(!element.top){
            element.top='middle'
          }
        });
      }

      return data.items;
    });
  }
 
}
