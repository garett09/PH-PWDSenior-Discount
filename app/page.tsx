import { DiscountCalculator } from '@/components/discount-calculator'
import { I18nProvider } from '@/lib/i18n-context'

export default function Home() {
  return (
    <I18nProvider>
      <main className="min-h-screen bg-slate-50 p-4 md:p-8">
        <DiscountCalculator />
      </main>
    </I18nProvider>
  )
}
