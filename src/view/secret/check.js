import React from 'react'
import { InputItem, Toast, Button } from 'antd-mobile';
import { createForm } from 'rc-form';

class CheckSecre extends React.Component {
  state = {
    check_status:'off'
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
          check_status === 'off' ? <form className="secret-check-form">
                  <InputItem
                      type="phone"
                      placeholder="input your phone"
                      {...getFieldProps('phone', {
                        initialValue: this.state.phone,
                        rules: [
                          { required: true, message: 'Must input a phone' },
                        ],
                      })}
                    >手机号码</InputItem>
                  <Button className="fixed-bottom-btn" type="primary" onClick={this.onSubmit}>提交</Button>
          </form>:<div className="result">
                      result
          </div>
        }
      </div>
    )
  }
}


export default createForm()(CheckSecre)