import LegalScreen from '@/components/legal-screen'

const sections = [
    {
        id: 'introduction',
        title: 'Introduction',

        paragraphs: [
            'financhor respects your privacy and is committed to protecting the information entrusted to us.',
            'This Privacy Policy explains the types of information we may collect, why we use it, how it may be shared and the measures we take to protect it.',
        ],
    },

    {
        id: 'collection',
        title: 'Information We Collect',

        paragraphs: [
            'We may collect information necessary to create your account, provide services, process transactions, verify your identity, provide support and protect our platform.',
        ],

        bullets: [
            'Name and contact information.',
            'Phone number and email address.',
            'Account and transaction information.',
            'Identity verification information where required.',
            'Bank and payment information needed for requested services.',
            'Device and technical information.',
            'Information you provide when contacting customer support.',
        ],
    },

    {
        id: 'identity',
        title: 'Identity Verification',

        paragraphs: [
            'Some financhor services may require identity verification. Depending on the service and applicable requirements, verification may involve government identification information or other information needed to confirm your identity.',
            'Verification information may be used to prevent fraud, protect accounts and meet applicable legal or regulatory requirements.',
        ],
    },

    {
        id: 'usage',
        title: 'How We Use Your Information',

        paragraphs: [
            'We use information collected through financhor for purposes connected with providing, securing and improving our services.',
        ],

        bullets: [
            'Create and manage your account.',
            'Process payments and transactions.',
            'Provide requested financial services.',
            'Verify identity.',
            'Prevent fraud and unauthorized activity.',
            'Provide customer support.',
            'Maintain and improve the application.',
            'Meet applicable legal and regulatory obligations.',
        ],
    },

    {
        id: 'transactions',
        title: 'Transaction Information',

        paragraphs: [
            'When you make or receive a transaction, we may record information such as the transaction amount, date, reference, payment channel and related account information.',
            'This information allows us to provide transaction history, resolve disputes, investigate suspicious activity and maintain appropriate records.',
        ],
    },

    {
        id: 'sharing',
        title: 'Sharing of Information',

        paragraphs: [
            'financhor may share information with service providers, financial institutions, payment processors and other partners where necessary to provide requested services, process transactions, maintain the platform, prevent fraud or comply with legal obligations.',
            'We aim to limit information shared to what is reasonably necessary for the relevant purpose.',
        ],
    },

    {
        id: 'providers',
        title: 'Third-Party Service Providers',

        paragraphs: [
            'Some financhor features may depend on third-party services such as payment processors, banks, identity verification providers, cloud infrastructure providers and communication services.',
            'These providers may process information according to their own privacy policies and applicable requirements.',
        ],
    },

    {
        id: 'security',
        title: 'Information Security',

        paragraphs: [
            'We use reasonable technical and organizational measures designed to protect personal information against unauthorized access, loss, misuse, alteration or disclosure.',
            'However, no internet-based system can be guaranteed to be completely secure.',
        ],

        bullets: [
            'Use a strong password or PIN.',
            'Never share OTPs or authentication credentials.',
            'Log out or secure your device when appropriate.',
            'Contact financhor promptly if you notice suspicious account activity.',
        ],
    },

    {
        id: 'retention',
        title: 'Data Retention',

        paragraphs: [
            'We retain information for as long as reasonably necessary to provide services, maintain transaction records, comply with legal requirements, prevent fraud, resolve disputes and fulfil other legitimate business purposes.',
            'Different categories of information may be retained for different periods.',
        ],
    },

    {
        id: 'rights',
        title: 'Your Privacy Rights',

        paragraphs: [
            'Depending on applicable law, you may have rights concerning the personal information held about you.',
        ],

        bullets: [
            'Request access to certain personal information.',
            'Request correction of inaccurate information.',
            'Ask questions about how your information is used.',
            'Request deletion where legally applicable.',
            'Object to or restrict certain processing where applicable.',
        ],
    },

    {
        id: 'cookies',
        title: 'Cookies and Similar Technologies',

        paragraphs: [
            'financhor web services may use cookies or similar technologies to maintain sessions, improve security, remember preferences and understand how services are used.',
            'The technologies used may vary between our mobile application and web-based services.',
        ],
    },

    {
        id: 'children',
        title: 'Children and Ineligible Users',

        paragraphs: [
            'financhor services are intended for users who meet the applicable eligibility requirements for the services they use.',
            'We do not knowingly collect information from individuals who are not eligible to use a particular financial service.',
        ],
    },

    {
        id: 'changes',
        title: 'Changes to This Privacy Policy',

        paragraphs: [
            'We may update this Privacy Policy when our services, technology, legal requirements or privacy practices change.',
            'Where appropriate, significant changes will be communicated through the financhor application or another appropriate channel.',
        ],
    },

    {
        id: 'contact',
        title: 'Contact Us',

        paragraphs: [
            'If you have questions about this Privacy Policy or how your information is handled, please contact financhor through the official support channels available within the application.',
        ],
    },
]

export default function PrivacyScreen() {
    return (
        <LegalScreen
            title="Privacy Policy"
            description="How financhor collects, uses and protects your information."
            lastUpdated="27 August 2026"
            icon="shield-checkmark-outline"
            sections={sections}
        />
    )
}