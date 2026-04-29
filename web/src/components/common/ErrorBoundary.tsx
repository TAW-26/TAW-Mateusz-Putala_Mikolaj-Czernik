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
        console.error("Critical System Failure:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative mb-6">
                        <AlertTriangle size={80} className="text-red-500 animate-pulse" />
                        <div className="absolute inset-0 blur-2xl bg-red-500/20 animate-pulse"></div>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">
                        SYSTEM CRITICAL ERROR
                    </h1>
                    <p className="text-zinc-500 max-w-md mb-10 text-xs uppercase tracking-[0.3em] leading-relaxed">
                        Neural link severed. Voyager interface encountered an unrecoverable exception.
                    </p>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="flex items-center gap-3 px-8 py-4 bg-zinc-100 text-zinc-950 font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/5"
                    >
                        <RefreshCcw size={20} />
                        <span>REBOOT INTERFACE</span>
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}