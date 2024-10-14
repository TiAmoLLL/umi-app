import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
// import request from '@/utils/request';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  // console.log('hello world')
  const init = () => {
    // let url = `/api/homePage/details`
    // const { data } = request(url, {
    //   method: 'POST', // 指定请求方法为 POST
    //   // data: params
    // })
    console.log('this is home');
  };
  init();
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
