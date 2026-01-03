import { motion, useReducedMotion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
    once?: boolean;
}

function getInitialState(direction: FadeInProps['direction'], distance: number) {
    switch (direction) {
        case 'up': return { opacity: 0, y: distance };
        case 'down': return { opacity: 0, y: -distance };
        case 'left': return { opacity: 0, x: distance };
        case 'right': return { opacity: 0, x: -distance };
        default: return { opacity: 0, y: distance };
    }
}

export function FadeIn({
    children,
    delay = 0,
    duration = 0.5,
    className = '',
    direction = 'up',
    distance = 30,
    once = true
}: FadeInProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial={getInitialState(direction, distance)}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once, margin: "-50px" }}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    once?: boolean;
}

export function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.1,
    once = true
}: StaggerContainerProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: "-50px" }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div variants={staggerItemVariants} className={className}>
            {children}
        </motion.div>
    );
}

