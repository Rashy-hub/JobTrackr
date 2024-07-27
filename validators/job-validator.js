const yup = require('yup')

const jobValidator = yup.object().shape({
    user: yup
        .string()
        .required('User ID is required')
        .matches(/^[0-9a-fA-F]{24}$/, 'Invalid User ID format'),
    title: yup.string().trim().required('Title is required').max(100, 'Title must be less than 100 characters'),
    company: yup.string().trim().max(100, 'Company name must be less than 100 characters'),
    website: yup.string().trim().url('Invalid URL format'),
    contact: yup.object().shape({
        name: yup.string().trim().max(100, 'Name must be less than 100 characters'),
        email: yup.string().trim().email('Invalid email format').required("Contact email can't be blank"),
        phone: yup
            .string()
            .trim()
            .matches(/^\+?[0-9\s\-]{7,15}$/, 'Phone number is invalid'),
        address: yup.string().trim().max(200, 'Address must be less than 200 characters'),
    }),
    origin: yup.string().oneOf(['LinkedIn', 'Indeed', 'Glassdoor', 'Referral', 'Other'], 'Invalid origin'),
    status: yup.string().oneOf(['Applied', 'Interviewing', 'Offered', 'Rejected', 'Accepted'], 'Invalid status'),
    comment: yup.string().trim().max(500, 'Comment must be less than 500 characters'),
})

module.exports = {
    jobValidator,
}
