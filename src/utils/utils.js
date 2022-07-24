import jwt_decode from "jwt-decode";

export const jwtdecoder = (token) => {
  console.log(jwt_decode(token));
  return jwt_decode(token);
};
