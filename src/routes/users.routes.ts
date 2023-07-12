import { Router } from 'express';
import {
  verifyEmailController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordTokenController,
  resetPasswordController,
  meController,
  updateMeController,
  getProfileController,
  followController
} from '~/controllers/users.controllers';
import { filterMiddleware } from '~/middlewares/common.middlewares';
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator,
  followValidator
} from '~/middlewares/users.middlewares';
import { UpdateMeReqBody } from '~/models/requests/User.requests';
import { wrapRequestHandler } from '~/utils/handlers';

const userRouter = Router();

/**
 * Description: Login a user
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */

userRouter.post('/login', loginValidator, wrapRequestHandler(loginController));

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
userRouter.post('/register', registerValidator, wrapRequestHandler(registerController));

/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body:{ refresh_token: string }
 */

userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController));

/**
 * Description: Refresh token
 * Path: /refresh-token
 * Method: POST
 * Body:{ refresh_token: string }
 */

userRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController));

/**
 * Description: Verify email when user click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body:{ email_verify_token: string }
 */

userRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController));

/**
 * Description: Resend verify email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */

userRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController));

/**
 * Description: Submit email for reset password
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */

userRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController));

/**
 * Description: Verify forgot password token to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Body:{ forgot_password_token: string }
 */

userRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
);

/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Body:{ forgot_password_token: string, password: string, confirm_password: string }
 */

userRouter.post(
  '/reset-password',
  verifyForgotPasswordTokenValidator,
  resetPasswordValidator,
  wrapRequestHandler(resetPasswordController)
);

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */

userRouter.get('/me', accessTokenValidator, wrapRequestHandler(meController));

/**
 * Description: Update my profile
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: { UserSchema }
 */

userRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
);

/**
 * Description: Get user profile
 * Path: /:username
 * Method: GET
 */

userRouter.get('/:username', wrapRequestHandler(getProfileController));

/**
 * Description: Follow someone
 * Path: /follow
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { followed_user_id: string }
 */

userRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
);

export default userRouter;
