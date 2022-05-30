

import { Image, RichText, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { BasePage } from 'simple-framework-mini/base';
import * as RichTextHelper from 'simple-framework-mini/utils';
import { AtTabs, AtTabsPane } from 'taro-ui';
import "taro-ui/dist/style/components/message.scss";
import "taro-ui/dist/style/components/tabs.scss";
import BrandModel from '../../models/BrandModel';
import ServiceDetailModel from '../../models/ServiceDetailModel';
import textUtil from '../../util/textUtil';

import './detail.less';



/**
 * 服务详情页
 * 底部可加购物车，加入购物车，去下单
 * 下单跳转至订单新增页面
 */
export default class Index extends BasePage {

    config = {
        navigationBarTitleText: '服务详情'
    }

    constructor(props) {
        super(props)
        this.pageName = "服务详情页";
    }

    componentDidMount() {
        super.componentDidMount();
        let that = this;
        let params = Taro.getCurrentInstance().router.params;

        BrandModel.findById(params.serviceId).then((response) => {
            // Taro.atMessage({
            //     message: '查询详情失败',
            //     type: "warning",
            // })
            if (response && response.data) {
                that.setState({ service: response.data });
            } else {
                // Taro.atMessage({
                //     message: '查询详情失败',
                //     type: "warning",
                // })
            }
        })
        ServiceDetailModel.deviceList(params.serviceId).then((response) => {
            if (response && response.data && response.data.items) {
                that.setState({ deviceList: response.data.items })
            } else { }
        })
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    state = {
        service: {
            name: '~',
            image: '',
            price: 0,
            stock: '',
            content: '详情信息～',
            parameter: '参数～',
            service: '服务～',
        },
        deviceList: [],
        curIndex: 0,
    }
    onSwitchTab = (tabIndex) => {
        this.setState({ curIndex: tabIndex });
    }

    renderTabContent = (current, tabIndex, richContent) =>
        <AtTabsPane current={current} index={tabIndex} >
            <View className='goods-content'>
                <RichText nodes={RichTextHelper.convertRichTextImage(richContent)} />
            </View>
        </AtTabsPane>

    render() {
        let that = this;
        let service = this.state.service;
        let deviceList = this.state.deviceList;
        let defaultImage = "http://images.koudaibook.com/windwithlife/cb83307978654e4a865e3c21866a3716.jpeg"
        let displayImage = textUtil.isNotEmpty(service.image) ? service.image : (textUtil.isNotEmpty(service.logo) ? service.logo : defaultImage)
        let showTab = service.content || service.parameter || service.service
        return (
            <View className="goods-root-container">
                <View className="goods-info-container">
                    <View className="goods-image-box">
                        <Image src={displayImage} className="goods-thumb"></Image>
                    </View>
                    <View className="goods-info">
                        <Text className="goods-name">{service.name}</Text>
                        {service.price && <View className="goods-price">￥{service.price ?? 1}</View>}
                        {showTab && <Text className="goods-description">{service.description}</Text>}
                    </View>

                    {
                        showTab === true ?
                            <AtTabs
                                current={this.state.curIndex}
                                onClick={that.onSwitchTab.bind(this)}
                                tabList={[{ title: '服务详情' }, { title: '产品参数' }, { title: '售后保障' },]}
                            >
                                {service.content &&
                                    this.renderTabContent(this.state.curIndex, 0, service.content)
                                }
                                {service.content &&
                                    this.renderTabContent(this.state.curIndex, 1, service.parameter)
                                }
                                {service.service &&
                                    this.renderTabContent(this.state.curIndex, 2, service.service)
                                }
                            </AtTabs> :
                            <View className="goods-content">
                                {service.description}
                                {deviceList && deviceList.length > 0 &&
                                    <View className='device-list'>
                                        支持设备列表：
                                        {deviceList.map((deviceItem) => {
                                            return <View className='device-item'>
                                                {deviceItem.name}
                                            </View>
                                        })
                                        }
                                    </View>
                                }
                            </View>
                    }
                </View>

           
                <View className='bottom-space' />
            </View>

        )
    }
}
