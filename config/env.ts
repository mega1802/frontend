const LOCAL_BASE_URL = "http://192.168.0.144:3000"; 


enum ENVS {
  local
}

let env: ENVS = ENVS.local;

const getBaseURL = (iENV: ENVS) => {

  if (iENV === ENVS.local) {
    return LOCAL_BASE_URL;
  }
  
  throw new Error(`Unknown environment: ${iENV}`);
};

export const BASE_URL = getBaseURL(env);
