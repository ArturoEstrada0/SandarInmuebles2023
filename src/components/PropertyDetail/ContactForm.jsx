/* eslint-disable react/prop-types */
import { Button, Form, Input, Select } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
const { Option } = Select
import './ContactForm.css'

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 48,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
}
const ContactForm = ({ onFinish }) => {
  const [form] = Form.useForm()

  const handleSubmit = async (values) => {
    await onFinish(values)
    form.resetFields()
  }

  const prefixSelector = (
    <Form.Item name='prefix' noStyle>
      <Select
        style={{
          width: 70,
        }}>
        <Option value='52'>+52</Option>
      </Select>
    </Form.Item>
  )

  return (
    <Form
      {...formItemLayout}
      form={form}
      name='contact-form'
      onFinish={handleSubmit}
      initialValues={{
        prefix: '52',
        intro:
          '¡Hola! Estoy interesada/o en una propiedad que vi en el sitio web de Sandar Inmuebles. ¿Podrías contactarme, por favor? ¡Muchas gracias!',
      }}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError>
      <Form.Item
        name='name'
        label='Nombre'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{
          marginBottom: '0px',
        }}
        rules={[
          {
            required: true,
            message: 'Ingresa tu nombre!',
            whitespace: true,
          },
        ]}>
        <Input
          prefix={<UserOutlined />}
          style={{ height: '40px' }}
          placeholder='Ingresa tu nombre'
        />
      </Form.Item>

      <Form.Item
        name='lastname'
        label='Apellido'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{
          marginBottom: '0px',
        }}
        rules={[
          {
            required: true,
            message: 'Ingresa tu apellido!',
            whitespace: true,
          },
        ]}>
        <Input
          prefix={<UserOutlined />}
          style={{ height: '40px' }}
          placeholder='Ingresa tu apellido'
        />
      </Form.Item>

      <Form.Item
        name='phone'
        label='Teléfono'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{
          marginBottom: '0px',
        }}
        rules={[
          {
            required: true,
            message: 'Ingresa tu número telefonico!',
          },
          {
            pattern: new RegExp(/^\d{10}$/),
            message: 'Número invalido!',
          },
        ]}>
        <Input
          addonBefore={prefixSelector}
          prefix={<PhoneOutlined />}
          style={{
            width: '100%',
          }}
          placeholder='Ingresa tu número de teléfono'
        />
      </Form.Item>

      <Form.Item
        name='email'
        label='E-mail'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{
          marginBottom: '0px',
        }}
        rules={[
          {
            type: 'email',
            message: 'El e-mail es invalido!',
          },
          {
            required: true,
            message: 'Ingresa tu e-mail!',
          },
        ]}>
        <Input
          prefix={<MailOutlined />}
          style={{ height: '40px' }}
          placeholder='Ingresa tu e-mail'
        />
      </Form.Item>

      <Form.Item
        name='intro'
        label='Mensaje'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{
          marginBottom: '0px',
        }}
        rules={[
          {
            required: false,
            message: 'Ingresa un mensaje!',
          },
        ]}>
        <Input.TextArea showCount maxLength={300} style={{ height: '110px' }} />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button
          type='primary'
          htmlType='submit'
          style={{
            marginTop: '30px',
            width: '100%',
            height: '50px',
            fontSize: '1.2rem',
          }}>
          Enviar
        </Button>
      </Form.Item>
    </Form>
  )
}
export default ContactForm
