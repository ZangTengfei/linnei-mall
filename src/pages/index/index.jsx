import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Navigator, Swiper, SwiperItem, Image, ScrollView, Block } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { AtIcon, AtTag } from 'taro-ui';
import { get as getGlobalData} from '../../global_data';
import { couponReceive } from '../../services/coupon';

import './index.less'

@connect(({ home, goods }) => ({
  data: home.data,
  goodsCount: goods.goodsCount,
}))
class Index extends PureComponent {

  config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true,
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({type: 'home/getIndex'})
    dispatch({type: 'goods/getGoodsCount'})
  }

  onPullDownRefresh() {
    Taro.showNavigationBarLoading() //在标题栏中显示加载
    this.getData();
    Taro.hideNavigationBarLoading() //完成停止加载
    Taro.stopPullDownRefresh() //停止下拉刷新
  }

  componentWillMount() {
    // 页面初始化 options为页面跳转所带来的参数
    let {scene, grouponId, goodId, orderId} =  this.$router.params;
    if (scene) {
      //这个scene的值存在则证明首页的开启来源于朋友圈分享的图,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      scene = decodeURIComponent(scene);
      console.log("scene:" + scene);

      let info_arr = [];
      info_arr = scene.split(',');
      let _type = info_arr[0];
      let id = info_arr[1];

      if (_type == 'goods') {
        Taro.navigateTo({
          url: '../goods/goods?id=' + id
        });
      } else if (_type == 'groupon') {
        Taro.navigateTo({
          url: '../goods/goods?grouponId=' + id
        });
      } else {
        Taro.navigateTo({
          url: '../index/index'
        });
      }
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (grouponId) {
      //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: '../goods/goods?grouponId=' + grouponId
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (goodId) {
      //这个goodId的值存在则证明首页的开启来源于分享,同时可以通过获取到的goodId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: '../goods/goods?id=' + goodId
      });
    }

    // 页面初始化 options为页面跳转所带来的参数
    if (orderId) {
      //这个orderId的值存在则证明首页的开启来源于订单模版通知,同时可以通过获取到的pageId的值跳转导航到对应的详情页
      Taro.navigateTo({
        url: '../ucenter/orderDetail/orderDetail?id=' + orderId
      });
    }

    this.getData();

  }

  onShareAppMessage () {
    return {
      title: 'Taro mall小程序商场',
      desc: 'Taro 开源微信小程序商城',
      path: '/pages/index/index'
    }
  }

  getCoupon = (e) => {
    if (!getGlobalData('hasLogin')) {
      Taro.navigateTo({
        url: "/pages/auth/login/login"
      });
    }

    let couponId = e.currentTarget.dataset.index;
    couponReceive({
      couponId: couponId
    }).then(() => {
      Taro.showToast({
        title: "领取成功"
      })
    })
  }

  render () {
    const {goodsCount, data} = this.props;
    return (
      <View className='container'>
        <View className='search'>
          <Navigator url='/pages/search/search' className='input'>
            <AtIcon className='icon' size='18' color='#C7C7C7' value='search' />
            <Text className='txt'>搜索您想要的商品</Text>
          </Navigator>
        </View>
        <View className='banner-wrap'>
          <Swiper className='banner' indicatorDots autoplay interval='3000' duration='100'>
            {
              data.banner && data.banner.map(item => {
                return <SwiperItem key={item.id}>
                  {
                    item.link > 0 ? <Navigator url={`/pages/goods/goods?id=${item.link}`}>
                      <Image className='img' src={item.url} />
                    </Navigator> : <Image className='img' src={item.url} />
                  }
                </SwiperItem>
              })
            }
          </Swiper>
        </View>

        <View className='notice'>
          <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E5%85%AC%E5%91%8Aicon%402x.png?sign=aa6d02932a45e6a9378b7f76a4f26cd7&t=1586425345'></Image>
          <Text className='txt'>新用户下单就送大额优惠券啦～</Text>
        </View>

        <View className='menu section'>
          <View className='wrap'>
            <View className='title'>
              <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E6%A6%9C%E5%8D%95icon%402x.png?sign=2dfa797bbb96712c16c78509a11e6397&t=1586426164'></Image>
              <Text className='txt'>权威榜单</Text>
            </View>
            <View className='list'>
              <View className='item'>
                <View className='img-w'>
                  <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E7%87%83%E6%B0%94%E7%81%B6icon%402x.png?sign=b3e0e84ae1d863f25a7e8c39ca1beea3&t=1586426998'></Image>
                </View>
                <Text className='txt'>燃气灶</Text>
              </View>
              <View className='item'>
                <View className='img-w'>
                  <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E7%83%AD%E6%B0%B4%E5%99%A8icon%402x.png?sign=68d733af5199edaa77a04c5f22236b55&t=1586427417'></Image>
                </View>
                <Text className='txt'>燃气热水器</Text>
              </View>
              <View className='item'>
                <View className='img-w'>
                  <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E9%87%87%E6%9A%96%E7%A9%BA%E8%B0%83icon%402x.png?sign=8b0d31a336da2febae65c884f056f12a&t=1586427435'></Image>
                </View>
                <Text className='txt'>采暖系统</Text>
              </View>
            </View>
          </View>
        </View>

        <View className='menu section'>
          <View className='wrap'>
            <View className='title'>
              <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E6%A6%9C%E5%8D%95icon%402x.png?sign=2dfa797bbb96712c16c78509a11e6397&t=1586426164'></Image>
              <Text className='txt'>品牌精选</Text>
            </View>
            <View className='list'>
              <View className='item'>
                <View className='img-w'>
                  <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E7%87%83%E6%B0%94%E7%81%B6icon%402x.png?sign=b3e0e84ae1d863f25a7e8c39ca1beea3&t=1586426998'></Image>
                </View>
                <Text className='txt'>林内</Text>
              </View>
              <View className='item'>
                <View className='img-w'>
                  <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E7%83%AD%E6%B0%B4%E5%99%A8icon%402x.png?sign=68d733af5199edaa77a04c5f22236b55&t=1586427417'></Image>
                </View>
                <Text className='txt'>林内</Text>
              </View>
              <View className='item'>
                <View className='img-w'>
                  <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E9%87%87%E6%9A%96%E7%A9%BA%E8%B0%83icon%402x.png?sign=8b0d31a336da2febae65c884f056f12a&t=1586427435'></Image>
                </View>
                <Text className='txt'>林内</Text>
              </View>
              <View className='item'>
                <View className='img-w'>
                  <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E7%87%83%E6%B0%94%E7%81%B6icon%402x.png?sign=b3e0e84ae1d863f25a7e8c39ca1beea3&t=1586426998'></Image>
                </View>
                <Text className='txt'>林内</Text>
              </View>
              <View className='item'>
                <View className='img-w'>
                  <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E7%83%AD%E6%B0%B4%E5%99%A8icon%402x.png?sign=68d733af5199edaa77a04c5f22236b55&t=1586427417'></Image>
                </View>
                <Text className='txt'>林内</Text>
              </View>
              <View className='item'>
                <View className='img-w'>
                  <Image className='img' src='https://7a74-ztf-iaokv-1254271997.tcb.qcloud.la/%E9%87%87%E6%9A%96%E7%A9%BA%E8%B0%83icon%402x.png?sign=8b0d31a336da2febae65c884f056f12a&t=1586427435'></Image>
                </View>
                <Text className='txt'>林内</Text>
              </View>
            </View>
          </View>
        </View>

      </View>
    )
  }
}

export default Index
