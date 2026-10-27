import { PAGE_PATH_KEYS } from "#/utils/constant";
import { Link } from "@tanstack/react-router";
import { FaCog } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";

interface PageHeaderProps {
    title: string;
    onBack?: string;
    visible?: boolean
}

const PageHeader = ({ title, onBack, visible }: PageHeaderProps) => {
    return (
        <div className="bg-white border-b border-gray-100 py-3 px-4 shadow-sm w-full fixed top-[3.9rem] left-0 z-10">
            <div className="max-w-7xl mx-auto flex items-center relative justify-between">
                <Link
                    to={onBack}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                >
                    <FaChevronLeft />
                </Link>
                <div className="flex items-center justify-between w-full pl-3 sm:pl-4">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                        {title}
                    </h1>

                    {visible && <Link
                        to={PAGE_PATH_KEYS.SETTINGS}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors shrink-0"
                    >
                        <FaCog className="animate-spin-slow" />
                        <span>Settings</span>
                    </Link>
                    }


                </div>
            </div>
        </div>
    );
};

export default PageHeader;