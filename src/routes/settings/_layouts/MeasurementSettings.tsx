import { ThemeInput } from "#/utils"
import { useState } from "react"
import { FaChevronDown, FaPlus, FaRulerCombined, FaTrash, FaVenusMars } from "react-icons/fa"

const MeasurementSettings = ({
  setMaleProductsInput,
  setFemaleProductsInput,
  handleAddProduct,
  maleProductsInput,
  femaleProductsInput,
  maleProducts,
  handleRemoveProduct,
  femaleProducts,
  formData
}: any) => {

  const [isMeasurementOpen, setIsMeasurementOpen] = useState(false)
  const [activeGenderTab, setActiveGenderTab] = useState<'male' | 'female'>('male')


  return (<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6">
    <button
      type="button"
      onClick={() => setIsMeasurementOpen(!isMeasurementOpen)}
      className="w-full flex items-center justify-between text-left focus:outline-none group py-1 border-b border-gray-100 pb-4"
    >
      <div>
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-600" />
          Measurement Categories
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          પુરુષ અને સ્ત્રી વિભાગ માટે માપના વિકલ્પો મેનેજ કરો
        </p>
      </div>
      <FaChevronDown
        className={`text-purple-600 transition-transform duration-300 ${isMeasurementOpen ? 'rotate-180' : ''}`}
        size={16}
      />
    </button>

    <div
      className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isMeasurementOpen ? 'grid-rows-[1fr] opacity-100 space-y-4' : 'grid-rows-[0fr] opacity-0 space-y-0'
        }`}
    >
      <div className="overflow-hidden space-y-4 pt-1">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <FaVenusMars className="text-purple-600" /> કેટેગરી પસંદ કરો (Gender Category) *
          </label>
          <div className="flex gap-4 h-[44px] items-center px-3 border border-gray-200 rounded-xl bg-slate-50 w-fit">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="measurementGender"
                value="male"
                checked={activeGenderTab === 'male'}
                onChange={() => setActiveGenderTab('male')}
                className="text-purple-600 focus:ring-purple-500"
              />
              પુરુષ (Male Products)
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="measurementGender"
                value="female"
                checked={activeGenderTab === 'female'}
                onChange={() => setActiveGenderTab('female')}
                className="text-purple-600 focus:ring-purple-500"
              />
              સ્ત્રી (Female Products)
            </label>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex gap-2">
            <ThemeInput
              type="text"
              placeholder={`નવું પ્રોડક્ટ કી ઉમેરો (દા.ત. ${activeGenderTab === 'male' ? 'Kurta, Suit' : 'Suit, Lehenga'})`}
              className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl text-sm"
              value={activeGenderTab === 'male' ? maleProductsInput : femaleProductsInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                activeGenderTab === 'male'
                  ? setMaleProductsInput(e.target.value)
                  : setFemaleProductsInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddProduct()
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddProduct}
              className="px-4 h-[44px] bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all shadow-sm"
            >
              <FaPlus size={12} /> ઉમેરો
            </button>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
              <FaRulerCombined className="text-purple-600" />
              {activeGenderTab === 'male' ? 'પુરુષ માપ કીઝ (Male Keys):' : 'સ્ત્રી માપ કીઝ (Female Keys):'}
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {(activeGenderTab === 'male' ? maleProducts : femaleProducts).map((productKey: any) => (
                <div
                  key={productKey}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-200 text-purple-900 rounded-lg text-xs font-semibold shadow-xs"
                >
                  <span>{productKey}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(productKey)}
                    className="text-red-500 hover:text-red-700 transition-colors p-0.5"
                    title="કાઢી નાખો"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              ))}
              {(activeGenderTab === 'male' ? maleProducts : femaleProducts).length === 0 && (
                <p className="text-xs text-gray-400 italic">કોઈ પ્રોડક્ટ કી ઉમેરેલ નથી.</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-gray-500">
            <div>
              <span className="font-semibold text-gray-700">Male DB Value:</span> {formData.male_measurements}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Female DB Value:</span> {formData.female_measurements}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>)
}

export default MeasurementSettings