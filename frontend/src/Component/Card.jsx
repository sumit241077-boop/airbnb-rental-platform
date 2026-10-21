
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';
import { FcCancel } from 'react-icons/fc';

import { userDataContext } from '../Context/UserContext';
import { listingDataContext } from '../Context/ListingContext';
import { bookingDataContext } from '../Context/BookingContext';

function Card({
    title,
    landMark,
    image1,
    image2,
    image3,
    rent,
    city,
    id,
    ratings,
    isBooked,
    host
}) {
    const navigate = useNavigate();

    const { userData } = useContext(userDataContext);
    const { handleViewCard } = useContext(listingDataContext);
    const { cancelBooking } = useContext(bookingDataContext);

    const [popUp, setPopUp] = useState(false);

    const images = [image1, image2, image3].filter(Boolean);

    const handleClick = () => {
        if (userData) {
            handleViewCard(id);
        } else {
            navigate('/login');
        }
    };

    const openCancelPopup = (event) => {
        event.stopPropagation();
        setPopUp(true);
    };

    const confirmCancel = async (event) => {
        event.stopPropagation();

        try {
            await cancelBooking(id);
            setPopUp(false);
        } catch (error) {
            console.error('Booking cancellation failed:', error);
        }
    };

    return (
        <article
            className="group relative w-full min-w-0 max-w-[380px] cursor-pointer"
            onClick={() => !isBooked && handleClick()}
        >
            {/* Property images */}
            <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                {images.length > 0 ? (
                    <div
                        className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {images.map((image, index) => (
                            <img
                                key={`${id}-${index}`}
                                src={image}
                                alt={`${title || 'Property'} photo ${index + 1}`}
                                loading="lazy"
                                className="h-full w-full shrink-0 snap-center object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        No image available
                    </div>
                )}

                {/* Booked badge */}
                {isBooked && (
                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-green-700 shadow-sm">
                        <GiConfirmed size={17} />
                        Booked
                    </div>
                )}

                {/* Existing cancellation behaviour */}
                {isBooked && host == userData?._id && (
                    <button
                        type="button"
                        onClick={openCancelPopup}
                        className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-md hover:bg-red-50"
                    >
                        <FcCancel size={16} />
                        Cancel
                    </button>
                )}

                {/* Cancellation confirmation */}
                {popUp && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
                        <div
                            className="w-full max-w-[270px] rounded-2xl bg-white p-5 shadow-xl"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <h3 className="text-lg font-semibold text-gray-900">
                                Cancel booking?
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Are you sure you want to cancel this booking?
                            </p>

                            <div className="mt-5 flex gap-3">
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setPopUp(false);
                                    }}
                                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                                >
                                    Keep
                                </button>

                                <button
                                    type="button"
                                    onClick={confirmCancel}
                                    className="flex-1 rounded-full bg-[#FF385C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E31C5F]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Property details */}
            <div className="flex flex-col gap-1.5 px-0.5">
                <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-gray-900">
                        {landMark || 'Location not specified'}
                        {city ? `, ${city}` : ''}
                    </h2>

                    <span className="flex shrink-0 items-center gap-1 text-sm text-gray-800">
                        <FaStar className="text-[#FF385C]" size={13} />
                        {ratings && Number(ratings) > 0 ? ratings : 'New'}
                    </span>
                </div>

                <p className="truncate text-sm text-gray-500">
                    {title || 'Untitled property'}
                </p>

                <p className="mt-1 text-sm text-gray-700">
                    <span className="text-base font-semibold text-gray-900">
                        ₹{rent}
                    </span>{' '}
                    / day
                </p>
            </div>
        </article>
    );
}

export default Card;
