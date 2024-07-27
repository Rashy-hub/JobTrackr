const yup = require('yup')

const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).+$/
const pwdRegexMsg = 'Your password is too weak :o'

const registerValidator = yup.object().shape({
    username: yup.string().trim().required('Username is required').min(3, 'Username must be at least 3 characters long').max(50, 'Username must be less than 50 characters'),
    email: yup.string().trim().lowercase().required('Email is required').email('Invalid email format').max(255, 'Email must be less than 255 characters'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(64, 'Password must be less than 64 characters')
        .matches(pwdRegex, pwdRegexMsg),
})

const loginValidator = yup.object().shape({
    email: yup.string().trim().required('Email is required').email('Invalid email format'),
    password: yup.string().required('Password is required'),
})

const refreshValidator = yup.object().shape({
    email: yup.string().trim().required('Email is required').email('Invalid email format'),
})

module.exports = {
    registerValidator,
    loginValidator,
    refreshValidator,
}
