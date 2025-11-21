export interface LawResponseMode {
    id: 'primer' | 'legal' | 'math'
    label: string
    description: string
    promptAddendum: string
    laws: string[]
    rules: string[]
    sampleUseCases: string[]
}

export const LAW_RESPONSE_MODES: LawResponseMode[] = [
    {
        id: 'primer',
        label: 'Explain Like I’m New',
        description: 'Use Taglish-friendly explanations, break down VAT vs. 20% discount, and remind users about receipt essentials.',
        promptAddendum: `Always restate the rule of thumb for restaurant bills: remove 12% VAT first, then apply the 20% discount only to the PWD/Senior share. Offer calm reassurance and plain-language math.`,
        laws: ['RA 10754', 'RA 9994', 'RA 10909 (Exact Change Law)'],
        rules: [
            'VAT comes off first before the 20% discount for VAT-registered establishments.',
            'Discount applies only to the PWD/Senior’s personal consumption.',
            'Receipts must show discount lines clearly (BIR Sec. 237).'
        ],
        sampleUseCases: [
            'First-time diner confused why the discount is not exactly 20% of subtotal.',
            'Need to explain why change should not be rounded off.',
            'User anxious about asking cashiers to recompute.'
        ]
    },
    {
        id: 'legal',
        label: 'Legal Citations',
        description: 'Cite the exact section of the law and latest DOJ/DTI/DILG issuances when reminding establishments to comply.',
        promptAddendum: `Quote the relevant provision, then explain what it means operationally. Always mention that DOJ Opinion No. 45 (2024) says verification can’t delay discounts, and JMC 01-2022 covers online orders.`,
        laws: ['RA 10754', 'RA 9994', 'JMC 01-2022', 'DOJ Opinion No. 45 (s. 2024)', 'DTI-DA-DOE JAO 17-02'],
        rules: [
            'Verification of IDs must not delay the discount (DOJ Opinion No. 45).',
            'Online/phone transactions must honor discounts if ID is presented upon delivery (JMC 01-2022).',
            'Service-charge share of the PWD/Senior is waived per DOJ guidance.'
        ],
        sampleUseCases: [
            'Need copy-paste citations for an escalation email.',
            'Explaining why a flat ₱50 discount violates RA 10754.',
            'Clarifying which annex of JMC 01-2022 covers online proof.'
        ]
    },
    {
        id: 'math',
        label: 'Quick Math & Tables',
        description: 'Prioritize step-by-step computations and show prorated vs. exclusive scenarios with tables.',
        promptAddendum: `Return concise tables: Original Amount, Less VAT (if applicable), Less 20% Discount, Net to Pay, and Service Charge share. Offer both exclusive-item and prorated calculations when group dining is possible.`,
        laws: ['RA 10754', 'RA 9994', 'BIR RR 5-2017 (VAT guidance)'],
        rules: [
            'Always show both VAT-exempt sale and discount columns.',
            'Prorate totals by number of diners when only one PWD/Senior is present.',
            'Service charge is computed on the base amount before VAT but the PWD/Senior share is waived.'
        ],
        sampleUseCases: [
            'User uploads a receipt and wants a breakdown to compare with cashier math.',
            'Need to show how service charge percentage was derived.',
            'Explaining why prorating changes the final net amount.'
        ]
    }
]

