import React from 'react'
import { InputItem, Toast, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { queryUrlParam } from '@/utils/util'

class CheckSecre extends React.Component {
  state = {
    check_status:'off'
  }

  componentWillMount() {
    let phone = queryUrlParam(this.props.history.location.search,'phone')
    if(phone){
      this.getInfo()
    }
  }


  getInfo() {
    this.setState({
      check_status: 'on'
    })
  }

  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (errors,values) => {
      if (!errors) {
        console.log(values);
        this.setState({
          check_status:'on'
        })
      } else {
        for(let x in errors){
          let error = errors[x];
          Toast.info(error.errors[0].message)
          return
        }
      }
    });
  }

  render() {
    let { check_status } = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div className="secret-check-wrap">
        {
          check_status === 'off' ? <div className="secret-check-form-wrap">
            <div className="tip">
              <p>您的朋友随礼物还给您留了一段私言密语，您的手机号是查询留言的密码！</p>
              <p>请输入您的手机号码查看TA为您留下的私言密语......</p>
            </div>
            <form className="secret-check-form">
                  <InputItem
                      type="phone"
                      {...getFieldProps('phone', {
                        initialValue: this.state.phone,
                        rules: [
                          { required: true, message: '请输入手机号码' },
                        ],
                      })}
                    >手机号码：</InputItem>
                  <Button size="small" type="primary" onClick={this.onSubmit}>查询</Button>
          </form>
          </div>:<div className="result">
              <div className="item">
                <p className="label">我想对您说：</p>
                <p className="content light">我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是我是</p>
              </div>
              <div className="item">
                <p className="label">永恒一刻：</p>
                <p className="content">
                  <img src="" />
                </p>
              </div>
              <div className="item">
                <p className="label">送卡人姓名/昵称：</p>
                <p className="content">fafafafa</p>
              </div>
              <div className="item">
                <p className="label">提交时间：</p>
                <p className="content">2019-06-20 14:03:38</p>
              </div>
          </div>
        }
      </div>
    )
  }
}


export default createForm()(CheckSecre)