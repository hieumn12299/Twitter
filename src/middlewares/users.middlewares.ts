import { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';
import usersService from '~/services/users.services';
import { validate } from '~/utils/validation';

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password'
    });
  }
  next();
};

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: { errorMessage: 'This field cannot be left blank.' },
      isLength: {
        errorMessage: 'This field must be between 1 and 100 characters long.',
        options: {
          min: 1,
          max: 100
        }
      },
      trim: true
    },
    email: {
      notEmpty: { errorMessage: 'This field cannot be left blank.' },
      isEmail: { errorMessage: 'This field must be a valid email address.' },
      trim: true,
      custom: {
        options: async (value) => {
          const isExistEmail = await usersService.checkEmailExist(value);
          if (isExistEmail) {
            throw new Error('Email already exists');
          }
          return true;
        }
      }
    },
    password: {
      notEmpty: { errorMessage: 'This field cannot be left blank.' },
      isLength: {
        errorMessage: 'Password must be 6-50 characters long.',
        options: {
          min: 6,
          max: 50
        }
      },
      isString: true,
      isStrongPassword: {
        errorMessage:
          'Password must be 6-50 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }
      }
    },
    confirm_password: {
      notEmpty: { errorMessage: 'This field cannot be left blank.' },
      isLength: {
        errorMessage: 'Password must be 6-50 characters long.',
        options: {
          min: 6,
          max: 50
        }
      },
      isString: true,
      isStrongPassword: {
        errorMessage:
          'Password must be 6-50 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
          }
          return true;
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        errorMessage: 'This field must be a valid Date',
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
);
