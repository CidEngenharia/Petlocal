import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Pet } from '../types';

interface PetMapProps {
    pets: Pet[];
}

const AnyReactComponent = ({ text, photoUrl, lat, lng }: { text: string, photoUrl?: string, lat: number, lng: number, key?: any }) => (
    <div className="relative group cursor-pointer">
        <div className="w-12 h-12 rounded-full border-4 border-white shadow-xl overflow-hidden bg-brand-primary transform group-hover:scale-125 transition-transform">
            <img
                src={photoUrl || 'https://via.placeholder.com/150'}
                alt={text}
                className="w-full h-full object-cover"
            />
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-md border border-stone-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-900">{text}</p>
        </div>
    </div>
);

const PetMap: React.FC<PetMapProps> = ({ pets }) => {
    // Default center (Salvador, BR as an example, since it appeared in the mock)
    const defaultProps = {
        center: {
            lat: -12.9714,
            lng: -38.5014
        },
        zoom: 11
    };

    // Generating mock coordinates for pets that only have address/city
    const petsWithCoords = pets.map((pet, index) => {
        // Simple mock: offset from center for demo, since we don't have geocoding yet
        return {
            ...pet,
            lat: defaultProps.center.lat + (Math.random() - 0.5) * 0.1,
            lng: defaultProps.center.lng + (Math.random() - 0.5) * 0.1
        };
    });

    return (
        <div className="w-full h-full rounded-[40px] overflow-hidden border-8 border-white/10 relative">
            <GoogleMapReact
                bootstrapURLKeys={{ key: "" }} // Add API Key here
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
                {petsWithCoords.map(pet => (
                    <AnyReactComponent
                        key={pet.id}
                        lat={pet.lat}
                        lng={pet.lng}
                        text={pet.name}
                        photoUrl={pet.photoUrl}
                    />
                ))}
            </GoogleMapReact>
            {!pets.length && (
                <div className="absolute inset-0 bg-stone-100 flex items-center justify-center p-8 text-center">
                    <div>
                        <p className="text-stone-400 font-bold mb-2 uppercase tracking-widest text-sm">Mapa do Sistema</p>
                        <p className="text-stone-300 text-xs">Aguardando localização dos animais cadastrados...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetMap;
