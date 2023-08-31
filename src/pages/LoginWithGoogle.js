import {LoginSocialGoogle} from "reactjs-social-login";
import {GoogleLoginButton} from "react-social-login-buttons";

export default function LoginWithGoogle() {return (
            <>
            <div>
                <LoginSocialGoogle client_id={
                    "420362997504-21gqqs491gttfqp41skjbfe2776dq15t.apps.googleusercontent.com"
                }
                    scope="openid profile email"
                    discoveryDocs="claims_supported"
                    access_type="offline"
                                   onReject={({provide, data}) => {
                                       console.log(provide, data)
                                   }}
                                   onResolve={(err) => {
                                       console.log(err)
                                   }}>
                    <GoogleLoginButton/>
                </LoginSocialGoogle>
            </div>
            </>
    )
}
