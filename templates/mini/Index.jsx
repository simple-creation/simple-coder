
import { View, Text, Image, RadioGroup, Radio, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import "taro-ui/dist/style/components/icon.scss";
import { BasePage, ClientUser } from 'simple-framework-mini/base';
import './index.less'
import AddressModel from '../../models/AddressModel';
import { AtButton } from 'taro-ui'

export default class Index extends BasePage {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      addressList: [],
      from: '',
      selectId: ''
    };
  }

  componentDidMount() {
  }

  componentDidShow() {
    let { from = '' } = Taro.getCurrentInstance().router.params;
    this.setState({
      from
    })

    AddressModel.findUserAddressList().then(res => {
      this.setState({
        addressList: res?.data?.items || []
      })
    })
  }

  componentDidHide() { }


  goPage = (id) => {
    this.gotoPage({
      url: `/pages/modifyAddress/index?&id=${id}`
    })
  }

  confirmSelect = () => {
    const self = this;
    Taro.removeStorage({
      key: 'selectAddress',
      success: function () {
        let selectAddress = self.state.addressList.find(i => i.id === self.state.selectId)
        Taro.setStorage({
          key: "selectAddress",
          data: JSON.stringify(selectAddress),
          success: function () {
            Taro.navigateBack()
          }
        })
      }
    })
  }

  selectChange = (e) => {
    this.setState({
      selectId: +e.detail.value
    })
  }

  refresherRefresh = e => {
    console.log(222, e.detail)
    setTimeout(_ => {
      console.log('colse');
      this.setState({
        loading: true
      })
    }, 2000)
  }

  render() {
    console.log(this.state.addressList);
    return (
      <View className='address-page page' style={{ marginBottom: this.state.addressList.length > 4 ? '100px' : 0 }}>
        <ScrollView
          scrollY
          scrollAnchoring
          scrollWithAnimation
          refresherEnabled
          onRefresherRefresh={this.refresherRefresh}
          className='scroll-box'>
          <RadioGroup onChange={this.selectChange.bind(this)} >
            {
              this.state.addressList.map((item, index) => {
                const { address = '', houseNumber = '', contact = '', id, isDefault = 0, phoneNumber = '' } = item;
                return (
                  <>
                    <View className='address-item'>
                      {
                        this.state.from === 'order' ? <Radio value={item.id} /> : null
                      }
                      <View className='info'>
                        <View>
                          <View className='name-title'>
                            {
                              isDefault === 1 ? (
                                <Text className='tag'>默认</Text>
                              ) : null
                            }
                            <Text className='title'>{address}</Text>
                          </View>
                        </View>
                        <View className='detail'>{houseNumber}</View>
                        <View>
                          <Text className='contact'>{contact}</Text>
                          <Text className='contact'>{phoneNumber}</Text>
                        </View>
                      </View>
                      <View onClick={this.goPage.bind(this, id)}>
                        <Image
                          className="icon"
                          src={require("../../assets/images/edit.png")}
                        />
                      </View>
                    </View>
                    {
                      index !== this.state.addressList.length - 1 ? <View className='line'></View> : null
                    }
                  </>

                )
              })
            }
          </RadioGroup>
        </ScrollView>
        <View className='handle-container'>
          {
            this.state.from === 'order' ? <AtButton className='btn' type='primary' onClick={this.confirmSelect.bind(this)} disabled={!this.state.selectId}>
              确认选择
            </AtButton> : <AtButton className='btn' type='primary' onClick={this.goPage.bind(this, -1)}>
              添加新地址
            </AtButton>
          }
        </View>
      </View>
    )
  }
}
