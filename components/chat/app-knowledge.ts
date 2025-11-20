export const APP_KNOWLEDGE = `
---
APPLICATION CAPABILITIES & CALCULATION LOGIC

MODULE 1: DINING (RESTAURANT) CALCULATOR
- **Purpose:** Computes discounts for food and drinks in restaurants.
- **Inputs:**
  - Total Bill Amount
  - Number of PWDs/Senior Citizens
  - Number of Regular Diners
  - Service Charge settings (Rate, Base, Excluded Amount)
  - **Advanced Options (Group Dining):**
    - **Prorated (Default):** Used when food is shared equally.
    - **Exclusive:** Used when PWD/Senior has separate, specific orders.
- **Calculation Logic:**
  1. **VAT Exemption:**
     - Base Amount = Total Bill / 1.12
     - VAT Amount = Total Bill - Base Amount
  2. **Discount (20%):**
     - **Scenario A: Solo Diner:**
       - Discount = Base Amount * 0.20
     - **Scenario B: Group Dining (Prorated):**
       - Prorated Base = Base Amount / Total Diners
       - Discount = Prorated Base * Number of PWDs * 0.20
     - **Scenario C: Group Dining (Exclusive/Mixed):**
       - *Exclusive Part:* The amount consumed ONLY by PWDs gets 100% discount (VAT Exempt + 20% off).
       - *Shared Part:* The remaining amount (Total - Exclusive) is prorated among ALL diners.
       - Total Discount = (Exclusive Discount) + (Shared Prorated Discount).
  3. **Service Charge Exemption:**
     - PWDs/Seniors are exempt from their share of the service charge.
     - Exemption = (Total Service Charge / Total Diners) * Number of PWDs.

MODULE 2: MEDICINE CALCULATOR
- **Purpose:** Computes discounts for medicines (generic & branded).
- **Inputs:** Total Bill Amount.
- **Calculation Logic:**
  - Same as Solo Dining logic (VAT Exempt + 20% Discount).
  - Formula: (Bill / 1.12) * 0.80.

MODULE 3: GROCERY CALCULATOR
- **Purpose:** Computes the 5% special discount for basic necessities and prime commodities.
- **Inputs:**
  - Total Bill Amount
  - Remaining Weekly Cap (Default: P1,300)
- **Calculation Logic:**
  - Discountable Amount = Min(Total Bill, Remaining Cap)
  - Discount = Discountable Amount * 0.05
  - Note: VAT is usually NOT exempt for groceries unless the item itself is VAT-exempt.

MODULE 4: UTILITIES CALCULATOR
- **Purpose:** Computes 5% discount for Electricity and Water.
- **Inputs:** Monthly Bill Amount.
- **Calculation Logic:**
  - Discount = Bill Amount * 0.05
  - **Restrictions:**
    - Electricity: Max 100 kWh consumption.
    - Water: Max 30 cubic meters consumption.

MODULE 5: TRANSPORT CALCULATOR
- **Purpose:** Computes 20% discount + VAT exemption for travel fares.
- **Inputs:** Base Fare Amount.
- **Calculation Logic:**
  - Final Fare = (Base Fare / 1.12) * 0.80.
  - Note: Other fees (fuel surcharge, terminal fees) might not be discountable depending on the carrier, but the law covers the "actual fare".

MODULE 6: LEGAL TOOLS
- **Rights Flashcards:** A collection of simplified legal rights (e.g., "No Service Charge", "Express Lane") with citations.
- **Complaint Generator:** A tool to generate a formal complaint letter against establishments violating the law.
- **City Ordinance Checker:** A database of local city ordinances providing additional perks (e.g., Free Parking, Birthday Cash Gifts).

GENERAL APP FEATURES
- **Save Calculation:** Users can save their computations for future reference.
- **Share Breakdown:** Users can share the detailed bill computation via text or other apps.
- **Receipt Scanner:** (Experimental) Users can scan receipts to auto-fill amounts.
`
