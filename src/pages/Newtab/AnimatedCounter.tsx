import React, { useEffect, useState, useRef } from 'react';
import CountUp from 'react-countup';

interface AnimatedCounterProps {
    value: number;
    formattingFn?: (value: number) => string;
}


const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, formattingFn = n => `${n}` }) => {
    return (
        <div>
            <CountUp
                start={0}
                end={value}
                duration={1.5}
                useEasing={true}
                preserveValue
                separator=","
                formattingFn={formattingFn}
            />
        </div>
    );
};

export default AnimatedCounter;