
import LegalScreen from '@/components/legal-screen'

const sections = [
    {
        id: 'acceptance',
        title: 'Acceptance of Terms',

        paragraphs: [
            'By registering for or using financhor, you agree to comply with these Terms and Conditions. If you do not agree with these terms, you should not use the financhor application or services.',
            'These terms govern your relationship with financhor and your use of the features and services made available through the platform.',
        ],
    },

    {
        id: 'eligibility',
        title: 'Eligibility',

        paragraphs: [
            'You must satisfy the applicable legal and service requirements to use financhor. Some services may have additional eligibility requirements.',
            'You agree to provide accurate, complete and current information during registration and whenever requested.',
        ],
    },

    {
        id: 'account',
        title: 'Account Registration and Security',

        paragraphs: [
            'You are responsible for keeping your financhor account and security credentials safe.',
        ],

        bullets: [
            'Keep your password, PIN and OTP confidential.',
            'Do not allow another person to use your account.',
            'Provide accurate information during registration and verification.',
            'Notify financhor if you suspect unauthorized access to your account.',
        ],
    },

    {
        id: 'services',
        title: 'financhor Services',

        paragraphs: [
            'financhor may provide access to savings, pension, insurance, payment, emergency assistance and other financial services made available through the application.',
            'Individual services may have additional terms, eligibility requirements, limits, fees or conditions.',
        ],
    },

    {
        id: 'savings',
        title: 'Savings and Contributions',

        paragraphs: [
            'Where financhor provides savings or contribution features, the applicable product terms will determine how contributions are collected, recorded and made available.',
            'Transaction records shown within the application should be reviewed regularly and discrepancies should be reported promptly.',
        ],
    },

    {
        id: 'payments',
        title: 'Payments and Transactions',

        paragraphs: [
            'financhor may use banks, payment processors and other approved financial service providers to process transactions.',
            'A transaction may be subject to processing times, verification, network availability and the terms of the relevant payment provider.',
        ],

        bullets: [
            'Confirm transaction information before authorizing a transaction.',
            'Keep transaction references where appropriate.',
            'Report unauthorized or incorrect transactions promptly.',
        ],
    },

    {
        id: 'loan',
        title: 'Loans and Emergency Financial Requests',

        paragraphs: [
            'Where loan or emergency financial assistance is available, submitting a request does not guarantee approval.',
            'Approval may depend on eligibility, verification, available limits, repayment capacity, applicable policies and other requirements.',
            'Where a loan is approved, you will be provided with applicable terms before accepting the loan.',
        ],
    },

    {
        id: 'insurance',
        title: 'Insurance Claims',

        paragraphs: [
            'Insurance-related services and claims are subject to the applicable insurance policy and its terms, conditions, exclusions and limits.',
            'Submitting a claim does not automatically guarantee approval or payment. Claims may be reviewed and verified before a decision is made.',
        ],
    },

    {
        id: 'pension',
        title: 'Pension Services',

        paragraphs: [
            'Pension-related services are subject to applicable laws, regulations, pension arrangements and requirements of relevant pension providers.',
            'Access to pension funds may be subject to eligibility requirements and legal restrictions.',
        ],
    },

    {
        id: 'prohibited',
        title: 'Prohibited Activities',

        paragraphs: [
            'You must not use financhor for unlawful, fraudulent, abusive or unauthorized activities.',
        ],

        bullets: [
            'Providing false identity or financial information.',
            'Attempting to access another person\'s account.',
            'Using financhor for fraudulent transactions.',
            'Attempting to bypass security or verification controls.',
            'Interfering with the security or operation of the application.',
        ],
    },

    {
        id: 'availability',
        title: 'Service Availability',

        paragraphs: [
            'We aim to provide reliable access to financhor, but services may occasionally be unavailable because of maintenance, network failures, security events, third-party providers or circumstances outside our reasonable control.',
        ],
    },

    {
        id: 'changes',
        title: 'Changes to These Terms',

        paragraphs: [
            'financhor may update these Terms and Conditions when services, regulations or business practices change.',
            'Where appropriate, material changes will be communicated through the application or another appropriate communication channel.',
        ],
    },

    {
        id: 'termination',
        title: 'Account Suspension or Termination',

        paragraphs: [
            'financhor may restrict, suspend or terminate access to an account where reasonably necessary to protect the platform, comply with applicable requirements, investigate suspected fraud or address violations of these terms.',
        ],
    },

    {
        id: 'contact',
        title: 'Contact Us',

        paragraphs: [
            'If you have questions about these Terms and Conditions, please contact financhor through the official support channels provided in the application.',
        ],
    },
]

export default function TermsScreen() {
    return (
        <LegalScreen
            title="Terms & Conditions"
            description="The rules and responsibilities that apply when using financhor."
            lastUpdated="27 August 2026"
            icon="document-text-outline"
            sections={sections}
        />
    )
}