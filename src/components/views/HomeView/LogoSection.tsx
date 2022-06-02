// LIB FUNCTIONS
import { useRef, useState } from 'react';
import { useMediaQuery } from '@mui/material';
// LIB COMPONENTS
import { Box, Theme } from '@mui/material';

// UTILS
interface MinMax {
    min: number;
    max: number;
}
interface GetRandomXY {
    x: MinMax;
    y: MinMax;
}
function getRandomNumber(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
}
function getOffset(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
    };
}
function getRandomXY({ x, y }: GetRandomXY) {
    return {
        x: getRandomNumber(x.min, x.max),
        y: getRandomNumber(y.min, y.max),
    };
}

// MAIN-COMPONENT
export default function LogoSectionComponent() {
    const [rotation, setRotation] = useState(-360);
    const logoRef = useRef<HTMLElement>(null);
    const isMdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    function summonLogo() {
        if (!logoRef.current) return;
        const offset = getOffset(logoRef.current);
        const { clientWidth, clientHeight } = logoRef.current;
        const image = new Image(50);
        image.src = '/images/logo.png';
        image.style.position = 'fixed';
        image.style.top = offset.top + clientHeight / 2 - 25 + 'px';
        image.style.left = offset.left + clientWidth / 2 - 25 + 'px';
        image.style.opacity = '0';
        image.style.zIndex = '2000';
        image.style.transition = '0.3s';
        function move() {
            const { x, y } = getRandomXY({
                x: {
                    min: -50,
                    max: isMdDown ? window.innerWidth : -50,
                },
                y: {
                    min: -50,
                    max: isMdDown ? -50 : window.innerHeight,
                },
            });
            image.style.top = y + 'px';
            image.style.left = x + 'px';
            image.style.opacity = '1';
        }
        setTimeout(move);
        setTimeout(() => document.body.removeChild(image), 1000);
        document.body.appendChild(image);
    }
    function playSoundEffect() {
        new Audio('/audios/whoosh.mp3').play();
    }
    function handleClick() {
        if (!logoRef.current) return;
        summonLogo();
        playSoundEffect();
        setRotation((val) => val - 360);
        logoRef.current.style.transform = `rotate(${rotation}deg)`;
    }
    return (
        <LogoSection>
            <LogoSectionContainer>
                <Box
                    component="img"
                    src="/images/logo.png"
                    alt="Basic Calculus Courseware Logo"
                    ref={logoRef}
                    onClick={handleClick}
                />
            </LogoSectionContainer>
        </LogoSection>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const LogoSection = styled('div')({
    ...styles.flexCenter,
    ...styles.py(4),
    overflow: 'hidden',
});
const LogoSectionContainer = styled('div')({
    ...styles.borderRadius(100),
    transition: '0.3s',
    userSelect: 'none',
    '&:hover': {
        transform: 'scale(0.8)',
    },
    '&:active': {
        transform: 'scale(0.9)',
    },
    '.MuiBox-root': {
        ...styles.borderRadius(100),
        width: '100%',
        maxWidth: '400px',
        transition: '0.3s',
        cursor: 'pointer',
    },
});
