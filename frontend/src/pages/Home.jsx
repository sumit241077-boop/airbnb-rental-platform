
import React, { useContext } from 'react';
import Nav from '../Component/Nav';
import Card from '../Component/Card';
import { listingDataContext } from '../Context/ListingContext';

function Home() {
    const { newListData } = useContext(listingDataContext);

    const listings = Array.isArray(newListData) ? newListData : [];

    return (
        <main className="min-h-screen bg-white">
            <Nav />

            {/* Main homepage content */}
            <section className="mx-auto max-w-[1600px] px-4 pb-16 pt-[250px] sm:px-6 md:pt-[185px] lg:px-10">

                {/* Heading */}
                <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FF385C]">
                            Find your next getaway
                        </p>

                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                            Explore stays
                        </h1>

                        <p className="mt-2 text-sm text-gray-500 sm:text-base">
                            Discover a place that feels like home.
                        </p>
                    </div>

                    {listings.length > 0 && (
                        <p className="text-sm text-gray-500">
                            {listings.length}{' '}
                            {listings.length === 1 ? 'stay' : 'stays'} available
                        </p>
                    )}
                </div>

                {/* Property grid */}
                {listings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {listings.map((list) => (
                            <Card
                                key={list._id}
                                title={list.title}
                                landMark={list.landMark}
                                city={list.city}
                                image1={list.image1}
                                image2={list.image2}
                                image3={list.image3}
                                rent={list.rent}
                                id={list._id}
                                ratings={list.ratings}
                                isBooked={list.isBooked}
                                host={list.host}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-2xl">
                            <span role="img" aria-label="House">⌂</span>
                        </div>

                        <h2 className="text-lg font-semibold text-gray-900">
                            No stays found
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                            There are no properties to show in this selection.
                            Try another category or add a new listing.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}

export default Home;
