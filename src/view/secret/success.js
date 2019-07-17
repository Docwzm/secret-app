import React from 'react'
import { Result, Icon } from 'antd-mobile';
import qrcode from '../../assets/images/qrcode.jpg'
import './styles/success.scss'

class Success extends React.Component {
  render() {
    return <div className="success-wrap">

      <Result
        img={<Icon type="check-circle" className="spe" style={{ fill: '#d2b78c' }} />}
        title="提交成功"
        message=""
      />
      <div className="warn-tip">
        亲，若您忘记在天猫或京东订单备注“私言密语”，请务必及时用旺旺或叮咚联系在线客服备注！
      </div>

      
      <div className="qr-wrap">
        <p className="tip">长按识别图点二维码关注公众号</p>
        <img className="qr-code" src={qrcode}></img>
        <p className="name">powerionics旗舰店，更多精彩活动等着您！</p>
      </div>

      
    </div>
  }
}
export default Success