"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
	children: ReactNode
	fallback?: ReactNode
}

interface State {
	hasError: boolean
	error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo)
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: null })
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback
			}

			return (
				<div className="flex flex-col items-center justify-center min-h-[200px] p-6 rounded-lg border border-red-900/30 bg-red-950/20">
					<AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
					<h2 className="text-lg font-semibold text-red-300 mb-2">
						Something went wrong
					</h2>
					<p className="text-sm text-red-400/80 text-center mb-4 max-w-md">
						{this.state.error?.message || "An unexpected error occurred"}
					</p>
					<Button
						variant="outline"
						size="sm"
						onClick={this.handleRetry}
						className="border-red-800 text-red-300 hover:bg-red-950/50"
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						Try again
					</Button>
				</div>
			)
		}

		return this.props.children
	}
}

// Functional wrapper for easier use
export function withErrorBoundary<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	fallback?: ReactNode
) {
	return function WithErrorBoundaryWrapper(props: P) {
		return (
			<ErrorBoundary fallback={fallback}>
				<WrappedComponent {...props} />
			</ErrorBoundary>
		)
	}
}
