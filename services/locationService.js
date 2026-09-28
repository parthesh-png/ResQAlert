const locations = {
    patna: {
        name: "Patna, Bihar",
        lat: 25.5941,
        lng: 85.1376,
    },

    manhattan: {
        name: "Manhattan, NYC",
        lat: 40.7831,
        lng: -73.9712,
    },

    delhi: {
        name: "Delhi, India",
        lat: 28.6139,
        lng: 77.2090,
    },
};

export const resolveLocation = (description) => {
    const text = description.toLowerCase();

    for (const key in locations) {
        if (text.includes(key)) {
            return {
                name: locations[key].name,
                coordinates: {
                    lat: locations[key].lat,
                    lng: locations[key].lng,
                },
            };
        }
    }

    return null;
};