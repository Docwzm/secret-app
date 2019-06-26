import React from 'react'
import { List, InputItem, Toast, Button, ImagePicker, TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';

class WriteSecre extends React.Component {
  state = {
    disabled: true,
    files:[]
  }

  validateIdp = (rule, date, callback) => {
    if (date == 1) {
      callback(new Error('Invalid Date'));
    } else {
      callback();
    }
  }

  onChange = (files, type, index) => {
    this.setState({
      files,
    });
    console.log(files)
  }

  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        console.log(values);
        this.props.history.push(`/secret/check?phone=${values.phone}`)
      } else {
        for (let x in errors) {
          let error = errors[x];
          Toast.info(error.errors[0].message)
          return
        }
      }
    });
  }

  render() {
    let { files } = this.state
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <form className="secret-wirte-form">
        <List renderHeader={() => {
          return (
            <div>
              <p className="label">我想对您说：</p>
              <p>填写您想对TA说的话，不限字数</p>
            </div>
          )
        }}>
          <TextareaItem
            rows="3"
            {...getFieldProps('test1', {
              initialValue: this.state.test1,
              rules: [
                { required: true, message: 'Must input a test1' },
              ],
            })}
          ></TextareaItem>
        </List>

        <List className="no-bg" renderHeader={() => {
          return (
            <div>
              <p className="label">永恒一刻：</p>
              <p>选填项！上传您想分享的图片，可选择上传或不上传！</p>
            </div>
          )
        }}>
         <ImagePicker
          files={files}
          onChange={this.onChange}
          onImageClick={(index, fs) => console.log(index, fs)}
          selectable={files.length < 1}
          multiple={false}
        />
        </List>

        <List renderHeader={() => {
          return (
            <div>
              <p className="label">送卡人姓名/昵称：</p>
              <p>选填项！如果您不想让对方知道是谁，可不填！</p>
            </div>
          )
        }}>
          <InputItem
            {...getFieldProps('idp', {
              initialValue: this.state.idt,
              rules: [
                { required: true, message: 'Must select a date' },
                { validator: this.validateIdp }
              ],
            })}
          ></InputItem>

        </List>

        <List renderHeader={() => {
          return (
            <div>
              <p className="label">powerionics淘宝或京东订单编号:：</p>
              <p>可在您的淘宝京东订单内查询复制！</p>
            </div>
          )
        }}>
           <InputItem
            {...getFieldProps('test2', {
              initialValue: this.state.test2,
              rules: [
                { required: true, message: 'Must select a date' },
                { validator: this.validateIdp }
              ],
            })}
          ></InputItem>
        </List>

        <List renderHeader={() => {
          return (
            <div>
              <p className="label">手机号码：</p>
              <p>必填项！请填写收卡人的手机号，此手机号即为对方查询留言的唯一密码，请核对无误！</p>
            </div>
          )
        }}>
          <InputItem
            type="phone"
            placeholder="对方手机号码"
            {...getFieldProps('phone', {
              initialValue: this.state.phone,
              rules: [
                { required: true, message: 'Must input a phone' },
              ],
            })}
          ></InputItem>
        </List>
        
        <Button className="fixed-bottom-btn" type="primary" onClick={this.onSubmit}>提交</Button>
      </form>
    )
  }
}


export default createForm()(WriteSecre)