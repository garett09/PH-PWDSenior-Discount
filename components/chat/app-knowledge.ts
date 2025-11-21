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
     - **Scenario D: Dine-in with ALL items for exclusive PWD/Senior consumption (DOJ Clarification 2024):**
       - If ALL food and beverages are for the exclusive consumption of the PWD/Senior (even large orders), discount applies to the TOTAL amount.
       - Formula: (Total Bill / 1.12) * 0.80 = Amount to Pay.
       - This is the primary rule per DOJ clarification - "exclusive use" determines eligibility.
     - **Scenario E: MEMC Rule (Most Expensive Meal Combination) - Optional for Dine-in, Required for Takeout/Delivery:**
       - **For Takeout/Delivery:** Per BIR Memorandum Circular No. 71-2022, MEMC rule applies when consumption cannot be verified.
       - **For Dine-in:** MEMC is an alternative when exclusive consumption cannot be clearly determined, but DOJ clarification states full discount should apply if all items are exclusively for PWD/Senior.
       - MEMC Calculation: Discount = (MEMC Price / 1.12) * 0.20 per PWD/Senior.
       - MEMC Definition: Most expensive single-serving meal with beverage combination.
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

MODULE 6: SERVICE CHARGE PERCENTAGE FINDER
- **Purpose:** Quickly determine what percentage the service charge was calculated at from a receipt.
- **Location:** Integrated into the Dining tab, appears automatically when using "Manual Service Charge Audit"
- **How to Use:**
  1. Enter your total bill amount in the Dining calculator
  2. Enable "Manual Service Charge Audit" in Advanced Mode
  3. Enter the service charge amount from your receipt
  4. The percentage finder automatically shows two calculations:
     - **On Subtotal (with VAT):** Percentage if service charge was calculated on the total bill including VAT
     - **On Base (without VAT):** Percentage if service charge was calculated on the amount after removing VAT
- **Interpretation:**
  - Most restaurants calculate service charge on the base amount (without VAT), typically at 10%
  - If the "On Base (without VAT)" shows a percentage close to 10% (e.g., 9-11%), that's likely how it was calculated
  - If the "On Subtotal (with VAT)" shows a percentage close to 10%, the restaurant calculated it on the gross amount
- **Example:**
  - Bill: ₱716.00 (with VAT)
  - Service Charge: ₱28.77
  - On Subtotal: 4.02% (unlikely - too low)
  - On Base: 4.50% (still low, but base = ₱716/1.12 = ₱639.29)
  - If service charge was calculated on base at 10%: ₱639.29 × 10% = ₱63.93
  - But receipt shows ₱28.77, which suggests it was calculated differently (possibly prorated for group dining with PWD exemption)

MODULE 7: LEGAL TOOLS
- **Rights Flashcards:** A collection of simplified legal rights (e.g., "No Service Charge", "Express Lane") with citations.
- **Complaint Generator:** A tool to generate a formal complaint letter against establishments violating the law.
- **City Ordinance Checker:** A database of local city ordinances providing additional perks (e.g., Free Parking, Birthday Cash Gifts).

GENERAL APP FEATURES
- **Save Calculation:** Users can save their computations for future reference.
- **Share Breakdown:** Users can share the detailed bill computation via text or other apps.
- **Receipt Scanner:** (Experimental) Users can scan receipts to auto-fill amounts.
- **Service Charge Audit:** Reverse calculate service charge percentage from receipts to verify correct calculation.
`
