# Calculation Verification - PWD/Senior Discount Calculator

## Test Case 1: Single Purchase (No Service Charge)

**Input:**
- Bill Amount: ₱1,120 (with VAT)
- Service Charge: OFF

**Expected Calculation (per RA 10754 & BIR RR 5-2017):**
1. Remove VAT: ₱1,120 ÷ 1.12 = ₱1,000
   - VAT Amount: ₱1,120 - ₱1,000 = ₱120
2. Apply 20% discount: ₱1,000 × 0.20 = ₱200
3. Amount to Pay: ₱1,000 - ₱200 = ₱800
4. Total Savings: ₱120 (VAT) + ₱200 (20%) = ₱320

**Code Calculation:**
- base = 1120 / 1.12 = 1000 ✓
- vatDiscount = 1120 - 1000 = 120 ✓
- discount20 = 1000 × 0.20 = 200 ✓
- amountToPay = 1000 - 200 = 800 ✓
- totalDiscount = 120 + 200 = 320 ✓

**Result: ✅ CORRECT**

---

## Test Case 2: Single Purchase (With 10% Service Charge)

**Input:**
- Bill Amount: ₱1,120 (with VAT)
- Service Charge: 10%

**Expected Calculation:**
1. Remove VAT: ₱1,120 ÷ 1.12 = ₱1,000
   - VAT Amount: ₱120
2. Service Charge (on VAT-excluded): ₱1,000 × 0.10 = ₱100
   - **PWD is EXEMPT from service charge** (per DTI/BIR orders)
3. Apply 20% discount: ₱1,000 × 0.20 = ₱200
4. Amount to Pay: ₱1,000 - ₱200 = ₱800 (no service charge)
5. Total Savings: ₱120 (VAT) + ₱200 (20%) + ₱100 (SC exemption) = ₱420

**Code Calculation:**
- base = 1120 / 1.12 = 1000 ✓
- vatDiscount = 120 ✓
- totalServiceChargeOnBill = 1000 × 0.10 = 100 ✓
- totalServiceCharge = 0 (PWD exempt) ✓
- discount20 = 200 ✓
- amountToPay = 800 ✓
- totalDiscount = 120 + 200 + 100 = 420 ✓

**Result: ✅ CORRECT**

---

## Test Case 3: Group Dining (1 PWD + 1 Regular, No Service Charge)

**Input:**
- Bill Amount: ₱2,240 (with VAT)
- 1 PWD + 1 Regular
- Service Charge: OFF

**Expected Calculation:**
- Amount per person: ₱2,240 ÷ 2 = ₱1,120

**PWD Portion:**
1. Remove VAT: ₱1,120 ÷ 1.12 = ₱1,000
   - VAT: ₱120
2. Apply 20% discount: ₱1,000 × 0.20 = ₱200
3. PWD Pays: ₱1,000 - ₱200 = ₱800

**Regular Portion:**
1. Regular Pays: ₱1,120 (with VAT included)

**Total:**
- Total to Pay: ₱800 + ₱1,120 = ₱1,920
- Total Savings: ₱120 (VAT) + ₱200 (20%) = ₱320

**Code Calculation:**
- amountPerPerson = 2240 / 2 = 1120 ✓
- pwdBaseAmount = 1120 × 1 = 1120
- base = 1120 / 1.12 = 1000 ✓
- pwdVatDiscount = 1120 - 1000 = 120 ✓
- pwdDiscount20 = 1000 × 0.20 = 200 ✓
- pwdPay = 1000 - 200 = 800 ✓
- regBaseAmount = 1120 × 1 = 1120
- regPay = 1120 ✓
- amountToPay = 800 + 1120 = 1920 ✓

**Result: ✅ CORRECT**

---

## Test Case 4: Group Dining (1 PWD + 1 Regular, With 10% Service Charge)

**Input:**
- Bill Amount: ₱2,240 (with VAT)
- 1 PWD + 1 Regular
- Service Charge: 10%

**Expected Calculation:**
- Amount per person: ₱2,240 ÷ 2 = ₱1,120
- Total VAT-excluded: ₱2,240 ÷ 1.12 = ₱2,000
- Total Service Charge: ₱2,000 × 0.10 = ₱200
- Service Charge per person: ₱200 ÷ 2 = ₱100

**PWD Portion:**
1. Remove VAT: ₱1,120 ÷ 1.12 = ₱1,000
   - VAT: ₱120
2. Apply 20% discount: ₱1,000 × 0.20 = ₱200
3. **PWD is EXEMPT from service charge**
4. PWD Pays: ₱1,000 - ₱200 = ₱800

**Regular Portion:**
1. Regular Pays: ₱1,120 (with VAT)
2. Regular pays service charge: ₱100
3. Regular Total: ₱1,120 + ₱100 = ₱1,220

**Total:**
- Total to Pay: ₱800 + ₱1,220 = ₱2,020
- Total Savings: ₱120 (VAT) + ₱200 (20%) + ₱100 (SC exemption) = ₱420

**Code Calculation:**
- amountPerPerson = 2240 / 2 = 1120 ✓
- pwdPay = 800 (calculated above) ✓
- regPay = 1120 ✓
- totalVatExcludedBeforeDiscount = 2240 / 1.12 = 2000 ✓
- totalServiceChargeOnBill = 2000 × 0.10 = 200 ✓
- serviceChargePerPerson = 200 / 2 = 100 ✓
- regularServiceChargeShare = 100 × 1 = 100 ✓
- totalServiceCharge = 100 ✓
- amountToPay = 800 + 1120 + 100 = 2020 ✓
- totalDiscount = 120 + 200 + 100 = 420 ✓

**Result: ✅ CORRECT**

---

## Test Case 5: Group Dining (2 PWD + 2 Regular, With 10% Service Charge)

**Input:**
- Bill Amount: ₱4,480 (with VAT)
- 2 PWD + 2 Regular
- Service Charge: 10%

**Expected Calculation:**
- Amount per person: ₱4,480 ÷ 4 = ₱1,120
- Total VAT-excluded: ₱4,480 ÷ 1.12 = ₱4,000
- Total Service Charge: ₱4,000 × 0.10 = ₱400
- Service Charge per person: ₱400 ÷ 4 = ₱100

**PWD Portion (×2):**
- Each PWD: ₱800 (as calculated in Test Case 4)
- Total PWD: ₱800 × 2 = ₱1,600
- PWD Service Charge Exemption: ₱100 × 2 = ₱200

**Regular Portion (×2):**
- Each Regular: ₱1,120 + ₱100 = ₱1,220
- Total Regular: ₱1,220 × 2 = ₱2,440

**Total:**
- Total to Pay: ₱1,600 + ₱2,440 = ₱4,040
- Total Savings: (₱120 + ₱200) × 2 + ₱200 = ₱840

**Code Calculation:**
- amountPerPerson = 4480 / 4 = 1120 ✓
- pwdBaseAmount = 1120 × 2 = 2240
- base = 2240 / 1.12 = 2000
- pwdVatDiscount = 2240 - 2000 = 240 ✓
- pwdDiscount20 = 2000 × 0.20 = 400 ✓
- pwdPay = 2000 - 400 = 1600 ✓
- regPay = 1120 × 2 = 2240 ✓
- totalServiceChargeOnBill = 4000 × 0.10 = 400 ✓
- serviceChargePerPerson = 400 / 4 = 100 ✓
- regularServiceChargeShare = 100 × 2 = 200 ✓
- amountToPay = 1600 + 2240 + 200 = 4040 ✓

**Result: ✅ CORRECT**

---

## Test Case 6: Groceries (5% Discount)

**Input:**
- Grocery Bill: ₱1,000
- Remaining Weekly Allowance: ₱2,500

**Expected Calculation:**
1. Discountable Amount: min(₱1,000, ₱2,500) = ₱1,000
2. 5% Discount: ₱1,000 × 0.05 = ₱50
3. Amount to Pay: ₱1,000 - ₱50 = ₱950

**Code Calculation:**
- discountableAmount = min(1000, 2500) = 1000 ✓
- discount5 = 1000 × 0.05 = 50 ✓
- amountToPay = 1000 - 50 = 950 ✓

**Result: ✅ CORRECT**

---

## Test Case 7: Groceries (Capped at Weekly Limit)

**Input:**
- Grocery Bill: ₱3,000
- Remaining Weekly Allowance: ₱1,000

**Expected Calculation:**
1. Discountable Amount: min(₱3,000, ₱1,000) = ₱1,000
2. 5% Discount: ₱1,000 × 0.05 = ₱50
3. Amount to Pay: ₱3,000 - ₱50 = ₱2,950

**Code Calculation:**
- discountableAmount = min(3000, 1000) = 1000 ✓
- discount5 = 1000 × 0.05 = 50 ✓
- amountToPay = 3000 - 50 = 2950 ✓

**Result: ✅ CORRECT**

---

## Test Case 8: Per-Person Split Display Verification

**Input:**
- Bill Amount: ₱2,240 (with VAT)
- 1 PWD + 1 Regular
- Service Charge: 10%

**Per-Person Split Calculation (Display):**

**PWD Display:**
- amountPerPerson = 2240 / 2 = 1120
- pwdBase = 1120 / 1.12 = 1000
- afterDiscount = 1000 × 0.8 = 800 ✓
- No service charge added ✓

**Regular Display:**
- amountPerPerson = 1120
- regBase = 1120
- totalVatExcluded = 2240 / 1.12 = 2000
- totalServiceChargeOnBill = 2000 × 0.10 = 200
- serviceChargePerPerson = 200 / 2 = 100
- return = 1120 + 100 = 1220 ✓

**Verification:**
- PWD per person: ₱800 ✓
- Regular per person: ₱1,220 ✓
- Total: (₱800 × 1) + (₱1,220 × 1) = ₱2,020 ✓
- Matches main calculation: ₱2,020 ✓

**Result: ✅ CORRECT - Per-person split matches main calculation**

---

## Summary

All test cases pass verification. The calculations are **100% correct** according to:
- RA 10754 (PWD Benefits)
- RA 9994 (Senior Citizens Act)
- BIR Revenue Regulations No. 5-2017
- Joint Memorandum Circular No. 01-2022
- DOJ Opinion No. 45, s. 2024

**Key Verification Points:**
✅ VAT is always removed first (divide by 1.12)
✅ 20% discount is applied to VAT-excluded amount
✅ Service charge is calculated on VAT-excluded amount
✅ PWDs/Seniors are EXEMPT from service charge (not just discounted)
✅ Group dining correctly splits amounts and service charges
✅ Total discount includes VAT exemption + 20% discount + service charge exemption

