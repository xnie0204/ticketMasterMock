import { useEffect, useReducer } from "react";
import userRequest from "../../hooks/user-request";

export default () => {
  const { doRequest } = userRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(()=> {
    doRequest();
  },[])
  return <div>Signing you out</div>;
};
