import React from 'react'
import helpImage from '../../assets/images/help_center.jpeg'
import './styles/helpCenter.scss'

class HelpCenter extends React.Component {

  render() {
      return <div className="helpCenter">
          <img src={helpImage}></img>
          <div className="footer-record">©2009-2019 深圳市史摩斯贸易有限公司 版权所有<br/>互联网ICP备案：粤ICP备14040574号-1  </div>
      </div>
  }
}
export default HelpCenter