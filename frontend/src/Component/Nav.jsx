
import React, { useContext, useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { FiSearch } from 'react-icons/fi';
import { GiHamburgerMenu, GiFamilyHouse, GiWoodCabin } from 'react-icons/gi';
import { CgProfile } from 'react-icons/cg';
import { MdWhatshot, MdBedroomParent, MdOutlinePool } from 'react-icons/md';
import { IoBedOutline } from 'react-icons/io5';
import { FaTreeCity } from 'react-icons/fa6';
import { BiBuildingHouse } from 'react-icons/bi';
import { SiHomeassistantcommunitystore } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { authDataContext } from '../Context/AuthContext';
import { userDataContext } from '../Context/UserContext';
import { listingDataContext } from '../Context/ListingContext';

function Nav() {
    const [showPopup, setShowPopup] = useState(false);
    const [category, setCategory] = useState('trending');
    const [input, setInput] = useState('');

    const { userData, setUserData } = useContext(userDataContext);
    const { serverUrl } = useContext(authDataContext);

    const {
        listingData,
        setNewListData,
        searchData,
        handleSearch,
        handleViewCard
    } = useContext(listingDataContext);

    const navigate = useNavigate();

    const categories = [
        { label: 'Trending', value: 'trending', icon: MdWhatshot },
        { label: 'Villas', value: 'villa', icon: GiFamilyHouse },
        { label: 'Farm Houses', value: 'farmHouse', icon: FaTreeCity },
        { label: 'Pool Houses', value: 'poolHouse', icon: MdOutlinePool },
        { label: 'Rooms', value: 'rooms', icon: MdBedroomParent },
        { label: 'Flats', value: 'flat', icon: BiBuildingHouse },
        { label: 'PG', value: 'pg', icon: IoBedOutline },
        { label: 'Cabins', value: 'cabin', icon: GiWoodCabin },
        { label: 'Shops', value: 'shops', icon: SiHomeassistantcommunitystore }
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(input);
        }, 300);

        return () => clearTimeout(timer);
    }, [input]);

    const handleLogOut = async () => {
        try {
            await axios.post(
                `${serverUrl}/api/auth/logout`,
                {},
                { withCredentials: true }
            );

            setUserData(null);
            setShowPopup(false);
            navigate('/login');
        } catch (error) {
            console.error(
                'Logout failed:',
                error.response?.data || error.message
            );
        }
    };

    const handleCategory = (selectedCategory) => {
        setCategory(selectedCategory);

        if (selectedCategory === 'trending') {
            setNewListData(listingData);
        } else {
            const filteredListings = Array.isArray(listingData)
                ? listingData.filter(
                    (listing) => listing.category === selectedCategory
                )
                : [];

            setNewListData(filteredListings);
        }
    };

    const handleSearchResult = (id) => {
        setInput('');

        if (userData) {
            handleViewCard(id);
        } else {
            navigate('/login');
        }
    };

    const SearchResults = () => {
        if (!input.trim()) return null;

        return (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                {searchData?.length > 0 ? (
                    searchData.map((item) => (
                        <button
                            type="button"
                            key={item._id}
                            onClick={() => handleSearchResult(item._id)}
                            className="w-full rounded-xl px-4 py-3 text-left text-sm transition hover:bg-rose-50"
                        >
                            <span className="block font-semibold text-gray-800">
                                {item.title}
                            </span>
                            <span className="mt-1 block text-gray-500">
                                {item.landMark}, {item.city}
                            </span>
                        </button>
                    ))
                ) : (
                    <p className="px-4 py-5 text-center text-sm text-gray-500">
                        No matching stays found
                    </p>
                )}
            </div>
        );
    };

    return (
        <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-gray-100 bg-white">
            {/* Main navbar */}
            <div className="mx-auto flex min-h-[82px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">

                {/* Logo */}
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="shrink-0"
                    aria-label="Go to homepage"
                >
                    <img
                        src={logo}
                        alt="Airbnb home"
                        className="w-[105px] object-contain sm:w-[125px]"
                    />
                </button>

                {/* Desktop search */}
                <div className="relative hidden w-full max-w-[420px] md:block">
                    <div className="flex h-[52px] items-center rounded-full border border-gray-200 bg-white pl-5 pr-2 shadow-sm transition hover:shadow-md">
                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Search destinations"
                            className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-500"
                            aria-label="Search destinations"
                        />

                        <button
                            type="button"
                            onClick={() => handleSearch(input)}
                            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF385C] text-white transition hover:bg-[#E31C5F]"
                            aria-label="Search"
                        >
                            <FiSearch size={18} />
                        </button>
                    </div>

                    <SearchResults />
                </div>

                {/* Profile and menu */}
                <div className="relative flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigate('/listingpage1')}
                        className="hidden rounded-full px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 lg:block"
                    >
                        List your home
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowPopup((previous) => !previous)}
                        className="flex h-[46px] items-center gap-3 rounded-full border border-gray-300 bg-white px-3 transition hover:shadow-md"
                        aria-label="Open account menu"
                        aria-expanded={showPopup}
                    >
                        <GiHamburgerMenu size={19} className="text-gray-700" />

                        {userData?.name ? (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-white">
                                {userData.name.slice(0, 1).toUpperCase()}
                            </span>
                        ) : (
                            <CgProfile size={27} className="text-gray-600" />
                        )}
                    </button>

                    {showPopup && (
                        <>
                            <button
                                type="button"
                                className="fixed inset-0 z-40 cursor-default"
                                aria-label="Close menu"
                                onClick={() => setShowPopup(false)}
                            />

                            <div className="absolute right-0 top-[56px] z-50 w-[230px] overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-xl">
                                {!userData ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate('/login');
                                            setShowPopup(false);
                                        }}
                                        className="w-full px-5 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
                                    >
                                        Login / Sign up
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleLogOut}
                                        className="w-full px-5 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
                                    >
                                        Logout
                                    </button>
                                )}

                                <div className="my-2 border-t border-gray-100" />

                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate('/listingpage1');
                                        setShowPopup(false);
                                    }}
                                    className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    List your home
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate('/mylisting');
                                        setShowPopup(false);
                                    }}
                                    className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    My listings
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate('/mybooking');
                                        setShowPopup(false);
                                    }}
                                    className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    My bookings
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile search */}
            <div className="px-4 pb-3 md:hidden">
                <div className="relative mx-auto max-w-[600px]">
                    <div className="flex h-[48px] items-center rounded-full border border-gray-200 bg-white pl-4 pr-2 shadow-sm">
                        <FiSearch size={18} className="mr-3 shrink-0 text-gray-500" />

                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Where do you want to stay?"
                            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                            aria-label="Search destinations"
                        />

                        <button
                            type="button"
                            onClick={() => handleSearch(input)}
                            className="ml-2 rounded-full bg-[#FF385C] p-2 text-white"
                            aria-label="Search"
                        >
                            <FiSearch size={16} />
                        </button>
                    </div>

                    <SearchResults />
                </div>
            </div>

            {/* Categories */}
            <nav className="border-t border-gray-100 bg-white">
                <div className="mx-auto flex h-[82px] max-w-[1600px] items-stretch gap-7 overflow-x-auto px-4 sm:px-6 lg:justify-center lg:gap-10 lg:px-10">
                    {categories.map((item) => {
                        const CategoryIcon = item.icon;
                        const isActive = category === item.value;

                        return (
                            <button
                                type="button"
                                key={item.value}
                                onClick={() => handleCategory(item.value)}
                                className={`group relative flex min-w-[64px] shrink-0 flex-col items-center justify-center gap-2 border-b-2 text-xs transition ${
                                    isActive
                                        ? 'border-gray-800 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900'
                                }`}
                            >
                                <CategoryIcon
                                    size={24}
                                    className={`transition ${
                                        isActive
                                            ? 'text-[#FF385C]'
                                            : 'text-gray-600 group-hover:text-gray-900'
                                    }`}
                                />
                                <span className="whitespace-nowrap font-medium">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </header>
    );
}

export default Nav;
