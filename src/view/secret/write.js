import React from 'react'
import { List, InputItem, Toast, Button, DatePicker } from 'antd-mobile';
import { createForm } from 'rc-form';

class WriteSecre extends React.Component {
  state = {
    disabled:true
  }

  validateIdp = (rule, date, callback) => {
    if (date==1) {
      callback(new Error('Invalid Date'));
    } else {
      callback();
    }
  }
  
  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (errors,values) => {
      if (!errors) {
        console.log(values);
        this.props.history.push(`/secret/check?phone=${values.phone}`)
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
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <form className="secret-wirte-form">
      <List>
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

        <InputItem
          placeholder="must be the format of YYYY-MM-DD"
          {...getFieldProps('idp', {
            initialValue: this.state.idt,
            rules: [
              { required: true, message: 'Must select a date' },
              { validator: this.validateIdp }
            ],
          })}
        >Input date</InputItem>

        <DatePicker
          {...getFieldProps('dp', {
            initialValue: this.state.dpValue
          })}
        >
          <List.Item arrow="horizontal">Date</List.Item>
        </DatePicker>
      </List>
      <Button className="fixed-bottom-btn" type="primary" onClick={this.onSubmit}>提交</Button>
    </form>
    )
  }
}


export default createForm()(WriteSecre)