import React, { useEffect, useRef } from 'react';
import CountUp from 'react-countup';

interface AnimatedCounterProps {
    value: number;
    formattingFn?: (value: number) => string;
    decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, formattingFn = n => `${n}`, decimals = 0 }) => {
    const prevValueRef = useRef<number>(0);

    useEffect(() => {
        prevValueRef.current = value;
    }, [value]);

    return (
        <div>
            <CountUp
                start={prevValueRef.current}
                end={value}
                duration={1}
                useEasing={true}
                preserveValue
                separator=","
                formattingFn={formattingFn}
                decimals={decimals}
            />
        </div>
    );
};

export default AnimatedCounter;