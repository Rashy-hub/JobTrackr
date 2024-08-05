const yup = require('yup')

// Expressions régulières pour les mots de passe
const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).+$/
const pwdRegexMsg = 'Your password is too weak :o'

// Validation des données d'inscription
const registerValidator = yup.object().shape({
    firstname: yup.string().trim().required('First name is required').min(2, 'First name must be at least 2 characters long').max(50, 'First name must be less than 50 characters'),

    lastname: yup.string().trim().required('Last name is required').min(2, 'Last name must be at least 2 characters long').max(50, 'Last name must be less than 50 characters'),

    email: yup.string().trim().lowercase().required('Email is required').email('Invalid email format').max(255, 'Email must be less than 255 characters'),

    github: yup.string().trim().url('GitHub profile must be a valid URL').nullable(), // Champ optionnel

    profilePicture: yup
        .mixed()
        .test('fileSize', 'File too large', (value) => {
            if (!value) return true // Autoriser les champs vides (optionnels)
            return value.size <= 1024 * 1024 // 1 Mo
        })
        .test('fileType', 'Unsupported file format', (value) => {
            if (!value) return true // Autoriser les champs vides (optionnels)
            return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
        }),

    cv: yup.mixed().test('fileType', 'CV must be a PDF file', (value) => {
        if (!value) return true // Autoriser les champs vides (optionnels)
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

// Validation des données de connexion
const loginValidator = yup.object().shape({
    email: yup.string().trim().required('Email is required').email('Invalid email format'),

    password: yup.string().required('Password is required'),
})

// Validation des données de rafraîchissement de token
const refreshValidator = yup.object().shape({
    email: yup.string().trim().required('Email is required').email('Invalid email format'),
})
// Validation pour les fichiers uniquement
const fileValidator = yup.object().shape({
    profilePicture: yup
        .mixed()
        .nullable()
        .test('fileSize', 'File too large', (value) => {
            if (!value) return true // Autoriser les champs vides (optionnels)
            console.log(value.size) // Debug: Vérifiez la taille du fichier
            return value.size <= 10 * 1024 * 1024 // 10 Mo
        })
        .test('fileType', 'Unsupported file format', (value) => {
            if (!value) return true // Autoriser les champs vides (optionnels)
            return ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(value.mimetype)
        }),

    cv: yup
        .mixed()
        .nullable()
        .test('fileType', 'CV must be a PDF file', (value) => {
            if (!value) return true // Autoriser les champs vides (optionnels)
            return value.mimetype === 'application/pdf' // Utilisez 'mimetype' au lieu de 'type'
        }),
})

module.exports = fileValidator

module.exports = {
    registerValidator,
    loginValidator,
    refreshValidator,
    fileValidator,
}
