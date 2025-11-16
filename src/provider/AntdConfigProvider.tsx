import { ConfigProvider } from 'antd';

export default function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#554970',
        },
        components: {
          Button: {
            borderRadius: 6,
            colorPrimaryText: '#FFF',
            colorText: '#0A0A0A',
            primaryShadow: 'none',
            defaultBorderColor: '#9E9E9E',
          },
          Input: {
            colorBorder: '#9E9E9E',
            colorTextPlaceholder: '#9E9E9E',
          },
          InputNumber: {
            colorBorder: '#9E9E9E',
          },
          Select: {
            colorBorder: '#9E9E9E',
          },
          DatePicker: {
            colorBorder: '#9E9E9E',
          },
        },
      }}>
      {children}
    </ConfigProvider>
  );
}
