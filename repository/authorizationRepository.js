import apiFetch from "../utils/fetchWrapper";

export class AuthorizationRepository {
  baseUrl = "http://localhost:5052/auth";

  async resetPassword({ userId, password }) {
    const body = { userId, password };
    return apiFetch(this.baseUrl + "/set-password", { method: "PUT", body });
  }

  async forgotPassword({email, username}) {
    const body = {email, username};
    return apiFetch(this.baseUrl + "/forgot-password", {method: "POST", body})
  }

  async resetForgottenPassword({ userId, token, password}){
    const body = {userId, token, password};
    return apiFetch(this.baseUrl + "/reset-password", {method: "POST", body})
  }
}
