import React from 'react';
import logoImage from '../../assets/logo.png';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <img
            src={logoImage}
            alt="Logo"
            className={className}
            loading="eager"
            style={{ height: 32, width: 'auto' }}
        />
    );
};

export default Logo;
