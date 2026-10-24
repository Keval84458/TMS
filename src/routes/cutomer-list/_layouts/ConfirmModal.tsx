import { FaExclamationTriangle } from "react-icons/fa"

const ConfirmModal = ({ deleteModalConfig, setDeleteModalConfig, handleDelete }: any) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <FaExclamationTriangle size={20} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-900">
                        શું તમે "{deleteModalConfig.name}" ને ડિલીટ કરવા માંગો છો?
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                        આ ક્રિયા પાછી ખેંચી શકાતી નથી!
                    </p>
                </div>
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => setDeleteModalConfig({ isOpen: false, id: null, name: '' })}
                        className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                    >
                        ના (Cancel)
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 shadow-md shadow-red-600/30"
                    >
                        હા, ડિલીટ કરો
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal