import React from 'react';

const sources = ['/logo.png', '/logo2.png', '/logo3.png'];

export default function IconLogo({ size = 48, index = 0 }) {
    // Ensure index is within bounds
    const src = sources[index] || sources[0];
    return (
        <img
            src={src}
            alt="AS"
            width={size}
            height={size}
            className="rounded-lg"
            style={{ display: 'block' }}
        />
    );
}