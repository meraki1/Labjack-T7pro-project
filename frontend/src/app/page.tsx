import React from 'react'
import Layout from './layout'
import Image from 'next/image'
import StartExperimentButton from './components/StartExperimentButton'
import './globals.css'

export default function HomePage() {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-blue-200 via-blue-100 to-white">
                <h1 className="text-5xl mb-6 text-blue-800">LabJack T7 Pro Experiments</h1>
                <div className="w-3/4 md:w-3/5 lg:w-2/5 mb-6 border-2 border-blue-200 rounded-lg overflow-hidden shadow-lg">
                    <Image 
                        src="/assets/LABJACK_T7_01.png" 
                        alt="LabJack T7 Pro" 
                        width={800}
                        height={500} 
                    />
                </div>
                <p className="mb-6 text-center text-gray-700 w-3/4 md:w-2/5">
                    Dobrodošli na platformu LabJack T7 Pro Experiments! 
                    Ovdje možete s lakoćom provoditi svoje eksperimente i upravljati njima,
                    koristeći intuitivno sučelje i moćne značajke dizajnirane za profesionalce i entuzijaste.
                </p>
                <StartExperimentButton />
            </div>
        </Layout>
    );
}