import { ThemeInput } from "#/utils"
import { FaMapMarkerAlt, FaPhone, FaUser, FaVenusMars } from "react-icons/fa"

const CustomerDetails = ({ formData, onCustomerChange }: any) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
          <FaUser className="text-purple-600" /> ગ્રાહકનું નામ *
        </label>
        <ThemeInput
          type="text"
          placeholder="દા.ત. કેવલ મકવાણા"
          className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
          value={formData.customer_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCustomerChange('customer_name', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
          <FaPhone className="text-purple-600" /> ફોન નંબર *
        </label>
        <ThemeInput
          type="tel"
          placeholder="દા.ત. 1234567890"
          className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
          value={formData.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCustomerChange('phone', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
          <FaMapMarkerAlt className="text-purple-600" /> ગામ / શહેર *
        </label>
        <ThemeInput
          type="text"
          placeholder="દા.ત. અમદાવાદ"
          className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
          value={formData.city}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCustomerChange('city', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
          <FaVenusMars className="text-purple-600" /> ગ્રાહકનો પ્રકાર (Gender) *
        </label>
        <div className="flex gap-4 h-[44px] items-center px-2 border border-gray-200 rounded-xl bg-slate-50">
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={(e) => onCustomerChange('gender', e.target.value)}
              className="text-purple-600 focus:ring-purple-500"
            />
            પુરુષ (Male)
          </label>
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={(e) => onCustomerChange('gender', e.target.value)}
              className="text-purple-600 focus:ring-purple-500"
            />
            સ્ત્રી (Female)
          </label>
        </div>
      </div>
    </div>)
}
export default CustomerDetails