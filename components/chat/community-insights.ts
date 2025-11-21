export interface CommunityInsight {
    id: string
    title: string
    sourceUrl: string
    summary: string
    implication: string
    recommendations: string[]
    tags: string[]
}

export const COMMUNITY_INSIGHTS: CommunityInsight[] = [
    {
        id: 'mentalhealthph-flat-50',
        title: 'Flat ₱50 discount on ₱430 bill',
        sourceUrl: 'https://www.reddit.com/r/MentalHealthPH/comments/1k6uhzj/pwd_discount/',
        summary: 'PWD diner only received a ₱50 deduction on a ₱430 café order; receipt lacked VAT/service-charge detail and staff could not explain the computation.',
        implication: 'Users feel anxious confronting staff when discounts are incorrect, especially when receipts don’t show VAT-exempt lines or service-charge math.',
        recommendations: [
            'Show VAT-first-then-20% steps with sample figures (₱430 → ₱383.93 → ₱307.14).',
            'Remind users to request official receipts and highlight RA 10909 (No Shortchanging).',
            'Offer scripts for politely escalating to managers when computations look wrong.'
        ],
        tags: ['restaurant', 'vat', 'service-charge']
    },
    {
        id: 'philippines-397-meal',
        title: 'Only 25% off on ₱397 meal',
        sourceUrl: 'https://www.reddit.com/r/Philippines/comments/1m0kw40/pwd_rights_only_got_25_discount_on_a_397_meal/',
        summary: 'PWD customer in CDO reports receiving just ₱25 off on a ₱397 order; staff insisted on “one food + one drink” rule and refused to show receipt until pressed.',
        implication: 'Establishments misinterpret “exclusive consumption” and invent policies; users need ready escalation paths (DTI, 8888, LGU boards).',
        recommendations: [
            'Provide template letters referencing RA 10754 and DOJ Opinion No. 45 for complaints.',
            'Surface hotline/agency options (DTI, OSCA/PDAO, 8888) with context on what information to submit.',
            'Explain how to document receipts/photos before filing a report.'
        ],
        tags: ['complaint', 'exclusive-use', 'dti']
    },
    {
        id: 'fake-id-skepticism',
        title: 'Fear of fake IDs causing stricter policies',
        sourceUrl: 'https://www.reddit.com/r/Philippines/comments/1m0kw40/pwd_rights_only_got_25_discount_on_a_397_meal/comment/n3dkvoq/',
        summary: 'Thread participants note that widespread fake PWD IDs make businesses overly restrictive, demanding proof or limiting discounts arbitrarily.',
        implication: 'Assistant responses must reassure legit cardholders that verification cannot delay benefits and teach them how to offer quick verification steps.',
        recommendations: [
            'Highlight DOJ guidance that discounts cannot be withheld pending ID verification.',
            'Suggest carrying digital copies of OSCA/PDAO certificates and outlining quick validation steps.',
            'Educate users on reporting counterfeit ID sellers to NCDA/DOJ hotlines.'
        ],
        tags: ['verification', 'policy', 'trust']
    }
]

