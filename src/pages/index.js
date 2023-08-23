import { useContext} from 'react';
import Auth from '../components/Auth';
import Feed from '../components/Feed';
 import { GlobalContext } from '../state/context/GlobalContext'; 

const HomePage = () => {
  <head>   <title>Mi Página | Next.js</title></head>
   const { isAuthenticated,isOnboarded} = useContext(GlobalContext); 

  return  isAuthenticated && isOnboarded ?  <Feed/>  : <Auth />; 
};

export default HomePage;
