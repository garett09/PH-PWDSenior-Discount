# DiscountPH 🇵🇭

**The most accurate PWD and Senior Citizen discount calculator for the Philippines.**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🌟 Features

- ✅ **Legally Compliant** - Follows RA 10754, RA 11361, and DTI JAO 01-2022
- 🍽️ **Restaurant Mode** - Handles complex service charge scenarios
- 🛒 **Grocery/Medicine Mode** - Tracks remaining monthly allowance
- 👥 **Group Dining** - Split bills accurately between PWD/Senior and regular diners
- 📊 **Detailed Breakdowns** - See exactly how discounts are calculated
- 💾 **Save Calculations** - Store and review past calculations (local storage)
- 📤 **Share Results** - Native share functionality using Web Share API
- 🔍 **Receipt Comparison** - Audit mode to compare with actual receipts
- 📱 **Mobile-First** - Optimized for iPhone and Android
- 🌐 **Works Offline** - No internet required, all calculations are local
- 🎨 **Modern UI** - Beautiful, intuitive interface with Simple/Advanced modes

## 🚀 Platform

### Web App
Live at: [Your Vercel URL]

Optimized for mobile devices with a native app-like experience.

## 📱 Screenshots

[Add screenshots here]

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Deployment**: Vercel (Web)

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/PH-PWDSenior-Discount.git
cd PH-PWDSenior-Discount

# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build web app
npm run build

# Start production server
npm start
```

## 🧮 How It Works

### PWD/Senior Discount Calculation

According to Philippine law (RA 10754 and RA 11361):

1. **Remove VAT** (12%) from the base price
2. **Apply 20% discount** on the VAT-exclusive amount
3. **Service charge exemption** for PWD/Senior share (in restaurants)

### Service Charge Scenarios

The app handles 4 major service charge calculation methods used in the Philippines:

1. **Gross Amount** (Most common) - SC calculated on menu price
2. **Net of VAT** - SC calculated after removing VAT
3. **Post-Discount** - SC calculated after applying discount
4. **Manual Override** - Enter exact SC from receipt

### Group Dining

When dining with regular paying customers:

- **Prorated Method** - Divide bill equally by headcount
- **Exclusive Method** - Separate PWD orders for maximum accuracy
- **Mixed Transaction** - Combination of both methods

## 🎯 Use Cases

- **PWD/Senior Citizens** - Calculate your discount at restaurants and stores
- **Family Members** - Help loved ones verify their discounts
- **Restaurant Staff** - Ensure accurate discount application
- **Business Owners** - Verify POS system calculations
- **Auditors** - Compare receipts with legal requirements

## 🔒 Privacy

DiscountPH does not collect, store, or transmit any personal information. All calculations are performed locally on your device. Saved calculations are stored in your browser's local storage only.

## 📜 Legal References

- [RA 10754](https://www.officialgazette.gov.ph/2016/03/22/republic-act-no-10754/) - Expanded Senior Citizens Act
- [RA 11361](https://www.officialgazette.gov.ph/2019/07/25/republic-act-no-11361/) - Magna Carta for PWD
- [DTI JAO 01-2022](https://www.dti.gov.ph/) - Service Charge Guidelines

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Adrian Garett Sian**

## 🙏 Acknowledgments

- Philippine laws and regulations for discount entitlements
- The PWD and Senior Citizen community
- All contributors and testers

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: [your-email]

---

**Made with ❤️ for the Filipino community**
