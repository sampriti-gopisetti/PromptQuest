import React from 'react';

type LoadingOverlayProps = {
	show: boolean;
	message?: string;
};

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show, message = 'AI Guru is working...' }) => {
	if (!show) return null;
	return (
		<div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
			<div
				className="flex flex-col items-center gap-4 rounded-xl bg-white px-8 py-6 border-4 border-black shadow-2xl"
				style={{ filter: 'url(#sketch-outline)' }}
				role="alert"
				aria-live="assertive"
				aria-busy="true"
			>
				<div className="h-10 w-10 rounded-full border-4 border-slate-300 border-t-slate-800 animate-spin" aria-hidden="true" />
				<div className="text-xl font-extrabold text-slate-900">{message}</div>
				<div className="text-sm text-slate-600">Hang tight while we evaluate your prompt…</div>
			</div>
		</div>
	);
};

export default LoadingOverlay;

