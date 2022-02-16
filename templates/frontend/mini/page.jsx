
import { View } from '@tarojs/components'

import "taro-ui/dist/style/components/button.scss" // 按需引入
import "taro-ui/dist/style/components/icon.scss";

<% for (var i=0;i<data.blocks.length;i++) {
  var name = data.blocks[i].name;
  var componentImport = data.blocks[i].componentImportPath;
  var styleImport = data.blocks[i].styleImportPath;%>
  <%-componentImport %>
  <%-styleImport %>
<%}%>

import {BasePage} from "simple-framework-mini/base";


export default class Index extends BasePage {


  constructor(props){

    super(props);

    this.pageId = "PID-Preview-Page";
    this.pageName ="预览页"
    this.state ={
  <% for(var i=0;i<data.blocks.length;i++) {
        var dataName = data.blocks[i].dataName%>
    <%=dataName%>:{},
  <%}%>
    }
  
  }

  componentDidMount() {
    let that = this;
    super.componentDidMount();

  }

  componentWillUnmount() { }

  componentDidShow() {
    super.componentDidShow();
   }

  componentDidHide() { }

  render() {
    let that = this;
    return (
      <View >
<% for(var i=0;i<data.blocks.length;i++) {
  var name = data.blocks[i].name;
  var dataName = data.blocks[i].dataName%>
      <<%=name%>  data={that.state.<%=dataName%>}/>
<%}%>
      </View>

    )
  }
}
