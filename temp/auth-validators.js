const yup = require('yup')

const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).+$/
const pwdRegexMsg = 'Your password is too weak :o'

const registerValidator = yup.object().shape({
    firstname: yup.string().trim().required('First name is required').min(2, 'First name must be at least 2 characters long').max(50, 'First name must be less than 50 characters'),

    lastname: yup.string().trim().required('Last name is required').min(2, 'Last name must be at least 2 characters long').max(50, 'Last name must be less than 50 characters'),

    email: yup.string().trim().lowercase().required('Email is required').email('Invalid email format').max(255, 'Email must be less than 255 characters'),

    github: yup.string().trim().url('GitHub profile must be a valid URL').nullable(), // Optional field

    profilePicture: yup
        .mixed()
        .test('fileSize', 'File too large', (value) => {
            if (!value) return true // Allow empty field (optional)
            return value.size <= 1024 * 1024 // 1MB
        })
        .test('fileType', 'Unsupported file format', (value) => {
            if (!value) return true // Allow empty field (optional)
            return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
        }),

    cv: yup.mixed().test('fileType', 'CV must be a PDF file', (value) => {
        if (!value) return true // Allow empty field (optional)
        return value.type === 'application/pdf'
    }),

    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(64, 'Password must be less than 64 characters')
        .matches(pwdRegex, pwdRegexMsg),

    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
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
