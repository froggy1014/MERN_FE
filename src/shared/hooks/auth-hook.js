import {useState, useEffect, useCallback} from 'react'

let logoutTimer ;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalContents, setModalContents] = useState(null) 


  
  const login = useCallback((uid, access_token, expirationDate) => {
    setToken(access_token);
    setUserId(uid)
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem('userData', JSON.stringify({userId: uid, accessToken: access_token, expiration: tokenExpirationDate.toISOString()}));
  }, [])
  
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null)
    localStorage.removeItem('userData');
  }, [])
  
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.accessToken && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.accessToken, new Date(storedData.expiration));
    }
  }, [login])

  useEffect(() => {
    if(token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpirationDate])

  return { token, login, logout, userId};

}