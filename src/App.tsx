import { notification } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';
import { createContext } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import AntdConfigProvider from './provider/AntdConfigProvider';
import ReactQueryProvider from './provider/ReactQueryProvider';

const ToastContext = createContext<NotificationInstance | null>(null);

function App() {
  const [messageApi, contextHolder] = notification.useNotification();
  return (
    <ReactQueryProvider>
      <AntdConfigProvider>
        <div className='!font-ventidole-montserrat overflow-x-hidden'>
          {contextHolder}
          <ToastContext.Provider value={messageApi}>
            <RouterProvider router={router} />
          </ToastContext.Provider>
        </div>
      </AntdConfigProvider>
    </ReactQueryProvider>
  );
}

export default App;
