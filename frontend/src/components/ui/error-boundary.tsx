'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('Error caught by boundary:', error, errorInfo);
	}

	reset = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			const FallbackComponent = this.props.fallback || DefaultErrorFallback;
			return <FallbackComponent error={this.state.error} reset={this.reset} />;
		}

		return this.props.children;
	}
}

interface ErrorFallbackProps {
	error?: Error;
	reset: () => void;
}

function DefaultErrorFallback({ error, reset }: ErrorFallbackProps) {
	return (
		<div className='min-h-[400px] flex items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='text-center'>
					<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20'>
						<AlertTriangle className='h-6 w-6 text-red-600 dark:text-red-400' />
					</div>
					<CardTitle>Something went wrong</CardTitle>
					<CardDescription>An unexpected error occurred while loading this content.</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{error && (
						<div className='text-sm text-muted-foreground bg-muted p-3 rounded-md'>
							<strong>Error:</strong> {error.message}
						</div>
					)}
					<div className='flex flex-col space-y-2'>
						<Button onClick={reset} className='w-full'>
							<RefreshCw className='h-4 w-4 mr-2' />
							Try Again
						</Button>
						<Button variant='outline' onClick={() => (window.location.href = '/')} className='w-full'>
							<Home className='h-4 w-4 mr-2' />
							Go Home
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

// Hook for functional components
export function useErrorBoundary() {
	const [error, setError] = React.useState<Error | null>(null);

	const resetError = React.useCallback(() => {
		setError(null);
	}, []);

	const captureError = React.useCallback((error: Error) => {
		setError(error);
	}, []);

	React.useEffect(() => {
		if (error) {
			throw error;
		}
	}, [error]);

	return { captureError, resetError };
}

// Network error fallback
export function NetworkErrorFallback({ error, reset }: ErrorFallbackProps) {
	const isNetworkError =
		error?.message.toLowerCase().includes('network') || error?.message.toLowerCase().includes('fetch');

	return (
		<div className='min-h-[300px] flex items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='text-center'>
					<div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20'>
						<AlertTriangle className='h-6 w-6 text-yellow-600 dark:text-yellow-400' />
					</div>
					<CardTitle>{isNetworkError ? 'Connection Problem' : 'Something went wrong'}</CardTitle>
					<CardDescription>
						{isNetworkError
							? 'Unable to connect to the server. Please check your internet connection.'
							: 'An unexpected error occurred while loading this content.'}
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex flex-col space-y-2'>
						<Button onClick={reset} className='w-full'>
							<RefreshCw className='h-4 w-4 mr-2' />
							Try Again
						</Button>
						<Button variant='outline' onClick={() => window.location.reload()} className='w-full'>
							Refresh Page
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
