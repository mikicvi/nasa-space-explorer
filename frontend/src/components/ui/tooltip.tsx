'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
	children: React.ReactNode;
	content: string;
	side?: 'top' | 'bottom' | 'left' | 'right';
	className?: string;
}

export function Tooltip({ children, content, side = 'bottom', className }: TooltipProps) {
	const [isVisible, setIsVisible] = React.useState(false);

	const sideClasses = {
		top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
	};

	return (
		<div className='relative inline-block'>
			<div
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
				onFocus={() => setIsVisible(true)}
				onBlur={() => setIsVisible(false)}
			>
				{children}
			</div>
			{isVisible && (
				<div
					className={cn(
						'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap pointer-events-none',
						sideClasses[side],
						className
					)}
				>
					{content}
					<div
						className={cn(
							'absolute w-0 h-0 border-2 border-solid',
							side === 'top' &&
								'top-full left-1/2 transform -translate-x-1/2 border-gray-900 border-b-0 border-l-transparent border-r-transparent',
							side === 'bottom' &&
								'bottom-full left-1/2 transform -translate-x-1/2 border-gray-900 border-t-0 border-l-transparent border-r-transparent',
							side === 'left' &&
								'left-full top-1/2 transform -translate-y-1/2 border-gray-900 border-r-0 border-t-transparent border-b-transparent',
							side === 'right' &&
								'right-full top-1/2 transform -translate-y-1/2 border-gray-900 border-l-0 border-t-transparent border-b-transparent'
						)}
					/>
				</div>
			)}
		</div>
	);
}
