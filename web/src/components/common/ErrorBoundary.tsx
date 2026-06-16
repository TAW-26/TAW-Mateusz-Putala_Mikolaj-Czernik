import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
    public state: State = { hasError: false };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Application error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-5">
                        <AlertTriangle size={24} className="text-red-600" />
                    </div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Coś poszło nie tak
                    </h1>
                    <p className="text-muted text-sm max-w-sm mb-6">
                        Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
                    </p>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="btn-primary"
                    >
                        <RefreshCcw size={16} />
                        Wróć do panelu
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
